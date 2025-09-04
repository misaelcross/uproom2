import React, { useState, useEffect, useRef } from 'react';
import { 
  Search,
  Filter,
  Users,
  Check,
  ChevronDown,
  Folder,
  FolderPlus
} from 'lucide-react';

const ActionBarTodos = ({ searchQuery, setSearchQuery, onCreateGroup, selectedPeriod, setSelectedPeriod, showPeriodDropdown, setShowPeriodDropdown }) => {
  const periodDropdownRef = useRef(null);

  // Opções de período
  const periodOptions = [
    'Day',
    'Week',
    'Month'
  ];

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
        setShowPeriodDropdown(false);
      }
    };

    if (showPeriodDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPeriodDropdown, setShowPeriodDropdown]);

  return (
    <div className="w-fit min-w-0 rounded-lg h-20 p-4 flex items-center space-x-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
      </div>



      {/* Create Group Button */}
      <button 
        onClick={onCreateGroup}
        className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors"
      >
        <FolderPlus className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-medium">Create folder</span>
      </button>
    </div>
  );
};

export default ActionBarTodos;