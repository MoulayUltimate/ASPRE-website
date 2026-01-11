'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    recentOrders: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const response = await fetch(`${apiUrl}/orders/stats`);

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching stats:', err);
                setError(err.message || 'Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
                <p>Error: {error}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Make sure the backend server is running on port 3001
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Analytics Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Revenue</h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        ${stats?.totalRevenue.toFixed(2) || '0.00'}
                    </p>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>From Cloudflare KV</span>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Orders</h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        {stats?.totalOrders || 0}
                    </p>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>All time</span>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Recent Orders</h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        {stats?.recentOrders.length || 0}
                    </p>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Last 5 orders</span>
                </div>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Recent Activity</h2>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.recentOrders.map((order: any, idx: number) => (
                            <div key={idx} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.375rem', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 600, marginRight: '0.5rem' }}>{order.orderId}</span>
                                    <span style={{ color: '#6b7280' }}>{order.customerName}</span>
                                </div>
                                <span style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#6b7280' }}>No recent orders yet</p>
                )}
            </div>
        </div>
    );
}
