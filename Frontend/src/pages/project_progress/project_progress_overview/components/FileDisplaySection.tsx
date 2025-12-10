import type { MediaFile } from '../types/projectProgress.types';
import styles from '../styles/projectProgress.module.css';

interface FileDisplaySectionProps {
  files: MediaFile[];
  title?: string;
  showSuccessMessage?: boolean;
}

export function FileDisplaySection({ files, title = "Submitted Files", showSuccessMessage }: FileDisplaySectionProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      
      {showSuccessMessage && (
        <p className={styles.successMessageSmall}>
          ✓ Files submitted successfully
        </p>
      )}
      
      <div className={styles.fileSection}>
        <h3 className={styles.filesSectionTitle}>Submitted Files</h3>
        
        {files.length === 0 ? (
          <p className={styles.noFiles}>No files submitted yet</p>
        ) : (
          files.map(file => (
            <div key={file.id} className={styles.fileItem}>
              <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#059669" strokeWidth="1.5"/>
                <path d="M8 12.5l2.5 2.5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.file_name}</span>
                <span className={styles.fileSize}>{formatSize(file.file_size)}</span>
              </div>
              {/* read only!!*/}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
