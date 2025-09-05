import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Printer } from 'lucide-react';

const TodoHeader = ({ 
  onNavigateDate
}) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handlePrintList = () => {
    // Implementation for printing the todo list
    window.print();
    setShowOptionsMenu(false);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex items-center justify-between px-4 h-[60px] bg-transparent border border-neutral-700 rounded-lg mb-4">
      {/* Left side - Date as Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-white">
          {getCurrentDate()}
        </h2>
      </div>

      {/* Right side - Navigation and Options */}
      <div className="flex items-center gap-2">
        {/* Date Navigation */}
        {onNavigateDate && (
          <div className="flex items-center border border-neutral-700 rounded-lg py-1">
            <button
              onClick={() => onNavigateDate('previous')}
              className="w-9 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors border-r border-neutral-700"
              title="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-neutral-400 text-sm font-medium">
              Today
            </span>
            <button
              onClick={() => onNavigateDate('next')}
              className="w-9 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors border-l border-neutral-700"
              title="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="flex items-center justify-center w-9 h-9 border border-neutral-600 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Options Dropdown */}
          {showOptionsMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={handlePrintList}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoHeader;