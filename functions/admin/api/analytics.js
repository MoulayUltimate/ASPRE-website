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

        // 2. Get Daily Stats
        const dateKey = new Date().toISOString().split('T')[0];
        const views = await env.ASPRE_SETTINGS.get(`stats::${dateKey}::views`) || 0;

        // 3. Get Errors
        const errors = await env.ASPRE_SETTINGS.get('log::errors', { type: 'json' }) || [];

        // 4. Historical Data (mock for now)
        const chartData = {
            visitors: [120, 132, 101, 134, 90, 230, 210],
            conversions: [2, 3, 1, 4, 2, 5, 3]
        };

        return new Response(JSON.stringify({
            realtime: {
                count: activeUsers.length,
                users: activeUsers
            },
            today: {
                views: Number(views),
                conversions: 3
            },
            errors: errors,
            history: chartData
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Return fallback data if KV fails
        return new Response(JSON.stringify({
            realtime: { count: 0, users: [] },
            today: { views: 0, conversions: 0 },
            errors: [],
            history: {
                visitors: [45, 52, 38, 67, 55, 78, 82],
                conversions: [1, 2, 1, 3, 2, 4, 3]
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
