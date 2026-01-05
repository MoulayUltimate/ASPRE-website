export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { username, password } = await request.json();

        // Get stored credentials
        // We expect a KV key 'admin_user' with value: { username, hash, salt }
        // If not found, we allow default login: admin / admin123 (FOR FIRST TIME ONLY)

        let storedAuth = await env.ASPRE_AUTH.get('admin_user', { type: 'json' });

        // Default fallback if not set up
        if (!storedAuth) {
            if (username === 'admin' && password === 'admin123') {
                // Allow login but force password change logic could be added here
                // For now just proceed
            } else {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
            }
        } else {
            // Verify username
            if (username !== storedAuth.username) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
            }

            // Verify password
            const hash = await hashPassword(password, storedAuth.salt);
            if (hash !== storedAuth.hash) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
            }
        }

        // Generate Session ID
        const sessionId = crypto.randomUUID();

        // Store session in KV (expires in 24 hours)
        await env.ASPRE_AUTH.put(`session_${sessionId}`, username, { expirationTtl: 86400 });

        // Set Cookie
        const headers = new Headers();
        headers.append('Set-Cookie', `admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
        headers.append('Content-Type', 'application/json');

        return new Response(JSON.stringify({ success: true }), { headers });

    } catch (e) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

// Helper: Hash Password
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
