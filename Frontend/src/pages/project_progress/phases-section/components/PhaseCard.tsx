// src/pages/project_progress/components/PhaseCard.tsx
import type { FC } from 'react';
import type { Phase } from '../types/project';

interface PhaseCardProps {
  phase: Phase;
  onClick: () => void;
  isSelected?: boolean;
}

const PhaseCard: FC<PhaseCardProps> = ({ phase, onClick, isSelected = false }) => {
  /**
   * Returns the appropriate color class based on phase status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed':
        return 'text-brand-navy-dark dark:text-green-400';
      case 'In Progress':
        return 'text-brand-blue dark:text-blue-400';
      case 'Not Started':
        return 'text-slate-500 dark:text-slate-400';
      default:
        return 'text-slate-500';
    }
  };

  /**
   * Returns the appropriate color for date text based on status
   */
  const getDateColor = (status: string): string => {
    if (status === 'In Progress' && phase.dueDate) {
      return 'text-brand-red-dark dark:text-red-400';
    }
    return 'text-slate-500 dark:text-slate-400';
  };

  /**
   * Calculates completion percentage
   */
  const getCompletionPercentage = (): number => {
    if (phase.tasks.total === 0) return 0;
    return Math.round((phase.tasks.completed / phase.tasks.total) * 100);
  };

  /**
   * Returns the appropriate icon color class
   */
  const getIconColorClass = (): string => {
    if (phase.status === 'Completed') {
      return 'text-brand-navy-dark dark:text-green-400';
    } else if (phase.status === 'In Progress') {
      return 'text-brand-blue dark:text-blue-400';
    }
    return phase.iconColor;
  };

  return (
    <div
      className={`phase-card ${isSelected ? 'phase-card-active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${phase.name} phase`}
    >
      {/* Card Header with Icon and Title */}
      <div className="phase-card-header">
        <span
          className={`material-symbols-outlined phase-icon ${getIconColorClass()}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          {phase.icon}
        </span>
        <div className="phase-info">
          <p className="phase-name">{phase.name}</p>
          <p className={`phase-date ${getDateColor(phase.status)}`}>
            {phase.completedDate && `Completed on ${phase.completedDate}`}
            {phase.dueDate && `Due by ${phase.dueDate}`}
            {phase.startDate && `Starts ${phase.startDate}`}
          </p>
        </div>
      </div>
      
      {/* Card Details */}
      <div className="phase-details">
        {/* Status */}
        <div className="phase-detail-item">
          <span className="phase-detail-label">Status:</span>
          <span className={`phase-detail-value ${getStatusColor(phase.status)}`}>
            {phase.status}
          </span>
        </div>

        {/* Tasks Progress */}
        <div className="phase-detail-item flex-col items-start gap-1">
          <div className="flex items-center gap-2 w-full">
            <span className="phase-detail-label">Tasks:</span>
            <span className="phase-detail-value">
              {phase.tasks.completed}/{phase.tasks.total}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
              {getCompletionPercentage()}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                phase.status === 'Completed' 
                  ? 'bg-green-500' 
                  : phase.status === 'In Progress'
                  ? 'bg-brand-blue'
                  : 'bg-slate-400'
              }`}
              style={{ width: `${getCompletionPercentage()}%` }}
              role="progressbar"
              aria-valuenow={getCompletionPercentage()}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Deliverable Link */}
        {phase.deliverable && (
          <div className="phase-detail-item phase-deliverable">
            <span className="phase-detail-label">Deliverable:</span>
            <a 
              href="#" 
              className="deliverable-link"
              onClick={(e) => {
                e.stopPropagation();
                // Handle deliverable download/view
                console.log('Opening deliverable:', phase.deliverable);
              }}
              aria-label={`Download ${phase.deliverable}`}
            >
              <span className="material-symbols-outlined text-sm mr-1 align-middle">
                description
              </span>
              {phase.deliverable}
            </a>
          </div>
        )}

        {/* Budget/Price indicator */}
        {phase.price && (
          <div className="phase-detail-item mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
            <span className="phase-detail-label">Budget:</span>
            <span className="phase-detail-value font-bold text-brand-navy-dark dark:text-white">
              {phase.price}
            </span>
          </div>
        )}
      </div>

      {/* Active Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default PhaseCard;