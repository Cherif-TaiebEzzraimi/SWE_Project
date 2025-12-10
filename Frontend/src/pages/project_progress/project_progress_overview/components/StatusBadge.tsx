import styles from '../styles/projectProgress.module.css';

interface StatusBadgeProps {
  type: 'waiting' | 'started';
  message: string;
}

export function StatusBadge({ type, message }: StatusBadgeProps) {
  return (
    <div className={`${styles.statusBadge} ${type === 'started' ? styles.statusStarted : styles.statusWaiting}`}>
      {type === 'started' ? (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#059669" strokeWidth="1.5"/>
          <path d="M8 12.5l2.5 2.5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className={styles.loadingIcon} width="20px" height="15px" viewBox="0 0 64 48">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" className={styles.loadingBack}></polyline>
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" className={styles.loadingFront}></polyline>
        </svg>
      )}
      {message}
    </div>
  );
}
