import styles from '../styles/projectProgress.module.css';

export function LockedState() {
  return (
    <div className={styles.lockedContainer}>
      <div className={styles.lockedCard}>
        <div className={styles.lockIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
            <line x1="12" y1="17.5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className={styles.lockedTitle}>Project Access Locked</h2>
        <p className={styles.lockedText}>
          This project is currently awaiting client materials. You'll gain full access once the client uploads the required project files and documentation.
        </p>
        <div className={styles.lockedInfo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="1.5"/>
            <path d="M12 16V12M12 8h.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>You will be notified when the client submits the files</span>
        </div>
      </div>
    </div>
  );
}
