<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header p {
            color: #d1fae5;
            margin: 10px 0 0 0;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .membership-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .membership-box h2 {
            margin: 0 0 10px 0;
            color: #065f46;
            font-size: 24px;
        }
        .membership-box .plan-name {
            font-size: 32px;
            font-weight: bold;
            color: #10b981;
            margin: 10px 0;
        }
        .membership-box p {
            margin: 5px 0;
            color: #064e3b;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            background-color: #10b981;
            color: #ffffff;
            border-radius: 8px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-top: 10px;
        }
        .info-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .info-section h3 {
            margin: 0 0 15px 0;
            color: #1e293b;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #64748b;
            font-size: 14px;
        }
        .info-value {
            color: #1e293b;
            font-weight: bold;
            font-size: 14px;
        }
        .total-section {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            color: #ffffff;
        }
        .total-row.grand-total {
            border-top: 2px solid #ffffff;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: bold;
        }
        .features-list {
            text-align: left;
            padding: 0;
            margin: 15px 0;
            list-style: none;
        }
        .features-list li {
            padding: 6px 0;
            color: #064e3b;
            font-size: 14px;
        }
        .features-list li::before {
            content: "✓ ";
            color: #10b981;
            font-weight: bold;
        }
        .footer {
            background-color: #1e293b;
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }
        .footer a {
            color: #10b981;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>🏋️ Neon Fitness Gym</h1>
            <p>Membership Confirmation</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Hello <strong>{{ $user->name }}</strong>,
            </p>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 30px;">
                Welcome to NeonFit! Your membership has been successfully activated. We're thrilled to have you on board on your fitness journey.
            </p>

            <!-- Membership Info Box -->
            <div class="membership-box">
                <h2>🎉 Membership Activated</h2>
                <div class="plan-name">{{ $planName }}</div>
                <span class="status-badge">Active</span>
            </div>

            <!-- Membership Details -->
            <div class="info-section">
                <h3>📋 Membership Details</h3>
                <div class="info-row">
                    <span class="info-label">Member Name:</span>
                    <span class="info-value">{{ $user->name }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $user->email }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Plan:</span>
                    <span class="info-value">{{ $planName }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($startDate)->format('F d, Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Expiry Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($endDate)->format('F d, Y') }}</span>
                </div>
            </div>

            <!-- Plan Features -->
            <div class="info-section">
                <h3>💪 Your Plan Features</h3>
                @if($planName === 'Day Pass')
                    <ul class="features-list">
                        <li>Single day access to gym facilities</li>
                        <li>Locker room access</li>
                        <li>Free WiFi</li>
                    </ul>
                @elseif($planName === 'Pro Member')
                    <ul class="features-list">
                        <li>24/7 Gym Access</li>
                        <li>Group Classes Included</li>
                        <li>1 Guest Pass per Month</li>
                        <li>Free Fitness Assessment</li>
                    </ul>
                @elseif($planName === 'Elite')
                    <ul class="features-list">
                        <li>All Pro Member Benefits</li>
                        <li>Unlimited Sauna/Recovery</li>
                        <li>Personal Training (1x/month)</li>
                        <li>Nutrition Plan</li>
                        <li>Priority Support</li>
                    </ul>
                @endif
            </div>

            <!-- Payment Summary -->
            <div class="total-section">
                <div class="total-row grand-total">
                    <span>Amount Paid:</span>
                    <span>Rs. {{ number_format($amount, 2) }}</span>
                </div>
            </div>

            <!-- Additional Info -->
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin-top: 30px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>💡 Tip:</strong>
                    @if($planName === 'Day Pass')
                        Present this email or your ID at the reception for gym entry today.
                    @else
                        Show your membership ID at the reception on your first visit. Your membership is valid until {{ \Carbon\Carbon::parse($endDate)->format('F d, Y') }}.
                    @endif
                </p>
            </div>

            <!-- Thank You Message -->
            <p style="font-size: 14px; color: #64748b; margin-top: 30px; text-align: center;">
                If you have any questions about your membership, please don't hesitate to contact us.<br>
                We're here to help! 💪
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Neon Fitness Gym</strong></p>
            <p>Your Partner in Fitness Excellence</p>
            <p style="margin-top: 15px;">
                Email: <a href="mailto:khanalpradip66@gmail.com">khanalpradip66@gmail.com</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
                © {{ date('Y') }} Neon Fitness Gym. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
