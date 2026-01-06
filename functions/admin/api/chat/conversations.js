export async function onRequestGet(context) {
    const { env } = context;

    try {
        const list = await env.ASPRE_SETTINGS.get('chat::list', { type: 'json' }) || [];

        return new Response(JSON.stringify({
            conversations: list
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
