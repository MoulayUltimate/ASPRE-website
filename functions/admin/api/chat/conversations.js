export async function onRequestGet(context) {
    const { env } = context;

    try {
        const list = await env.ASPRE_SETTINGS.get('chat::list', { type: 'json' }) || [];

        // Check presence for each conversation
        const conversations = await Promise.all(list.map(async (conv) => {
            const presence = await env.ASPRE_SETTINGS.get(`chat::presence::${conv.id}`);
            const isOnline = presence && (Date.now() - parseInt(presence) < 35000); // 35s buffer
            return { ...conv, isOnline: !!isOnline };
        }));

        return new Response(JSON.stringify({ conversations }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
