export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();
        const timestamp = Date.now();
        const dateKey = new Date().toISOString().split('T')[0];
        const country = request.cf?.country || 'Unknown';

        // 1. Real-time heartbeat
        if (data.type === 'heartbeat') {
            const sessionId = data.sessionId;
            await env.ASPRE_SETTINGS.put(`rt::${sessionId}`, JSON.stringify({
                url: data.url,
                country: country,
                city: request.cf?.city || 'Unknown',
                ts: timestamp
            }), { expirationTtl: 300 });
        }

        // 2. Page Views & Country Stats
        if (data.type === 'pageview') {
            // Increment views
            const views = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::views`) || 0;
            await env.ASPRE_SETTINGS.put(`stats::${dateKey}::views`, (Number(views) + 1).toString());

            // Update country stats
            let countries = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::countries`, { type: 'json' }) || {};
            countries[country] = (countries[country] || 0) + 1;
            await env.ASPRE_SETTINGS.put(`stats::${dateKey}::countries`, JSON.stringify(countries));
        }

        // 3. Click Tracking
        if (data.type === 'click') {
            let clicks = await env.ASPRE_SETTINGS.get('log::clicks', { type: 'json' }) || [];

            clicks.unshift({
                type: data.clickType || 'click',
                text: data.text || 'Unknown',
                href: data.href || null,
                ts: timestamp,
                country: country
            });

            clicks = clicks.slice(0, 100);
            await env.ASPRE_SETTINGS.put('log::clicks', JSON.stringify(clicks));
        }

        // 4. Conversions (e.g. checkout start)
        if (data.type === 'conversion') {
            const convs = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::conversions`) || 0;
            await env.ASPRE_SETTINGS.put(`stats::${dateKey}::conversions`, (Number(convs) + 1).toString());
        }

        // 5. Errors
        if (data.type === 'error') {
            let errors = await env.ASPRE_SETTINGS.get('log::errors', { type: 'json' }) || [];
            errors.unshift({ ...data, ts: timestamp, country: country });
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
