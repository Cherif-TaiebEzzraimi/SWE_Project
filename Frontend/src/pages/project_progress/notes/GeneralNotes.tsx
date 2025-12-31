import React, { useState , useImperativeHandle, forwardRef } from 'react';
import type { Note } from './../types/notes_types';
import { NotesGrid } from '../NotesGrid';


interface GeneralNotesProps {
  notes: Note[];
  onToggleStatus: (noteId: string) => void;
}

export const GeneralNotes: React.FC<GeneralNotesProps> = ({ notes, onToggleStatus }) => {
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