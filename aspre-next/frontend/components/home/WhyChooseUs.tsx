import styles from './WhyChooseUs.module.css';

const benefits = [
    {
        icon: 'fa-infinity',
        title: 'Lifetime License',
        description: 'One-time payment for full lifetime access. No monthly subscriptions or hidden fees ever.',
    },
    {
        icon: 'fa-bolt',
        title: 'Instant Delivery',
        description: 'Receive your license key and download link via email within minutes of purchase.',
    },
    {
        icon: 'fa-shield-alt',
        title: 'Secure Payment',
        description: 'Your transaction is protected by Stripe’s advanced security and encryption.',
    },
    {
        icon: 'fa-headset',
        title: 'Expert Support',
        description: 'Get access to our dedicated support team and active community forum.',
    },
    {
        icon: 'fa-video',
        title: 'Video Training',
        description: 'Includes over 100 hours of high-quality video tutorials to help you learn.',
    },
    {
        icon: 'fa-check-circle',
        title: 'Verified Software',
        description: '100% genuine software license guaranteed to work with your CNC machine.',
    },
];

export default function WhyChooseUs() {
    return (
        <section className="section">
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                        Why Choose Aspire 12?
                    </h2>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
                        The industry standard for CNC routing, milling, and engraving.
                    </p>
                </div>

                <div className={styles.grid}>
                    {benefits.map((benefit, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <i className={`fas ${benefit.icon}`} />
                            </div>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
