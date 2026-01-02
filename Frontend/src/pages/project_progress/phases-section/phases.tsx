// import PhaseCard from './components/PhaseCard';
// import PhaseDetails from './components/PhaseDetails';
// import AddPhaseModal from './components/AddPhaseModal';
// import EditPhaseModal from './components/EditPhaseModal';
// import { AddNoteModalForPhases } from './components/AddNoteModelForPhae';
// import type { Phase } from './types/project';
// import { useState } from 'react';
// import { usePhasesContext, PhasesProvider } from './context/PhasesContext';
// import './styles/phases_styles.css';

// const initialPhases: Phase[] = [
//   {
//     id: '1',
//     name: 'Discovery',
//     status: 'Completed',
//     completedDate: 'Oct 28',
//     tasks: { completed: 4, total: 4 },
//     deliverable: 'Project Brief v1.2.pdf',
//     icon: 'folder_managed',
//     iconColor: 'text-brand-navy-dark',
//     isActive: false,
//     description: 'Initial project discovery and requirements gathering phase. This includes stakeholder interviews, competitive analysis, and defining project scope.',
//     deadline: 'Oct 28',
//     price: '$1,500',
//     todos: [
//       {
//         id: '1',
//         title: 'Stakeholder Interviews',
//         completed: true,
//         date: 'Oct 15'
//       },
//       {
//         id: '2',
//         title: 'Competitive Analysis',
//         completed: true,
//         date: 'Oct 20'
//       },
//       {
//         id: '3',
//         title: 'Requirements Documentation',
//         completed: true,
//         date: 'Oct 25'
//       },
//       {
//         id: '4',
//         title: 'Project Brief Finalization',
//         completed: true,
//         date: 'Oct 28'
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: 'UI Design',
//     status: 'In Progress',
//     dueDate: 'Nov 12',
//     tasks: { completed: 1, total: 3 },
//     icon: 'folder_supervised',
//     iconColor: 'text-brand-blue',
//     isActive: true,
//     description: 'This phase involves creating a high-fidelity design of the user interface based on the approved wireframes and project requirements. It includes color schemes, typography, and interactive elements.',
//     deadline: 'Nov 12',
//     price: '$2,500',
//     todos: [
//       {
//         id: '1',
//         title: 'Finalize Color Palette',
//         completed: true,
//         date: 'Oct 30'
//       },
//       {
//         id: '2',
//         title: 'Create Homepage Mockups',
//         completed: false,
//         date: 'Nov 5'
//       },
//       {
//         id: '3',
//         title: 'Design User Profile Page',
//         completed: false,
//         date: 'Nov 10'
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Development',
//     status: 'Not Started',
//     startDate: 'Nov 13',
//     tasks: { completed: 0, total: 8 },
//     icon: 'folder',
//     iconColor: 'text-slate-400',
//     isActive: false,
//     description: 'Implementation phase where the approved designs are coded into a functional website using modern web technologies.',
//     deadline: 'Dec 15',
//     price: '$5,000',
//     todos: [
//       {
//         id: '1',
//         title: 'Set up Development Environment',
//         completed: false,
//         date: 'Nov 13'
//       },
//       {
//         id: '2',
//         title: 'Frontend Development - Homepage',
//         completed: false,
//         date: 'Nov 20'
//       },
//       {
//         id: '3',
//         title: 'Frontend Development - Profile',
//         completed: false,
//         date: 'Nov 25'
//       },
//       {
//         id: '4',
//         title: 'Backend API Integration',
//         completed: false,
//         date: 'Dec 1'
//       },
//       {
//         id: '5',
//         title: 'Database Setup',
//         completed: false,
//         date: 'Dec 3'
//       },
//       {
//         id: '6',
//         title: 'Authentication System',
//         completed: false,
//         date: 'Dec 8'
//       },
//       {
//         id: '7',
//         title: 'Content Management',
//         completed: false,
//         date: 'Dec 12'
//       },
//       {
//         id: '8',
//         title: 'Final Development Review',
//         completed: false,
//         date: 'Dec 15'
//       }
//     ]
//   },
//   {
//     id: '4',
//     name: 'Testing',
//     status: 'Not Started',
//     startDate: 'Dec 16',
//     tasks: { completed: 0, total: 5 },
//     icon: 'folder',
//     iconColor: 'text-slate-400',
//     isActive: false,
//     description: 'Quality assurance and testing phase to ensure everything works correctly across different devices and browsers.',
//     deadline: 'Dec 22',
//     price: '$1,000',
//     todos: [
//       {
//         id: '1',
//         title: 'Cross-browser Testing',
//         completed: false,
//         date: 'Dec 16'
//       },
//       {
//         id: '2',
//         title: 'Mobile Responsiveness Testing',
//         completed: false,
//         date: 'Dec 18'
//       },
//       {
//         id: '3',
//         title: 'Performance Testing',
//         completed: false,
//         date: 'Dec 19'
//       },
//       {
//         id: '4',
//         title: 'Security Audit',
//         completed: false,
//         date: 'Dec 20'
//       },
//       {
//         id: '5',
//         title: 'User Acceptance Testing',
//         completed: false,
//         date: 'Dec 22'
//       }
//     ]
//   },
//   {
//     id: '5',
//     name: 'Deployment',
//     status: 'Not Started',
//     startDate: 'Dec 23',
//     tasks: { completed: 0, total: 3 },
//     icon: 'folder',
//     iconColor: 'text-slate-400',
//     isActive: false,
//     description: 'Final deployment and launch of the website to production servers with monitoring setup.',
//     deadline: 'Dec 31',
//     price: '$800',
//     todos: [
//       {
//         id: '1',
//         title: 'Server Configuration',
//         completed: false,
//         date: 'Dec 23'
//       },
//       {
//         id: '2',
//         title: 'Production Deployment',
//         completed: false,
//         date: 'Dec 28'
//       },
//       {
//         id: '3',
//         title: 'Post-launch Monitoring',
//         completed: false,
//         date: 'Dec 31'
//       }
//     ]
//   }
// ];

// const PhasesPageContent = () => {
//   const { phases, canEditPhases, addPhase, updatePhase, deletePhase, toggleEditMode } = usePhasesContext();

//   const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);

//   const handlePhaseClick = (phase: Phase) => {
//     setSelectedPhase(phase);
//   };

//   const handleEditPhase = (phase: Phase) => {
//     setPhaseToEdit(phase);
//     setIsEditModalOpen(true);
//   };

//   const handleDeletePhase = (phaseId: string) => {
//     deletePhase(phaseId);
//     if (selectedPhase?.id === phaseId) {
//       setSelectedPhase(null);
//     }
//   };

//   const handleAddPhase = (newPhase: Phase) => {
//     addPhase(newPhase);
//   };

//   const handleSaveEditedPhase = (updatedPhase: Phase) => {
//     updatePhase(updatedPhase);
//     setSelectedPhase(updatedPhase);
//   };

//   const handleAddNote = (category: 'general' | 'prework' | 'private', title: string, content: string) => {
//     const newNote = {
//       id: Date.now().toString(),
//       title,
//       content,
//       status: 'active',
//       date: new Date().toISOString().split('T')[0],
//     };

//     // Save to localStorage
//     const storageKey = category === 'general' ? 'generalNotes' : 
//                        category === 'prework' ? 'preWorkNotes' : 
//                        'privateNotes';
    
//     const existingNotes = localStorage.getItem(storageKey);
//     const notes = existingNotes ? JSON.parse(existingNotes) : [];
//     notes.unshift(newNote);
//     localStorage.setItem(storageKey, JSON.stringify(notes));

//     alert(`Note added successfully to ${category} notes!`);
//   };

//   return (
//     <>
//       {/* Horizontal scrollable phases list */}
//       <div className="phases-scroll-container">
//         <div className="phases-scroll-content">
//           {phases.map((phase) => (
//             <PhaseCard
//               key={phase.id}
//               phase={phase}
//               onClick={() => handlePhaseClick(phase)}
//               isSelected={selectedPhase?.id === phase.id}
//               canEdit={canEditPhases}
//               onEdit={() => handleEditPhase(phase)}
//               onDelete={() => handleDeletePhase(phase.id)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Phase details section */}
//       {selectedPhase && (
//         <PhaseDetails
//           phase={selectedPhase}
//           onClose={() => setSelectedPhase(null)}
//           onEdit={() => handleEditPhase(selectedPhase)}
//           onDelete={() => handleDeletePhase(selectedPhase.id)}
//           canEdit={canEditPhases}
//         />
//       )}

//       <div className="h-6" />

//       {/* Add Note */}
//       <div className="flex justify-center gap-5 flex-wrap">
//        {canEditPhases && (
//           <button
//             onClick={() => setIsNoteModalOpen(true)}
//             className="px-6 py-3 bg-transparent text-red-400 border border-red-400 rounded-lg 
//        hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.7)] 
//        transition-all duration-500">
//             <span className="material-symbols-outlined mr-2 font-bold text-lg">NOTE</span>
//             Leave a Note
//           </button>
//         )}

//        {/* Edit Mode Toggle Button */}
//         <button
//           onClick={toggleEditMode}
//           className={`px-6 py-3 rounded-lg border transition-all duration-300 bg-slate-200/20 text-slate-600 border-slate-600 hover:shadow-[0_0_10px_rgba(71,85,105,0.7)]'
//                 } hover:scale-105`}
//           title={canEditPhases ? 'Lock editing' : 'Unlocked'}
//           >
//           <span className="material-symbols-outlined mr-2 font-bold text-lg">
//             {canEditPhases ? 'lock_open' : 'lock'}
//           </span>
//           {canEditPhases ? 'Lock Editing' : 'Unlock Editing'}
//         </button>

//         {/*add phase button */}
//         {canEditPhases && (
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="px-6 py-3 bg-transparent text-blue-400 border border-blue-600 rounded-lg 
//            hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] 
//            transition-all duration-300"
//           >
//             <span className="material-symbols-outlined mr-2 font-bold text-lg">ADD</span>
//             Add a Phase
//           </button>
//         )}
//       </div>
//       <div className="h-10" />

//       {/* Modals */}
//       <AddPhaseModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         onAdd={handleAddPhase}
//       />

//       <EditPhaseModal
//         isOpen={isEditModalOpen}
//         phase={phaseToEdit}
//         onClose={() => setIsEditModalOpen(false)}
//         onSave={handleSaveEditedPhase}
//       />

//       <AddNoteModalForPhases
//         isOpen={isNoteModalOpen}
//         onClose={() => setIsNoteModalOpen(false)}
//         onAdd={handleAddNote}
//       />
//     </>
//   );
// };

// const PhasesPage = () => {
//   return (
//     <PhasesProvider initialPhases={initialPhases}>
//       <PhasesPageContent />
//     </PhasesProvider>
//   );
// };

// export default PhasesPage;

import PhaseCard from './components/PhaseCard';
import PhaseDetails from './components/PhaseDetails';
import AddPhaseModal from './components/AddPhaseModal';
import EditPhaseModal from './components/EditPhaseModal';
import { AddNoteModalForPhases } from './components/AddNoteModelForPhae';
import type { Phase } from './types/project';
import { useState } from 'react';
import { usePhasesContext, PhasesProvider } from './context/PhasesContext';
import { useLocation } from 'react-router-dom';
import { getUserId } from '../../../lib/auth';
import './styles/phases_styles.css';

const initialPhases: Phase[] = [
  {
    id: '1',
    name: 'Discovery',
    status: 'Completed',
    completedDate: 'Oct 28',
    tasks: { completed: 4, total: 4 },
    deliverable: 'Project Brief v1.2.pdf',
    icon: 'folder_managed',
    iconColor: 'text-brand-navy-dark',
    isActive: false,
    description: 'Initial project discovery and requirements gathering phase. This includes stakeholder interviews, competitive analysis, and defining project scope.',
    deadline: 'Oct 28',
    price: '$1,500',
    todos: [
      {
        id: '1',
        title: 'Stakeholder Interviews',
        completed: true,
        date: 'Oct 15'
      },
      {
        id: '2',
        title: 'Competitive Analysis',
        completed: true,
        date: 'Oct 20'
      },
      {
        id: '3',
        title: 'Requirements Documentation',
        completed: true,
        date: 'Oct 25'
      },
      {
        id: '4',
        title: 'Project Brief Finalization',
        completed: true,
        date: 'Oct 28'
      }
    ]
  },
  {
    id: '2',
    name: 'UI Design',
    status: 'In Progress',
    dueDate: 'Nov 12',
    tasks: { completed: 1, total: 3 },
    icon: 'folder_supervised',
    iconColor: 'text-brand-blue',
    isActive: true,
    description: 'This phase involves creating a high-fidelity design of the user interface based on the approved wireframes and project requirements. It includes color schemes, typography, and interactive elements.',
    deadline: 'Nov 12',
    price: '$2,500',
    todos: [
      {
        id: '1',
        title: 'Finalize Color Palette',
        completed: true,
        date: 'Oct 30'
      },
      {
        id: '2',
        title: 'Create Homepage Mockups',
        completed: false,
        date: 'Nov 5'
      },
      {
        id: '3',
        title: 'Design User Profile Page',
        completed: false,
        date: 'Nov 10'
      }
    ]
  },
  {
    id: '3',
    name: 'Development',
    status: 'Not Started',
    startDate: 'Nov 13',
    tasks: { completed: 0, total: 8 },
    icon: 'folder',
    iconColor: 'text-slate-400',
    isActive: false,
    description: 'Implementation phase where the approved designs are coded into a functional website using modern web technologies.',
    deadline: 'Dec 15',
    price: '$5,000',
    todos: [
      {
        id: '1',
        title: 'Set up Development Environment',
        completed: false,
        date: 'Nov 13'
      },
      {
        id: '2',
        title: 'Frontend Development - Homepage',
        completed: false,
        date: 'Nov 20'
      },
      {
        id: '3',
        title: 'Frontend Development - Profile',
        completed: false,
        date: 'Nov 25'
      },
      {
        id: '4',
        title: 'Backend API Integration',
        completed: false,
        date: 'Dec 1'
      },
      {
        id: '5',
        title: 'Database Setup',
        completed: false,
        date: 'Dec 3'
      },
      {
        id: '6',
        title: 'Authentication System',
        completed: false,
        date: 'Dec 8'
      },
      {
        id: '7',
        title: 'Content Management',
        completed: false,
        date: 'Dec 12'
      },
      {
        id: '8',
        title: 'Final Development Review',
        completed: false,
        date: 'Dec 15'
      }
    ]
  },
  {
    id: '4',
    name: 'Testing',
    status: 'Not Started',
    startDate: 'Dec 16',
    tasks: { completed: 0, total: 5 },
    icon: 'folder',
    iconColor: 'text-slate-400',
    isActive: false,
    description: 'Quality assurance and testing phase to ensure everything works correctly across different devices and browsers.',
    deadline: 'Dec 22',
    price: '$1,000',
    todos: [
      {
        id: '1',
        title: 'Cross-browser Testing',
        completed: false,
        date: 'Dec 16'
      },
      {
        id: '2',
        title: 'Mobile Responsiveness Testing',
        completed: false,
        date: 'Dec 18'
      },
      {
        id: '3',
        title: 'Performance Testing',
        completed: false,
        date: 'Dec 19'
      },
      {
        id: '4',
        title: 'Security Audit',
        completed: false,
        date: 'Dec 20'
      },
      {
        id: '5',
        title: 'User Acceptance Testing',
        completed: false,
        date: 'Dec 22'
      }
    ]
  },
  {
    id: '5',
    name: 'Deployment',
    status: 'Not Started',
    startDate: 'Dec 23',
    tasks: { completed: 0, total: 3 },
    icon: 'folder',
    iconColor: 'text-slate-400',
    isActive: false,
    description: 'Final deployment and launch of the website to production servers with monitoring setup.',
    deadline: 'Dec 31',
    price: '$800',
    todos: [
      {
        id: '1',
        title: 'Server Configuration',
        completed: false,
        date: 'Dec 23'
      },
      {
        id: '2',
        title: 'Production Deployment',
        completed: false,
        date: 'Dec 28'
      },
      {
        id: '3',
        title: 'Post-launch Monitoring',
        completed: false,
        date: 'Dec 31'
      }
    ]
  }
];

type PhasesPageContentProps = {
  storageScope?: string;
};

const PhasesPageContent = ({ storageScope }: PhasesPageContentProps) => {
  const { phases, canEditPhases, addPhase, updatePhase, deletePhase, toggleEditMode } = usePhasesContext();
  const resolvedScope = storageScope ?? null;
  const userId = getUserId();

  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  const handleEditPhase = (phase: Phase) => {
    setPhaseToEdit(phase);
    setIsEditModalOpen(true);
  };

  const handleDeletePhase = (phaseId: string) => {
    deletePhase(phaseId);
    if (selectedPhase?.id === phaseId) {
      setSelectedPhase(null);
    }
  };

  const handleAddPhase = (newPhase: Phase) => {
    addPhase(newPhase);
  };

  const handleSaveEditedPhase = (updatedPhase: Phase) => {
    updatePhase(updatedPhase);
    setSelectedPhase(updatedPhase);
  };

  const handleAddNote = (category: 'general' | 'prework' | 'private', title: string, content: string) => {
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
    };

    // Save to localStorage (scoped per project when possible)
    const legacyStorageKey = category === 'general' ? 'generalNotes' : 
                 category === 'prework' ? 'preWorkNotes' : 
                 'privateNotes';

    const storageKey = (() => {
      if (!resolvedScope) return legacyStorageKey;
      if (category !== 'private') return `${resolvedScope}:${legacyStorageKey}`;
      if (!userId) return null;
      return `${resolvedScope}:privateNotes:user:${userId}`;
    })();

    if (!storageKey) {
      return;
    }
    
    const existingNotes = localStorage.getItem(storageKey);
    const notes = existingNotes ? JSON.parse(existingNotes) : [];
    notes.unshift(newNote);
    localStorage.setItem(storageKey, JSON.stringify(notes));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('notesUpdated'));
  };

  return (
    <>
      {/* Horizontal scrollable phases list */}
      <div className="phases-scroll-container">
        <div className="phases-scroll-content">
          {phases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              onClick={() => handlePhaseClick(phase)}
              isSelected={selectedPhase?.id === phase.id}
              canEdit={canEditPhases}
              onEdit={() => handleEditPhase(phase)}
              onDelete={() => handleDeletePhase(phase.id)}
            />
          ))}
        </div>
      </div>

      {/* Phase details section */}
      {selectedPhase && (
        <PhaseDetails
          phase={selectedPhase}
          onClose={() => setSelectedPhase(null)}
          onEdit={() => handleEditPhase(selectedPhase)}
          onDelete={() => handleDeletePhase(selectedPhase.id)}
          canEdit={canEditPhases}
          onUpdatePhase={(updated) => {
            updatePhase(updated);
            setSelectedPhase(updated);
          }}
        />
      )}

      <div className="h-6" />

      {/* Add Note */}
      <div className="flex justify-center gap-5 flex-wrap">
       {canEditPhases && (
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="px-6 py-3 bg-transparent text-red-400 border border-red-400 rounded-lg 
       hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.7)] 
       transition-all duration-500">
            <span className="material-symbols-outlined mr-2 font-bold text-lg">NOTE</span>
            Leave a Note
          </button>
        )}

       {/* Edit Mode Toggle Button */}
        <button
          onClick={toggleEditMode}
          className={`px-6 py-3 rounded-lg border transition-all duration-300 bg-slate-200/20 text-slate-600 border-slate-600 hover:shadow-[0_0_10px_rgba(71,85,105,0.7)]'
                } hover:scale-105`}
          title={canEditPhases ? 'Lock editing' : 'Unlocked'}
          >
          <span className="material-symbols-outlined mr-2 font-bold text-lg">
            {canEditPhases ? 'lock_open' : 'lock'}
          </span>
          {canEditPhases ? 'Lock Editing' : 'Unlock Editing'}
        </button>

        {/*add phase button */}
        {canEditPhases && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-transparent text-blue-400 border border-blue-600 rounded-lg 
           hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] 
           transition-all duration-300"
          >
            <span className="material-symbols-outlined mr-2 font-bold text-lg">ADD</span>
            Add a Phase
          </button>
        )}
      </div>
      <div className="h-10" />

      {/* Modals */}
      <AddPhaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPhase}
      />

      <EditPhaseModal
        isOpen={isEditModalOpen}
        phase={phaseToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditedPhase}
      />

      <AddNoteModalForPhases
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onAdd={handleAddNote}
      />
    </>
  );
};

interface PhasesPageProps {
  projectState?: any;
}

const PhasesPage = ({ projectState: propProjectState }: PhasesPageProps = {}) => {
  const location = useLocation();
  // Use prop if provided, otherwise fall back to location.state
  const projectState = propProjectState || location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const projectId = projectState.projectId ?? (searchParams.get('projectId') ? Number(searchParams.get('projectId')) : undefined);
  const negotiationId = projectState.negotiationId ?? (searchParams.get('negotiationId') ? Number(searchParams.get('negotiationId')) : undefined);
  const phasesStorageKey = projectId ? `project:${projectId}` : negotiationId ? `negotiation:${negotiationId}` : undefined;
  // If coming from direct hire, start with empty phases
  const phasesToUse = (projectState.directHire && projectState.initialLoad) ? [] : initialPhases;
  
  return (
    <PhasesProvider initialPhases={phasesToUse} storageKey={phasesStorageKey}>
      <PhasesPageContent storageScope={phasesStorageKey} />
    </PhasesProvider>
  );
};

export default PhasesPage;