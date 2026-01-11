'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './ProductShowcase.module.css';

const PRODUCT = {
    id: 'aspire-12',
    name: 'Vectric Aspire 12',
    price: 119,
    originalPrice: 1995,
    image: '/images/aspire-laptop-showcase.png',
};

export default function ProductShowcase() {
    const [currentImage, setCurrentImage] = useState(0);
    const { addToCart } = useCart();

    const images = [
        '/images/aspire-v12-showcase.png',
        '/images/aspire-whats-new-v12.jpg',
    ];

    // Auto-rotate images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handleAddToCart = () => {
        addToCart({
            id: PRODUCT.id,
            name: PRODUCT.name,
            price: PRODUCT.price,
            originalPrice: PRODUCT.originalPrice,
            image: PRODUCT.image,
        });
    };

    return (
        <div id="product-offer" className={styles.productBox}>
            {/* Left: Image Showcase */}
            <div className={styles.imageContainer}>
                {images.map((src, index) => (
                    <Image
                        key={src}
                        src={src}
                        alt={`Vectric Aspire V12 ${index === 0 ? 'Showcase' : "What's New"}`}
                        fill
                        className={`${styles.productImage} ${index === currentImage ? styles.active : ''
                            }`}
                        priority={index === 0}
                    />
                ))}
            </div>

            {/* Right: Product Info */}
            <div className={styles.productInfo}>
                {/* Title */}
                <div className={styles.titleSection}>
                    <h2>Vectric Aspire 12</h2>
                    <p>Professional 3D CNC Design & Carving Software - Windows</p>
                </div>

                {/* Features Grid */}
                <div className={styles.featuresGrid}>
                    <div className={styles.feature}>
                        <i className="fas fa-infinity" style={{ color: '#0066cc' }} />
                        <span>Lifetime License</span>
                    </div>
                    <div className={styles.feature}>
                        <i className="fas fa-bolt" style={{ color: '#00b67a' }} />
                        <span>Instant Delivery</span>
                    </div>
                    <div className={styles.feature}>
                        <i className="fas fa-check-circle" style={{ color: '#00b67a' }} />
                        <span>Verified Software</span>
                    </div>
                    <div className={styles.feature}>
                        <i className="fas fa-undo" style={{ color: '#00b67a' }} />
                        <span>30-Day Guarantee</span>
                    </div>
                </div>

                {/* Pricing */}
                <div className={styles.pricingBox}>
                    <div className={styles.priceRow}>
                        <span className={styles.originalPrice}>$1,995</span>
                        <span className={styles.currentPrice}>$119</span>
                    </div>
                    <div className={styles.savingsBadge}>Save $1,876 (94% OFF)</div>
                </div>

                {/* Add to Cart Button */}
                <button className={styles.buyButton} onClick={handleAddToCart}>
                    <i className="fas fa-shopping-cart" />
                    Add to Cart – Only $119
                </button>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                    <span>
                        <i className="fas fa-shield-alt" style={{ color: '#00b67a' }} /> Secure
                    </span>
                    <span>
                        <i className="fas fa-bolt" style={{ color: '#00b67a' }} /> Instant
                    </span>
                    <span>
                        <i className="fas fa-clock" style={{ color: '#00b67a' }} /> 1-2 Min
                    </span>
                </div>
            </div>
        </div>
    );
}
