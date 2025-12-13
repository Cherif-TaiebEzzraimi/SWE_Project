// src/pages/project_progress/components/PhaseCard.tsx
import type { FC } from 'react';
import type { Phase } from '../types/project';

interface PhaseCardProps {
  phase: Phase;
  onClick: () => void;
  isSelected?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PhaseCard: FC<PhaseCardProps> = ({ phase, onClick, isSelected = false, canEdit = false, onEdit, onDelete }) => {
  /**
   * Returns the appropriate color class based on phase status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed':
        return 'text-brand-navy-dark dark:text-teal-400';
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
   * Returns the appropriate icon color class
   */
  const getIconColorClass = (): string => {
    if (phase.status === 'Completed') {
      return 'text-brand-navy-dark dark:text-teal-400';
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
            <span className="phase-detail-label">Price:</span>
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

      {/* Edit/Delete Action Buttons - Only show if canEdit is true */}
      {canEdit && (
        <div className="absolute top-4 right-12 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="Edit phase"
              title="Edit phase"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete the "${phase.name}" phase?`)) {
                  onDelete();
                }
              }}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              aria-label="Delete phase"
              title="Delete phase"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhaseCard;