import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Company Info */}
                    <div className={styles.footerColumn}>
                        <Image
                            src="/images/logo.png"
                            alt="Aspire Logo"
                            width={150}
                            height={48}
                            className={styles.footerLogo}
                        />
                        <p>
                            Your trusted source for professional CNC software licenses at
                            unbeatable prices.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Facebook">
                                <i className="fab fa-facebook" />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <i className="fab fa-twitter" />
                            </a>
                            <a href="#" aria-label="YouTube">
                                <i className="fab fa-youtube" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <i className="fab fa-instagram" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerColumn}>
                        <h3>Quick Links</h3>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/#features">Product Details</Link>
                            </li>
                            <li>
                                <Link href="/#features">All Features</Link>
                            </li>
                            <li>
                                <a
                                    href="https://www.trustpilot.com/review/3daspire.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Customer Reviews
                                </a>
                            </li>
                            <li>
                                <Link href="/#faq">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={styles.footerColumn}>
                        <h3>Support</h3>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/contact">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/#features">Installation Guide</Link>
                            </li>
                            <li>
                                <Link href="/shipping-policy">Shipping Policy</Link>
                            </li>
                            <li>
                                <Link href="/refund-policy">Refund Policy</Link>
                            </li>
                            <li>
                                <Link href="/#faq">License Activation</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className={styles.footerColumn}>
                        <h3>Legal</h3>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/terms">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href="/privacy">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/cookie-policy">Cookie Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms">Disclaimer</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© 2024 ASPIRE. All rights reserved. | Contact: contact@3daspire.com</p>
                    <p className={styles.disclaimer}>
                        Vectric and Aspire are trademarks of Vectric Ltd. This site is an
                        independent reseller.
                    </p>
                </div>
            </div>
        </footer>
    );
}
