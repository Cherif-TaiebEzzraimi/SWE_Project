import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectCard } from './components/ProjectCard';
import { FileUploadSection } from './components/FileUploadSection';
import { FileDisplaySection } from './components/FileDisplaySection';
import { StatusBadge } from './components/StatusBadge';
import type { FileForUpload, MediaFile } from './types/projectProgress.types';
import styles from './styles/projectProgress.module.css';

export default function ProjectProgressClientOverview() {
  const location = useLocation();
  const isSubmittedPath = location.pathname.includes('/submitted');
  
  const [files, setFiles] = useState<FileForUpload[]>([]);
  const [submittedFiles, setSubmittedFiles] = useState<MediaFile[]>([]);
  const [filesSubmitted, setFilesSubmitted] = useState(isSubmittedPath);
  const [projectStarted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleFileSelect = (newFiles: FileForUpload[]) => {
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleSubmitFiles = async () => {
    const uploaded = files.map(f => ({
      id: f.id,
      file_url: 'mock',
      file_type: f.type,
      file_name: f.name,
      file_size: f.size,
      created_at: new Date().toISOString()
    }));
    
    setSubmittedFiles(uploaded);
    setFiles([]);
    setFilesSubmitted(true);
    setShowSuccessMessage(true);
  };

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
          userType="freelancer"
          userName="Sarah Jenkins"
          userRole="Lead UI/UX Designer"
          userPhoto=""
        >
          {/* Project files Section */}
          {!filesSubmitted ? (
            <FileUploadSection 
              files={files}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onSubmit={handleSubmitFiles}
            />
          ) : (
            <FileDisplaySection 
              files={submittedFiles}
              title="Project Files"
              showSuccessMessage={showSuccessMessage}
            />
          )}
        </ProjectCard>

        {                 }
        {filesSubmitted && !projectStarted && (
          <StatusBadge 
            type="waiting"
            message="Waiting for freelancer to start"
          />
        )}

        {projectStarted && (
          <StatusBadge 
            type="started"
            message="Freelancer started working on your project"
          />
        )}
      </div>
    </div>
  );
}
