import React from 'react';
import { Circle , Check  } from 'lucide-react';
import type { Note } from './types/notes_types';
import styles from './styles.module.css';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  onToggleStatus?: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onToggleStatus }) => {
  const cardClass = note.status === 'done' 
    ? `${styles.noteCard} ${styles.noteCardDone}` 
    : styles.noteCard;
  
  const titleClass = note.status === 'done'
    ? `${styles.noteTitle} ${styles.noteTitleDone}`
    : styles.noteTitle;
  
  const contentClass = note.status === 'done'
    ? `${styles.noteContent} ${styles.noteContentDone}`
    : styles.noteContent;
  
  const dateClass = note.status === 'done'
    ? `${styles.noteDate} ${styles.noteDateDone}`
    : styles.noteDate;

  const handleMarkDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus?.(note.id);
  };

  return (
    <div onClick={onClick} className={cardClass}>
      <div className={styles.notePin}>
        <div className={styles.notePinCircle}>
          <Circle size={12} color="#6b7280" />
        </div>
      </div>

      <h3 className={titleClass}>{note.title}</h3>
      <p className={contentClass}>{note.content}</p>
      <div className={styles.noteFooter}>
        <p className={dateClass}>{note.date}</p>
        <button 
          onClick={handleMarkDone}
          className={note.status === 'done' ? styles.doneButtonActive : styles.doneButton}
          title={note.status === 'done' ? 'Mark as active' : 'Mark as done'}
        >
          <Check size={14} />
          {note.status === 'done' ? 'Done' : 'Mark Done'}
        </button>
      </div>
    </div>
  );
};