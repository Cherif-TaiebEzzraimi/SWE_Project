import React from 'react';
import type { FileForUpload } from '../types/projectProgress.types';
import styles from '../styles/projectProgress.module.css';

interface FileUploadSectionProps {
  files: FileForUpload[];
  onFileSelect: (files: FileForUpload[]) => void;
  onRemoveFile: (id: string) => void;
  onSubmit: () => void;
}

export function FileUploadSection({ files, onFileSelect, onRemoveFile, onSubmit }: FileUploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36),
        name: file.name,
        size: file.size,
        type: file.type
      }));
      onFileSelect(newFiles);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Project Files:</h2>
          <p className={styles.cardSubtitle}>Upload your project requirements and any supporting materials to help the freelancer get started.</p>
        </div>
        {files.length === 0 && (
          <label htmlFor="fileInput" className={styles.addFileBtn} aria-label="Add files">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                d="m19,21H5c-1.1,0-2-.9-2-2V5c0-1.1.9-2,2-2h11l5,5v11c0,1.1-.9,2-2,2Z"
                strokeLinejoin="round"
                strokeLinecap="round"
                data-path="box"
              />
              <path
                d="M7 3L7 8L15 8"
                strokeLinejoin="round"
                strokeLinecap="round"
                data-path="line-top"
              />
              <path
                d="M17 20L17 13L7 13L7 20"
                strokeLinejoin="round"
                strokeLinecap="round"
                data-path="line-bottom"
              />
            </svg>
          </label>
        )}
      </div>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className={styles.fileInput}
        id="fileInput"
      />

      {files.length > 0 && (
        <div className={styles.fileSection}>
          <h3 className={styles.filesSectionTitle}>Ready for Upload</h3>
          {files.map(file => (
            <div key={file.id} className={styles.fileItem}>
              <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 2V9H20" fill="white" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </div>
              <button onClick={() => onRemoveFile(file.id)} className={styles.removeBtn}>
                ×
              </button>
            </div>
          ))}
          <div className={styles.buttonContainer}>
            <label htmlFor="fileInput" className={styles.addFileBtn} aria-label="Add files">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  d="m19,21H5c-1.1,0-2-.9-2-2V5c0-1.1.9-2,2-2h11l5,5v11c0,1.1-.9,2-2,2Z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  data-path="box"
                />
                <path
                  d="M7 3L7 8L15 8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  data-path="line-top"
                />
                <path
                  d="M17 20L17 13L7 13L7 20"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  data-path="line-bottom"
                />
              </svg>
            </label>
            <button onClick={onSubmit} className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
