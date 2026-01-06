export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { conversationId, message, sender } = await request.json();

        if (!conversationId || !message || !sender) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get existing conversation
        let conversation = await env.ASPRE_SETTINGS.get(`chat::${conversationId}`, { type: 'json' }) || {
            id: conversationId,
            messages: [],
            lastMessage: null,
            lastMessageTime: null,
            unread: 0
        };

        // Add new message
        const newMessage = {
            message: message.slice(0, 500), // Limit message length
            sender,
            timestamp: Date.now()
        };

        conversation.messages.push(newMessage);
        conversation.lastMessage = message.slice(0, 100);
        conversation.lastMessageTime = newMessage.timestamp;

        // Increment unread if customer message
        if (sender === 'customer') {
            conversation.unread = (conversation.unread || 0) + 1;
        }

        // Save conversation
        await env.ASPRE_SETTINGS.put(`chat::${conversationId}`, JSON.stringify(conversation));

        // Update conversation list
        let list = await env.ASPRE_SETTINGS.get('chat::list', { type: 'json' }) || [];
        const existing = list.findIndex(c => c.id === conversationId);

        const listItem = {
            id: conversationId,
            lastMessage: conversation.lastMessage,
            lastMessageTime: conversation.lastMessageTime,
            unread: conversation.unread
        };

        if (existing >= 0) {
            list[existing] = listItem;
        } else {
            list.unshift(listItem);
        }

        // Keep only last 100 conversations
        list = list.slice(0, 100);
        await env.ASPRE_SETTINGS.put('chat::list', JSON.stringify(list));

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
