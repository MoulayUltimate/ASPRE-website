export async function onRequestGet(context) {
    const { env } = context;

    // 1. Get Real-time Users
    // List keys starting with rt::
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

    // 4. Mock Data for Charts (since we don't have historical data yet)
    // In a real app, we would query a database.
    const chartData = {
        visitors: [120, 132, 101, 134, 90, 230, 210], // Last 7 days
        conversions: [2, 3, 1, 4, 2, 5, 3]
    };

    return new Response(JSON.stringify({
        realtime: {
            count: activeUsers.length,
            users: activeUsers
        },
        today: {
            views: Number(views),
            conversions: 3 // Mock for now
        },
        errors: errors,
        history: chartData
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
