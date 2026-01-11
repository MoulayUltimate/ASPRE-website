'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const { itemCount, openCart } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className="container">
                <nav className={styles.nav}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/images/logo.png"
                            alt="Aspire Logo"
                            width={120}
                            height={40}
                            priority
                        />
                    </Link>

                    {/* Main Navigation */}
                    <ul className={`${styles.mainNav} ${mobileMenuOpen ? styles.open : ''}`}>
                        <li>
                            <Link href="/#features">Features</Link>
                        </li>
                        <li>
                            <Link href="/#testimonials">Reviews</Link>
                        </li>
                        <li>
                            <Link href="/#faq">FAQ</Link>
                        </li>
                        <li>
                            <Link href="/contact">Support</Link>
                        </li>
                        <li>
                            <Link href="/shipping-policy">Shipping</Link>
                        </li>
                    </ul>

                    {/* CTA Buttons */}
                    <div className={styles.navCta}>
                        {/* Cart Button */}
                        <button
                            className={styles.cartButton}
                            onClick={openCart}
                            aria-label="Open cart"
                        >
                            <i className="fas fa-shopping-cart" />
                            {itemCount > 0 && (
                                <span className={styles.cartBadge}>{itemCount}</span>
                            )}
                        </button>

                        {/* Take Offer Button */}
                        <Link href="/#product-offer" className="btn btn-primary">
                            <i className="fas fa-shopping-cart" />
                            Take offer
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.menuToggle}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </nav>
            </div>
        </header>
    );
}
