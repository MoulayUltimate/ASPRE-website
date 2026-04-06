import express from 'express';
import { CloudflareKV } from '../services/cloudflareKV';
import crypto from 'crypto';

const router = express.Router();
const SETTINGS_NAMESPACE = process.env.CLOUDFLARE_KV_SETTINGS_ID || process.env.CLOUDFLARE_KV_ORDERS_ID;

// Start a new chat (requires email)
router.post('/start', async (req, res) => {
    try {
        const { email, initialMessage } = req.body;
        if (!email || !initialMessage) {
            return res.status(400).json({ error: 'Email and initial message are required' });
        }

        const conversationId = `chat_${crypto.randomBytes(8).toString('hex')}`;
        const newConversation = {
            id: conversationId,
            email,
            messages: [{
                id: crypto.randomBytes(4).toString('hex'),
                sender: 'customer',
                text: initialMessage,
                timestamp: Date.now()
            }],
            lastMessage: initialMessage,
            lastMessageTime: Date.now(),
            unreadAdmin: 1, // Admin hasn't read it
            unreadCustomer: 0
        };

        await CloudflareKV.put(SETTINGS_NAMESPACE, `chat::${conversationId}`, newConversation);

        // Update list of all active conversations
        let chatList = await CloudflareKV.get(SETTINGS_NAMESPACE, 'chat::list') || [];
        chatList.push({
            id: conversationId,
            email,
            lastMessage: initialMessage,
            lastMessageTime: Date.now(),
            unread: 1
        });
        await CloudflareKV.put(SETTINGS_NAMESPACE, 'chat::list', chatList);

        res.json({ success: true, conversationId });
    } catch (error: any) {
        console.error('Error starting chat:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send a message to an existing conversation
router.post('/send', async (req, res) => {
    try {
        const { conversationId, message, sender } = req.body; // sender is 'customer' or 'admin'
        if (!conversationId || !message || !sender) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const chat = await CloudflareKV.get(SETTINGS_NAMESPACE, `chat::${conversationId}`);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        const newMessage = {
            id: crypto.randomBytes(4).toString('hex'),
            sender,
            text: message,
            timestamp: Date.now()
        };

        chat.messages.push(newMessage);
        chat.lastMessage = message;
        chat.lastMessageTime = Date.now();

        if (sender === 'customer') chat.unreadAdmin = (chat.unreadAdmin || 0) + 1;
        if (sender === 'admin') chat.unreadCustomer = (chat.unreadCustomer || 0) + 1;

        await CloudflareKV.put(SETTINGS_NAMESPACE, `chat::${conversationId}`, chat);

        // Update list
        let chatList = await CloudflareKV.get(SETTINGS_NAMESPACE, 'chat::list') || [];
        const idx = chatList.findIndex((c: any) => c.id === conversationId);
        if (idx >= 0) {
            chatList[idx].lastMessage = message;
            chatList[idx].lastMessageTime = Date.now();
            chatList[idx].unread = chat.unreadAdmin; // Update unread count for admin view
            // Sort by latest
            chatList.sort((a: any, b: any) => b.lastMessageTime - a.lastMessageTime);
            await CloudflareKV.put(SETTINGS_NAMESPACE, 'chat::list', chatList);
        }

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: Get all conversations
router.get('/conversations', async (req, res) => {
    try {
        const chatList = await CloudflareKV.get(SETTINGS_NAMESPACE, 'chat::list') || [];
        res.json(chatList);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific conversation messages
router.get('/:id', async (req, res) => {
    try {
        const chat = await CloudflareKV.get(SETTINGS_NAMESPACE, `chat::${req.params.id}`);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        // Let frontend specify who is polling so we can clear unread
        const queryRole = req.query.role; // 'admin' or 'customer'
        let updated = false;

        if (queryRole === 'admin' && chat.unreadAdmin > 0) {
            chat.unreadAdmin = 0;
            updated = true;
        } else if (queryRole === 'customer' && chat.unreadCustomer > 0) {
            chat.unreadCustomer = 0;
            updated = true;
        }

        if (updated) {
            await CloudflareKV.put(SETTINGS_NAMESPACE, `chat::${req.params.id}`, chat);

            // Also zero out the unread badge in the list if admin read it
            if (queryRole === 'admin') {
                let chatList = await CloudflareKV.get(SETTINGS_NAMESPACE, 'chat::list') || [];
                const idx = chatList.findIndex((c: any) => c.id === req.params.id);
                if (idx >= 0) {
                    chatList[idx].unread = 0;
                    await CloudflareKV.put(SETTINGS_NAMESPACE, 'chat::list', chatList);
                }
            }
        }

        res.json(chat);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
