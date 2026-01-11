import styles from './StatsCounter.module.css';

export default function StatsCounter() {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <h3>8,347+</h3>
                <p>Licenses Delivered</p>
            </div>
            <div className={styles.statCard}>
                <h3>98%</h3>
                <p>Satisfaction Rate</p>
            </div>
            <div className={styles.statCard}>
                <h3>2019</h3>
                <p>Trusted Since</p>
            </div>
        </div>
    );
}
