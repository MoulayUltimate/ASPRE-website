import express from 'express';
import { CloudflareKV } from '../services/cloudflareKV';

const router = express.Router();

const SETTINGS_NAMESPACE = process.env.CLOUDFLARE_KV_SETTINGS_ID || process.env.CLOUDFLARE_KV_ORDERS_ID;

// Get settings
router.get('/:key', async (req, res) => {
    try {
        const key = `setting_${req.params.key}`;
        const settings = await CloudflareKV.get(SETTINGS_NAMESPACE, key);
        if (!settings) {
            return res.json({});
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// Update settings
router.post('/:key', async (req, res) => {
    try {
        const key = `setting_${req.params.key}`;
        await CloudflareKV.put(SETTINGS_NAMESPACE, key, req.body);
        res.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: 'Error saving settings' });
    }
});

export default router;
