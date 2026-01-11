import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="section">
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contact Us</h1>
                        <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)' }}>
                            We're here to help. Reach out to us for any questions about Aspire 12.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '3rem' }}>
                        <div className="grid-2">
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Get in Touch</h3>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <i className="fas fa-envelope" style={{ color: 'var(--accent-blue)' }} /> Email Support
                                    </h4>
                                    <p>
                                        <a href="mailto:support@3daspire.com" style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                                            support@3daspire.com
                                        </a>
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                        Average response time: 2-4 hours
                                    </p>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <i className="fas fa-clock" style={{ color: 'var(--accent-blue)' }} /> Support Hours
                                    </h4>
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                                    <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                                </div>
                            </div>

                            <div style={{ background: 'var(--gray-100)', padding: '2rem', borderRadius: '12px' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Quick Answers</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>Where is my license key?</strong>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                            License keys are sent automatically via email immediately after purchase. Check your spam folder if you don't see it.
                                        </p>
                                    </li>
                                    <li>
                                        <strong>Do you offer refunds?</strong>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                            Yes, we offer a 30-day money-back guarantee for all purchases.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="text-center" style={{ marginTop: '3rem' }}>
                        <Link href="/" className="btn btn-secondary">
                            <i className="fas fa-arrow-left" /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
