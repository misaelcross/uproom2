import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';

const TodoStep = ({ step, onToggleComplete, onDelete, onUpdateDescription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDescriptionClick = () => {
    setIsEditing(true);
    setEditedDescription(step.description);
  };

  const handleSave = () => {
    if (editedDescription.trim() && editedDescription !== step.description) {
      onUpdateDescription(step.id, editedDescription.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDescription('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div className="flex items-center space-x-3 group">
      <button
        onClick={() => onToggleComplete(step.id)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          step.completed
            ? 'bg-neutral-800 border-neutral-600'
            : 'border-neutral-400 hover:border-white'
        }`}
      >
        {step.completed && (
          <Check className="w-2.5 h-2.5 text-white" />
        )}
      </button>
      
      <div className="flex-1 flex items-center space-x-2">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="flex-1 bg-transparent border border-neutral-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button
              onClick={handleCancel}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <button
              onClick={handleSave}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Check className="w-3 h-3" />
            </button>
          </>
        ) : (
          <span
            onClick={handleDescriptionClick}
            className={`text-sm cursor-pointer hover:text-neutral-300 transition-colors ${
              step.completed ? 'line-through text-neutral-500' : 'text-white'
            }`}
          >
            {step.description}
          </span>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={() => onDelete(step.id)}
          className="text-neutral-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default TodoStep;