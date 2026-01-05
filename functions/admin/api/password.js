async function checkAuth(request, env) {
    const cookie = request.headers.get('Cookie');
    const sessionMatch = cookie && cookie.match(/admin_session=([^;]+)/);
    if (!sessionMatch) return null;
    const sessionId = sessionMatch[1];
    const username = await env.ASPRE_AUTH.get(`session_${sessionId}`);
    return username;
}

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const username = await checkAuth(request, env);
    if (!username) return new Response('Unauthorized', { status: 401 });

    try {
        const { current, newPass } = await request.json();

        // Get stored
        const storedAuth = await env.ASPRE_AUTH.get('admin_user', { type: 'json' });

        // If default user (admin/admin123) and not in DB yet
        if (!storedAuth) {
            if (username === 'admin' && current === 'admin123') {
                // Allow change
            } else {
                return new Response('Invalid current password', { status: 400 });
            }
        } else {
            // Verify current
            const hash = await hashPassword(current, storedAuth.salt);
            if (hash !== storedAuth.hash) {
                return new Response('Invalid current password', { status: 400 });
            }
        }

        // Set new
        const salt = crypto.randomUUID();
        const newHash = await hashPassword(newPass, salt);

        await env.ASPRE_AUTH.put('admin_user', JSON.stringify({
            username: username,
            hash: newHash,
            salt: salt
        }));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response('Error updating password', { status: 500 });
    }
}
