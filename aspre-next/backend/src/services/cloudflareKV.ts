import dotenv from 'dotenv';

dotenv.config();

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const NAMESPACES = {
    ORDERS: process.env.CLOUDFLARE_KV_ORDERS_ID,
    CUSTOMERS: process.env.CLOUDFLARE_KV_CUSTOMERS_ID,
    LICENSES: process.env.CLOUDFLARE_KV_LICENSES_ID,
};

if (!ACCOUNT_ID || !API_TOKEN) {
    console.warn('⚠️ Cloudflare credentials missing. KV storage will not work.');
}

export const CloudflareKV = {
    async get(namespaceId: string | undefined, key: string) {
        if (!namespaceId) throw new Error('Namespace ID not configured');

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch KV: ${response.statusText}`);
        }

        return response.json();
    },

    async put(namespaceId: string | undefined, key: string, value: any) {
        if (!namespaceId) throw new Error('Namespace ID not configured');

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to write to KV: ${response.statusText}`);
        }

        return true;
    },

    async list(namespaceId: string | undefined, limit = 10, cursor?: string, prefix?: string) {
        if (!namespaceId) throw new Error('Namespace ID not configured');

        let url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/keys?limit=${limit}`;
        if (cursor) url += `&cursor=${cursor}`;
        if (prefix) url += `&prefix=${encodeURIComponent(prefix)}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cloudflare KV API Error:', errorText);
            throw new Error(`Failed to list KV keys: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data.result || []; // Returns array of { name: "key" }, empty array if none
    },

    // Helpers for specific namespaces
    orders: {
        async create(order: any) {
            return CloudflareKV.put(NAMESPACES.ORDERS, order.orderId, order);
        },
        async get(orderId: string) {
            return CloudflareKV.get(NAMESPACES.ORDERS, orderId);
        },
        async list() {
            // Listing keys only gives us IDs, we need to fetch values in parallel (careful with rate limits)
            // For admin dashboard, we might want to store a separate "index" or just fetch recent keys
            const keys = await CloudflareKV.list(NAMESPACES.ORDERS, 20);
            if (!keys || keys.length === 0) return [];

            const orders = await Promise.all(
                keys.map((k: any) => CloudflareKV.get(NAMESPACES.ORDERS, k.name))
            );
            return orders.filter((order: any) => order !== null);
        }
    },

    licenses: {
        async getAvailable() {
            // Assuming 'licenses:available' key stores an array of keys
            return CloudflareKV.get(NAMESPACES.LICENSES, 'licenses:available');
        },
        async assign(licenseKey: string) {
            // Update the license key status
            await CloudflareKV.put(NAMESPACES.LICENSES, `license:${licenseKey}`, {
                key: licenseKey,
                status: 'assigned',
                assignedAt: new Date().toISOString(),
            });

            // Update available list (this requires a transaction ideally, but KV is eventually consistent)
            // For this implementation, we'll assume we fetched the list, popped one, and updated it.
            // Real implementation needs better concurrency handling or Durable Objects.
        }
    }
};
