import PhaseCard from './components/PhaseCard';
import PhaseDetails from './components/PhaseDetails';
import AddPhaseModal from './components/AddPhaseModal';
import EditPhaseModal from './components/EditPhaseModal';
import { AddNoteModalForPhases } from './components/AddNoteModelForPhae';
import type { Phase } from './types/project';
import { useState, useEffect } from 'react';
import { usePhasesContext, PhasesProvider } from './context/PhasesContext';
import { useLocation } from 'react-router-dom';
import { getUserId } from '../../../lib/auth';
import './styles/phases_styles.css';
import { useUserType } from '../../../context/UserTypeContext';

const samplePhase: Phase[] = [];

type PhasesPageContentProps = {
  storageScope?: string;
  clientFilesSubmitted?: boolean;
};

const PhasesPageContent = ({ storageScope, clientFilesSubmitted: propClientFilesSubmitted }: PhasesPageContentProps) => {
  const { phases, canEditPhases, addPhase, updatePhase, deletePhase } = usePhasesContext();
  const { userType } = useUserType();
  const location = useLocation();
  const resolvedScope = storageScope ?? null;
  const userId = getUserId();

  // Get clientFilesSubmitted from props first, then fallback to location.state
  const clientFilesSubmitted = propClientFilesSubmitted ?? Boolean(location.state?.clientFilesSubmitted);
  
  // Determine editing permissions
  const canEditThisSection = userType === 'freelancer' ? clientFilesSubmitted : 
                                (userType === 'client' ? false : canEditPhases);

  console.log('[PhasesPageContent] Render with:', {
    userType,
    propClientFilesSubmitted,
    locationClientFilesSubmitted: location.state?.clientFilesSubmitted,
    clientFilesSubmitted,
    canEditPhases,
    canEditThisSection
  });

  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  const handleEditPhase = (phase: Phase) => {
     console.log('[PhasesPageContent] handleEditPhase called', { phase, canEditThisSection });
    setPhaseToEdit(phase);
    setIsEditModalOpen(true);
  };

  const handleDeletePhase = (phaseId: string) => {
     console.log('[PhasesPageContent] handleDeletePhase called', { phaseId, canEditThisSection });
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
              canEdit={canEditThisSection}
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
          canEdit={canEditThisSection}
          onUpdatePhase={(updated) => {
            updatePhase(updated);
            setSelectedPhase(updated);
          }}
        />
      )}

      <div className="h-6" />

      {/* Action buttons */}
      <div className="flex justify-center gap-5 flex-wrap">
         {/* Only show note and add phase buttons for freelancer, and only if editing is allowed */}
        {userType === 'freelancer' && canEditThisSection && (
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="px-6 py-3 bg-transparent text-red-400 border border-red-400 rounded-lg 
              hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.7)] 
              transition-all duration-500"
          >
            <span className="material-symbols-outlined mr-2 font-bold text-lg">note</span>
            Leave a Note
          </button>
        )}
         {/* Add phase button for freelancer only, and only if editing is allowed */}
        {userType === 'freelancer' && canEditThisSection && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-transparent text-blue-400 border border-blue-600 rounded-lg 
              hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] 
              transition-all duration-300"
          >
            <span className="material-symbols-outlined mr-2 font-bold text-lg">add</span>
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
  const projectState = propProjectState || location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const projectId = projectState.projectId ?? (searchParams.get('projectId') ? Number(searchParams.get('projectId')) : undefined);
  const negotiationId = projectState.negotiationId ?? (searchParams.get('negotiationId') ? Number(searchParams.get('negotiationId')) : undefined);
  const phasesStorageKey = projectId ? `project:${projectId}` : negotiationId ? `negotiation:${negotiationId}` : undefined;
  
  const phasesToUse = (projectState.directHire && projectState.initialLoad) ? [] : samplePhase;
  
  // Extract clientFilesSubmitted from projectState
  const clientFilesSubmitted = Boolean(projectState.clientFilesSubmitted);
  
  console.log('[PhasesPage] Rendering with:', {
    projectId,
    negotiationId,
    clientFilesSubmitted,
    projectState
  });
  
  return (
    <PhasesProvider initialPhases={phasesToUse} storageKey={phasesStorageKey}>
      <PhasesPageContent 
        storageScope={phasesStorageKey} 
        clientFilesSubmitted={clientFilesSubmitted}
      />
    </PhasesProvider>
  );
};

export default PhasesPage;