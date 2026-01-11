'use client';

import { useState } from 'react';
import styles from './CouponBanner.module.css';

export default function CouponBanner() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('Vectric10');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.couponBanner}>
            <p>
                <i className="fas fa-tag" />
                Use{' '}
                <span className={styles.couponCode} onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Vectric10'}{' '}
                    <i className={copied ? 'fas fa-check' : 'far fa-copy'} />
                </span>{' '}
                Coupon code to Get <strong>10% Off</strong>
            </p>
        </div>
    );
}
