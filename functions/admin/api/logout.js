export async function onRequestPost(context) {
    const { request, env } = context;

    // Get cookie
    const cookie = request.headers.get('Cookie');
    const sessionMatch = cookie && cookie.match(/admin_session=([^;]+)/);

    if (sessionMatch) {
        const sessionId = sessionMatch[1];
        // Delete from KV
        await env.ASPRE_AUTH.delete(`session_${sessionId}`);
    }

    // Clear Cookie
    const headers = new Headers();
    headers.append('Set-Cookie', `admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);

    return new Response(JSON.stringify({ success: true }), { headers });
}
