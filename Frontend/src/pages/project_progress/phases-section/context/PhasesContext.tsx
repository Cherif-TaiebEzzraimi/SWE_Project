import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, type FC } from 'react';
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
  storageKey?: string;
}

export const PhasesProvider: FC<PhasesProviderProps> = ({ children, initialPhases, storageKey }) => {
  const resolvedStorageKey = useMemo(() => (storageKey ? `projectProgress:${storageKey}:phases` : null), [storageKey]);

  const [phases, setPhases] = useState<Phase[]>(() => {
    if (!resolvedStorageKey) return initialPhases;
    try {
      const raw = localStorage.getItem(resolvedStorageKey);
      if (!raw) return initialPhases;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Phase[]) : initialPhases;
    } catch {
      return initialPhases;
    }
  });
  const [canEditPhases, setCanEditPhases] = useState(true);

  useEffect(() => {
    if (!resolvedStorageKey) return;
    try {
      localStorage.setItem(resolvedStorageKey, JSON.stringify(phases));
    } catch {
      // ignore storage failures
    }
  }, [phases, resolvedStorageKey]);

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
