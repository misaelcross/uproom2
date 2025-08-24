import React, { useState, useEffect, useRef } from 'react';
import { 
  Search,
  Filter,
  Calendar,
  Check,
  ChevronDown,
  UserPlus
} from 'lucide-react';

const ActionBarSchedule = ({ searchTerm, setSearchTerm, onScheduleMeet, timeFrame = 'Day', onTimeFrameChange }) => {
  const [timeFrameDropdownOpen, setTimeFrameDropdownOpen] = useState(false);
  const timeFrameDropdownRef = useRef(null);

  // Opções de time frame para schedule
  const timeFrameOptions = [
    'Day',
    'Week',
    'Month'
  ];

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeFrameDropdownRef.current && !timeFrameDropdownRef.current.contains(event.target)) {
        setTimeFrameDropdownOpen(false);
      }
    };

    if (timeFrameDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [timeFrameDropdownOpen]);

  const handleTimeFrameClick = () => {
    setTimeFrameDropdownOpen(!timeFrameDropdownOpen);
  };

  const handleTimeFrameSelect = (option) => {
    setTimeFrameDropdownOpen(false);
    if (onTimeFrameChange) {
      onTimeFrameChange(option);
    }
  };

  return (
    <div className="w-fit min-w-0 rounded-lg h-20 p-4 flex items-center space-x-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
      </div>

      {/* Time Frame Button with Dropdown */}
      <div className="relative" ref={timeFrameDropdownRef}>
        <button 
          onClick={handleTimeFrameClick}
          className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors"
        >
          <Filter className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-medium">{timeFrame}</span>
          <ChevronDown className="h-4 w-4 text-white" />
        </button>
        
        {/* Dropdown Menu */}
        {timeFrameDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[120px]">
            <div className="py-1">
              {timeFrameOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeFrameSelect(option)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    timeFrame === option 
                      ? 'bg-neutral-700 text-white' 
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <span>{option}</span>
                  {timeFrame === option && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collaborate Button */}
      <button 
        onClick={onScheduleMeet}
        className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors"
      >
        <UserPlus className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-medium">Collaborate</span>
      </button>
    </div>
  );
};

export default ActionBarSchedule;