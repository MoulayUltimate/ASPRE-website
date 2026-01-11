import express from 'express';
import { CloudflareKV } from '../services/cloudflareKV';

const router = express.Router();

// Get statistics for dashboard
router.get('/stats', async (req, res) => {
    try {
        const orders = await CloudflareKV.orders.list();

        const stats = {
            totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
            totalOrders: orders.length,
            recentOrders: orders
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

// Get all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await CloudflareKV.orders.list();
        // Sort by date descending
        orders.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await CloudflareKV.orders.get(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
});

export default router;
