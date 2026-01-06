export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();
        const timestamp = Date.now();
        const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // We will store data in ASPRE_SETTINGS for now as it's the available binding
        // Structure: analytics::YYYY-MM-DD::type -> [events]

        // 1. Real-time heartbeat (expires in 5 mins)
        if (data.type === 'heartbeat') {
            const sessionId = data.sessionId;
            await env.ASPRE_SETTINGS.put(`rt::${sessionId}`, JSON.stringify({
                url: data.url,
                country: request.cf?.country || 'Unknown',
                city: request.cf?.city || 'Unknown',
                ts: timestamp
            }), { expirationTtl: 300 }); // 5 mins
        }

        // 2. Page Views & Events (Persistent)
        // Note: In a real high-traffic app, we'd use Durable Objects or specialized analytics.
        // For this scale, we'll append to a daily chunk or just log it.
        // Since KV isn't great for "appending", we will just use the real-time feature 
        // and simple counters for this demo to avoid race conditions.

        if (data.type === 'pageview') {
            // Increment daily counter
            const count = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::views`) || 0;
            await env.ASPRE_SETTINGS.put(`stats::${dateKey}::views`, Number(count) + 1);
        }

        if (data.type === 'error') {
            // Store last 50 errors
            let errors = await env.ASPRE_SETTINGS.get('log::errors', { type: 'json' }) || [];
            errors.unshift({ ...data, ts: timestamp, country: request.cf?.country });
            errors = errors.slice(0, 50);
            await env.ASPRE_SETTINGS.put('log::errors', JSON.stringify(errors));
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
