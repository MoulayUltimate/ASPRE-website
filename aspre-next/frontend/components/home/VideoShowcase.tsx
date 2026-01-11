import styles from './VideoShowcase.module.css';

export default function VideoShowcase() {
    return (
        <section className="section">
            <div className="container">
                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                        See Aspire 12 in Action
                    </h2>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
                        Watch how professionals create stunning 3D designs with Vectric Aspire 12
                    </p>
                </div>

                {/* Video Container */}
                <div className={styles.videoContainer}>
                    <div className={styles.videoWrapper}>
                        <iframe
                            src="https://www.youtube.com/embed/YhZvuls_tms?start=44&autoplay=1&mute=1&rel=0&modestbranding=1&loop=1&playlist=YhZvuls_tms"
                            title="Vectric Aspire 12 Demo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
