'use client';

import { useState } from 'react';

export default function MarketingPage() {
    const [googleAdsId, setGoogleAdsId] = useState('');
    const [ga4Id, setGa4Id] = useState('');
    const [gtmId, setGtmId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save to backend/Cloudflare KV
        alert('Tracking codes saved! (Backend integration pending)');
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Marketing & Tracking</h1>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Google Ads Conversion ID
                        </label>
                        <input
                            type="text"
                            value={googleAdsId}
                            onChange={(e) => setGoogleAdsId(e.target.value)}
                            placeholder="AW-..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Google Analytics ID (GA4)
                        </label>
                        <input
                            type="text"
                            value={ga4Id}
                            onChange={(e) => setGa4Id(e.target.value)}
                            placeholder="G-..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Google Tag Manager ID
                        </label>
                        <input
                            type="text"
                            value={gtmId}
                            onChange={(e) => setGtmId(e.target.value)}
                            placeholder="GTM-..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '# 3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Save Tracking Codes
                    </button>
                </form>
            </div>
        </div>
    );
}
