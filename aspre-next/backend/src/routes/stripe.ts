import express from 'express';
import Stripe from 'stripe';
import { CloudflareKV } from '../services/cloudflareKV';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, customerEmail, customerName, couponCode } = req.body;

        // Calculate totals
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [`${FRONTEND_URL}${item.image}`] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const tempOrderId = `ASP-${Date.now().toString(36).toUpperCase()}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${tempOrderId}`,
            cancel_url: `${FRONTEND_URL}/checkout`,
            customer_email: customerEmail,
            metadata: {
                customerName,
                tempOrderId,
                items: JSON.stringify(items.map((i: any) => ({ id: i.id, q: i.quantity }))),
            },
        });

        res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook handler
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!sig || !endpointSecret) throw new Error('Missing signature or secret');
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
            await createOrderFromSession(session);
            console.log('✅ Order created in Cloudflare KV');
        } catch (error) {
            console.error('❌ Failed to create order:', error);
        }
    }

    res.json({ received: true });
});

async function createOrderFromSession(session: Stripe.Checkout.Session) {
    const metadata = session.metadata || {};
    const items = JSON.parse(metadata.items || '[]');

    const orderId = metadata.tempOrderId || `ASP-${Date.now().toString(36).toUpperCase()}`;

    // 1. Get License
    let licenseKey = 'LICENSE-UNAVAILABLE';
    try {
        const availableLicenses = await CloudflareKV.licenses.getAvailable();
        if (availableLicenses && Array.isArray(availableLicenses) && availableLicenses.length > 0) {
            licenseKey = availableLicenses[0];
            // Remove from available (Optimistic locking omitted for brevity)
            const updatedList = availableLicenses.slice(1);
            await CloudflareKV.put(process.env.CLOUDFLARE_KV_LICENSES_ID, 'licenses:available', updatedList);
            // Mark assigned
            await CloudflareKV.licenses.assign(licenseKey);
        }
    } catch (e) {
        console.error('Failed to assign license:', e);
    }

    // 2. Create Order Object
    const order = {
        orderId,
        customerName: metadata.customerName || session.customer_details?.name || 'Unknown',
        customerEmail: session.customer_details?.email || '',
        items: items.map((i: any) => ({
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
        paymentIntentId: session.payment_intent as string,
        licenseKey,
        createdAt: new Date().toISOString(),
    };

    // 3. Save to Cloudflare KV
    await CloudflareKV.orders.create(order);

    // 4. Update Analytics Conversions
    const todayKey = new Date().toISOString().split('T')[0];
    const SETTINGS_NAMESPACE = process.env.CLOUDFLARE_KV_SETTINGS_ID || process.env.CLOUDFLARE_KV_ORDERS_ID;
    const currentConvs = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${todayKey}::conversions`) || 0;
    await CloudflareKV.put(SETTINGS_NAMESPACE, `stats::${todayKey}::conversions`, Number(currentConvs) + 1);
}

export default router;
