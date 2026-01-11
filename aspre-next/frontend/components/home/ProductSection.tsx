'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';

const PRODUCT = {
    id: 'aspire-12',
    name: 'Vectric Aspire 12',
    price: 119,
    originalPrice: 1995,
    image: '/images/aspire-laptop-showcase.png',
};

export default function ProductSection() {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        window.location.href = 'https://buy.stripe.com/bJe00i0XWdpW7Xg5ks2Ry00';
    };

    return (
        <section className="section" id="product-offer" style={{ padding: '4rem 0' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'start'
                }}>
                    {/* Left Column - Product Image (Sticky & Large) */}
                    <div style={{
                        position: 'sticky',
                        top: '8rem',
                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                        zIndex: 10
                    }}>
                        <Image
                            src="/images/aspire-laptop-showcase.png"
                            alt="Vectric Aspire 12 Interface on Laptop"
                            width={1000}
                            height={700}
                            style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.1)', transformOrigin: 'top center' }}
                            priority
                        />
                    </div>

                    {/* Right Column - Product Details (In Card) */}
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1.5rem',
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        position: 'relative',
                        zIndex: 20
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                            Vectric Aspire 12
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#666666', marginBottom: '2rem' }}>
                            Professional 3D CNC Design & Carving Software - Windows
                        </p>

                        {/* Features Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                            {[
                                { icon: 'fa-infinity', color: '#0066cc', text: 'Lifetime License', bg: '#e0f2fe' },
                                { icon: 'fa-bolt', color: '#00b67a', text: 'Instant Delivery', bg: '#dcfce7' },
                                { icon: 'fa-check-circle', color: '#00b67a', text: 'Verified Software', bg: '#dcfce7' },
                                { icon: 'fa-undo', color: '#0066cc', text: '30-Day Guarantee', bg: '#e0f2fe' }
                            ].map((feature, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.2s ease'
                                }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                        e.currentTarget.style.borderColor = feature.color;
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: feature.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <i className={`fas ${feature.icon}`} style={{ color: feature.color, fontSize: '0.9rem' }}></i>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Area */}
                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '1.5rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>$1,995</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0066cc', lineHeight: 1 }}>$119</span>
                            </div>

                            <div style={{ display: 'inline-block', background: '#00b67a', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 182, 122, 0.2)' }}>
                                Save $1,876 (94% OFF)
                            </div>

                            <button
                                onClick={handleAddToCart}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(180deg, #0066cc 0%, #0052a3 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1.25rem',
                                    borderRadius: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 102, 204, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.3)';
                                }}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                Claim License – Only $119
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <i className="fas fa-shield-alt" style={{ color: '#00b67a' }}></i> Secure
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <i className="fas fa-bolt" style={{ color: '#00b67a' }}></i> Instant
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <i className="fas fa-clock" style={{ color: '#00b67a' }}></i> 1-2 Min
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
