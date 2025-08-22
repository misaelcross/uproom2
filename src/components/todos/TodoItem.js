import React, { useState, useRef, useEffect } from 'react';
import { Check, Star, ChevronDown, AlertTriangle, MessageCircle, Clock } from 'lucide-react';

const TodoItem = ({ 
  todo, 
  onToggleComplete, 
  onToggleStar, 
  onDelete, 
  onSelect,
  onUpdatePriority
}) => {

  // Function to clean HTML mentions and return plain text
  const cleanMentionText = (text) => {
    if (!text) return '';
    // Remove HTML tags from mentions like <span class="mention bg-white text-black px-1 py-0.5 rounded text-sm">@John Doe</span>
    return text.replace(/<[^>]*>/g, '');
  };

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const priorities = [
    { value: 'High', label: 'High', text: 'text-red-400', bg: 'bg-red-500/10' },
    { value: 'Medium', label: 'Medium', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { value: 'Low', label: 'Low', text: 'text-green-400', bg: 'bg-green-500/10' },
    { value: 'None', label: 'None', text: 'text-neutral-400', bg: 'bg-neutral-500/10' }
  ];

  const currentPriority = priorities.find(p => p.value === (todo.priority || 'None')) || priorities.find(p => p.value === 'None');

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
      className={`border rounded-lg p-3 sm:p-4 hover:bg-neutral-800 transition-colors cursor-pointer group w-full ${
        todo.missed 
          ? 'border-amber-600/50 bg-amber-900/10' 
          : 'border-neutral-700'
      }`}
      onClick={handleItemClick}
    >
      <div className="flex items-start gap-2 sm:gap-3 w-full">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            todo.completed 
              ? 'bg-white border-white' 
              : `border-gray-400 hover:border-white`
          }`}
        >
          {todo.completed && <Check className="w-2.5 h-2.5 text-black" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {todo.missed && (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span className={`text-white text-sm sm:text-base truncate ${todo.completed ? 'line-through opacity-60' : ''}`}>
                {cleanMentionText(todo.description)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <span className="text-neutral-400 text-xs sm:text-sm hidden sm:block">{todo.time}</span>
              
              {/* Priority Badge with Dropdown - Similar to UserCard status badge */}
              <div className="relative priority-badge" ref={dropdownRef}>
                <button
                  onClick={handlePriorityClick}
                  className={`flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 ${currentPriority.text} ${currentPriority.bg}`}
                >
                  <span className="hidden sm:inline">{currentPriority.label}</span>
                  <span className="sm:hidden">{currentPriority.label.charAt(0)}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPriorityDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-10 min-w-[80px] sm:min-w-[100px]">
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
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Star className={`w-4 h-4 ${todo.starred ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Removed Steps indicator with progress bar - as requested */}
          
          {/* Additional info: Comments, Duration */}
          {(todo.comments?.length > 0 || todo.duration) && (
            <div className="mt-2 flex flex-wrap gap-3 sm:space-y-1 sm:block">
              {/* Comments */}
              {todo.comments && todo.comments.length > 0 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  {/* Last commenter's avatar */}
                  <img 
                    src={todo.comments[todo.comments.length - 1].author.avatar} 
                    alt={todo.comments[todo.comments.length - 1].author.name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />
                  {/* Number of comments in bold white */}
                  <span className="font-bold text-white">
                    {todo.comments.length} comment{todo.comments.length !== 1 ? 's' : ''}
                  </span>
                  {/* Last comment date */}
                  <span className="text-neutral-400">
                    {new Date(todo.comments[todo.comments.length - 1].createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {/* Duration */}
              {todo.duration && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">{todo.duration.start} - {todo.duration.end}</span>
                  <span className="sm:hidden truncate max-w-[60px]">{todo.duration.start}</span>
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