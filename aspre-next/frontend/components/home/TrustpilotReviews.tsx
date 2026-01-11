import styles from './TrustpilotReviews.module.css';

const reviews = [
    {
        id: 1,
        title: 'Vectric is User Friendly',
        text: '"I have used both VCarve Pro and Aspire as well as my students. I would not even consider switching to anything else. Good company, good product, and good Customer Service."',
        date: 'Jun 2025',
    },
    {
        id: 2,
        title: 'Excellent Software',
        text: '"Excellent software. I\'ve been using this for a few months now with a Shapeoko 4x4 machine and Genmitsu 6050 and it is great. Really functional and easy to use. Highly recommend."',
        date: 'Jun 2025',
    },
    {
        id: 3,
        title: 'The Best for CNC',
        text: '"Aspire lets me create complex 3D designs I never thought possible. The interface is intuitive and support is excellent. Worth every penny!"',
        date: 'May 2025',
    },
];

function StarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#00B67A">
            <path d="M10 0l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" />
        </svg>
    );
}

export default function TrustpilotReviews() {
    return (
        <section className="section" id="testimonials">
            <div className="container">
                {/* Trustpilot Header */}
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <div className={styles.trustpilotHeader}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="4" fill="#00B67A" />
                            <path
                                d="M16 6L18.472 13.528H26.472L19.944 18.472L22.416 26L16 21.056L9.584 26L12.056 18.472L5.528 13.528H13.528L16 6Z"
                                fill="white"
                            />
                        </svg>
                        <h2 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--gray-900)' }}>
                            Trustpilot
                        </h2>
                    </div>
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                        Rated Excellent by Customers
                    </h3>
                    <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)' }}>
                        See what CNC professionals are saying about Vectric Aspire software
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className={styles.reviewsGrid}>
                    {reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} />
                                ))}
                            </div>
                            <h4>{review.title}</h4>
                            <p>{review.text}</p>
                            <div className={styles.reviewFooter}>
                                <span>— Verified Customer</span>
                                <span>{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Reviews Link */}
                <div className="text-center" style={{ marginTop: '3rem' }}>
                    <a
                        href="https://www.trustpilot.com/review/vectric.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewAllLink}
                    >
                        View all reviews on Trustpilot
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6 3L11 8L6 13" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
