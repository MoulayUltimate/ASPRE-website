export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
        return new Response(JSON.stringify({ error: 'Missing conversationId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const conversation = await env.ASPRE_SETTINGS.get(`chat::${conversationId}`, { type: 'json' });

        // Check if other party is typing
        // If sender is customer, check if admin is typing
        const adminTyping = await env.ASPRE_SETTINGS.get(`chat::typing::${conversationId}::admin`);
        const customerTyping = await env.ASPRE_SETTINGS.get(`chat::typing::${conversationId}::customer`);

        return new Response(JSON.stringify({
            messages: conversation?.messages || [],
            unread: conversation?.unread || 0,
            isTyping: {
                admin: !!adminTyping,
                customer: !!customerTyping
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
