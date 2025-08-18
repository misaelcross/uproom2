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
    <div className="border-b border-neutral-700 pb-6 mb-6">
      <div className="flex items-center justify-between">
<<<<<<< HEAD
        {/* Title and Date */}
        <div className="flex flex-col">
          <h1 className="text-white text-2xl font-bold mb-1">
            To-dos
          </h1>
          <p className="text-neutral-400 text-sm">
            {getCurrentDate()}
          </p>
        </div>

        {/* Navigation and Options */}
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

            {showOptionsMenu && (
              <div className="absolute top-full right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={handlePrintList}
                  className="w-full text-left px-3 py-2 text-white hover:bg-neutral-700 transition-colors rounded-lg flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print List</span>
                </button>
              </div>
            )}
          </div>
=======
        {/* Date Title with Navigation Arrows */}
        <div className="flex items-center gap-2">
                    <h1 className="text-white text-2xl font-bold">
            {getCurrentDate()}
          </h1>
          {onNavigateDate && (
            <button
              onClick={() => onNavigateDate('previous')}
              className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"


              title="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNavigateDate && (
            <button
              onClick={() => onNavigateDate('next')}
              className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"

              title="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="flex items-center justify-center w-9 h-9 border border-neutral-600 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showOptionsMenu && (
            <div className="absolute top-full right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 min-w-[160px]">
              <button
                onClick={handlePrintList}
                className="w-full text-left px-3 py-2 text-white hover:bg-neutral-700 transition-colors rounded-lg flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print List</span>
              </button>
            </div>
          )}
>>>>>>> 7229304f488fcda1c0fb0b597420c525c19d4448
        </div>
      </div>
    </div>
  );
};

export default TodoHeader;