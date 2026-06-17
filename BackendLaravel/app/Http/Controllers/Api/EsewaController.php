<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Payment;
use App\Models\Membership;
use App\Models\Order;
use App\Mail\MembershipConfirmation;
use App\Mail\OrderConfirmation;

class EsewaController extends Controller
{
    public function pay(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'plan' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized user.'
            ], 401);
        }

        // Check if user already has an active membership
        if ($user->membership_status === 'active' && $user->membership_expires_at && now()->lt($user->membership_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'You already have an active membership. Your ' . $user->membership_plan . ' plan expires on ' . \Carbon\Carbon::parse($user->membership_expires_at)->format('M d, Y') . '.'
            ], 422);
        }

        // Map plan names to local IDs
        $planId = 1;
        if ($request->plan === 'Pro Member') {
            $planId = 2;
        } elseif ($request->plan === 'Elite') {
            $planId = 3;
        }

        $timestamp = time();
        $transactionUuid = "NEONFIT_U{$user->id}_P{$planId}_{$timestamp}";

        // Save pending payment record
        Payment::create([
            'user_id' => $user->id,
            'payment_type' => 'membership',
            'transaction_uuid' => $transactionUuid,
            'amount' => $request->amount,
            'plan_name' => $request->plan,
            'status' => 'pending',
        ]);

        $secretKey = config('services.esewa.secret');
        $productCode = config('services.esewa.merchant');

        $totalAmount = number_format((float) $request->amount, 2, '.', '');

        $message = "total_amount={$totalAmount},transaction_uuid={$transactionUuid},product_code={$productCode}";
        $signature = base64_encode(hash_hmac('sha256', $message, $secretKey, true));

        Log::info('Initiating eSewa Payment', [
            'user_id' => $user->id,
            'transaction_uuid' => $transactionUuid,
            'message_to_sign' => $message,
            'signature' => $signature,
        ]);

        return response()->json([
            'url' => config('services.esewa.url'),
            'params' => [
                'amount' => $totalAmount,
                'tax_amount' => '0',
                'total_amount' => $totalAmount,
                'transaction_uuid' => $transactionUuid,
                'product_code' => $productCode,
                'product_service_charge' => '0',
                'product_delivery_charge' => '0',
                'success_url' => route('esewa.success'),
                'failure_url' => route('esewa.failure'),
                'signed_field_names' => 'total_amount,transaction_uuid,product_code',
                'signature' => $signature,
            ]
        ]);
    }

    /**
     * Initiate eSewa payment for product orders
     */
    public function payOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required|numeric',
            'amount' => 'required|numeric',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized user.'
            ], 401);
        }

        $order = Order::where('id', $request->order_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.'
            ], 404);
        }

        $timestamp = time();
        $transactionUuid = "NEONFIT_ORDER_{$order->id}_{$timestamp}";

        // Save pending payment record
        Payment::create([
            'user_id' => $user->id,
            'payment_type' => 'order',
            'order_id' => $order->id,
            'transaction_uuid' => $transactionUuid,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        $secretKey = config('services.esewa.secret');
        $productCode = config('services.esewa.merchant');

        $totalAmount = number_format((float) $request->amount, 2, '.', '');

        $message = "total_amount={$totalAmount},transaction_uuid={$transactionUuid},product_code={$productCode}";
        $signature = base64_encode(hash_hmac('sha256', $message, $secretKey, true));

        Log::info('Initiating eSewa Payment for Order', [
            'user_id' => $user->id,
            'order_id' => $order->id,
            'transaction_uuid' => $transactionUuid,
        ]);

        return response()->json([
            'url' => config('services.esewa.url'),
            'params' => [
                'amount' => $totalAmount,
                'tax_amount' => '0',
                'total_amount' => $totalAmount,
                'transaction_uuid' => $transactionUuid,
                'product_code' => $productCode,
                'product_service_charge' => '0',
                'product_delivery_charge' => '0',
                'success_url' => route('esewa.order.success'),
                'failure_url' => route('esewa.order.failure'),
                'signed_field_names' => 'total_amount,transaction_uuid,product_code',
                'signature' => $signature,
            ]
        ]);
    }

    public function success(Request $request)
    {
        $encodedData = $request->query('data');
        if (!$encodedData) {
            Log::error('eSewa payment success called without data');
            return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('No data received from payment gateway.'));
        }

        try {
            $decodedJson = base64_decode($encodedData);
            $decoded = json_decode($decodedJson, true);

            Log::info('eSewa Callback Success Received', ['decoded' => $decoded]);

            if (!$decoded || !isset($decoded['signature']) || !isset($decoded['transaction_uuid']) || !isset($decoded['total_amount']) || !isset($decoded['product_code'])) {
                Log::error('eSewa success callback has invalid payload structure', ['decoded' => $decoded]);
                return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Invalid payment response details.'));
            }

            // Verify local HMAC-SHA256 signature
            $secretKey = config('services.esewa.secret');
            
            // Build signature message from all signed fields
            $signedFieldNames = $decoded['signed_field_names'] ?? '';
            $fields = array_map('trim', explode(',', $signedFieldNames));
            $messageParts = [];
            foreach ($fields as $field) {
                if (isset($decoded[$field])) {
                    $value = $field === 'total_amount' ? str_replace(',', '', $decoded[$field]) : $decoded[$field];
                    $messageParts[] = "{$field}={$value}";
                }
            }
            $message = implode(',', $messageParts);
            $computedSignature = base64_encode(hash_hmac('sha256', $message, $secretKey, true));

            if ($computedSignature !== $decoded['signature']) {
                Log::error('eSewa HMAC signature mismatch', [
                    'received' => $decoded['signature'],
                    'computed' => $computedSignature,
                    'message' => $message
                ]);
                return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Signature verification failed. Potential tampering.'));
            }

            $totalAmount = $decoded['total_amount'];
            $totalAmountStr = str_replace(',', '', $totalAmount);

            // Server-to-server transaction verification
            $verifyUrl = config('services.esewa.verify_url');
            $statusResponse = Http::get($verifyUrl, [
                'product_code' => $decoded['product_code'],
                'total_amount' => $totalAmountStr,
                'transaction_uuid' => $decoded['transaction_uuid'],
            ]);

            Log::info('eSewa Server-to-Server Verification Status Check', [
                'url' => $verifyUrl,
                'status' => $statusResponse->status(),
                'body' => $statusResponse->body(),
            ]);

            $isComplete = false;
            if ($statusResponse->successful()) {
                $statusJson = $statusResponse->json();
                if (isset($statusJson['status']) && $statusJson['status'] === 'COMPLETE') {
                    $isComplete = true;
                }
            } else {
                Log::warning('eSewa transaction verification API call unsuccessful, falling back to signature check');
                $isComplete = true;
            }

            if (!$isComplete) {
                Log::error('eSewa server confirmed payment was not completed');
                return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Payment verification failed.'));
            }

            // Parse transaction UUID: NEONFIT_U{userId}_P{planId}_{timestamp}
            preg_match('/NEONFIT_U(\d+)_P(\d+)_/', $decoded['transaction_uuid'], $matches);
            if (count($matches) === 3) {
                $userId = $matches[1];
                $planId = $matches[2];

                $user = User::find($userId);
                if ($user) {
                    $planNames = [1 => 'Day Pass', 2 => 'Pro Member', 3 => 'Elite'];
                    $planName = $planNames[$planId] ?? 'Pro Member';

                    // Day Pass expires in 1 day, others in 1 month
                    $expiresAt = $planId === 1 ? now()->addDay() : now()->addMonth();

                    // Activate User Membership
                    $user->update([
                        'membership_plan' => $planName,
                        'membership_status' => 'active',
                        'membership_expires_at' => $expiresAt,
                    ]);

                    // Store details in memberships table
                    Membership::updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'plan_name' => $planName,
                            'status' => 'active',
                            'price' => floatval($totalAmountStr),
                            'start_date' => now(),
                            'end_date' => $expiresAt,
                        ]
                    );

                    Log::info('Membership activated successfully in database', ['user_id' => $user->id, 'plan' => $planName]);

                    // Update payment record
                    $payment = Payment::where('transaction_uuid', $decoded['transaction_uuid'])->first();
                    if ($payment) {
                        $payment->update([
                            'status' => 'completed',
                            'esewa_transaction_code' => $decoded['transaction_code'] ?? null,
                            'response_payload' => $decoded,
                        ]);
                    } else {
                        Payment::create([
                            'user_id' => $user->id,
                            'payment_type' => 'membership',
                            'transaction_uuid' => $decoded['transaction_uuid'],
                            'amount' => floatval($totalAmountStr),
                            'plan_name' => $planName,
                            'status' => 'completed',
                            'esewa_transaction_code' => $decoded['transaction_code'] ?? null,
                            'response_payload' => $decoded,
                        ]);
                    }

                    // Send membership confirmation email
                    try {
                        Mail::to($user->email)->send(new MembershipConfirmation(
                            $user,
                            $planName,
                            floatval($totalAmountStr),
                            now(),
                            $expiresAt
                        ));
                        Log::info("Membership confirmation email sent to {$user->email} for {$planName}");
                    } catch (\Exception $e) {
                        Log::error("Failed to send membership confirmation email to {$user->email}: " . $e->getMessage(), [
                            'exception' => get_class($e),
                            'trace' => $e->getTraceAsString(),
                        ]);
                    }

                    $message = urlencode("Welcome to NeonFit! Your {$planName} membership has been activated successfully.");
                    return redirect("http://localhost:3000/thank-you?status=success&type=membership&message={$message}&plan=" . urlencode($planName));
                }
            }

            Log::error('eSewa payment succeeded, but user or plan details could not be parsed', ['uuid' => $decoded['transaction_uuid']]);
            return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Could not identify user membership record.'));

        } catch (\Exception $e) {
            Log::error('eSewa callback exception occurred', ['exception' => $e->getMessage()]);
            return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('An unexpected error occurred during verification.'));
        }
    }

    /**
     * eSewa success callback for product orders
     */
    public function orderSuccess(Request $request)
    {
        $encodedData = $request->query('data');
        if (!$encodedData) {
            Log::error('eSewa order success called without data');
            return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('No data received from payment gateway.'));
        }

        try {
            $decodedJson = base64_decode($encodedData);
            $decoded = json_decode($decodedJson, true);

            Log::info('eSewa Order Callback Success Received', ['decoded' => $decoded]);

            if (!$decoded || !isset($decoded['signature']) || !isset($decoded['transaction_uuid']) || !isset($decoded['total_amount']) || !isset($decoded['product_code'])) {
                Log::error('eSewa order success callback has invalid payload structure', ['decoded' => $decoded]);
                return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('Invalid payment response details.'));
            }

            // Verify local HMAC-SHA256 signature
            $secretKey = config('services.esewa.secret');

            // Build signature message from all signed fields
            $signedFieldNames = $decoded['signed_field_names'] ?? '';
            $fields = array_map('trim', explode(',', $signedFieldNames));
            $messageParts = [];
            foreach ($fields as $field) {
                if (isset($decoded[$field])) {
                    $value = $field === 'total_amount' ? str_replace(',', '', $decoded[$field]) : $decoded[$field];
                    $messageParts[] = "{$field}={$value}";
                }
            }
            $message = implode(',', $messageParts);
            $computedSignature = base64_encode(hash_hmac('sha256', $message, $secretKey, true));

            if ($computedSignature !== $decoded['signature']) {
                Log::error('eSewa order HMAC signature mismatch', [
                    'received' => $decoded['signature'],
                    'computed' => $computedSignature,
                ]);
                return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('Signature verification failed.'));
            }

            $totalAmount = $decoded['total_amount'];
            $totalAmountStr = str_replace(',', '', $totalAmount);

            // Server-to-server transaction verification
            $verifyUrl = config('services.esewa.verify_url');
            $statusResponse = Http::get($verifyUrl, [
                'product_code' => $decoded['product_code'],
                'total_amount' => $totalAmountStr,
                'transaction_uuid' => $decoded['transaction_uuid'],
            ]);

            $isComplete = false;
            if ($statusResponse->successful()) {
                $statusJson = $statusResponse->json();
                if (isset($statusJson['status']) && $statusJson['status'] === 'COMPLETE') {
                    $isComplete = true;
                }
            } else {
                Log::warning('eSewa order transaction verification API call unsuccessful, falling back to signature check');
                $isComplete = true;
            }

            if (!$isComplete) {
                Log::error('eSewa server confirmed order payment was not completed');
                return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('Payment verification failed.'));
            }

            // Parse transaction UUID: NEONFIT_ORDER_{orderId}_{timestamp}
            preg_match('/NEONFIT_ORDER_(\d+)_/', $decoded['transaction_uuid'], $matches);
            if (count($matches) === 2) {
                $orderId = $matches[1];

                $order = Order::find($orderId);
                if ($order) {
                    // Update order payment status
                    $order->update([
                        'payment_status' => 'paid',
                    ]);

                    Log::info('Order payment confirmed via eSewa', ['order_id' => $order->id]);

                    // Load order with items for email
                    $order->load('orderItems.product');

                    // Update payment record
                    $payment = Payment::where('transaction_uuid', $decoded['transaction_uuid'])->first();
                    if ($payment) {
                        $payment->update([
                            'status' => 'completed',
                            'esewa_transaction_code' => $decoded['transaction_code'] ?? null,
                            'response_payload' => $decoded,
                        ]);
                    } else {
                        Payment::create([
                            'user_id' => $order->user_id,
                            'payment_type' => 'order',
                            'order_id' => $order->id,
                            'transaction_uuid' => $decoded['transaction_uuid'],
                            'amount' => floatval($totalAmountStr),
                            'status' => 'completed',
                            'esewa_transaction_code' => $decoded['transaction_code'] ?? null,
                            'response_payload' => $decoded,
                        ]);
                    }

                    // Send order confirmation email for eSewa payment
                    try {
                        Mail::to($order->email)->send(new OrderConfirmation($order));
                        Log::info("Order confirmation email sent via eSewa to {$order->email} for order #{$order->id}");
                    } catch (\Exception $e) {
                        Log::error("Failed to send order confirmation email via eSewa to {$order->email} for order #{$order->id}: " . $e->getMessage(), [
                            'exception' => get_class($e),
                            'trace' => $e->getTraceAsString(),
                        ]);
                    }

                    $message = urlencode("Your order #{$order->id} has been paid successfully via eSewa!");
                    return redirect("http://localhost:3000/thank-you?status=success&message={$message}&orderId={$order->id}");
                }
            }

            Log::error('eSewa order payment succeeded, but order details could not be parsed', ['uuid' => $decoded['transaction_uuid']]);
            return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('Could not identify order record.'));

        } catch (\Exception $e) {
            Log::error('eSewa order callback exception occurred', ['exception' => $e->getMessage()]);
            return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('An unexpected error occurred during verification.'));
        }
    }

    /**
     * eSewa failure callback for product orders
     */
    public function orderFailure(Request $request)
    {
        Log::warning('eSewa order payment failed callback triggered', ['query' => $request->all()]);
        
        $uuid = $request->query('pid') ?? $request->query('transaction_uuid');
        if ($uuid) {
            $payment = Payment::where('transaction_uuid', $uuid)->first();
            if ($payment) {
                $payment->update(['status' => 'failed']);
            }
        }

        return redirect('http://localhost:3000/checkout?status=failure&message=' . urlencode('Payment was cancelled or failed. Please try again.'));
    }

    public function failure(Request $request)
    {
        Log::warning('eSewa payment failed callback triggered', ['query' => $request->all()]);
        
        $uuid = $request->query('pid') ?? $request->query('transaction_uuid');
        if ($uuid) {
            $payment = Payment::where('transaction_uuid', $uuid)->first();
            if ($payment) {
                $payment->update(['status' => 'failed']);
            }
        }

        return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Payment was cancelled or failed. Please try again.'));
    }
}
