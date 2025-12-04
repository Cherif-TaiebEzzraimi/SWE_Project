import { createContext, useContext, useState, type ReactNode, type FC } from 'react';
import type { Phase } from '../types/project';

interface PhasesContextType {
  phases: Phase[];
  canEditPhases: boolean;
  addPhase: (phase: Phase) => void;
  updatePhase: (phase: Phase) => void;
  deletePhase: (phaseId: string) => void;
  toggleEditMode: () => void;
  lockEditMode: () => void;
  unlockEditMode: () => void;
}

const PhasesContext = createContext<PhasesContextType | undefined>(undefined);

interface PhasesProviderProps {
  children: ReactNode;
  initialPhases: Phase[];
}

export const PhasesProvider: FC<PhasesProviderProps> = ({ children, initialPhases }) => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [canEditPhases, setCanEditPhases] = useState(true);

  const addPhase = (phase: Phase) => {
    setPhases([...phases, phase]);
  };

  const updatePhase = (updatedPhase: Phase) => {
    setPhases(phases.map(phase => phase.id === updatedPhase.id ? updatedPhase : phase));
  };

  const deletePhase = (phaseId: string) => {
    setPhases(phases.filter(phase => phase.id !== phaseId));
  };

  const toggleEditMode = () => {
    setCanEditPhases(!canEditPhases);
  };

  const lockEditMode = () => {
    setCanEditPhases(false);
  };

  const unlockEditMode = () => {
    setCanEditPhases(true);
  };

  return (
    <PhasesContext.Provider
      value={{
        phases,
        canEditPhases,
        addPhase,
        updatePhase,
        deletePhase,
        toggleEditMode,
        lockEditMode,
        unlockEditMode,
      }}
    >
      {children}
    </PhasesContext.Provider>
  );
};

export const usePhasesContext = () => {
  const context = useContext(PhasesContext);
  if (!context) {
    throw new Error('usePhasesContext must be used within a PhasesProvider');
  }
  return context;
};
