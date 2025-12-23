<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
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
        .status-update-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
        }
        .status-update-box h2 {
            margin: 0 0 20px 0;
            color: #065f46;
            font-size: 22px;
        }
        .status-badge {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 18px;
            text-transform: uppercase;
            margin: 10px 0;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-processing {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-shipped {
            background-color: #e0e7ff;
            color: #4338ca;
        }
        .status-delivered {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .payment-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .payment-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
        .payment-failed {
            background-color: #fee2e2;
            color: #991b1b;
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
        .total-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
        }
        .total-box p {
            margin: 0;
            color: #ffffff;
            font-size: 16px;
        }
        .total-box .amount {
            font-size: 28px;
            font-weight: bold;
            margin-top: 5px;
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
        .status-message {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .status-message p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>🏋️ Neon Fitness Gym</h1>
            <p>Order Status Update</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Hello <strong>{{ $order->full_name }}</strong>,
            </p>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 30px;">
                We wanted to let you know that your order status has been updated.
            </p>

            <!-- Status Update Box -->
            <div class="status-update-box">
                <h2>Order #{{ $order->id }} Status Update</h2>

                <p style="margin: 15px 0 10px 0; color: #64748b; font-size: 14px;">Order Status:</p>
                <span class="status-badge status-{{ $order->order_status }}">
                    {{ ucfirst($order->order_status) }}
                </span>

                <p style="margin: 25px 0 10px 0; color: #64748b; font-size: 14px;">Payment Status:</p>
                <span class="status-badge payment-{{ $order->payment_status }}">
                    {{ ucfirst($order->payment_status) }}
                </span>

                <p style="margin-top: 20px; color: #64748b; font-size: 12px;">
                    Updated on: {{ \Carbon\Carbon::parse($order->updated_at)->format('F d, Y - h:i A') }}
                </p>
            </div>

            <!-- Status Message -->
            <div class="status-message">
                <p>
                    @if($order->order_status === 'pending')
                        <strong>📋 Your order is pending:</strong> We've received your order and it's being prepared for processing.
                    @elseif($order->order_status === 'processing')
                        <strong>⚙️ Your order is being processed:</strong> We're preparing your items for shipment.
                    @elseif($order->order_status === 'shipped')
                        <strong>🚚 Your order has been shipped:</strong> Your package is on its way to you!
                    @elseif($order->order_status === 'delivered')
                        <strong>✅ Your order has been delivered:</strong> We hope you enjoy your purchase! Thank you for choosing Neon Fitness Gym.
                    @elseif($order->order_status === 'cancelled')
                        <strong>❌ Your order has been cancelled:</strong> If you have any questions, please contact us.
                    @endif
                </p>
            </div>

            <!-- Order Summary -->
            <div class="info-section">
                <h3>📦 Order Summary</h3>
                <div class="info-row">
                    <span class="info-label">Order ID:</span>
                    <span class="info-value">#{{ $order->id }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Order Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Method:</span>
                    <span class="info-value">{{ $order->payment_method }}</span>
                </div>
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
                    <span class="info-label">Address:</span>
                    <span class="info-value">{{ $order->address }}</span>
                </div>
            </div>

            <!-- Order Items -->
            <div class="info-section">
                <h3>🛍️ Items Ordered</h3>
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

            <!-- Total -->
            <div class="total-box">
                <p>Total Amount</p>
                <p class="amount">Rs. {{ number_format($order->total, 2) }}</p>
            </div>

            <!-- Contact Info -->
            @if($order->order_status !== 'delivered' && $order->order_status !== 'cancelled')
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 30px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>💡 Need Help?</strong> If you have any questions about your order, please don't hesitate to contact us.
                </p>
            </div>
            @endif

            <!-- Thank You Message -->
            <p style="font-size: 14px; color: #64748b; margin-top: 30px; text-align: center;">
                Thank you for choosing Neon Fitness Gym! 💪
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
