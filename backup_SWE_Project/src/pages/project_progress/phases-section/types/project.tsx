// src/pages/project_progress/types/project.ts

/**
 * Represents a single todo/task item within a phase
 */
export interface Todo {
  /** Unique identifier for the todo item */
  id: string;
  
  /** Title/description of the task */
  title: string;
  
  /** Whether the task has been completed */
  completed: boolean;
  
  /** Due date of the task (formatted string, e.g., "Nov 15") */
  date: string;
}

/**
 * Represents the status of a project phase
 */
export type PhaseStatus = 'Completed' | 'In Progress' | 'Not Started';

/**
 * Represents a project phase with all its details
 */
export interface Phase {
  /** Unique identifier for the phase */
  id: string;
  
  /** Name of the phase (e.g., "Discovery", "UI Design") */
  name: string;
  
  /** Current status of the phase */
  status: PhaseStatus;
  
  /** Date when the phase was completed (optional, only for completed phases) */
  completedDate?: string;
  
  /** Due date for the phase (optional, typically for in-progress phases) */
  dueDate?: string;
  
  /** Start date for the phase (optional, for not-started phases) */
  startDate?: string;
  
  /** Task completion tracking */
  tasks: {
    /** Number of completed tasks */
    completed: number;
    
    /** Total number of tasks */
    total: number;
  };
  
  /** Name of the deliverable file (optional) */
  deliverable?: string;
  
  /** Material icon name to display for this phase */
  icon: string;
  
  /** Tailwind CSS class for the icon color */
  iconColor: string;
  
  /** Whether this phase is currently active/selected */
  isActive?: boolean;
  
  /** Detailed description of what this phase involves */
  description: string;
  
  /** Deadline date (formatted string) */
  deadline: string;
  
  /** Budget/price for this phase */
  price: string;
  
  /** List of todos/tasks for this phase */
  todos: Todo[];
}

/**
 * Represents the overall project information
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  
  /** Project title */
  title: string;
  
  /** Project description */
  description: string;
  
  /** Client information */
  client: {
    /** Client name */
    name: string;
    
    /** Client avatar/logo URL */
    avatar: string;
  };
  
  /** Freelancer/contractor information */
  freelancer: {
    /** Freelancer name */
    name: string;
    
    /** Freelancer avatar URL */
    avatar: string;
  };
  
  /** Overall project completion percentage */
  completionPercentage: number;
  
  /** Current active phase name */
  currentPhase: string;
  
  /** List of all phases in the project */
  phases: Phase[];
}

/**
 * Tab options for the project progress page
 */
export type TabType = 'overview' | 'phases' | 'notes';

/**
 * Represents a note in the notes section
 */
export interface Note {
  /** Unique identifier for the note */
  id: string;
  
  /** Note title */
  title: string;
  
  /** Note content */
  content: string;
  
  /** Timestamp when the note was created */
  createdAt: Date;
  
  /** Timestamp when the note was last updated */
  updatedAt: Date;
  
  /** Tags associated with the note */
  tags: string[];
}

/**
 * Utility type for phase statistics
 */
export interface PhaseStatistics {
  /** Total number of phases */
  total: number;
  
  /** Number of completed phases */
  completed: number;
  
  /** Number of phases in progress */
  inProgress: number;
  
  /** Number of phases not started */
  notStarted: number;
  
  /** Overall completion percentage across all phases */
  overallCompletion: number;
}

/**
 * Helper function to calculate phase statistics
 */
export const calculatePhaseStatistics = (phases: Phase[]): PhaseStatistics => {
  const completed = phases.filter(p => p.status === 'Completed').length;
  const inProgress = phases.filter(p => p.status === 'In Progress').length;
  const notStarted = phases.filter(p => p.status === 'Not Started').length;
  
  // Calculate overall completion based on tasks
  const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.total, 0);
  const completedTasks = phases.reduce((sum, phase) => sum + phase.tasks.completed, 0);
  const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    total: phases.length,
    completed,
    inProgress,
    notStarted,
    overallCompletion
  };
};

/**
 * Helper function to get the next phase in the sequence
 */
export const getNextPhase = (phases: Phase[], currentPhaseId: string): Phase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentPhaseId);
  if (currentIndex === -1 || currentIndex === phases.length - 1) {
    return null;
  }
  return phases[currentIndex + 1];
};

/**
 * Helper function to get the previous phase in the sequence
 */
export const getPreviousPhase = (phases: Phase[], currentPhaseId: string): Phase | null => {
  const currentIndex = phases.findIndex(p => p.id === currentPhaseId);
  if (currentIndex <= 0) {
    return null;
  }
  return phases[currentIndex - 1];
};

/**
 * Helper function to calculate days remaining until deadline
 */
export const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Helper function to check if a phase is overdue
 */
export const isPhaseOverdue = (phase: Phase): boolean => {
  if (phase.status === 'Completed') return false;
  return getDaysUntilDeadline(phase.deadline) < 0;
};

/**
 * Helper function to get completion percentage for a phase
 */
export const getPhaseCompletionPercentage = (phase: Phase): number => {
  if (phase.tasks.total === 0) return 0;
  return Math.round((phase.tasks.completed / phase.tasks.total) * 100);
};

/**
 * Helper function to sort phases by status priority
 * Priority: In Progress > Not Started > Completed
 */
export const sortPhasesByPriority = (phases: Phase[]): Phase[] => {
  const statusOrder: Record<PhaseStatus, number> = {
    'In Progress': 1,
    'Not Started': 2,
    'Completed': 3
  };
  
  return [...phases].sort((a, b) => {
    return statusOrder[a.status] - statusOrder[b.status];
  });
};

/**
 * Helper function to get all incomplete todos across all phases
 */
export const getIncompleteTodos = (phases: Phase[]): Array<Todo & { phaseName: string }> => {
  const incompleteTodos: Array<Todo & { phaseName: string }> = [];
  
  phases.forEach(phase => {
    phase.todos
      .filter(todo => !todo.completed)
      .forEach(todo => {
        incompleteTodos.push({
          ...todo,
          phaseName: phase.name
        });
      });
  });
  
  return incompleteTodos;
};

/**
 * Helper function to validate phase data
 */
export const validatePhase = (phase: Partial<Phase>): boolean => {
  return !!(
    phase.id &&
    phase.name &&
    phase.status &&
    phase.description &&
    phase.deadline &&
    phase.price &&
    phase.tasks &&
    typeof phase.tasks.completed === 'number' &&
    typeof phase.tasks.total === 'number'
  );
};

/**
 * Type guard to check if a value is a valid PhaseStatus
 */
export const isValidPhaseStatus = (status: string): status is PhaseStatus => {
  return ['Completed', 'In Progress', 'Not Started'].includes(status);
};

/**
 * Default empty phase template
 */
export const createEmptyPhase = (): Partial<Phase> => ({
  name: '',
  status: 'Not Started',
  tasks: { completed: 0, total: 0 },
  icon: 'folder',
  iconColor: 'text-slate-400',
  isActive: false,
  description: '',
  deadline: '',
  price: '$0',
  todos: []
});