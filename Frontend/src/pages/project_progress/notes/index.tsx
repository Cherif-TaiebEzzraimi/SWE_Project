// 
import { useState, useEffect } from 'react';
import { GeneralNotes } from './GeneralNotes';
import { PreWorkNotes } from './PreWorkNotes';
import { PrivateNotes } from './PrivateNotes';
import { AddNoteModal } from './../AddNoteModel';
import type { Note } from '../types/notes_types';

const NotesSection = () => {
  const [activeNote, setActiveNote] = useState<'general' | 'prework' | 'private'>('general');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hard-coded default notes
  const defaultGeneralNotes: Note[] = [
    { id: '1', title: 'General Note 1', content: 'Content 1', status: 'active', date: '2025-12-31' },
    { id: '2', title: 'General Note 2', content: 'Content 2', status: 'done', date: '2025-12-30' },
  ];
  const defaultPreWorkNotes: Note[] = [
    { id: '1', title: 'PreWork Note 1', content: 'Content A', status: 'active', date: '2025-12-29' },
    { id: '2', title: 'PreWork Note 2', content: 'Content B', status: 'done', date: '2025-12-28' },
  ];
  const defaultPrivateNotes: Note[] = [
    { id: '1', title: 'Private Note 1', content: 'Secret 1', status: 'active', date: '2025-12-27' },
    { id: '2', title: 'Private Note 2', content: 'Secret 2', status: 'done', date: '2025-12-26' },
  ];

  // State with localStorage persistence
  const [generalNotes, setGeneralNotes] = useState<Note[]>([]);
  const [preWorkNotes, setPreWorkNotes] = useState<Note[]>([]);
  const [privateNotes, setPrivateNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount or use defaults
  useEffect(() => {
    const storedGeneral = localStorage.getItem('generalNotes');
    const storedPreWork = localStorage.getItem('preWorkNotes');
    const storedPrivate = localStorage.getItem('privateNotes');

    setGeneralNotes(storedGeneral ? JSON.parse(storedGeneral) : defaultGeneralNotes);
    setPreWorkNotes(storedPreWork ? JSON.parse(storedPreWork) : defaultPreWorkNotes);
    setPrivateNotes(storedPrivate ? JSON.parse(storedPrivate) : defaultPrivateNotes);
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => { localStorage.setItem('generalNotes', JSON.stringify(generalNotes)); }, [generalNotes]);
  useEffect(() => { localStorage.setItem('preWorkNotes', JSON.stringify(preWorkNotes)); }, [preWorkNotes]);
  useEffect(() => { localStorage.setItem('privateNotes', JSON.stringify(privateNotes)); }, [privateNotes]);

  // Toggle status
  const handleToggleStatus = (noteId: string, type: 'general' | 'prework' | 'private') => {
    const toggle = (notes: Note[], setNotes: (notes: Note[]) => void) => {
      setNotes(notes.map(n => ({
        ...n,
        status: n.id === noteId ? (n.status === 'done' ? 'active' : 'done') : n.status
      }) as Note));
    };

    if (type === 'general') toggle(generalNotes, setGeneralNotes);
    else if (type === 'prework') toggle(preWorkNotes, setPreWorkNotes);
    else if (type === 'private') toggle(privateNotes, setPrivateNotes);
  };

  // Add a new note
  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
    };

    if (activeNote === 'general') setGeneralNotes(prev => [newNote, ...prev]);
    else if (activeNote === 'prework') setPreWorkNotes(prev => [newNote, ...prev]);
    else if (activeNote === 'private') setPrivateNotes(prev => [newNote, ...prev]);
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeNote === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveNote('general')}
        >
          General
        </button>
        <button
          className={`px-4 py-2 rounded ${activeNote === 'prework' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveNote('prework')}
        >
          Pre-Work
        </button>
        <button
          className={`px-4 py-2 rounded ${activeNote === 'private' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveNote('private')}
        >
          Private
        </button>
      </div>

      {/* Note content */}
      <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
        {activeNote === 'general' && (
          <GeneralNotes notes={generalNotes} onToggleStatus={(id) => handleToggleStatus(id, 'general')} />
        )}
        {activeNote === 'prework' && (
          <PreWorkNotes notes={preWorkNotes} onToggleStatus={(id) => handleToggleStatus(id, 'prework')} />
        )}
        {activeNote === 'private' && (
          <PrivateNotes notes={privateNotes} onToggleStatus={(id) => handleToggleStatus(id, 'private')} />
        )}

        {/* Add Note Button at the bottom */}
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddNote}
      />
    </div>
  );
};

export default NotesSection;
