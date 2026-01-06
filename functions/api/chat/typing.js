export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { conversationId, sender, isTyping } = await request.json();

        if (!conversationId || !sender) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Store typing status with a short TTL (10 seconds)
        // Key: chat::typing::{conversationId}::{sender}
        await env.ASPRE_SETTINGS.put(`chat::typing::${conversationId}::${sender}`, "true", { expirationTtl: 10 });

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
