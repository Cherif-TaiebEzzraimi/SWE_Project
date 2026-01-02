import { usePhasesContext } from '../../project_progress/phases-section/context/PhasesContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectCard } from './components/ProjectCard';
import { LockedState } from './components/LockedState';
import type { MediaFile } from './types/projectProgress.types';
import styles from './styles/projectProgress.module.css';

interface ProjectProgressFreelancerOverviewProps {
  clientFilesSubmitted?: boolean;
  submittedFiles?: MediaFile[];
}

export default function ProjectProgressFreelancerOverview({ clientFilesSubmitted, submittedFiles = [] }: ProjectProgressFreelancerOverviewProps) {
  const location = useLocation();
  const { lockEditMode, unlockEditMode } = usePhasesContext();
  // Use prop if provided, otherwise fallback to location.state
  // Use a state variable to react to prop changes (for live updates)
  const [filesSubmitted, setFilesSubmitted] = useState(
    typeof clientFilesSubmitted === 'boolean' ? clientFilesSubmitted : Boolean(location.state?.clientFilesSubmitted)
  );

  // React to prop changes (for live updates after client submits file)
  useEffect(() => {
    if (typeof clientFilesSubmitted === 'boolean') {
      setFilesSubmitted(clientFilesSubmitted);
    } else {
      setFilesSubmitted(Boolean(location.state?.clientFilesSubmitted));
    }
  }, [clientFilesSubmitted, location.state?.clientFilesSubmitted]);

  const [negotiationId] = useState<number | null>(location.state?.negotiationId ?? null);
  const [isAgreeing, setIsAgreeing] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [projectState, setProjectState] = useState<'default' | 'agreed' | 'cancelled'>(
    location.state?.projectStatus || 'default'
  );

  // Unlock editing if files have been submitted, lock if not
  useEffect(() => {
    if (filesSubmitted) {
      unlockEditMode();
    } else {
      lockEditMode();
    }
  }, [filesSubmitted, unlockEditMode, lockEditMode]);

  console.log('[FreelancerOverview] Rendering with state:', { filesSubmitted, projectState, negotiationId });

  const handleStartProject = () => {
    localStorage.setItem('projectStarted', 'true');
    console.log('[FreelancerOverview] Project started');
  };

  // Freelancer: Finalize project setup (agree)
  const handleFinalizeSetup = async () => {
    if (!negotiationId) return;
    setIsAgreeing(true);
    try {
      await fetch(`/api/negotiations/${negotiationId}/agree`, { method: 'POST', credentials: 'include' });
      lockEditMode(); // Lock editing for both
      setProjectState('agreed');
      console.log('[FreelancerOverview] Project finalized');
    } catch (error) {
      console.error('[FreelancerOverview] Error finalizing:', error);
    } finally {
      setIsAgreeing(false);
    }
  };

  // Freelancer: Cancel project
  const handleCancelProject = async () => {
    if (!negotiationId) return;
    setIsDeclining(true);
    try {
      await fetch(`/api/negotiations/${negotiationId}/decline`, { method: 'POST', credentials: 'include' });
      setProjectState('cancelled');
      console.log('[FreelancerOverview] Project cancelled');
    } catch (error) {
      console.error('[FreelancerOverview] Error cancelling:', error);
    } finally {
      setIsDeclining(false);
    }
  };

  // Remove the tab bar/header from the freelancer overview (it is already rendered by the parent)
  if (!filesSubmitted) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.tabContent}>
          <LockedState message="Waiting for client to upload specs file..." />
        </div>
      </div>
    );
  }

  // State 2: After freelancer cancelled
  if (filesSubmitted && projectState === 'cancelled') {
    console.log('[FreelancerOverview] Rendering CANCELLED state');
    return (
      <div className={styles.pageContainer}>
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
                      <span className={styles.fileSize}>{(file.file_size / (1024 * 1024)).toFixed(1)} MB</span>
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
          <div className={styles.waitingFreelancerMsg}>You have cancelled this project.</div>
        </div>
      </div>
    );
  }

  // State 3: After freelancer agreed (editing locked)
  if (filesSubmitted && projectState === 'agreed') {
    console.log('[FreelancerOverview] Rendering AGREED state (locked)');
    return (
      <div className={styles.pageContainer}>
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
                      <span className={styles.fileSize}>{(file.file_size / (1024 * 1024)).toFixed(1)} MB</span>
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
          <div className={styles.waitingFreelancerMsg}>Project setup finalized. Editing is now locked.</div>
        </div>
      </div>
    );
  }

  // State 4: Default - Freelancer can edit phases, finalize, or cancel
  if (filesSubmitted && projectState === 'default') {
    console.log('[FreelancerOverview] Rendering DEFAULT state (can edit)');
    return (
      <div className={styles.pageContainer}>
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
                      <span className={styles.fileSize}>{(file.file_size / (1024 * 1024)).toFixed(1)} MB</span>
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
            <button className={styles.lockEditBtn} onClick={handleFinalizeSetup} disabled={isAgreeing}>
              {isAgreeing ? 'Finalizing...' : 'This is the final project setup'}
            </button>
            <button className={styles.declineBtn} onClick={handleCancelProject} disabled={isDeclining}>
              {isDeclining ? 'Cancelling...' : 'Cancel Project'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show unlocked view for freelancer to plan project
  if (filesSubmitted && projectState === 'default') {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Specs File Received</h2>
            <div className={styles.fileSection}>
              {submittedFiles.map(file => (
                <div key={file.id} className={styles.fileItemWithDownload}>/* ...file info... */</div>
              ))}
            </div>
          </div>
          <div className={styles.waitingFreelancerMsg}>Here's the specs file. Please plan the project phases below.</div>
          {/* The phases section is now editable for the freelancer */}
        </div>
      </div>
    );
  }

  // State 5: Unlocked - can start project
  console.log('[FreelancerOverview] Rendering UNLOCKED state (can start)');
  return (
    <div className={styles.pageContainer}>
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