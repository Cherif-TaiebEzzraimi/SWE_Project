import React from 'react';
import type { Note } from '../../types/notes.types';
import { NoteCard } from './NoteCard';
import styles from './styles.module.css';

interface NotesGridProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
  onToggleStatus?: (noteId: string) => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({ notes, onNoteClick, onToggleStatus }) => {
  if (notes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No notes yet. Click the + button to add your first note!</p>
      </div>
    );
  }

  return (
    <div className={styles.notesGridContainer}>
      <div className={styles.notesGrid}>
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => onNoteClick?.(note)}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    </div>
  );
};
