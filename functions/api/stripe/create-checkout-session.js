import Stripe from 'stripe';

export async function onRequestPost(context) {
    try {
        const { request, env } = context;

        // Parse request body
        const body = await request.json();
        const { items, customerEmail, customerName, couponCode } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid items' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Initialize Stripe
        if (!env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });

        // Determine Frontend URL
        // Use the request origin or fallback to env var or default
        const url = new URL(request.url);
        const FRONTEND_URL = env.FRONTEND_URL || url.origin;

        // Calculate totals
        const lineItems = items.map((item) => ({
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

        // Create Session
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
                items: JSON.stringify(items.map((i) => ({ id: i.id, q: i.quantity }))),
            },
        });

        return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Stripe session creation error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
