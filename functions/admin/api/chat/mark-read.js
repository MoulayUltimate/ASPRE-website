export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { conversationId } = await request.json();

        if (!conversationId) {
            return new Response(JSON.stringify({ error: 'Missing conversationId' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get conversation
        let conversation = await env.ASPRE_SETTINGS.get(`chat::${conversationId}`, { type: 'json' });

        if (conversation) {
            // Mark as read
            conversation.unread = 0;
            await env.ASPRE_SETTINGS.put(`chat::${conversationId}`, JSON.stringify(conversation));

            // Update list
            let list = await env.ASPRE_SETTINGS.get('chat::list', { type: 'json' }) || [];
            const item = list.find(c => c.id === conversationId);
            if (item) {
                item.unread = 0;
                await env.ASPRE_SETTINGS.put('chat::list', JSON.stringify(list));
            }
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
