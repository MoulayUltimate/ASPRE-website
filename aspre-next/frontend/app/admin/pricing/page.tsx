'use client';

import { useState, useEffect } from 'react';

export default function PricingPage() {
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [priceOriginal, setPriceOriginal] = useState('1995');
    const [priceCurrent, setPriceCurrent] = useState('119');
    const [discount, setDiscount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const response = await fetch(`${apiUrl}/settings/pricing`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && Object.keys(data).length > 0) {
                        setCurrencySymbol(data.currencySymbol || '$');
                        setCurrencyCode(data.currencyCode || 'USD');
                        setPriceOriginal(data.priceOriginal || '1995');
                        setPriceCurrent(data.priceCurrent || '119');
                    }
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const orig = parseFloat(priceOriginal) || 0;
        const curr = parseFloat(priceCurrent) || 0;
        const disc = orig - curr;
        setDiscount(disc.toFixed(2));
    }, [priceOriginal, priceCurrent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiUrl}/settings/pricing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currencySymbol, currencyCode, priceOriginal, priceCurrent })
            });
            if (response.ok) {
                alert('Pricing updated successfully!');
            } else {
                alert('Failed to update pricing.');
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
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Pricing Management</h1>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Currency Symbol
                            </label>
                            <select
                                value={currencySymbol}
                                onChange={(e) => setCurrencySymbol(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <option value="$">USD ($)</option>
                                <option value="£">GBP (£)</option>
                                <option value="€">EUR (€)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Currency Code
                            </label>
                            <select
                                value={currencyCode}
                                onChange={(e) => setCurrencyCode(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Original Price (Retail)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={priceOriginal}
                                onChange={(e) => setPriceOriginal(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Sale Price (Current)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={priceCurrent}
                                onChange={(e) => setPriceCurrent(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Discount Amount (Calculated)
                        </label>
                        <input
                            type="text"
                            value={`${currencySymbol}${discount}`}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                background: '#f9fafb',
                                color: '#6b7280'
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
                        Update Prices
                    </button>
                </form>
            </div>
        </div>
    );
}
