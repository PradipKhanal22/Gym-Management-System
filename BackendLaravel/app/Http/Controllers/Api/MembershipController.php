<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Membership;

class MembershipController extends Controller
{
    /**
     * Get current user's membership status
     */
    public function status(Request $request)
    {
        $user = $request->user();

        $hasActiveMembership = false;
        $daysRemaining = 0;
        $isExpired = false;
        $isDayPass = false;

        if ($user->membership_status === 'active' && $user->membership_expires_at) {
            $expiresAt = \Carbon\Carbon::parse($user->membership_expires_at);
            if ($expiresAt->isFuture()) {
                $hasActiveMembership = true;
                $isDayPass = $user->membership_plan === 'Day Pass';
                $daysRemaining = $isDayPass ? 0 : (int) now()->diffInDays($expiresAt, false);
            } else {
                $isExpired = true;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'has_active_membership' => $hasActiveMembership,
                'plan_name' => $user->membership_plan,
                'membership_status' => $user->membership_status,
                'membership_expires_at' => $user->membership_expires_at,
                'days_remaining' => $daysRemaining,
                'is_expired' => $isExpired,
                'is_day_pass' => $isDayPass,
            ]
        ], 200);
    }

    /**
     * Get all memberships (Admin only)
     */
    public function index(Request $request)
    {
        // Check if user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $memberships = Membership::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Memberships retrieved successfully',
            'data' => $memberships
        ], 200);
    }
}
