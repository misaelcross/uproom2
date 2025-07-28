import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Star, Plus, Trash2, X, Check } from 'lucide-react';
import TodoStep from './TodoStep';

const TodoDetails = ({ 
  todo, 
  onBack, 
  onToggleComplete, 
  onToggleStar, 
  onAddStep, 
  onDeleteStep, 
  onToggleStepComplete,
  onUpdateNotes,
  onDeleteTodo,
  onUpdateTodoDescription,
  onUpdateStepDescription 
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  if (!todo) return null;

  const completedSteps = todo.steps?.filter(step => step.completed).length || 0;
  const totalSteps = todo.steps?.length || 0;

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(todo.description);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== todo.description) {
      onUpdateTodoDescription(todo.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleTitleBlur = () => {
    handleTitleSave();
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTodo(todo.id);
    setShowDeleteModal(false);
    onBack();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <button
          onClick={onBack}
          className="flex items-center text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Todo Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleComplete(todo.id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-white border-white'
                : 'border-neutral-400 hover:border-white'
            }`}
          >
            {todo.completed && (
              <Check className="w-3 h-3 text-black" />
            )}
          </button>
          
          <div className="flex-1 flex items-center space-x-2">
            {isEditingTitle ? (
              <>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  className="flex-1 bg-transparent border border-neutral-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <button
                  onClick={handleTitleCancel}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleTitleSave}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </>
            ) : (
              <h2
                onClick={handleTitleClick}
                className={`text-xl font-medium cursor-pointer hover:text-neutral-300 transition-colors ${
                  todo.completed ? 'line-through text-neutral-500' : 'text-white'
                }`}
              >
                {todo.description}
              </h2>
            )}
          </div>

          {!isEditingTitle && (
            <button
              onClick={() => onToggleStar(todo.id)}
              className={`transition-colors ${
                todo.starred ? 'text-yellow-400' : 'text-neutral-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${todo.starred ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Steps Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Steps</h3>
            <span className="text-sm text-neutral-400">
              Tasks: {completedSteps} of {totalSteps}
            </span>
          </div>

          <div className="space-y-2">
            {todo.steps?.map((step) => (
              <TodoStep
                key={step.id}
                step={step}
                onToggleComplete={onToggleStepComplete}
                onDelete={onDeleteStep}
                onUpdateDescription={onUpdateStepDescription}
              />
            ))}
          </div>

          <button
            onClick={onAddStep}
            className="flex items-center text-neutral-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add step
          </button>
        </div>

        {/* Additional Sections */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Reminders</h4>
            <button className="text-sm text-neutral-400 hover:text-white transition-colors">
              + Add reminder
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Time</h4>
            <button className="text-sm text-neutral-400 hover:text-white transition-colors">
              + Add time
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Repeat</h4>
            <button className="text-sm text-neutral-400 hover:text-white transition-colors">
              + Add repeat
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Notes</h4>
            <textarea
              value={todo.notes || ''}
              onChange={(e) => onUpdateNotes(todo.id, e.target.value)}
              placeholder="Add notes..."
              className="w-full h-24 bg-transparent border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-700">
        <button
          onClick={handleDeleteClick}
          className="flex items-center text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete to-do
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Delete To-do</h3>
            <p className="text-neutral-400 mb-6">
              Are you sure you want to delete "{todo.description}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-neutral-600 rounded-lg text-white hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoDetails;