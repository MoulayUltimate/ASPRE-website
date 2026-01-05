export async function onRequestGet(context) {
    const { env } = context;

    try {
        const settings = await env.ASPRE_SETTINGS.get('site_config', { type: 'json' }) || {};

        // Filter sensitive data
        const publicConfig = {
            pricing: settings.pricing || {},
            stripe: {
                publicKey: settings.stripe?.publicKey,
                testMode: settings.stripe?.testMode,
                links: settings.stripe?.links
            },
            marketing: settings.marketing || {}
        };

        return new Response(JSON.stringify(publicConfig), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60' // Cache for 1 minute
            }
        });
    } catch (e) {
        return new Response('{}', {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
