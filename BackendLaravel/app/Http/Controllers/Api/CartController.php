<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get all cart items for authenticated user
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $cartItems = Cart::with(['product.category'])
            ->where('user_id', $userId)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Cart items retrieved successfully',
            'data' => $cartItems
        ], 200);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user()->id;
        $productId = $request->product_id;
        $quantity = $request->quantity;

        // Check product stock
        $product = Product::findOrFail($productId);

        // Check if item already exists in cart
        $cartItem = Cart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $quantity;

            if ($newQuantity > $product->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock available'
                ], 400);
            }

            $cartItem->update(['quantity' => $newQuantity]);
            $cartItem->load(['product.category']);

            return response()->json([
                'success' => true,
                'message' => 'Cart updated successfully',
                'data' => $cartItem
            ], 200);
        }

        // Check stock before adding
        if ($quantity > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock available'
            ], 400);
        }

        // Create new cart item
        $cartItem = Cart::create([
            'user_id' => $userId,
            'product_id' => $productId,
            'quantity' => $quantity
        ]);

        $cartItem->load(['product.category']);

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
            'data' => $cartItem
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user()->id;
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        // Check stock
        $product = Product::findOrFail($cartItem->product_id);

        if ($request->quantity > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock available'
            ], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);
        $cartItem->load(['product.category']);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully',
            'data' => $cartItem
        ], 200);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, string $id)
    {
        $userId = $request->user()->id;

        $cartItem = Cart::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully'
        ], 200);
    }

    /**
     * Clear all cart items for user
     */
    public function clear(Request $request)
    {
        $userId = $request->user()->id;

        Cart::where('user_id', $userId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully'
        ], 200);
    }
}

