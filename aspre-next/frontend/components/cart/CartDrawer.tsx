'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeFromCart,
        itemCount,
        subtotal,
        discount,
        total,
        appliedCoupon,
    } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeCart();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [closeCart]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.backdrop} ${isOpen ? styles.open : ''}`}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Cart Drawer */}
            <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>
                        <i className="fas fa-shopping-cart" /> Your Cart
                        {itemCount > 0 && <span className={styles.count}>({itemCount})</span>}
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={closeCart}
                        aria-label="Close cart"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.empty}>
                            <i className="fas fa-shopping-bag" />
                            <p>Your cart is empty</p>
                            <button onClick={closeCart} className="btn btn-primary">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className={styles.items}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className={styles.productImage}
                                        />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h4>{item.name}</h4>
                                        <div className={styles.pricing}>
                                            <span className={styles.originalPrice}>
                                                ${item.originalPrice.toLocaleString()}
                                            </span>
                                            <span className={styles.currentPrice}>
                                                ${item.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles.quantity}>
                                            Qty: {item.quantity}
                                        </div>
                                    </div>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <i className="fas fa-trash" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with totals */}
                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && discount > 0 && (
                                <div className={`${styles.totalRow} ${styles.discount}`}>
                                    <span>
                                        <i className="fas fa-tag" /> Coupon ({appliedCoupon.toUpperCase()})
                                    </span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className={styles.divider} />
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className={`btn btn-success btn-large ${styles.checkoutButton}`}
                            onClick={() => {
                                closeCart();
                                const checkoutUrl = 'https://buy.stripe.com/cNicN490LaCea5ef075wI02';
                                if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
                                    (window as any).gtag_report_conversion(checkoutUrl);
                                } else {
                                    window.location.href = checkoutUrl;
                                }
                            }}
                        >
                            <i className="fas fa-lock" /> Proceed to Checkout
                        </button>

                        <p className={styles.securityNote}>
                            <i className="fas fa-shield-alt" /> Secure checkout powered by Stripe
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
