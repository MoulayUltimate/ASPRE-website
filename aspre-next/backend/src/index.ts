import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orders';
import stripeRoutes from './routes/stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// Stripe webhook needs raw body, so we mount it before JSON parser
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Verify Cloudflare KV configuration
const hasCloudflareConfig =
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_API_TOKEN &&
    process.env.CLOUDFLARE_KV_ORDERS_ID;

if (hasCloudflareConfig) {
    console.log('✅ Cloudflare KV configuration detected');
} else {
    console.warn('⚠️ Cloudflare KV not fully configured. Check your .env file.');
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Using Cloudflare KV for data storage`);
});
