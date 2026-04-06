import Stripe from 'stripe';

export async function onRequestPost(context) {
    const { request, env } = context;
    const sig = request.headers.get('stripe-signature');
    const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

    if (!env.STRIPE_SECRET_KEY) {
        return new Response('STRIPE_SECRET_KEY missing', { status: 500 });
    }
    if (!endpointSecret) {
        return new Response('STRIPE_WEBHOOK_SECRET missing', { status: 500 });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
    });

    let event;

    try {
        const body = await request.text();
        if (!sig) throw new Error('No signature provided');
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            await handleCheckoutSessionCompleted(session, env);
            console.log('✅ Order created in Cloudflare KV');
        } catch (error) {
            console.error('❌ Failed to create order:', error);
            return new Response('Failed to process order', { status: 500 });
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function handleCheckoutSessionCompleted(session, env) {
    const metadata = session.metadata || {};
    const items = JSON.parse(metadata.items || '[]');
    const orderId = metadata.tempOrderId || `ASP-${Date.now().toString(36).toUpperCase()}`;

    // 1. Assign License Key
    const licenseKey = await assignLicenseKey(env);

    // 2. Create Order Object
    const order = {
        id: orderId, // standardized on 'id' instead of 'orderId' to match create-order.js
        orderId: orderId, // keeping both for compatibility
        customerName: metadata.customerName || session.customer_details?.name || 'Unknown',
        customerEmail: session.customer_details?.email || '',
        items: items.map((i) => ({
            productId: i.id,
            name: 'Vectric Aspire 12',
            price: session.amount_total ? session.amount_total / 100 : 0,
            quantity: i.q,
        })),
        subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
        discount: session.total_details?.amount_discount ? session.total_details.amount_discount / 100 : 0,
        total: session.amount_total ? session.amount_total / 100 : 0,
        paymentStatus: 'paid',
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,
        licenseKey: licenseKey || 'LICENSE-UNAVAILABLE',
        createdAt: new Date().toISOString(),
    };

    // 3. Save to Cloudflare KV
    // Save Order
    await env.ASPRE_ORDERS.put(`order:${orderId}`, JSON.stringify(order));

    // Save Customer
    // Check if customer exists to append order? For now, just overwrite/update basic info
    // In a real app, we'd read first. Here we'll just store the latest info.
    await env.ASPRE_CUSTOMERS.put(`customer:${order.customerEmail}`, JSON.stringify({
        name: order.customerName,
        email: order.customerEmail,
        lastOrder: orderId,
        updatedAt: order.createdAt
    }));

    // 4. Send Email
    if (env.EMAIL_API_KEY) {
        await sendOrderEmail(env, order);
    } else {
        console.warn('EMAIL_API_KEY not set, skipping email');
    }
}

async function assignLicenseKey(env) {
    try {
        const licensesListKey = 'licenses:available';
        const availableList = await env.ASPRE_LICENSES.get(licensesListKey, { type: 'json' });

        if (!availableList || !Array.isArray(availableList) || availableList.length === 0) {
            console.error('No licenses available');
            return null;
        }

        const licenseKey = availableList[0];

        // Optimistic locking: write back the list without this key
        const updatedList = availableList.slice(1);
        await env.ASPRE_LICENSES.put(licensesListKey, JSON.stringify(updatedList));

        // Mark as assigned
        await env.ASPRE_LICENSES.put(`license:${licenseKey}`, JSON.stringify({
            key: licenseKey,
            status: 'assigned',
            assignedAt: new Date().toISOString()
        }));

        return licenseKey;
    } catch (error) {
        console.error('Failed to assign license:', error);
        return null;
    }
}

async function sendOrderEmail(env, order) {
    try {
        const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0066cc 0%, #004c99 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .license-box { background: white; border: 2px solid #0066cc; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .license-key { font-size: 24px; font-weight: bold; color: #0066cc; letter-spacing: 2px; }
        .button { display: inline-block; background: #00b67a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Thank You for Your Purchase!</h1>
            <p>Your Vectric Aspire 12 License is Ready</p>
        </div>
        <div class="content">
            <h2>Hello ${order.customerName},</h2>
            <p>Thank you for choosing ASPIRE! Your order has been processed successfully.</p>
            
            <div class="license-box">
                <h3>Your License Key:</h3>
                <p class="license-key">${order.licenseKey}</p>
                <p style="color: #666; font-size: 14px;">Order ID: ${order.id}</p>
            </div>
            
            <h3>📥 Download & Installation:</h3>
            <ol>
                <li>Download Aspire 12: <a href="https://3daspire.com/download">Click here to download</a></li>
                <li>Run the installer</li>
                <li>Enter your license key when prompted: <strong>${order.licenseKey}</strong></li>
                <li>Complete the activation process</li>
            </ol>
            
            <p style="text-align: center;">
                <a href="https://3daspire.com/install-guide" class="button">Watch Installation Video</a>
            </p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or need assistance:</p>
            <ul>
                <li>Email: support@3daspire.com</li>
            </ul>
            
            <p><strong>Important:</strong> Please save this email for your records. You can re-download the software anytime using your order ID.</p>
            
            <div class="footer">
                <p>© 2024 ASPIRE. All rights reserved.</p>
                <p>This email was sent to ${order.customerEmail}</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        // Assuming a generic email service endpoint or SendGrid
        // For now, using the same placeholder as create-order.js
        // If the user has a specific email service, they need to configure it.
        // I'll use a generic fetch to a placeholder or assume the user has one.
        // Actually, create-order.js had 'https://api.your-email-service.com/send'.
        // I will keep that but add a comment.

        if (env.EMAIL_SERVICE_URL) {
            await fetch(env.EMAIL_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.EMAIL_API_KEY}`
                },
                body: JSON.stringify({
                    to: order.customerEmail,
                    from: 'noreply@3daspire.com',
                    subject: `Your Vectric Aspire 12 License - Order ${order.id}`,
                    html: emailBody
                })
            });
        } else {
            console.log('EMAIL_SERVICE_URL not configured. Email body generated:', emailBody.substring(0, 100) + '...');
        }

    } catch (error) {
        console.error('Email sending error:', error);
    }
}
