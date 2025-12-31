import { useNavigate, useLocation } from 'react-router-dom';
import styles from './styles/projectProgress.module.css';

export default function ProjectProgressPhasesAndTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect if user is client or freelancer based on URL
  const isFreelancer = location.pathname.includes('/freelancer/');
  const isClient = location.pathname.includes('/client/');
  
  const handleOverviewClick = () => {
    if (isFreelancer) {
      navigate('/project/123/freelancer/active');
    } else if (isClient) {
      navigate('/project/123/client/submitted');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.tabBar}>
        <button className={styles.tab} onClick={handleOverviewClick}>
          <svg className={styles.tabIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Overview
        </button>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          <svg className={styles.tabIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Phases & Tasks
        </button>
      </div>

      <div className={styles.tabContent}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Project Phases & Tasks</h2>
          <p style={{ color: '#6b7280', marginTop: '16px' }}>
            This is where phases and tasks will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
}
