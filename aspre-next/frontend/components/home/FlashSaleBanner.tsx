import styles from './FlashSaleBanner.module.css';

export default function FlashSaleBanner() {
    return (
        <div className={styles.banner}>
            <span>
                🔥 FLASH SALE ENDS IN 48 HOURS: Get Aspire for{' '}
                <strong>$1,876 OFF</strong> Before Price Returns to Normal
            </span>
        </div>
    );
}
