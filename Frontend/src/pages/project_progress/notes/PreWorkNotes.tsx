import React, { useState , useImperativeHandle, forwardRef } from 'react';
import type { Note } from './../types/notes_types';
import { NotesGrid } from '../NotesGrid';


interface PreWorkNotesProps {
  notes: Note[];
  onToggleStatus: (noteId: string) => void;
}

export const PreWorkNotes: React.FC<PreWorkNotesProps> = ({ notes, onToggleStatus }) => {
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