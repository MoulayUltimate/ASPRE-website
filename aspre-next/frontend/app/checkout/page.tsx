'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Checkout.module.css';

export default function CheckoutPage() {
    const { items, subtotal, discount, total, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApplyCoupon = () => {
        if (!couponInput.trim()) return;

        const success = applyCoupon(couponInput);
        if (success) {
            setCouponError('');
            setCouponInput('');
        } else {
            setCouponError('Invalid coupon code');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // In a real implementation, this would call the backend to create a Stripe session
            // For now, we'll simulate the redirect to Stripe

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiUrl}/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    customerEmail: email,
                    customerName: `${firstName} ${lastName}`,
                    couponCode: appliedCoupon,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Failed to create checkout session');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Error processing checkout:', error);
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="section">
                <div className="container text-center">
                    <h2>Your cart is empty</h2>
                    <p>Add items to your cart to proceed with checkout.</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.checkoutPage}>
            <div className="container">
                <div className={styles.checkoutGrid}>
                    {/* Left Column: Customer Info */}
                    <div className={styles.formColumn}>
                        <div className={styles.checkoutHeader}>
                            <h1>Checkout</h1>
                            <p>Complete your purchase securely</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.section}>
                                <h3>Contact Information</h3>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                    />
                                    <p className={styles.hint}>Your license key will be sent to this email.</p>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <h3>Billing Details</h3>
                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.paymentSection}>
                                <h3>Payment</h3>
                                <p className={styles.secureText}>
                                    <i className="fas fa-lock" /> All transactions are secure and encrypted.
                                </p>
                                <div className={styles.paymentMethods}>
                                    <div className={styles.paymentMethod}>
                                        <i className="fab fa-cc-stripe" /> Credit Card
                                    </div>
                                    <div className={styles.paymentIcons}>
                                        <i className="fab fa-cc-visa" />
                                        <i className="fab fa-cc-mastercard" />
                                        <i className="fab fa-cc-amex" />
                                        <i className="fab fa-cc-discover" />
                                    </div>
                                </div>
                                <p className={styles.redirectNote}>
                                    You will be redirected to Stripe to complete your payment securely.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary btn-large ${styles.submitButton}`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin" /> Processing...
                                    </>
                                ) : (
                                    <>Pay ${total.toFixed(2)}</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className={styles.summaryColumn}>
                        <div className={styles.summaryCard}>
                            <h3>Order Summary</h3>

                            <div className={styles.itemsList}>
                                {items.map((item) => (
                                    <div key={item.id} className={styles.item}>
                                        <div className={styles.itemImage}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={60}
                                                height={60}
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <span className={styles.itemQty}>{item.quantity}</span>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h4>{item.name}</h4>
                                            <p>${item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.couponSection}>
                                {appliedCoupon ? (
                                    <div className={styles.appliedCoupon}>
                                        <span>
                                            <i className="fas fa-tag" /> Code: <strong>{appliedCoupon.toUpperCase()}</strong>
                                        </span>
                                        <button onClick={removeCoupon} className={styles.removeCoupon}>
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.couponInput}>
                                        <input
                                            type="text"
                                            placeholder="Discount code"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="btn btn-secondary btn-small"
                                            disabled={!couponInput.trim()}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className={styles.errorText}>{couponError}</p>}
                            </div>

                            <div className={styles.totals}>
                                <div className={styles.totalRow}>
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className={`${styles.totalRow} ${styles.discountRow}`}>
                                        <span>Discount</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className={styles.divider} />
                                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                    <span>Total</span>
                                    <span>
                                        <span className={styles.currency}>USD</span> ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
