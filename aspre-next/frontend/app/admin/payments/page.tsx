'use client';

import { useState, useEffect } from 'react';

export default function PaymentsPage() {
    const [stripeLinkUSD, setStripeLinkUSD] = useState('');
    const [stripeLinkGBP, setStripeLinkGBP] = useState('');
    const [stripePublicKey, setStripePublicKey] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const response = await fetch(`${apiUrl}/settings/payments`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setStripeLinkUSD(data.stripeLinkUSD || '');
                        setStripeLinkGBP(data.stripeLinkGBP || '');
                        setStripePublicKey(data.stripePublicKey || '');
                    }
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiUrl}/settings/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stripeLinkUSD, stripeLinkGBP, stripePublicKey })
            });
            if (response.ok) {
                alert('Stripe settings saved successfully!');
            } else {
                alert('Failed to save Stripe settings.');
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Payments</h1>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fab fa-stripe" style={{ color: '#635BFF' }}></i>
                    Stripe Configuration
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Payment Link (USD)
                        </label>
                        <input
                            type="url"
                            value={stripeLinkUSD}
                            onChange={(e) => setStripeLinkUSD(e.target.value)}
                            placeholder="https://buy.stripe.com/..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem'
                            }}
                        />
                        <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>This link will be used for US Dollar payments</small>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Payment Link (GBP)
                        </label>
                        <input
                            type="url"
                            value={stripeLinkGBP}
                            onChange={(e) => setStripeLinkGBP(e.target.value)}
                            placeholder="https://buy.stripe.com/..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem'
                            }}
                        />
                        <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>This link will be used for British Pound payments</small>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Stripe Publishable Key
                        </label>
                        <input
                            type="text"
                            value={stripePublicKey}
                            onChange={(e) => setStripePublicKey(e.target.value)}
                            placeholder="pk_live_..."
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
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Save Stripe Settings
                    </button>
                </form>
            </div>
        </div>
    );
}
