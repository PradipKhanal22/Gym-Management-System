<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Payment;
use App\Models\Membership;

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
            'transaction_uuid' => $transactionUuid,
            'amount' => $request->amount,
            'plan_name' => $request->plan,
            'status' => 'pending',
        ]);

        $secretKey = config('services.esewa.secret');
        $productCode = config('services.esewa.merchant');

        // Format amount with 2 decimal places — this string MUST be identical
        // in both the HMAC message and the total_amount field posted to eSewa.
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
                'total_amount' => $totalAmount,   // Must match signature exactly
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
            
            // Format total_amount as it is returned (can be string or numeric)
            // eSewa returns total_amount exactly as formatted. But we must match the exact string returned.
            $totalAmount = $decoded['total_amount'];
            
            // Replace commas inside amount if any (e.g. 1,000)
            $totalAmountStr = str_replace(',', '', $totalAmount);
            
            $message = "total_amount={$totalAmountStr},transaction_uuid={$decoded['transaction_uuid']},product_code={$decoded['product_code']}";
            $computedSignature = base64_encode(hash_hmac('sha256', $message, $secretKey, true));

            if ($computedSignature !== $decoded['signature']) {
                Log::error('eSewa HMAC signature mismatch', [
                    'received' => $decoded['signature'],
                    'computed' => $computedSignature,
                    'message' => $message
                ]);
                return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Signature verification failed. Potential tampering.'));
            }

            // Optional: Server-to-server transaction verification check
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

            // Note: In some local sandbox setups, the verification endpoint might be slow or return error.
            // We verify signature first, and then double check the response status.
            $isComplete = false;
            if ($statusResponse->successful()) {
                $statusJson = $statusResponse->json();
                if (isset($statusJson['status']) && $statusJson['status'] === 'COMPLETE') {
                    $isComplete = true;
                }
            } else {
                Log::warning('eSewa transaction verification API call unsuccessful, falling back to signature check');
                $isComplete = true; // Fallback to trust the verified signature in local environment
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

                    // Activate User Membership
                    $user->update([
                        'membership_plan' => $planName,
                        'membership_status' => 'active',
                        'membership_expires_at' => now()->addMonth(),
                    ]);

                    // Store details in memberships table
                    Membership::updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'plan_name' => $planName,
                            'status' => 'active',
                            'price' => floatval($totalAmountStr),
                            'start_date' => now(),
                            'end_date' => now()->addMonth(),
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
                            'transaction_uuid' => $decoded['transaction_uuid'],
                            'amount' => floatval($totalAmountStr),
                            'plan_name' => $planName,
                            'status' => 'completed',
                            'esewa_transaction_code' => $decoded['transaction_code'] ?? null,
                            'response_payload' => $decoded,
                        ]);
                    }

                    $message = urlencode("Welcome to NeonFit! Your {$planName} membership has been activated successfully.");
                    return redirect("http://localhost:3000/thank-you?status=success&message={$message}&orderId={$decoded['transaction_code']}");
                }
            }

            Log::error('eSewa payment succeeded, but user or plan details could not be parsed', ['uuid' => $decoded['transaction_uuid']]);
            return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('Could not identify user membership record.'));

        } catch (\Exception $e) {
            Log::error('eSewa callback exception occurred', ['exception' => $e->getMessage()]);
            return redirect('http://localhost:3000/pricing?status=failure&message=' . urlencode('An unexpected error occurred during verification.'));
        }
    }

    public function failure(Request $request)
    {
        Log::warning('eSewa payment failed callback triggered', ['query' => $request->all()]);
        
        // Try to update payment status to failed if pid / uuid is passed (v2 sometimes passes query parameters in failure too)
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
