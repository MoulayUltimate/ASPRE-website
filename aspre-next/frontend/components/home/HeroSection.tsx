import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.heroContainer}>
                    {/* Hero Content */}
                    <div className={styles.heroContent}>
                        <h1>Vectric Aspire 12 – Full 3D CNC Design & Carving Software</h1>
                        <p className={styles.heroSubtitle}>
                            Get professional-grade 3D CNC design software with a{' '}
                            <strong>full lifetime license</strong>. Save{' '}
                            <strong className={styles.discount}>$1,876</strong> compared to
                            retail price. Instant email delivery within minutes.
                        </p>

                        {/* Hero CTA Buttons */}
                        <div className={styles.heroCta}>
                            <Link href="/#product-offer" className="btn btn-primary btn-large">
                                Get Aspire 12 Now – Only <span>$119</span>
                            </Link>
                            <Link href="/#features" className="btn btn-secondary btn-large">
                                <i className="fas fa-list-ul" />
                                View Features
                            </Link>
                        </div>
                    </div>

                    {/* Hero Media */}
                    <div className={styles.heroMedia}>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster="/images/aspire-v12-showcase.png"
                        >
                            <source src="/videos/aspire-demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}
