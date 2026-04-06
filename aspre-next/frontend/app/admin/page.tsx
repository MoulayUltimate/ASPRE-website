'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface AnalyticsData {
    realtime: { count: number; users: any[] };
    today: { views: number; conversions: number };
    topCountries: { code: string; count: number; percent: number }[];
    errors: any[];
    clicks: any[];
    history: { labels: string[]; visitors: number[]; conversions: number[] };
}

export default function AdminDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const response = await fetch(`${apiUrl}/analytics`);

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }

                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching analytics:', err);
                setError(err.message || 'Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 15000); // refresh every 15s
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    const chartData = {
        labels: data?.history?.labels || [],
        datasets: [
            {
                label: 'Visitors',
                data: data?.history?.visitors || [],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index' as const, intersect: false }
        },
        scales: {
            y: { beginAtZero: true },
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Dashboard Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Total Visitors */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #3b82f6' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Visitors (Today)</h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        {data?.today?.views || 0}
                    </p>
                </div>
                {/* Live Users */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        Live Users <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>● Real-time</span>
                    </h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        {data?.realtime?.count || 0}
                    </p>
                </div>
                {/* Conversions */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #8b5cf6' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Conversions</h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        {data?.today?.conversions || 0}
                    </p>
                </div>
                {/* Errors */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #f97316' }}>
                    <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Errors (24h)</h3>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
                        {data?.errors?.length || 0}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Traffic Overview (7 Days)</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Top Countries</h2>
                    {data?.topCountries && data.topCountries.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.topCountries.map((c, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <img src={`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`} alt={c.code} />
                                        {c.code}
                                    </span>
                                    <div style={{ flex: 1, margin: '0 1rem', background: '#e5e7eb', height: '6px', borderRadius: '3px' }}>
                                        <div style={{ background: '#3b82f6', height: '100%', borderRadius: '3px', width: `${c.percent}%` }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{c.percent}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280' }}>No country data available</p>
                    )}
                </div>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Recent User Clicks</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '0.75rem' }}>Date</th>
                                <th style={{ padding: '0.75rem' }}>Type</th>
                                <th style={{ padding: '0.75rem' }}>Text/Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.clicks && data.clicks.length > 0 ? (
                                data.clicks.map((click, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                                            {new Date(click.timestamp).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{ background: '#e0e7ff', color: '#1d4ed8', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>
                                                {click.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{click.text}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                                        No recent clicks detected.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
