'use client';

import { useState } from 'react';
import styles from './FAQSection.module.css';

const faqs = [
    {
        question: 'Is this a real Aspire 12 license?',
        answer: 'Yes! This is a 100% genuine, full-featured Vectric Aspire 12 license. You get access to all professional features including 3D modeling, toolpath generation, rotary machining, and more. The software is fully functional with no limitations or trial periods.',
    },
    {
        question: 'How is my license delivered?',
        answer: 'Your license key and download link are sent directly to your email within 1-2 minutes after payment confirmation. Check your spam folder if you don\'t see it immediately. The email includes your license key, installation instructions, and download links.',
    },
    {
        question: 'Does it work on Windows 10/11?',
        answer: 'Yes! Aspire 12 is fully compatible with Windows 10 and Windows 11 (both 32-bit and 64-bit versions). Minimum requirements: 2GB RAM (8GB recommended), 500MB disk space, and OpenGL 2.0 compatible graphics card.',
    },
    {
        question: 'What CNC machines are supported?',
        answer: 'Aspire 12 works with virtually all CNC routers, mills, and carving machines. It includes post processors for over 300 machine types including ShopBot, Laguna, AXYZ, Multicam, Techno, BobCAD, Mach3, LinuxCNC, and many more. Custom post processors can also be created.',
    },
    {
        question: 'What if I need help installing?',
        answer: 'We provide a complete step-by-step installation video guide and dedicated email support. Our team is available to assist you with any installation questions or technical issues. Most customers complete installation in under 10 minutes.',
    },
    {
        question: 'What is your refund policy?',
        answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied with your purchase for any reason, contact us within 30 days for a full refund. No questions asked. Your satisfaction is our priority.',
    },
    {
        question: 'How long does delivery take?',
        answer: 'License delivery is instant! You\'ll receive your license key and download link via email within 1-2 minutes after payment confirmation. We process orders 24/7, so you can get started anytime.',
    },
    {
        question: 'Can I use this for commercial projects?',
        answer: 'Yes! This is a full commercial license. You can use Aspire 12 to create and sell products, run your business, or take on client projects. There are no restrictions on commercial use.',
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="section" id="faq">
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                        Frequently Asked Questions
                    </h2>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
                        Everything you need to know about your Aspire 12 license.
                    </p>
                </div>

                <div className={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                        >
                            <button
                                className={styles.question}
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <i className={`fas fa-chevron-down ${styles.icon}`} />
                            </button>
                            <div
                                className={styles.answer}
                                style={{ maxHeight: openIndex === index ? '200px' : '0' }}
                            >
                                <div className={styles.answerContent}>{faq.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: '3rem' }}>
                    <p style={{ fontSize: '1.125rem', color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                        Still have questions?
                    </p>
                    <a href="/contact" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none', background: 'var(--gray-100)', color: 'var(--gray-900)' }}>
                        <i className="fas fa-envelope"></i>
                        Contact Support
                    </a>
                </div>
            </div>
        </section>
    );
}
