import React, { useState, useRef, useEffect } from 'react';
import { Check, Star, Trash2, ChevronDown } from 'lucide-react';

const TodoItem = ({ 
  todo, 
  onToggleComplete, 
  onToggleStar, 
  onDelete, 
  onSelect,
  onUpdatePriority 
}) => {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const priorities = [
    { value: 'High', label: 'High', color: 'bg-red-500' },
    { value: 'Medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'Low', label: 'Low', color: 'bg-green-500' },
    { value: 'None', label: 'None', color: 'bg-neutral-500' }
  ];

  const currentPriority = priorities.find(p => p.value === (todo.priority || 'None'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPriorityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (e) => {
    // Don't trigger onSelect if clicking on priority badge area
    if (e.target.closest('.priority-badge')) {
      return;
    }
    onSelect(todo);
  };

  const handlePriorityClick = (e) => {
    e.stopPropagation();
    setShowPriorityDropdown(!showPriorityDropdown);
  };

  const handlePrioritySelect = (priority) => {
    onUpdatePriority(todo.id, priority.value);
    setShowPriorityDropdown(false);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStar(todo.id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleComplete(todo.id);
  };

  return (
    <div
      className="border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors cursor-pointer group"
      onClick={handleItemClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            todo.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-neutral-400 hover:border-white'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {todo.starred && (
                <button onClick={handleStarClick}>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </button>
              )}
              {!todo.starred && (
                <button onClick={handleStarClick} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-4 h-4 text-neutral-400 hover:text-yellow-500" />
                </button>
              )}
              <span className={`text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                {todo.description}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-neutral-400 text-sm">{todo.time}</span>
              
              {/* Priority Badge with Dropdown */}
              <div className="relative priority-badge" ref={dropdownRef}>
                <button
                  onClick={handlePriorityClick}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium text-white transition-colors hover:opacity-80 ${currentPriority.color}`}
                >
                  <span>{currentPriority.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPriorityDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-10 min-w-[100px]">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => handlePrioritySelect(priority)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-neutral-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className={`w-3 h-3 rounded ${priority.color}`}></div>
                        <span>{priority.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleDeleteClick}
                className="text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Steps indicator */}
          {todo.steps && todo.steps.length > 0 && (
            <div className="mt-2 text-sm text-neutral-400">
              <span>Tasks</span>
              <span className="mx-2">•</span>
              <span>{todo.steps.filter(step => step.completed).length} of {todo.steps.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;