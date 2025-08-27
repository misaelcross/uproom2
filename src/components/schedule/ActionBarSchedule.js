import React from 'react';
import { 
  Search,
  UserPlus
} from 'lucide-react';

const ActionBarSchedule = ({ searchTerm, setSearchTerm, onScheduleMeet }) => {

  return (
    <div className="w-fit min-w-0 rounded-lg h-20 p-4 flex items-center space-x-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
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