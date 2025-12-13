// src/pages/project_progress/components/PhaseDetails.tsx
import { useState, useEffect } from 'react';
import type { Phase, Todo } from '../types/project';
import type { FC } from 'react';
import TodoItem from './TodoItem';

interface PhaseDetailsProps {
  phase: Phase;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void; 
  canEdit?: boolean;
}
const PhaseDetails: FC<PhaseDetailsProps> = ({ phase, onClose, onEdit, onDelete, canEdit = false }) => {
  const [todos, setTodos] = useState<Todo[]>(phase.todos);
  

  

  // Sync todos with phase when phase changes
  useEffect(() => {
    setTodos(phase.todos || []);
  }, [phase.id, phase.todos]);

  /**
   * Calculates the number of completed todos
   */
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  /**
   * Toggles todo completion status
   */
  const handleToggleTodo = (todoId: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * Deletes a todo item
   */
  const handleDeleteTodo = (todoId: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
  };

  /**
   * Returns appropriate status badge styling
   */
  const getStatusBadgeStyle = () => {
    switch (phase.status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900/40 text-brand-blue dark:text-blue-300';
      case 'Not Started':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  /**
   * Returns appropriate status icon
   */
  const getStatusIcon = () => {
    switch (phase.status) {
      case 'Completed':
        return 'check_circle';
      case 'In Progress':
        return 'autorenew';
      case 'Not Started':
        return 'schedule';
      default:
        return 'info';
    }
  };

  /**
   * Calculates days until deadline
   */
  const getDaysUntilDeadline = () => {
    const deadline = new Date(phase.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysUntilDeadline();

  return (
    <div className="phase-details-section">
      <div className="phase-details-content">
        {/* Header Section */}
        <div className="phase-details-header">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`material-symbols-outlined text-4xl ${
                    phase.status === 'Completed' 
                      ? 'text-green-600 dark:text-green-400' 
                      : phase.status === 'In Progress'
                      ? 'text-brand-blue'
                      : 'text-slate-400'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {phase.icon}
                </span>
                <h3 className="phase-details-title">{phase.name}</h3>
              </div>
              <p className="phase-details-description">{phase.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {canEdit && onEdit && (
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                    aria-label="Delete phase"
                    title="Delete phase details"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span className="text-sm font-medium">Delete phase</span>
                  </button>
              )}
              {canEdit && onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                  aria-label="Edit phase"
                  title="Edit phase details"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span className="text-sm font-medium">Edit Phase</span>
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  aria-label="Close phase details"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Meta Information Grid */}
        <div className="phase-details-meta">
          {/* Deadline */}
          <div className="meta-item">
            <p className="meta-label">
              <span className="material-symbols-outlined text-sm align-middle mr-1">
                event
              </span>
              Deadline
            </p>
            <div className="flex items-baseline gap-2">
              <p className="meta-value meta-deadline">{phase.deadline}</p>
              {phase.status !== 'Completed' && daysRemaining >= 0 && (
                <span className={`text-xs ${
                  daysRemaining <= 3 
                    ? 'text-red-600 dark:text-red-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  ({daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left)
                </span>
              )}
              {daysRemaining < 0 && phase.status !== 'Completed' && (
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  (Overdue)
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="meta-item">
            <p className="meta-label">
              <span className="material-symbols-outlined text-sm align-middle mr-1">
                payments
              </span>
              Price
            </p>
            <p className="meta-value">{phase.price}</p>
          </div>

          {/* Status */}
          <div className="meta-item">
            <p className="meta-label">
              <span className="material-symbols-outlined text-sm align-middle mr-1">
                info
              </span>
              State
            </p>
            <div className={`status-badge ${getStatusBadgeStyle()}`}>
              <span className="material-symbols-outlined status-icon">
                {getStatusIcon()}
              </span>
              <span>{phase.status}</span>
            </div>
          </div>

          {/* Tasks Progress */}
          <div className="meta-item">
            <p className="meta-label">
              <span className="material-symbols-outlined text-sm align-middle mr-1">
                task
              </span>
              Progress
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="meta-value text-base">
                    {completedCount}/{totalCount}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      phase.status === 'Completed'
                        ? 'bg-green-500'
                        : phase.status === 'In Progress'
                        ? 'bg-brand-blue'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deliverable Section (if exists) */}
        {phase.deliverable && (
          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-brand-cyan-border dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-blue text-2xl">
                  description
                </span>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Deliverable
                  </p>
                  <p className="font-semibold text-brand-navy-dark dark:text-white">
                    {phase.deliverable}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => console.log('Download deliverable:', phase.deliverable)}
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        )}

        {/* Todo List Section */}
        {todos.length > 0 && (
          <div className="todos-section">
            <div className="flex items-center justify-between mb-4">
              <h4 className="todos-title">To-do list</h4>
            </div>

            {/* Todo Items List */}
            <ul className="todos-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseDetails;