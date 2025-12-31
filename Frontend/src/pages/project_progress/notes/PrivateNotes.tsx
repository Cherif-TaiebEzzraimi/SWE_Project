import React, { useState , useImperativeHandle, forwardRef } from 'react';
import type { Note } from './../types/notes_types';
import { NotesGrid } from '../NotesGrid';


interface PrivateNotesProps {
  notes: Note[];
  onToggleStatus: (noteId: string) => void;
}

export const PrivateNotes: React.FC<PrivateNotesProps> = ({ notes, onToggleStatus }) => {
  const handleNoteClick = (note: Note) => {
    console.log('Note clicked:', note);
  };

  return (
    <NotesGrid 
      notes={notes} 
      onNoteClick={handleNoteClick}
      onToggleStatus={onToggleStatus}
    />
  );
};