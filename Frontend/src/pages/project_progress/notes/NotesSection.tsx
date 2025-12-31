

// import { useState, useEffect } from 'react';
// import { GeneralNotes } from './GeneralNotes';
// import { PreWorkNotes } from './PreWorkNotes';
// import { PrivateNotes } from './PrivateNotes';
// import { AddNoteModal } from './../AddNoteModel';
// import { Plus } from 'lucide-react';
// import type { Note } from '../types/notes_types';
// import styles from './../styles.module.css';

// const NotesSection = () => {
//   const [activeNote, setActiveNote] = useState<'general' | 'prework' | 'private'>('general');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Hard-coded default notes
//   const defaultGeneralNotes: Note[] = [
//     { id: '1', title: 'General Note 1', content: 'Content 1', status: 'active', date: '2025-12-31' },
//     { id: '2', title: 'General Note 2', content: 'Content 2', status: 'done', date: '2025-12-30' },
//   ];
//   const defaultPreWorkNotes: Note[] = [
//     { id: '1', title: 'PreWork Note 1', content: 'Content A', status: 'active', date: '2025-12-29' },
//     { id: '2', title: 'PreWork Note 2', content: 'Content B', status: 'done', date: '2025-12-28' },
//   ];
//   const defaultPrivateNotes: Note[] = [
//     { id: '1', title: 'Private Note 1', content: 'Secret 1', status: 'active', date: '2025-12-27' },
//     { id: '2', title: 'Private Note 2', content: 'Secret 2', status: 'done', date: '2025-12-26' },
//   ];

//   // Notes state
//   const [generalNotes, setGeneralNotes] = useState<Note[]>([]);
//   const [preWorkNotes, setPreWorkNotes] = useState<Note[]>([]);
//   const [privateNotes, setPrivateNotes] = useState<Note[]>([]);

//   // Function to load notes from localStorage
//   const loadNotes = () => {
//     const storedGeneral = localStorage.getItem('generalNotes');
//     const storedPreWork = localStorage.getItem('preWorkNotes');
//     const storedPrivate = localStorage.getItem('privateNotes');

//     setGeneralNotes(storedGeneral && JSON.parse(storedGeneral).length > 0
//       ? JSON.parse(storedGeneral)
//       : defaultGeneralNotes
//     );

//     setPreWorkNotes(storedPreWork && JSON.parse(storedPreWork).length > 0
//       ? JSON.parse(storedPreWork)
//       : defaultPreWorkNotes
//     );

//     setPrivateNotes(storedPrivate && JSON.parse(storedPrivate).length > 0
//       ? JSON.parse(storedPrivate)
//       : defaultPrivateNotes
//     );
//   };

//   // Load notes on mount
//   useEffect(() => {
//     loadNotes();
//   }, []);

//   // Add event listener for storage changes (when notes are added from Phases tab)
//   useEffect(() => {
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'generalNotes' || e.key === 'preWorkNotes' || e.key === 'privateNotes') {
//         loadNotes();
//       }
//     };

//     // Listen for custom event (for same-tab updates)
//     const handleNotesUpdate = () => {
//       loadNotes();
//     };

//     window.addEventListener('storage', handleStorageChange);
//     window.addEventListener('notesUpdated', handleNotesUpdate);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('notesUpdated', handleNotesUpdate);
//     };
//   }, []);

//   // Reload notes when the component becomes visible (when tab is switched)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         loadNotes();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, []);

//   // Save notes to localStorage whenever they change
//   useEffect(() => { 
//     localStorage.setItem('generalNotes', JSON.stringify(generalNotes)); 
//     // Dispatch custom event
//     window.dispatchEvent(new Event('notesUpdated'));
//   }, [generalNotes]);
  
//   useEffect(() => { 
//     localStorage.setItem('preWorkNotes', JSON.stringify(preWorkNotes)); 
//     window.dispatchEvent(new Event('notesUpdated'));
//   }, [preWorkNotes]);
  
//   useEffect(() => { 
//     localStorage.setItem('privateNotes', JSON.stringify(privateNotes)); 
//     window.dispatchEvent(new Event('notesUpdated'));
//   }, [privateNotes]);

//   // Toggle status function
//   const handleToggleStatus = (noteId: string, type: 'general' | 'prework' | 'private') => {
//     const toggle = (notes: Note[], setNotes: (notes: Note[]) => void) => {
//       setNotes(notes.map(n => ({
//         ...n,
//         status: n.id === noteId ? (n.status === 'done' ? 'active' : 'done') : n.status
//       }) as Note));
//     };

//     if (type === 'general') toggle(generalNotes, setGeneralNotes);
//     else if (type === 'prework') toggle(preWorkNotes, setPreWorkNotes);
//     else if (type === 'private') toggle(privateNotes, setPrivateNotes);
//   };

//   // Add new note
//   const handleAddNote = (title: string, content: string) => {
//     const newNote: Note = {
//       id: Date.now().toString(),
//       title,
//       content,
//       status: 'active',
//       date: new Date().toISOString().split('T')[0], // today's date
//     };

//     if (activeNote === 'general') setGeneralNotes(prev => [newNote, ...prev]);
//     else if (activeNote === 'prework') setPreWorkNotes(prev => [newNote, ...prev]);
//     else if (activeNote === 'private') setPrivateNotes(prev => [newNote, ...prev]);
//   };

//   return (
//     <div className={styles.notesSection}>
//       {/* Sub-tabs with updated colors */}
//       <div className="flex gap-4 mb-4">
//         <button
//           className={`px-4 py-2 rounded transition-all duration-300 ${
//             activeNote === 'general' 
//               ? 'bg-[#1e3a8a] text-white shadow-lg' 
//               : 'bg-[#f1f5f9] text-[#172554] hover:bg-[#e0f8fb]'
//           }`}
//           onClick={() => setActiveNote('general')}
//         >
//           General
//         </button>
//         <button
//           className={`px-4 py-2 rounded transition-all duration-300 ${
//             activeNote === 'prework' 
//               ? 'bg-[#49cfe0] text-white shadow-lg' 
//               : 'bg-[#f1f5f9] text-[#172554] hover:bg-[#e0f8fb]'
//           }`}
//           onClick={() => setActiveNote('prework')}
//         >
//           Pre-Work
//         </button>
//         <button
//           className={`px-4 py-2 rounded transition-all duration-300 ${
//             activeNote === 'private' 
//               ? 'bg-[#b91c1c] text-white shadow-lg' 
//               : 'bg-[#f1f5f9] text-[#172554] hover:bg-[#e7b5b5]'
//           }`}
//           onClick={() => setActiveNote('private')}
//         >
//           Private
//         </button>
//       </div>

//       {/* Notes content with updated border color */}
//       <div className="border-2 border-[#1e3a8a] shadow-[0_0_7px_3px_rgba(30,58,138,0.1)] bg-[#ffffff] p-6 rounded-lg relative">
//         {activeNote === 'general' && (
//           <GeneralNotes notes={generalNotes} onToggleStatus={(id) => handleToggleStatus(id, 'general')} />
//         )}
//         {activeNote === 'prework' && (
//           <PreWorkNotes notes={preWorkNotes} onToggleStatus={(id) => handleToggleStatus(id, 'prework')} />
//         )}
//         {activeNote === 'private' && (
//           <PrivateNotes notes={privateNotes} onToggleStatus={(id) => handleToggleStatus(id, 'private')} />
//         )}

//         {/* Add Note Button at bottom-right with updated color */}
//         <button
//           className="absolute bottom-4 right-4 px-4 py-2 bg-[#e7b5b5] text-[#b91c1c] rounded shadow-lg hover:bg-[#b91c1c] hover:text-white transition-all duration-300"
//           onClick={() => setIsModalOpen(true)}
//         >
//           <Plus size={20} />
//         </button>
//       </div>

//       {/* Add Note Modal */}
//       <AddNoteModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onAdd={handleAddNote}
//       />
//     </div>
//   );
// };

// export default NotesSection;

import { useState, useEffect } from 'react';
import { GeneralNotes } from './GeneralNotes';
import { PreWorkNotes } from './PreWorkNotes';
import { PrivateNotes } from './PrivateNotes';
import { AddNoteModal } from './../AddNoteModel';
import { Plus } from 'lucide-react';
import type { Note } from '../types/notes_types';
import styles from './../styles.module.css';

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

  // Notes state
  const [generalNotes, setGeneralNotes] = useState<Note[]>([]);
  const [preWorkNotes, setPreWorkNotes] = useState<Note[]>([]);
  const [privateNotes, setPrivateNotes] = useState<Note[]>([]);

  // Function to load notes from localStorage
  const loadNotes = () => {
    const storedGeneral = localStorage.getItem('generalNotes');
    const storedPreWork = localStorage.getItem('preWorkNotes');
    const storedPrivate = localStorage.getItem('privateNotes');

    setGeneralNotes(storedGeneral && JSON.parse(storedGeneral).length > 0
      ? JSON.parse(storedGeneral)
      : defaultGeneralNotes
    );

    setPreWorkNotes(storedPreWork && JSON.parse(storedPreWork).length > 0
      ? JSON.parse(storedPreWork)
      : defaultPreWorkNotes
    );

    setPrivateNotes(storedPrivate && JSON.parse(storedPrivate).length > 0
      ? JSON.parse(storedPrivate)
      : defaultPrivateNotes
    );
  };

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Listen for the custom 'notesUpdated' event
  useEffect(() => {
    const handleNotesUpdate = () => {
      loadNotes();
    };

    window.addEventListener('notesUpdated', handleNotesUpdate);

    return () => {
      window.removeEventListener('notesUpdated', handleNotesUpdate);
    };
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => { 
    localStorage.setItem('generalNotes', JSON.stringify(generalNotes)); 
    window.dispatchEvent(new Event('notesUpdated'));
  }, [generalNotes]);
  
  useEffect(() => { 
    localStorage.setItem('preWorkNotes', JSON.stringify(preWorkNotes)); 
    window.dispatchEvent(new Event('notesUpdated'));
  }, [preWorkNotes]);
  
  useEffect(() => { 
    localStorage.setItem('privateNotes', JSON.stringify(privateNotes)); 
    window.dispatchEvent(new Event('notesUpdated'));
  }, [privateNotes]);

  // Toggle status function
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

  // Add new note
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
    <div className={styles.notesSection}>
      {/* Sub-tabs with updated colors */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded transition-all duration-300 ${
            activeNote === 'general' 
              ? 'bg-[#1e3a8a] text-white shadow-lg' 
              : 'bg-[#f1f5f9] text-[#172554] hover:bg-[#e0f8fb]'
          }`}
          onClick={() => setActiveNote('general')}
        >
          General
        </button>
        <button
          className={`px-4 py-2 rounded transition-all duration-300 ${
            activeNote === 'prework' 
              ? 'bg-[#49cfe0] text-white shadow-lg' 
              : 'bg-[#f1f5f9] text-[#172554] hover:bg-[#e0f8fb]'
          }`}
          onClick={() => setActiveNote('prework')}
        >
          Pre-Work
        </button>
        <button
          className={`px-4 py-2 rounded transition-all duration-300 ${
            activeNote === 'private' 
              ? 'bg-[#b91c1c] text-white shadow-lg' 
              : 'bg-[#f1f5f9] text-[#172554] hover:bg-[#e7b5b5]'
          }`}
          onClick={() => setActiveNote('private')}
        >
          Private
        </button>
      </div>

      {/* Notes content with updated border color */}
      <div className="border-2 border-[#1e3a8a] shadow-[0_0_7px_3px_rgba(30,58,138,0.1)] bg-[#ffffff] p-6 rounded-lg relative">
        {activeNote === 'general' && (
          <GeneralNotes notes={generalNotes} onToggleStatus={(id) => handleToggleStatus(id, 'general')} />
        )}
        {activeNote === 'prework' && (
          <PreWorkNotes notes={preWorkNotes} onToggleStatus={(id) => handleToggleStatus(id, 'prework')} />
        )}
        {activeNote === 'private' && (
          <PrivateNotes notes={privateNotes} onToggleStatus={(id) => handleToggleStatus(id, 'private')} />
        )}

        {/* Add Note Button at bottom-right with updated color */}
        <button
          className="absolute bottom-4 right-4 px-4 py-2 bg-[#e7b5b5] text-[#b91c1c] rounded shadow-lg hover:bg-[#b91c1c] hover:text-white transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
        </button>
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