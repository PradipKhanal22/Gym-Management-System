<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'transaction_uuid',
        'esewa_transaction_code',
        'amount',
        'plan_name',
        'status',
        'response_payload'
    ];

    protected $casts = [
        'response_payload' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
