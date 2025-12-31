import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import type { Note } from '../../../types/notes.types';
import styles from './styles.module.css';

interface PreWorkImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

interface PreWorkPageProps {
  onAddNoteRequest?: (fn: (title: string, content: string) => void) => void;
}

export const PreWorkPage: React.FC<PreWorkPageProps> = ({ onAddNoteRequest }) => {
  const [preWorkNotes, setPreWorkNotes] = useState<Note[]>([]);
  const [images, setImages] = useState<PreWorkImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    if (onAddNoteRequest) {
      onAddNoteRequest((title: string, content: string) => {
        const newNote: Note = {
          id: Date.now().toString(),
          title,
          content,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: 'active'
        };
        setPreWorkNotes(prev => [newNote, ...prev]);
      });
    }
  }, [onAddNoteRequest]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: PreWorkImage = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            name: file.name,
            uploadedAt: new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className={styles.preWorkContainer}>
      <div className={styles.preWorkHeader}>
        <h2>Pre-Work Submissions</h2>
        <p>Upload images of your work progress</p>
      </div>

      <div
        className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload size={48} className={styles.uploadIcon} />
        <h3>Drag & drop images here</h3>
        <p>or</p>
        <label className={styles.uploadButton}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
          Browse Files
        </label>
        <span className={styles.uploadHint}>PNG, JPG, GIF up to 10MB</span>
      </div>

      {images.length > 0 && (
        <div className={styles.imagesGrid}>
          {images.map(image => (
            <div key={image.id} className={styles.imageCard}>
              <button
                className={styles.removeButton}
                onClick={() => removeImage(image.id)}
              >
                <X size={16} />
              </button>
              <img src={image.url} alt={image.name} className={styles.imagePreview} />
              <div className={styles.imageInfo}>
                <span className={styles.imageName}>{image.name}</span>
                <span className={styles.imageDate}>{image.uploadedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className={styles.emptyState}>
          <Image size={64} className={styles.emptyIcon} />
          <h3>No work submitted yet</h3>
          <p>Upload images to show your progress</p>
        </div>
      )}
    </div>
  );
};