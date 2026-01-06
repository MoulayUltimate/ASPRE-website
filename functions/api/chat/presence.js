export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { conversationId, status } = await request.json();

        if (!conversationId) {
            return new Response(JSON.stringify({ error: 'Missing conversationId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (status === 'offline') {
            await env.ASPRE_SETTINGS.delete(`chat::presence::${conversationId}`);
        } else {
            // Store presence with 60s TTL
            await env.ASPRE_SETTINGS.put(`chat::presence::${conversationId}`, Date.now().toString(), { expirationTtl: 60 });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
