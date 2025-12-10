import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectCard } from './components/ProjectCard';
import { LockedState } from './components/LockedState';
import type { MediaFile } from './types/projectProgress.types';
import styles from './styles/projectProgress.module.css';

export default function ProjectProgressFreelancerOverview() {
  const location = useLocation();
  const isActivePath = location.pathname.includes('/active') || location.pathname.includes('/unlocked');
  
  const [filesSubmitted] = useState<boolean>(isActivePath);
  const [submittedFiles] = useState<MediaFile[]>([
    { id: '1', file_name: 'project_brief.pdf', file_size: 1400000, file_url: '', file_type: 'pdf', created_at: '' },
    { id: '2', file_name: 'brand_assets.zip', file_size: 18700000, file_url: '', file_type: 'zip', created_at: '' }
  ]);

  const handleStartProject = () => {
    // TODO: API call to start project
    // mark project as started
    localStorage.setItem('projectStarted', 'true');
    // logic to be updated
  };  //  state2:locked before client sends files
  if (!filesSubmitted) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.tabBar}>
          <button className={`${styles.tab} ${styles.activeTab}`}>
            <svg className={styles.tabIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Overview
          </button>
        </div>
        <div className={styles.tabContent}>
          <LockedState />
        </div>
      </div>
    );
  }

  // state 3: unlocked after client sends files
  return (
    <div className={styles.pageContainer}>
      <div className={styles.tabBar}>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          <svg className={styles.tabIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Overview
        </button>
      </div>

      <div className={styles.tabContent}>
        <ProjectCard
          projectTitle="E-Commerce Website Redesign – Bloom & Co."
          projectDescription="Design and develop a modern, visually compelling e-commerce platform for our boutique floral business. The website should embody elegance and sophistication while delivering an intuitive shopping experience. Core deliverables include: a visually rich product catalog with professional photography, streamlined cart and checkout flows, secure payment gateway integration, fully responsive mobile-first design, and a user-friendly CMS for content management. The final product must seamlessly blend aesthetic appeal with functional excellence, enabling customers to effortlessly discover, customize, and purchase our premium floral arrangements."
          submittedOn="October 26, 2023"
          budget="$2,500"
          userType="client"
          userName="Amina Sarah"
          userRole="Innovate Inc."
          userPhoto=""
        >
          {/* ssubmitted files  */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Submitted Files</h2>
            
            <div className={styles.fileSection}>
              {submittedFiles.map(file => (
                <div key={file.id} className={styles.fileItemWithDownload}>
                  <div className={styles.fileIconWrapper}>
                    <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 2V9H20" fill="white" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.file_name}</span>
                    <span className={styles.fileSize}>
                      {(file.file_size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  <button className={styles.downloadBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3V16M12 16L7 11M12 16L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ProjectCard>

        
        <div className={styles.actionsContainer}>
          <button 
            className={styles.startProjectBtn}
            onClick={handleStartProject}
          >
            <span>Start Project</span>
            <svg width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
