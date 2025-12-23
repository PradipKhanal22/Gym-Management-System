<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
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
        .order-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .order-box h2 {
            margin: 0 0 10px 0;
            color: #065f46;
            font-size: 24px;
        }
        .order-box p {
            margin: 5px 0;
            color: #064e3b;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            background-color: #fef3c7;
            color: #92400e;
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
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .items-table th {
            background-color: #10b981;
            color: #ffffff;
            padding: 12px;
            text-align: left;
            font-size: 14px;
            font-weight: bold;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #475569;
            font-size: 14px;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .total-section {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
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
            <p>Order Confirmation</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Hello <strong>{{ $order->full_name }}</strong>,
            </p>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 30px;">
                Thank you for your order! We're excited to help you on your fitness journey. Your order has been received and is being processed.
            </p>

            <!-- Order Info Box -->
            <div class="order-box">
                <h2>Order #{{ $order->id }}</h2>
                <p><strong>Order Date:</strong> {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y - h:i A') }}</p>
                <p><strong>Payment Method:</strong> {{ $order->payment_method }}</p>
                <span class="status-badge">{{ ucfirst($order->order_status) }}</span>
            </div>

            <!-- Delivery Information -->
            <div class="info-section">
                <h3>📍 Delivery Information</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">{{ $order->full_name }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">{{ $order->phone }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $order->email }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">{{ $order->address }}</span>
                </div>
            </div>

            <!-- Order Items -->
            <div class="info-section">
                <h3>📦 Order Items</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Price</th>
                            <th style="text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->orderItems as $item)
                        <tr>
                            <td><strong>{{ $item->product_name }}</strong></td>
                            <td style="text-align: center;">{{ $item->quantity }}</td>
                            <td style="text-align: right;">Rs. {{ number_format($item->product_price, 2) }}</td>
                            <td style="text-align: right;"><strong>Rs. {{ number_format($item->subtotal, 2) }}</strong></td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Order Summary -->
            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>Rs. {{ number_format($order->subtotal, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>{{ $order->shipping == 0 ? 'FREE' : 'Rs. ' . number_format($order->shipping, 2) }}</span>
                </div>
                @if($order->tax > 0)
                <div class="total-row">
                    <span>Tax:</span>
                    <span>Rs. {{ number_format($order->tax, 2) }}</span>
                </div>
                @endif
                <div class="total-row grand-total">
                    <span>TOTAL:</span>
                    <span>Rs. {{ number_format($order->total, 2) }}</span>
                </div>
            </div>

            <!-- Additional Info -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 30px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>💡 Note:</strong>
                    @if($order->payment_method === 'COD')
                        Please keep the exact amount ready for cash on delivery.
                    @else
                        Your payment is being processed. You will receive a confirmation shortly.
                    @endif
                </p>
            </div>

            <!-- Thank You Message -->
            <p style="font-size: 14px; color: #64748b; margin-top: 30px; text-align: center;">
                If you have any questions about your order, please don't hesitate to contact us.<br>
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
