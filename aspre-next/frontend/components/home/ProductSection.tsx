'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import styles from './ProductSection.module.css';

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
        const checkoutUrl = 'https://buy.stripe.com/cNicN490LaCea5ef075wI02';
        if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
            (window as any).gtag_report_conversion(checkoutUrl);
        } else {
            window.location.href = checkoutUrl;
        }
    };

    return (
        <section className={styles.section} id="product-offer">
            <div className="container">
                <div className={styles.grid}>
                    {/* Left Column - Product Image (Sticky & Large) */}
                    <div className={styles.imageColumn}>
                        <Image
                            src="/images/aspire-laptop-showcase.png"
                            alt="Vectric Aspire 12 Interface on Laptop"
                            width={1000}
                            height={700}
                            className={styles.imageWrapper}
                            priority
                        />
                    </div>

                    {/* Right Column - Product Details (In Card) */}
                    <div className={styles.detailsColumn}>
                        <h2 className={styles.title}>
                            Vectric Aspire 12
                        </h2>
                        <p className={styles.subtitle}>
                            Professional 3D CNC Design & Carving Software - Windows
                        </p>

                        {/* Features Grid */}
                        <div className={styles.featuresGrid}>
                            {[
                                { icon: 'fa-infinity', color: '#0066cc', text: 'Lifetime License', bg: '#e0f2fe' },
                                { icon: 'fa-bolt', color: '#00b67a', text: 'Instant Delivery', bg: '#dcfce7' },
                                { icon: 'fa-check-circle', color: '#00b67a', text: 'Verified Software', bg: '#dcfce7' },
                                { icon: 'fa-undo', color: '#0066cc', text: '30-Day Guarantee', bg: '#e0f2fe' }
                            ].map((feature, index) => (
                                <div key={index}
                                    className={styles.featureItem}
                                    style={{ borderColor: '#e2e8f0' }} // Default border
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = feature.color;
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                >
                                    <div className={styles.featureIcon} style={{ background: feature.bg }}>
                                        <i className={`fas ${feature.icon}`} style={{ color: feature.color, fontSize: '0.9rem' }}></i>
                                    </div>
                                    <span className={styles.featureText}>{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Area */}
                        <div className={styles.pricingArea}>
                            <div className={styles.priceWrapper}>
                                <span className={styles.originalPrice}>$1,995</span>
                                <span className={styles.currentPrice}>$119</span>
                            </div>

                            <div className={styles.saveBadge}>
                                Save $1,876 (94% OFF)
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={styles.ctaButton}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                Claim License – Only $119
                            </button>

                            <div className={styles.trustBadges}>
                                <div className={styles.trustBadge}>
                                    <i className="fas fa-shield-alt" style={{ color: '#00b67a' }}></i> Secure
                                </div>
                                <div className={styles.trustBadge}>
                                    <i className="fas fa-bolt" style={{ color: '#00b67a' }}></i> Instant
                                </div>
                                <div className={styles.trustBadge}>
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
