'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './PricingBreakdown.module.css';

const PRODUCT = {
    id: 'aspire-12',
    name: 'Vectric Aspire 12',
    price: 119,
    originalPrice: 1995,
    image: '/images/aspire-laptop-showcase.png',
};

export default function PricingBreakdown() {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        window.location.href = 'https://buy.stripe.com/cNicN490LaCea5ef075wI02';
    };

    return (
        <section className="section" id="features">
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                        Complete Package – Exceptional Value
                    </h2>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
                        Get everything you need for professional 3D CNC design with lifetime access and support.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className={styles.pricingCard}>
                    {/* Main Pricing Box */}
                    <div className={styles.mainBox}>
                        {/* Line Items */}
                        <div className={styles.lineItems}>
                            <div className={styles.lineItem}>
                                <span>Vectric Aspire 12 (Retail)</span>
                                <span className={styles.strikePrice}>$1,995</span>
                            </div>
                            <div className={styles.lineItem}>
                                <span>Video Training Library</span>
                                <span className={styles.strikePrice}>$427</span>
                            </div>
                            <div className={styles.lineItem}>
                                <span>Premium Design Files & Clipart Library</span>
                                <span className={styles.strikePrice}>$259</span>
                            </div>
                            <div className={styles.lineItem}>
                                <span>Installation Support</span>
                                <span className={styles.strikePrice}>$149</span>
                            </div>
                            <div className={`${styles.lineItem} ${styles.lastItem}`}>
                                <span>Lifetime Updates</span>
                                <span className={styles.totalValue}>$3,337</span>
                            </div>
                        </div>

                        {/* Discount Box */}
                        <div className={styles.discountBox}>
                            <span>Your Discount</span>
                            <span className={styles.discountAmount}>-$3,218</span>
                        </div>

                        {/* Final Price Box */}
                        <div className={styles.finalPriceBox}>
                            <span>Your Price Today</span>
                            <span className={styles.finalPrice}>$119</span>
                        </div>

                        {/* CTA Button */}
                        <button className={styles.ctaButton} onClick={handleAddToCart}>
                            <i className="fas fa-shield-alt" />
                            Add to Cart – Save $1,876
                            <i className="fas fa-arrow-right" />
                        </button>

                        {/* Trust Points */}
                        <div className={styles.trustPoints}>
                            <div className={styles.trustPoint}>
                                <i className="fas fa-check-circle" />
                                <span>Instant delivery to your email</span>
                            </div>
                            <div className={styles.trustPoint}>
                                <i className="fas fa-check-circle" />
                                <span>30-day money-back guarantee</span>
                            </div>
                            <div className={styles.trustPoint}>
                                <i className="fas fa-check-circle" />
                                <span>100% genuine Vectric Aspire 12 license</span>
                            </div>
                        </div>
                    </div>

                    {/* Urgency Banner */}
                    <div className={styles.urgencyBanner}>
                        <p className={styles.urgencyTitle}>
                            <i className="fas fa-clock" />
                            <strong>Only 127 licenses remaining</strong> at this price
                        </p>
                        <p className={styles.urgencyText}>
                            Price returns to $1,995 when current stock sells out (usually 2-3 days)
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
