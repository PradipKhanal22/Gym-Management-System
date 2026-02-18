<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class EsewaController extends Controller
{
    public function pay(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'address' => 'required|string',
                'plan' => 'required|string',
                'amount' => 'required|numeric',
            ]);

            $amount = $request->amount;
            $taxAmount = 0;
            $productServiceCharge = 0;
            $productDeliveryCharge = 0;
            $totalAmount = $amount;
            
            $transactionUuid = 'NEONFIT_' . time() . '_' . rand(1000, 9999);
            $productCode = 'EPAYTEST';
            
            $successUrl = route('esewa.success');
            $failureUrl = route('esewa.failure');
            
            $secretKey = '8gBm/:&EnhH.1/q';
            
            $signedFieldNames = 'total_amount,transaction_uuid,product_code';
            $dataToSign = "total_amount=$totalAmount,transaction_uuid=$transactionUuid,product_code=$productCode";
            
            $signature = $this->generateSignature($dataToSign, $secretKey);

            Log::info('eSewa payment initiated', [
                'transaction_uuid' => $transactionUuid,
                'amount' => $amount,
                'total_amount' => $totalAmount
            ]);

            return response()->json([
                'success' => true,
                'url' => 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
                'params' => [
                    'amount' => $amount,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'transaction_uuid' => $transactionUuid,
                    'product_code' => $productCode,
                    'product_service_charge' => $productServiceCharge,
                    'product_delivery_charge' => $productDeliveryCharge,
                    'success_url' => $successUrl,
                    'failure_url' => $failureUrl,
                    'signed_field_names' => $signedFieldNames,
                    'signature' => $signature,
                ],
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('eSewa payment initiation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function generateSignature($data, $secretKey)
    {
        $hmac = hash_hmac('sha256', $data, $secretKey, true);
        return base64_encode($hmac);
    }

    public function success(Request $request)
    {
        Log::info('eSewa success callback - ALL PARAMETERS:', $request->all());
        Log::info('eSewa success callback - QUERY STRING:', ['query' => $request->getQueryString()]);
        Log::info('eSewa success callback - METHOD:', ['method' => $request->method()]);
        
        try {
            $data = $request->all();
            
            if (empty($data)) {
                $data = $request->query();
                Log::info('Using query parameters instead', $data);
            }
            
            $transactionUuid = $data['transaction_uuid'] ?? $data['pid'] ?? null;
            $totalAmount = $data['total_amount'] ?? $data['amt'] ?? null;
            $refId = $data['refId'] ?? $data['reference_id'] ?? null;
            
            Log::info('Extracted values', [
                'transaction_uuid' => $transactionUuid,
                'total_amount' => $totalAmount,
                'refId' => $refId
            ]);
            
            if ($transactionUuid && $totalAmount) {
                return redirect()->to('http://localhost:3000/payment-success?' . http_build_query([
                    'transaction_uuid' => $transactionUuid,
                    'amount' => $totalAmount,
                    'refId' => $refId,
                    'status' => 'success'
                ]));
            }
            
            return redirect()->to('http://localhost:3000/payment-success?' . http_build_query([
                'status' => 'success',
                'message' => 'Payment completed successfully'
            ]));
            
        } catch (\Exception $e) {
            Log::error('eSewa success callback error: ' . $e->getMessage());
            return redirect()->to('http://localhost:3000/payment-success?' . http_build_query([
                'status' => 'success',
                'message' => 'Payment completed'
            ]));
        }
    }

    public function failure(Request $request)
    {
        Log::info('eSewa failure callback - ALL PARAMETERS:', $request->all());
        Log::info('eSewa failure callback - QUERY STRING:', ['query' => $request->getQueryString()]);
        
        $data = $request->all();
        if (empty($data)) {
            $data = $request->query();
        }
        
        $transactionUuid = $data['transaction_uuid'] ?? $data['pid'] ?? null;
        
        return redirect()->to('http://localhost:3000/payment-failure?' . http_build_query([
            'reason' => 'payment_failed',
            'transaction_uuid' => $transactionUuid
        ]));
    }
}