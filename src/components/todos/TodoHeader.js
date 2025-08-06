import React from 'react';
import { ChevronDown, Clock, Users, Search, Filter } from 'lucide-react';

const TodoHeader = ({ 
  selectedPeriod, 
  setSelectedPeriod, 
  showPeriodDropdown, 
  setShowPeriodDropdown,
  selectedGroup,
  catchUpMode,
  setCatchUpMode,
  missedTodosCount,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters
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
      {/* Catch-Up Mode Banner */}
      {catchUpMode && (
        <div className="mb-4 p-3 bg-amber-900/20 border border-amber-600/30 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Catch-Up Mode</span>
          </div>
          <p className="text-amber-300/80 text-sm mt-1">
            You have {missedTodosCount} missed tasks. Review and reschedule as needed.
          </p>
          <button
            onClick={() => setCatchUpMode(false)}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline"
          >
            Exit Catch-Up Mode
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">
            {catchUpMode ? 'Catch-Up Mode' : (selectedGroup ? selectedGroup.name : 'To-dos')}
          </h1>
          <p className="text-neutral-400 text-sm">{getCurrentDate()}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Catch-Up Mode Toggle */}
          {!catchUpMode && missedTodosCount > 0 && (
            <button
              onClick={() => setCatchUpMode(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-900/20 border border-amber-600/30 rounded-lg text-amber-400 hover:bg-amber-900/30 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">Catch-Up ({missedTodosCount})</span>
            </button>
          )}

          {/* Period Dropdown */}
          {!catchUpMode && (
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
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {!catchUpMode && (
        <div className="mt-4 flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
              showFilters 
                ? 'border-white bg-neutral-700 text-white' 
                : 'border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && !catchUpMode && (
        <div className="mt-3 p-3 bg-neutral-800 border border-neutral-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Priority</label>
              <div className="space-y-1">
                {['High', 'Medium', 'Low'].map(priority => (
                  <label key={priority} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-neutral-600 bg-transparent text-white focus:ring-white" />
                    <span className="text-neutral-300">{priority}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Status</label>
              <div className="space-y-1">
                {['Completed', 'Pending', 'Starred'].map(status => (
                  <label key={status} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-neutral-600 bg-transparent text-white focus:ring-white" />
                    <span className="text-neutral-300">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoHeader;