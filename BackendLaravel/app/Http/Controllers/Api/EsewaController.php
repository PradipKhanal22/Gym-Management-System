<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EsewaController extends Controller
{
    public function pay(Request $request)
    {
        $request->validate([
            'full_name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required',
            'plan' => 'required',
            'amount' => 'required|numeric',
        ]);

        $transactionId = 'NEONFIT_' . time();

        // Save pending payment (recommended)
        // Payment::create([...])

        return response()->json([
            'url' => config('services.esewa.url'),
            'params' => [
                'amt' => $request->amount,
                'psc' => 0,
                'pdc' => 0,
                'txAmt' => 0,
                'tAmt' => $request->amount,
                'pid' => $transactionId,
                'scd' => config('services.esewa.merchant'),
                'su' => config('app.url') . '/api/esewa/success',
                'fu' => config('app.url') . '/api/esewa/failure',
            ]
        ]);
    }

    public function success(Request $request)
    {
        $verify = Http::asForm()->post(config('services.esewa.verify_url'), [
            'amt' => $request->amt,
            'rid' => $request->refId,
            'pid' => $request->pid,
            'scd' => config('services.esewa.merchant'),
        ]);

        if (str_contains($verify->body(), 'Success')) {
            // Update payment → SUCCESS
            // Activate membership
            return redirect('http://localhost:3000/payment-success');
        }

        return redirect('http://localhost:3000/payment-failure');
    }

    public function failure()
    {
        return redirect('http://localhost:3000/payment-failure');
    }
}

