import React from 'react';
import type { Note } from './../types/notes_types';
import { NotesGrid } from '../NotesGrid';


interface PrivateNotesProps {
  notes: Note[];
  onToggleStatus: (noteId: string) => void;
  onEditNote?: (note: Note) => void;
  onDeleteNote?: (noteId: string) => void;
}

export const PrivateNotes: React.FC<PrivateNotesProps> = ({ notes, onToggleStatus, onEditNote, onDeleteNote }) => {
  const handleNoteClick = (note: Note) => {
    console.log('Note clicked:', note);
  };

  return (
    <NotesGrid 
      notes={notes} 
      onNoteClick={handleNoteClick}
      onToggleStatus={onToggleStatus}
      onEditNote={onEditNote}
      onDeleteNote={onDeleteNote}
    />
  );
};