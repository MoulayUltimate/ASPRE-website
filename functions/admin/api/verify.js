export async function onRequest(context) {
    const { request, env } = context;

    const cookie = request.headers.get('Cookie');
    const sessionMatch = cookie && cookie.match(/admin_session=([^;]+)/);

    if (!sessionMatch) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const sessionId = sessionMatch[1];
    const username = await env.ASPRE_AUTH.get(`session_${sessionId}`);

    if (!username) {
        return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
    }

    return new Response(JSON.stringify({ username }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
