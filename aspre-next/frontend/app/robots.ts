import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            // AI search engine bots — explicitly allowed
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'ChatGPT-User', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'anthropic-ai', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'Bingbot', allow: '/' },
            { userAgent: 'Google-Extended', allow: '/' },
            { userAgent: 'CCBot', allow: '/' },
        ],
        sitemap: 'https://www.3daspire.com/sitemap.xml',
        host: 'https://www.3daspire.com',
    };
}
