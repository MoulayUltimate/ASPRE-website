import express from 'express';
import dotenv from 'dotenv';
import { CloudflareKV } from '../services/cloudflareKV';

dotenv.config();

const router = express.Router();
const SETTINGS_NAMESPACE = process.env.CLOUDFLARE_KV_SETTINGS_ID || process.env.CLOUDFLARE_KV_ORDERS_ID;

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const securitySettings = await CloudflareKV.get(SETTINGS_NAMESPACE, 'setting_security');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@3daspire.com';
        const adminPassword = securitySettings?.password || process.env.ADMIN_PASSWORD || 'admin123';

        if (email === adminEmail && password === adminPassword) {
            res.json({ success: true, token: 'admin_authenticated' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;
