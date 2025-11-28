// src/pages/project_progress/components/TodoItem.tsx
import { useState, type KeyboardEvent, type FC } from 'react';
import type { Todo } from '../types/project';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newTitle: string, newDate: string) => void;
}

const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDate, setEditDate] = useState(todo.date);
  const [showMenu, setShowMenu] = useState(false);

  /**
   * Handles saving the edited todo
   */
  const handleSaveEdit = () => {
    if (editTitle.trim() === '') return;
    if (onEdit) {
      onEdit(todo.id, editTitle, editDate);
    }
    setIsEditing(false);
  };

  /**
   * Handles canceling the edit
   */
  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDate(todo.date);
    setIsEditing(false);
  };

  /**
   * Handles key press in edit mode
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li className="todo-item group">
      {!isEditing ? (
        <>
          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`todo-checkbox ${todo.completed ? 'checked' : ''} hover:scale-110 transition-transform`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <span className="material-symbols-outlined">
              {todo.completed ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </button>

          {/* Todo Title */}
          <p className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </p>

          {/* Due Date */}
          <span className="todo-date flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">event</span>
            {todo.date}
          </span>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="todo-menu"
              aria-label="More options"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                
                <div className="absolute right-0 top-8 z-20 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onToggle(todo.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-base">
                      {todo.completed ? 'check_box_outline_blank' : 'check_box'}
                    </span>
                    {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <hr className="my-1 border-slate-200 dark:border-slate-600" />
                  <button
                    onClick={() => {
                      onDelete(todo.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Edit Mode */}
          <span className="material-symbols-outlined text-slate-400 flex-shrink-0">
            edit
          </span>

          <div className="flex-1 flex gap-2 items-center">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border border-brand-blue rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Task title..."
              autoFocus
            />
            <input
              type="text"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Date"
            />
          </div>

          {/* Edit Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleSaveEdit}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded text-green-600 dark:text-green-400 transition-colors"
              aria-label="Save changes"
            >
              <span className="material-symbols-outlined text-lg">check</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors"
              aria-label="Cancel editing"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;