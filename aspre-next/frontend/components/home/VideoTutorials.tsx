import styles from './VideoTutorials.module.css';

const tutorials = [
    {
        id: 'glEsqGe_8cU',
        title: 'Furniture Making with Aspire',
        thumbnail: 'https://img.youtube.com/vi/glEsqGe_8cU/hqdefault.jpg',
    },
    {
        id: '9Lc7XZHrvP8',
        title: 'Clip Art & Design Arrangement',
        thumbnail: 'https://img.youtube.com/vi/9Lc7XZHrvP8/hqdefault.jpg',
    },
    {
        id: 'IHPQ65Rn0YM',
        title: 'Model in a Dish Recess',
        thumbnail: 'https://img.youtube.com/vi/IHPQ65Rn0YM/hqdefault.jpg',
    },
    {
        id: 's4ofeDBlkbw',
        title: 'Custom Brush Function',
        thumbnail: 'https://img.youtube.com/vi/s4ofeDBlkbw/hqdefault.jpg',
    },
];

export default function VideoTutorials() {
    return (
        <section className="section">
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                        Comprehensive Video Training
                    </h2>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
                        Master Aspire 12 quickly with our extensive library of video tutorials included with your license.
                    </p>
                </div>

                <div className={styles.grid}>
                    {tutorials.map((video) => (
                        <div key={video.id} className={styles.videoCard}>
                            <div className={styles.thumbnailWrapper}>
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className={styles.thumbnail}
                                />
                                <a
                                    href={`https://www.youtube.com/watch?v=${video.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.playButton}
                                    aria-label={`Play ${video.title}`}
                                >
                                    <i className="fas fa-play" />
                                </a>
                            </div>
                            <h3 className={styles.videoTitle}>{video.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
