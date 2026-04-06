import express from 'express';
import { CloudflareKV } from '../services/cloudflareKV';

const router = express.Router();

// Using the same KV namespace mapping logic
const SETTINGS_NAMESPACE = process.env.CLOUDFLARE_KV_SETTINGS_ID || process.env.CLOUDFLARE_KV_ORDERS_ID;

router.get('/', async (req, res) => {
    try {
        // 1. Get Real-time Users
        const rtList = await CloudflareKV.list(SETTINGS_NAMESPACE, 100, undefined, 'rt::');
        const activeUsers = [];
        for (const key of rtList) {
            const userData = await CloudflareKV.get(SETTINGS_NAMESPACE, key.name);
            if (userData) activeUsers.push(userData);
        }

        // 2. Get Stats for Last 7 Days
        const history = {
            labels: [] as string[],
            visitors: [] as number[],
            conversions: [] as number[]
        };

        const countriesAgg: Record<string, number> = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString([], { weekday: 'short' });

            const views = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${dateKey}::views`) || 0;
            const convs = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${dateKey}::conversions`) || 0;
            const countries = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${dateKey}::countries`) || {};

            history.labels.push(label);
            history.visitors.push(Number(views));
            history.conversions.push(Number(convs));

            // Aggregate countries
            for (const [code, count] of Object.entries(countries)) {
                countriesAgg[code] = (countriesAgg[code] || 0) + (count as number);
            }
        }

        // 3. Format Countries for UI
        const totalVisitors = history.visitors.reduce((a, b) => a + b, 0) || 1;
        const topCountries = Object.entries(countriesAgg)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([code, count]) => ({
                code,
                count,
                percent: Math.round((count / totalVisitors) * 100) || 0
            }));

        // 4. Get Logs
        const errors = await CloudflareKV.get(SETTINGS_NAMESPACE, 'log::errors') || [];
        const clicks = await CloudflareKV.get(SETTINGS_NAMESPACE, 'log::clicks') || [];

        const todayKey = new Date().toISOString().split('T')[0];
        const todayViews = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${todayKey}::views`) || 0;
        const todayConvs = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${todayKey}::conversions`) || 0;

        res.json({
            realtime: {
                count: activeUsers.length,
                users: activeUsers
            },
            today: {
                views: Number(todayViews),
                conversions: Number(todayConvs)
            },
            topCountries,
            errors,
            clicks,
            history
        });
    } catch (error: any) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

// 5. Tracking Endpoint
router.post('/track', async (req, res) => {
    try {
        const { type, url, text, sessionId, country } = req.body;
        const todayKey = new Date().toISOString().split('T')[0];

        // Update Real-time
        if (sessionId) {
            const userData = {
                id: sessionId,
                url: url || '/',
                lastSeen: Date.now(),
                country: country || 'US'
            };
            await CloudflareKV.put(SETTINGS_NAMESPACE, `rt::${sessionId}`, userData);
        }

        if (type === 'pageview') {
            // Increment Views
            const currentViews = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${todayKey}::views`) || 0;
            await CloudflareKV.put(SETTINGS_NAMESPACE, `stats::${todayKey}::views`, Number(currentViews) + 1);

            // Increment Country Stats
            if (country) {
                const countries = await CloudflareKV.get(SETTINGS_NAMESPACE, `stats::${todayKey}::countries`) || {};
                countries[country] = (countries[country] || 0) + 1;
                await CloudflareKV.put(SETTINGS_NAMESPACE, `stats::${todayKey}::countries`, countries);
            }
        } else if (type === 'click') {
            const clicks = await CloudflareKV.get(SETTINGS_NAMESPACE, 'log::clicks') || [];
            clicks.unshift({
                timestamp: Date.now(),
                type: 'click',
                text: text || 'Unknown',
                url: url || '/'
            });
            // Keep only last 50
            await CloudflareKV.put(SETTINGS_NAMESPACE, 'log::clicks', clicks.slice(0, 50));
        }

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
