<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to NeoFiT Gym</title>
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
            padding: 50px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header .emoji {
            font-size: 64px;
            margin-bottom: 20px;
        }
        .header p {
            color: #d1fae5;
            margin: 15px 0 0 0;
            font-size: 18px;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 3px solid #10b981;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
        }
        .welcome-box h2 {
            margin: 0 0 15px 0;
            color: #065f46;
            font-size: 26px;
        }
        .welcome-box p {
            margin: 0;
            color: #064e3b;
            font-size: 16px;
            line-height: 1.6;
        }
        .info-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
        }
        .info-section h3 {
            margin: 0 0 15px 0;
            color: #1e293b;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        .feature-list li {
            padding: 12px 0;
            color: #475569;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .feature-list li:before {
            content: "✓";
            display: inline-block;
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 28px;
            font-weight: bold;
            flex-shrink: 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            text-transform: uppercase;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .stats-box {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            gap: 15px;
        }
        .stat-item {
            text-align: center;
            flex: 1;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 13px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
        }
        .footer {
            background-color: #1e293b;
            color: #ffffff;
            text-align: center;
            padding: 40px 20px;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }
        .footer a {
            color: #10b981;
            text-decoration: none;
        }
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #10b981, transparent);
            margin: 30px 0;
        }
        .highlight-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .highlight-box p {
            margin: 0;
            color: #92400e;
            font-size: 15px;
            line-height: 1.7;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="emoji">🏋️‍♂️</div>
            <h1>Welcome to NeoFiT Gym!</h1>
            <p>Your Fitness Journey Starts Here</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Welcome Message -->
            <div class="welcome-box">
                <h2>Hello {{ $user->name }}! 👋</h2>
                <p>
                    We're thrilled to have you join the NeoFiT Gym family!
                    You've just taken the first step towards a healthier, stronger, and more confident you.
                </p>
            </div>

            <!-- Account Details -->
            <div class="info-section">
                <h3>📋 Your Account Details</h3>
                <p style="margin: 10px 0; color: #475569;">
                    <strong style="color: #1e293b;">Name:</strong> {{ $user->name }}
                </p>
                <p style="margin: 10px 0; color: #475569;">
                    <strong style="color: #1e293b;">Email:</strong> {{ $user->email }}
                </p>
                <p style="margin: 10px 0; color: #475569;">
                    <strong style="color: #1e293b;">Phone:</strong> {{ $user->phone }}
                </p>
                <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px;">
                    <em>Registered on: {{ \Carbon\Carbon::parse($user->created_at)->format('F d, Y - h:i A') }}</em>
                </p>
            </div>

            <div class="divider"></div>

            <!-- What's Next -->
            <div class="info-section">
                <h3>🎯 What's Next?</h3>
                <ul class="feature-list">
                    <li><strong>Explore Our Services:</strong> Browse our premium gym services and training programs</li>
                    <li><strong>Meet Our Trainers:</strong> Connect with certified fitness professionals</li>
                    <li><strong>Shop Products:</strong> Check out our fitness equipment and supplements</li>
                    <li><strong>Track Your Progress:</strong> Monitor your fitness journey through your dashboard</li>
                    <li><strong>Join Classes:</strong> Participate in group fitness sessions and workshops</li>
                </ul>
            </div>

            <!-- Stats -->
            <div class="stats-box">
                <div class="stat-item">
                    <div class="stat-number">100+</div>
                    <div class="stat-label">Members</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">15+</div>
                    <div class="stat-label">Trainers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Programs</div>
                </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #64748b; margin-bottom: 20px; font-size: 16px;">
                    Ready to start your transformation?
                </p>
                <a href="#" class="cta-button">Get Started Now</a>
            </div>

            <!-- Important Note -->
            <div class="highlight-box">
                <p>
                    <strong>💡 Pro Tip:</strong> Complete your profile and set your fitness goals to get personalized
                    recommendations from our trainers. Don't forget to explore our exclusive member benefits and
                    special offers!
                </p>
            </div>

            <div class="divider"></div>

            <!-- Additional Info -->
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.7;">
                    <strong>📞 Need Help?</strong><br>
                    Our support team is here to help you! If you have any questions or need assistance,
                    feel free to reach out to us anytime. We're committed to making your fitness journey
                    smooth and enjoyable.
                </p>
            </div>

            <!-- Thank You -->
            <p style="font-size: 16px; color: #1e293b; text-align: center; margin: 30px 0;">
                <strong>Thank you for choosing NeoFiT Gym!</strong><br>
                <span style="color: #64748b; font-size: 14px;">
                    Together, we'll achieve your fitness goals! 💪
                </span>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">🏋️ NeoFiT Gym</p>
            <p style="color: #94a3b8; margin-bottom: 20px;">
                Your Partner in Fitness Excellence
            </p>
            <div style="border-top: 1px solid #475569; padding-top: 20px; margin-top: 20px;">
                <p style="margin: 5px 0;">
                    📧 Email: <a href="mailto:khanalpradip66@gmail.com">khanalpradip66@gmail.com</a>
                </p>
                <p style="margin: 5px 0;">
                    📍 Neon Fitness Gym - Building Stronger Bodies & Minds
                </p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                © {{ date('Y') }} NeoFiT Gym. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
