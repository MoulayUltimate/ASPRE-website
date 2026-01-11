'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        // Mock data
        setOrder({
            orderId: params.id,
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            items: [
                {
                    name: 'Vectric Aspire 12',
                    price: 119.00,
                    quantity: 1,
                }
            ],
            subtotal: 119.00,
            discount: 0,
            total: 119.00,
            paymentStatus: 'paid',
            stripeSessionId: 'cs_test_a1b2c3d4...',
            licenseKey: 'VEC-XXXX-YYYY-ZZZZ',
            createdAt: new Date().toISOString(),
        });
    }, [params.id]);

    if (!order) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/orders" style={{ color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <i className="fas fa-arrow-left" /> Back to Orders
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Order #{order.orderId}</h1>
                    <span style={{
                        background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fee2e2',
                        color: order.paymentStatus === 'paid' ? '#065f46' : '#991b1b',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                    }}>
                        {order.paymentStatus}
                    </span>
                </div>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Items */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Order Items</h3>
                        {order.items.map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Qty: {item.quantity}</div>
                                </div>
                                <div style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</div>
                            </div>
                        ))}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#6b7280' }}>
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#6b7280' }}>
                                <span>Discount</span>
                                <span>-${order.discount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem', marginTop: '0.5rem' }}>
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* License Info */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>License Information</h3>
                        <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '1.125rem', textAlign: 'center', letterSpacing: '1px' }}>
                            {order.licenseKey}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem', textAlign: 'center' }}>
                            Sent to customer email
                        </p>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Customer Info */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Customer</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#6b7280' }}>
                                <i className="fas fa-user" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{order.customerEmail}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            <p style={{ marginBottom: '0.5rem' }}><i className="fas fa-map-marker-alt" style={{ width: '20px' }} /> IP Address: 192.168.1.1</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Payment Details</h3>
                        <div style={{ fontSize: '0.875rem' }}>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{ color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Stripe Session ID</span>
                                <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.stripeSessionId}</span>
                            </div>
                            <div>
                                <span style={{ color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Payment Method</span>
                                <span>Credit Card (Visa ending 4242)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
