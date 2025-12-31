// import React, { useState } from 'react';
// import { Grid3x3, ListChecks, FileText, Plus } from 'lucide-react';
// import { NotesPage } from './notes';
// import type { Note } from './types/notes_types';
// // import { PreWorkPage } from './pre_work';
// // import { PaymentPage } from './payment';
// import { AddNoteModal } from './AddNoteModel';
// import styles from './styles.module.css';

// type MainTabType = 'overview' | 'phases' | 'notes' | 'pre-Work ' | 'Payement';

// interface Tab {
//   id: MainTabType;
//   name: string;
//   icon: React.ReactNode;
// }

// const mainTabs: Tab[] = [
//   { id: 'overview', name: 'Overview', icon: <Grid3x3 size={16} /> },
//   { id: 'phases', name: 'Phases & Tasks', icon: <ListChecks size={16} /> },
//   { id: 'notes', name: 'Notes', icon: <FileText size={16} /> }
// ];

// const initialPreWorkNotes: Note[] = [
//   {
//     id: '1',
//     title: 'Approval on V2 mockups',
//     content: 'Client loves the new direction but wants to tweak the header font.',
//     date: 'Oct 26',
//     status: 'active'
//   },
//   {
//     id: '2',
//     title: 'Revisit the color palette',
//     content: 'The secondary blue felt a bit too vibrant. Explored alternatives.',
//     date: 'Oct 25',
//     status: 'done'
//   },
//   {
//     id: '3',
//     title: 'Typography feedback',
//     content: 'Check the line height on the body copy. It feels a bit tight.',
//     date: 'Oct 24',
//     status: 'active'
//   },
//   {
//     id: '4',
//     title: 'User flow concerns',
//     content: 'The checkout process has one too many steps. Can we simplify?',
//     date: 'Oct 23',
//     status: 'done'
//   },
//   {
//     id: '5',
//     title: 'Add illustration to pricing page',
//     content: 'A new custom illustration is needed to explain the tier differences.',
//     date: 'Oct 22',
//     status: 'active'
//   }
// ];

// export const ProjectProgressPage: React.FC = () => {
//   const [activeMainTab, setActiveMainTab] = useState<MainTabType>('notes');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [addNoteFn, setAddNoteFn] = useState<((title: string, content: string) => void) | null>(null);
  
//   // Lift notes state to this level so it persists across tab switches
//   const [privateNotes, setPrivateNotes] = useState<Note[]>([]);
//   const [preWorkNotes, setPreWorkNotes] = useState<Note[]>(initialPreWorkNotes);
//   const [generalNotes, setGeneralNotes] = useState<Note[]>([]);

//   const renderMainTabContent = () => {
//     switch (activeMainTab) {
//       case 'overview':
//         return (
//           <div className={styles.placeholder}>
//             Overview content goes here
//           </div>
//         );
//       case 'phases':
//         return (
//           <div className={styles.placeholder}>
//             Phases & Tasks content goes here
//           </div>
//         );
//       case 'notes':
//         return (
//           <NotesPage 
//             onAddNoteRequest={(fn) => setAddNoteFn(() => fn)}
//             privateNotes={privateNotes}
//             preWorkNotes={preWorkNotes}
//             generalNotes={generalNotes}
//             setPrivateNotes={setPrivateNotes}
//             setPreWorkNotes={setPreWorkNotes}
//             setGeneralNotes={setGeneralNotes}
//           />
          

//         );
//       default:
//         return null;
//     }
//   };

//   const handleAddNote = (title: string, content: string) => {
//     if (addNoteFn) {
//       addNoteFn(title, content);
//     }
//   };

//   return (
//     <div className={styles.projectContainer}>
//       <div className={styles.projectCard}>
//         <div className={styles.projectHeader}>
//           <div className={styles.breadcrumb}>
//             <span className={styles.breadcrumbActive}>Project X</span>
//             <span>/</span>
//             <span>Progress</span>
//           </div>

//           <div className={styles.tabContainer}>
//             {mainTabs.map(tab => {
//               const buttonClass = activeMainTab === tab.id
//                 ? `${styles.tabButton} ${styles.tabButtonActive}`
//                 : styles.tabButton;

//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveMainTab(tab.id)}
//                   className={buttonClass}
//                 >
//                   {tab.icon}
//                   <span>{tab.name}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {renderMainTabContent()}

//         {activeMainTab === 'notes' && (
//           <button 
//             className={styles.floatingButton}
//             onClick={() => setIsModalOpen(true)}
//           >
//             <Plus size={24} />
//           </button>
//         )}
//       </div>

//       <AddNoteModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onAdd={handleAddNote}
//       />
//     </div>
//   );
// };

// export default ProjectProgressPage;