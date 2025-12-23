<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Mail\OrderConfirmation;
use App\Mail\OrderStatusUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Get all orders for authenticated user
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $orders = Order::with('orderItems.product')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ], 200);
    }

    /**
     * Get all orders (Admin only)
     */
    public function getAllOrders(Request $request)
    {
        // Check if user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $orders = Order::with(['user', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'All orders retrieved successfully',
            'data' => $orders
        ], 200);
    }

    /**
     * Store a new order
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'payment_method' => 'required|in:COD,Esewa',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $userId = $request->user()->id;

            // Get user's cart items
            $cartItems = Cart::with('product')
                ->where('user_id', $userId)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty'
                ], 400);
            }

            // Check stock availability
            foreach ($cartItems as $cartItem) {
                if ($cartItem->product->stock < $cartItem->quantity) {
                    return response()->json([
                        'success' => false,
                        'message' => "Insufficient stock for {$cartItem->product->name}. Available: {$cartItem->product->stock}"
                    ], 400);
                }
            }

            // Create order
            $order = Order::create([
                'user_id' => $userId,
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_method === 'COD' ? 'pending' : 'paid',
                'order_status' => 'pending',
                'subtotal' => $request->subtotal,
                'shipping' => $request->shipping,
                'tax' => $request->tax ?? 0,
                'total' => $request->total,
                'notes' => $request->notes
            ]);

            // Create order items and update product stock
            foreach ($cartItems as $cartItem) {
                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_price' => $cartItem->product->price,
                    'quantity' => $cartItem->quantity,
                    'subtotal' => $cartItem->product->price * $cartItem->quantity
                ]);

                // Update product stock
                $product = Product::find($cartItem->product_id);
                $product->stock -= $cartItem->quantity;
                $product->save();
            }

            // Clear user's cart
            Cart::where('user_id', $userId)->delete();

            DB::commit();

            // Load order with items
            $order->load('orderItems.product');

            // Send order confirmation email
            try {
                Mail::to($order->email)->send(new OrderConfirmation($order));
                Log::info("Order confirmation email sent successfully to {$order->email} for order #{$order->id}");
            } catch (\Exception $e) {
                // Log error but don't fail the order
                Log::error("Failed to send order confirmation email: " . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single order details
     */
    public function show(Request $request, string $id)
    {
        $userId = $request->user()->id;

        $order = Order::with('orderItems.product')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order retrieved successfully',
            'data' => $order
        ], 200);
    }

    /**
     * Update order status (Admin only)
     */
    public function updateStatus(Request $request, string $id)
    {
        // Check if user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'order_status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->order_status = $request->order_status;

        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }

        $order->save();

        // Send order status update email
        try {
            Mail::to($order->email)->send(new OrderStatusUpdate($order));
            Log::info("Order status update email sent successfully to {$order->email} for order #{$order->id}");
        } catch (\Exception $e) {
            // Log error but don't fail the status update
            Log::error("Failed to send order status update email: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order
        ], 200);
    }

    /**
     * Cancel order (User can cancel if order is still pending)
     */
    public function cancel(Request $request, string $id)
    {
        $userId = $request->user()->id;

        $order = Order::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        if ($order->order_status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel order that is already being processed'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Restore product stock
            foreach ($order->orderItems as $orderItem) {
                $product = Product::find($orderItem->product_id);
                if ($product) {
                    $product->stock += $orderItem->quantity;
                    $product->save();
                }
            }

            // Update order status
            $order->order_status = 'cancelled';
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'data' => $order
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
