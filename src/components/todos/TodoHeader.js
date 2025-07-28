import React from 'react';
import { ChevronDown } from 'lucide-react';

const TodoHeader = ({ 
  selectedPeriod, 
  setSelectedPeriod, 
  showPeriodDropdown, 
  setShowPeriodDropdown,
  selectedGroup 
}) => {
  const periodOptions = ['Today', 'Yesterday', 'Last week', 'Last month'];

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
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">
            {selectedGroup ? selectedGroup.name : 'To-dos'}
          </h1>
          <p className="text-neutral-400 text-sm">{getCurrentDate()}</p>
        </div>
        
        {/* Period Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-600 rounded-lg text-white hover:bg-neutral-700 transition-colors"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showPeriodDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 min-w-[150px]">
              {periodOptions.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedPeriod(option);
                    setShowPeriodDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-white hover:bg-neutral-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoHeader;