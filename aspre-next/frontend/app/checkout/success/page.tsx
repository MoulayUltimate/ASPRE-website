'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id') || 'ASP-XXXXX';

    return (
        <div className="section">
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#d1fae5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        color: '#059669',
                        fontSize: '2.5rem'
                    }}>
                        <i className="fas fa-check" />
                    </div>

                    <h1 style={{ marginBottom: '1rem' }}>Order Confirmed!</h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
                        Thank you for your purchase. Your order has been processed successfully.
                    </p>

                    <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                        <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Order ID</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'monospace' }}>{orderId}</p>
                        </div>

                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>What happens next?</h3>
                        <ol style={{ paddingLeft: '1.5rem', color: 'var(--gray-700)', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Check your email inbox for your <strong>License Key</strong> and download link.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Download and install Vectric Aspire 12.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Enter your license key when prompted during installation.</li>
                            <li>Enjoy creating amazing 3D CNC projects!</li>
                        </ol>
                    </div>

                    <Link href="/" className="btn btn-primary">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
