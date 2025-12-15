import { useState, type FormEvent, type FC } from 'react';
import type { Phase, Todo } from '../types/project';

interface EditPhaseModalProps {
  isOpen: boolean;
  phase: Phase | null;
  onClose: () => void;
  onSave: (phase: Phase) => void;
}

import { useEffect } from 'react';
const EditPhaseModal: FC<EditPhaseModalProps> = ({ isOpen, phase, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    price: '',
    deliverable: '',
    status: 'Not Started',
  });
  const [todos, setTodos] = useState<Todo[]>([]);

  // Sync modal state with selected phase when opened or phase changes
  useEffect(() => {
    if (isOpen && phase) {
      setFormData({
        name: phase.name || '',
        description: phase.description || '',
        deadline: phase.deadline || '',
        price: phase.price || '',
        deliverable: phase.deliverable || '',
        status: phase.status || 'Not Started',
      });
      setTodos(phase.todos ? phase.todos.map(todo => ({ ...todo })) : []);
    }
  }, [isOpen, phase]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTodoChange = (index: number, field: 'title' | 'date', value: string) => {
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos];
      updatedTodos[index] = { ...updatedTodos[index], [field]: value };
      return updatedTodos;
    });
  };

  const handleToggleTodo = (index: number) => {
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos];
      updatedTodos[index].completed = !updatedTodos[index].completed;
      return updatedTodos;
    });
  };

  const handleAddTodoField = () => {
    setTodos(prevTodos => [
      ...prevTodos,
      {
        id: Date.now().toString(),
        title: '',
        date: '',
        completed: false,
      },
    ]);
  };

  const handleRemoveTodoField = (index: number) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.filter((_, i) => i !== index);
      return updatedTodos.length === 0
        ? [{ id: Date.now().toString(), title: '', date: '', completed: false }]
        : updatedTodos;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a phase name');
      return;
    }
    const filledTodos = todos.filter(todo => todo.title.trim() !== '');
    if (filledTodos.length === 0) {
      alert('Please add at least one task');
      return;
    }
    if (!phase) return;
    const updatedPhase: Phase = {
      ...phase,
      name: formData.name,
      description: formData.description,
      deadline: formData.deadline,
      price: formData.price,
      deliverable: formData.deliverable || undefined,
      status: formData.status as any,
      tasks: {
        completed: filledTodos.filter(t => t.completed).length,
        total: filledTodos.length,
      },
      todos: filledTodos,
    };
    onSave(updatedPhase);
    onClose();
  };

  if (!isOpen || !phase) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Edit Phase: {phase.name}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phase Name */}
              <div>
                <label htmlFor="phaseName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phase Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="phaseName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., UI Design, Development"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Phase Description */}
              <div>
                <label htmlFor="phaseDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="phaseDescription"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this phase involves..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors resize-none"
                />
              </div>

              {/* Status, Deadline and Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="phaseStatus" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="phaseStatus"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phaseDeadline" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phaseDeadline"
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    placeholder="e.g., Dec 15"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phasePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phasePrice"
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., $2,500"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Deliverable */}
              <div>
                <label htmlFor="phaseDeliverable" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Deliverable
                </label>
                <input
                  id="phaseDeliverable"
                  type="text"
                  value={formData.deliverable}
                  onChange={(e) => handleInputChange('deliverable', e.target.value)}
                  placeholder="e.g., Design Mockups.pdf"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Tasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Tasks <span className="text-red-500">*</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddTodoField}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Add Task
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {todos.map((todo, index) => (
                    <div key={todo.id} className="flex gap-3 items-start bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleToggleTodo(index)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 flex-shrink-0 mt-1"
                        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {todo.completed ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </button>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={todo.title}
                          onChange={(e) => handleTodoChange(index, 'title', e.target.value)}
                          placeholder="Task title..."
                          className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors text-sm ${
                            todo.completed ? 'line-through text-slate-400' : ''
                          }`}
                        />
                        <input
                          type="text"
                          value={todo.date}
                          onChange={(e) => handleTodoChange(index, 'date', e.target.value)}
                          placeholder="Estimated duration (e.g., 5 days, Dec 15)"
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-colors text-sm"
                        />
                      </div>
                      {todos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTodoField(index)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 flex-shrink-0 mt-1"
                          aria-label="Remove task"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPhaseModal;
