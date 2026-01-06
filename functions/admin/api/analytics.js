export async function onRequestGet(context) {
    const { env } = context;

    try {
        // 1. Get Real-time Users
        const rtList = await env.ASPRE_SETTINGS.list({ prefix: 'rt::' });
        const activeUsers = [];
        for (const key of rtList.keys) {
            const userData = await env.ASPRE_SETTINGS.get(key.name, { type: 'json' });
            if (userData) activeUsers.push(userData);
        }

        // 2. Get Stats for Last 7 Days
        const history = {
            labels: [],
            visitors: [],
            conversions: []
        };

        const countriesAgg = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString([], { weekday: 'short' });

            const views = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::views`) || 0;
            const convs = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::conversions`) || 0;
            const countries = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::countries`, { type: 'json' }) || {};

            history.labels.push(label);
            history.visitors.push(Number(views));
            history.conversions.push(Number(convs));

            // Aggregate countries
            for (const [code, count] of Object.entries(countries)) {
                countriesAgg[code] = (countriesAgg[code] || 0) + count;
            }
        }

        // 3. Format Countries for UI
        const topCountries = Object.entries(countriesAgg)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([code, count]) => ({
                code,
                count,
                percent: Math.round((count / history.visitors.reduce((a, b) => a + b, 0 || 1)) * 100) || 0
            }));

        // 4. Get Logs
        const errors = await env.ASPRE_SETTINGS.get('log::errors', { type: 'json' }) || [];
        const clicks = await env.ASPRE_SETTINGS.get('log::clicks', { type: 'json' }) || [];

        const todayKey = new Date().toISOString().split('T')[0];
        const todayViews = await env.ASPRE_SETTINGS.get(`stats::${todayKey}::views`) || 0;
        const todayConvs = await env.ASPRE_SETTINGS.get(`stats::${todayKey}::conversions`) || 0;

        return new Response(JSON.stringify({
            realtime: {
                count: activeUsers.length,
                users: activeUsers
            },
            today: {
                views: Number(todayViews),
                conversions: Number(todayConvs)
            },
            topCountries,
            errors,
            clicks,
            history
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
