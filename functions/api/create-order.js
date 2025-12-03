/**
 * Cloudflare Functions - Create Order
 * Handles order creation, license assignment, and email delivery
 */

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const orderData = await request.json();

        // Validate request
        if (!orderData.email || !orderData.name || !orderData.paymentId) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Missing required fields'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate order ID
        const orderId = generateOrderId();
        const timestamp = new Date().toISOString();

        // Assign license key
        const licenseKey = await assignLicenseKey(env);

        if (!licenseKey) {
            return new Response(JSON.stringify({
                success: false,
                message: 'No license keys available'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create order object
        const order = {
            id: orderId,
            customerName: orderData.name,
            customerEmail: orderData.email,
            country: orderData.country || 'N/A',
            paymentMethod: orderData.paymentMethod,
            paymentId: orderData.paymentId,
            amount: orderData.amount,
            licenseKey: licenseKey,
            status: 'completed',
            createdAt: timestamp
        };

        // Save order to KV
        await env.ASPRE_ORDERS.put(`order:${orderId}`, JSON.stringify(order));
        await env.ASPRE_CUSTOMERS.put(`customer:${orderData.email}`, JSON.stringify({
            name: orderData.name,
            email: orderData.email,
            orders: [orderId],
            createdAt: timestamp
        }));

        // Send confirmation email
        await sendOrderEmail(env, order);

        // Log successful order
        console.log(`Order created: ${orderId} for ${orderData.email}`);

        return new Response(JSON.stringify({
            success: true,
            order: {
                id: orderId,
                licenseKey: licenseKey,
                email: orderData.email
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Generate unique order ID
 */
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `ASP-${timestamp}-${random}`.toUpperCase();
}

/**
 * Assign available license key
 */
async function assignLicenseKey(env) {
    try {
        // Get available licenses list
        const licensesListKey = 'licenses:available';
        const availableList = await env.ASPRE_LICENSES.get(licensesListKey, { type: 'json' });

        if (!availableList || availableList.length === 0) {
            return null;
        }

        // Get first available license
        const licenseKey = availableList[0];

        // Remove from available list
        const updatedList = availableList.slice(1);
        await env.ASPRE_LICENSES.put(licensesListKey, JSON.stringify(updatedList));

        // Mark license as used
        await env.ASPRE_LICENSES.put(`license:${licenseKey}`, JSON.stringify({
            key: licenseKey,
            status: 'assigned',
            assignedAt: new Date().toISOString()
        }));

        return licenseKey;
    } catch (error) {
        console.error('License assignment error:', error);
        return null;
    }
}

/**
 * Send order confirmation email
 */
async function sendOrderEmail(env, order) {
    try {
        // Email template
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
                <li>Download Aspire 12: <a href="YOUR_DOWNLOAD_LINK">Click here to download</a></li>
                <li>Run the installer</li>
                <li>Enter your license key when prompted: <strong>${order.licenseKey}</strong></li>
                <li>Complete the activation process</li>
            </ol>
            
            <p style="text-align: center;">
                <a href="YOUR_INSTALLATION_GUIDE_URL" class="button">Watch Installation Video</a>
            </p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or need assistance:</p>
            <ul>
                <li>Email: support@aspire-software.com</li>
                <li>Support Portal: <a href="YOUR_SUPPORT_URL">Visit Support</a></li>
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

        // Send email (integrate with your email service: SendGrid, Mailgun, etc.)
        const emailResponse = await fetch('https://api.your-email-service.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.EMAIL_API_KEY}`
            },
            body: JSON.stringify({
                to: order.customerEmail,
                from: 'noreply@aspire-software.com',
                subject: `Your Vectric Aspire 12 License - Order ${order.id}`,
                html: emailBody
            })
        });

        return emailResponse.ok;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
}
