import styles from '../styles/projectProgress.module.css';

interface ProjectHeaderProps {
  title: string;
  description: string;
  submittedOn: string;
  budget: string;
}

export function ProjectHeader({ title, description, submittedOn, budget }: ProjectHeaderProps) {
  return (
    <div className={styles.card}>
      <h1 className={styles.projectTitle}>{title}</h1>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Project Description:</h3>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.metadata}>
        <div className={styles.metadataItem}>
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="3.5" width="11" height="10" rx="1" stroke="#9ca3af" strokeWidth="1"/>
            <line x1="2.5" y1="6" x2="13.5" y2="6" stroke="#9ca3af" strokeWidth="1"/>
            <line x1="5" y1="1.5" x2="5" y2="4.5" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
            <line x1="11" y1="1.5" x2="11" y2="4.5" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <span>Submitted: {submittedOn}</span>
        </div>
        <div className={styles.metadataItem}>
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6.5" stroke="#9ca3af" strokeWidth="1"/>
            <text x="8" y="11" textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="600">$</text>
          </svg>
          <span>Project Budget: {budget}</span>
        </div>
      </div>
    </div>
  );
}
