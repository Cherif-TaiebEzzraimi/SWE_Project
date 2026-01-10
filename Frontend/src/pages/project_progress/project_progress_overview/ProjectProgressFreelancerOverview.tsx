import { usePhasesContext } from '../../project_progress/phases-section/context/PhasesContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectCard } from './components/ProjectCard';
import { LockedState } from './components/LockedState';
import type { MediaFile } from './types/projectProgress.types';
import apiClient from '../../../lib/axios';
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

  const [negotiationId] = useState<number | null>(
    location.state?.negotiationId ?? 
    (location.search ? Number(new URLSearchParams(location.search).get('negotiationId')) : null)
  );

  // Fetch negotiation data when component mounts
  useEffect(() => {
    const fetchNegotiationData = async () => {
      if (!negotiationId) return;
      
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/negotiations/${negotiationId}`);
        console.log('[FreelancerOverview] 📋 Negotiation data:', response.data);
        setNegotiationData(response.data);
        
        // Update project state based on negotiation status
        if (response.data.status === 'completed') {
          setProjectState('agreed');
        } else if (response.data.status === 'declined') {
          setProjectState('cancelled');
        } else {
          setProjectState('default');
        }
      } catch (error) {
        console.error('[FreelancerOverview] ❌ Error fetching negotiation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNegotiationData();
  }, [negotiationId]);
  const [isAgreeing, setIsAgreeing] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [projectState, setProjectState] = useState<'default' | 'agreed' | 'cancelled'>(
    location.state?.projectStatus || 'default'
  );
  const [negotiationData, setNegotiationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Parse client_description to extract structured data
  const parseClientDescription = (description: string) => {
    const titleMatch = description.match(/Project Title:\s*(.+?)(?:\n|$)/i);
    const categoryMatch = description.match(/Category:\s*(.+?)(?:\n|$)/i);
    const budgetMatch = description.match(/Budget:\s*(.+?)(?:\n|$)/i);
    const descMatch = description.match(/Description:\s*(.+?)(?:\n|$)/i);
    
    return {
      title: titleMatch ? titleMatch[1].trim() : 'Project',
      category: categoryMatch ? categoryMatch[1].trim() : '',
      budget: budgetMatch ? budgetMatch[1].trim() : 'Budget TBD',
      description: descMatch ? descMatch[1].trim() : description
    };
  };

  // Unlock editing if files have been submitted, lock if not
  useEffect(() => {
    console.log('[FreelancerOverview] 🔒 LOCK/UNLOCK EFFECT:', {
      filesSubmitted,
      shouldUnlock: filesSubmitted ? 'UNLOCK' : 'LOCK',
      lockEditModeAvailable: typeof lockEditMode,
      unlockEditModeAvailable: typeof unlockEditMode
    });
    
    if (filesSubmitted) {
      console.log('[FreelancerOverview] 📂 UNLOCKING editing - files submitted');
      unlockEditMode();
    } else {
      console.log('[FreelancerOverview] 🔒 LOCKING editing - no files submitted');
      lockEditMode();
    }
  }, [filesSubmitted, unlockEditMode, lockEditMode]);

  console.log('[FreelancerOverview] 🎯 FREELANCER OVERVIEW RENDERING:');
  console.log('   - filesSubmitted:', filesSubmitted);
  console.log('   - negotiationId:', negotiationId);
  console.log('   - projectState:', projectState);

  const handleStartProject = () => {
    localStorage.setItem('projectStarted', 'true');
    console.log('[FreelancerOverview] Project started');
  };

  // Handle file download
  const handleDownloadFile = async (file: any) => {
    try {
      console.log('[FreelancerOverview] 📥 Downloading file:', file.file_url);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = file.file_url;
      link.target = '_blank';
      link.download = file.file_url?.split('/').pop() || 'download';
      
      // For cross-origin downloads, we need to fetch first
      if (file.file_url.includes('localhost:8000')) {
        const response = await fetch(file.file_url, { credentials: 'include' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        link.href = url;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup blob URL if created
      if (file.file_url.includes('localhost:8000')) {
        setTimeout(() => window.URL.revokeObjectURL(link.href), 100);
      }
    } catch (error) {
      console.error('[FreelancerOverview] ❌ Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  // Get parsed project data
  const projectData = negotiationData ? parseClientDescription(negotiationData.client_description || '') : null;

  // Freelancer: Finalize project setup (agree)
  const handleFinalizeSetup = async () => {
    console.log('[FreelancerOverview] 🚀 FINALIZE BUTTON CLICKED');
    if (!negotiationId) {
      console.log('[FreelancerOverview] ❌ No negotiationId');
      return;
    }
    setIsAgreeing(true);
    try {
      await apiClient.post(`/negotiations/${negotiationId}/agree`);
      // Don't lock editing - freelancer should still be able to edit phases after agreement
      setProjectState('agreed');
      console.log('[FreelancerOverview] ✅ Project finalized - editing remains unlocked');
    } catch (error) {
      console.error('[FreelancerOverview] ❌ Error finalizing:', error);
    } finally {
      setIsAgreeing(false);
    }
  };

  // Freelancer: Cancel project
  const handleCancelProject = async () => {
    console.log('[FreelancerOverview] 🚫 CANCEL BUTTON CLICKED');
    if (!negotiationId) {
      console.log('[FreelancerOverview] ❌ No negotiationId');
      return;
    }
    setIsDeclining(true);
    try {
      await apiClient.post(`/negotiations/${negotiationId}/decline`);
      setProjectState('cancelled');
      console.log('[FreelancerOverview] ✅ Project cancelled - keeping in history with declined status');
    } catch (error) {
      console.error('[FreelancerOverview] ❌ Error cancelling:', error);
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
            projectTitle={projectData?.title || 'Project'}
            projectDescription={projectData?.description || 'Project description'}
            submittedOn={negotiationData?.created_at ? new Date(negotiationData.created_at).toLocaleDateString() : 'Unknown'}
            budget={projectData?.budget || 'Budget TBD'}
            userType="client"
            userName={negotiationData?.client?.user?.first_name + ' ' + negotiationData?.client?.user?.last_name || 'Client'}
            userRole={projectData?.category || 'Client'}
            userPhoto={negotiationData?.client?.profile_picture || ''}
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
                        <span className={styles.fileName}>{file.file_url?.split('/').pop() || 'File'}</span>
                        <span className={styles.fileSize}>{file.file_type}</span>
                      </div>
                     <button 
                       className={styles.downloadBtn}
                       onClick={() => handleDownloadFile(file)}
                     >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12 3V16M12 16L7 11M12 16L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M3 21H21" stroke="currentColor" strokeWidth="2" lineHeightcap="round"/>
                       </svg>
                     </button>
                   </div>
                ))}
              </div>
            </div>
          </ProjectCard>
          <div className={styles.waitingFreelancerMsg}>
            <h3>Project Cancelled</h3>
            <p>This negotiation has been cancelled. The project will not proceed further.</p>
            <p>You can view your negotiation history in your profile.</p>
          </div>
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
            projectTitle={projectData?.title || 'Project'}
            projectDescription={projectData?.description || 'Project description'}
            submittedOn={negotiationData?.created_at ? new Date(negotiationData.created_at).toLocaleDateString() : 'Unknown'}
            budget={projectData?.budget || 'Budget TBD'}
            userType="client"
            userName={negotiationData?.client?.user?.first_name + ' ' + negotiationData?.client?.user?.last_name || 'Client'}
            userRole={projectData?.category || 'Client'}
            userPhoto={negotiationData?.client?.profile_picture || ''}
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
                       <span className={styles.fileName}>{file.file_url?.split('/').pop() || 'File'}</span>
                       <span className={styles.fileSize}>{file.file_type}</span>
                     </div>
                     <button 
                       className={styles.downloadBtn}
                       onClick={() => handleDownloadFile(file)}
                     >
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
            projectTitle={projectData?.title || 'Project'}
            projectDescription={projectData?.description || 'Project description'}
            submittedOn={negotiationData?.created_at ? new Date(negotiationData.created_at).toLocaleDateString() : 'Unknown'}
            budget={projectData?.budget || 'Budget TBD'}
            userType="client"
            userName={negotiationData?.client?.user?.first_name + ' ' + negotiationData?.client?.user?.last_name || 'Client'}
            userRole={projectData?.category || 'Client'}
            userPhoto={negotiationData?.client?.profile_picture || ''}
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
                       <span className={styles.fileName}>{file.file_url?.split('/').pop() || 'File'}</span>
                       <span className={styles.fileSize}>{file.file_type}</span>
                     </div>
                     <button 
                       className={styles.downloadBtn}
                       onClick={() => handleDownloadFile(file)}
                     >
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



  // State 5: Unlocked - can start project
  console.log('[FreelancerOverview] Rendering UNLOCKED state (can start)');
  return (
    <div className={styles.pageContainer}>
      <div className={styles.tabContent}>
        <ProjectCard
          projectTitle={negotiationData?.client_description || 'Project'}
          projectDescription={negotiationData?.client_description || 'Project description'}
          submittedOn={negotiationData?.created_at ? new Date(negotiationData.created_at).toLocaleDateString() : 'Unknown'}
          budget={negotiationData?.budget ? `$${negotiationData.budget}` : 'Budget TBD'}
          userType="client"
          userName={negotiationData?.client?.user?.first_name + ' ' + negotiationData?.client?.user?.last_name || 'Client'}
          userRole="Client"
          userPhoto={negotiationData?.client?.profile_picture || ''}
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