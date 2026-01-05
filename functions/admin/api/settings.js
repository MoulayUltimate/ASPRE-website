// Middleware-like check
async function checkAuth(request, env) {
    const cookie = request.headers.get('Cookie');
    const sessionMatch = cookie && cookie.match(/admin_session=([^;]+)/);
    if (!sessionMatch) return false;
    const sessionId = sessionMatch[1];
    const username = await env.ASPRE_AUTH.get(`session_${sessionId}`);
    return !!username;
}

export async function onRequestGet(context) {
    const { request, env } = context;
    if (!await checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });

    const settings = await env.ASPRE_SETTINGS.get('site_config', { type: 'json' });
    return new Response(JSON.stringify(settings || {}), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    if (!await checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });

    try {
        const newSettings = await request.json();

        // Merge with existing
        const existing = await env.ASPRE_SETTINGS.get('site_config', { type: 'json' }) || {};
        const updated = { ...existing, ...newSettings };

        // Save
        await env.ASPRE_SETTINGS.put('site_config', JSON.stringify(updated));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error saving settings', { status: 500 });
    }
}
