import React, { useState, useRef, useEffect } from 'react';
import { Check, Star, ChevronDown, AlertTriangle, MessageCircle, Users, Clock } from 'lucide-react';

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
    { value: 'High', label: 'High', text: 'text-red-400', bg: 'bg-red-500/10' },
    { value: 'Medium', label: 'Medium', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { value: 'Low', label: 'Low', text: 'text-green-400', bg: 'bg-green-500/10' },
    { value: 'None', label: 'None', text: 'text-neutral-400', bg: 'bg-neutral-500/10' }
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

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleComplete(todo.id);
  };

  return (
    <div
      className={`border rounded-lg p-4 hover:bg-neutral-800 transition-colors cursor-pointer group ${
        todo.missed 
          ? 'border-amber-600/50 bg-amber-900/10' 
          : 'border-neutral-700'
      }`}
      onClick={handleItemClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            todo.completed 
              ? 'bg-white border-white' 
              : 'border-neutral-400 hover:border-white'
          }`}
        >
          {todo.completed && <Check className="w-2.5 h-2.5 text-black" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {todo.missed && (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span className={`text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                {todo.description}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-neutral-400 text-sm">{todo.time}</span>
              
              {/* Priority Badge with Dropdown - Similar to UserCard status badge */}
              <div className="relative priority-badge" ref={dropdownRef}>
                <button
                  onClick={handlePriorityClick}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 ${currentPriority.text} ${currentPriority.bg}`}
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
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-neutral-800 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className={`w-3 h-3 rounded ${priority.text} ${priority.bg}`}></div>
                        <span>{priority.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              


              {/* Star Icon */}
              <button
                onClick={handleStarClick}
                className={`transition-colors ${
                  todo.starred 
                    ? 'text-white' 
                    : 'text-neutral-600 hover:text-white'
                }`}
              >
                <Star className={`w-4 h-4 ${todo.starred ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Removed Steps indicator with progress bar - as requested */}
          
          {/* Additional info: Comments, Assignees, Duration */}
          {(todo.comments?.length > 0 || todo.assignees?.length > 0 || todo.duration) && (
            <div className="mt-2 space-y-1">
              {/* Comments */}
              {todo.comments && todo.comments.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-neutral-400">
                  <MessageCircle className="w-3 h-3" />
                  <span>{todo.comments.length} comment{todo.comments.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {/* Assignees */}
              {todo.assignees && todo.assignees.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Users className="w-3 h-3" />
                  <div className="flex items-center gap-1">
                    {todo.assignees.slice(0, 3).map((assignee, index) => (
                      <img 
                        key={assignee.id}
                        src={assignee.avatar} 
                        alt={assignee.name}
                        className="w-5 h-5 rounded-full border border-neutral-600"
                        title={assignee.name}
                      />
                    ))}
                    {todo.assignees.length > 3 && (
                      <span className="text-xs">+{todo.assignees.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Duration */}
              {todo.duration && (
                <div className="flex items-center gap-1 text-sm text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>{todo.duration.start} - {todo.duration.end}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;