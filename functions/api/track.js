export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();
        const timestamp = Date.now();
        const dateKey = new Date().toISOString().split('T')[0];

        // 1. Real-time heartbeat (expires in 5 mins)
        if (data.type === 'heartbeat') {
            const sessionId = data.sessionId;
            await env.ASPRE_SETTINGS.put(`rt::${sessionId}`, JSON.stringify({
                url: data.url,
                country: request.cf?.country || 'Unknown',
                city: request.cf?.city || 'Unknown',
                ts: timestamp
            }), { expirationTtl: 300 });
        }

        // 2. Page Views
        if (data.type === 'pageview') {
            const count = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::views`) || 0;
            await env.ASPRE_SETTINGS.put(`stats::${dateKey}::views`, Number(count) + 1);
        }

        // 3. Click Tracking - Store Top Clicks
        if (data.type === 'click') {
            let clicks = await env.ASPRE_SETTINGS.get('log::clicks', { type: 'json' }) || [];

            clicks.unshift({
                type: data.type || 'link',
                text: data.text || 'Unknown',
                href: data.href || null,
                ts: timestamp,
                country: request.cf?.country || 'Unknown'
            });

            clicks = clicks.slice(0, 100);
            await env.ASPRE_SETTINGS.put('log::clicks', JSON.stringify(clicks));
        }

        // 4. Errors
        if (data.type === 'error') {
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
