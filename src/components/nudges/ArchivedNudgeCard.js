import React from 'react';
import { Archive, Clock } from 'lucide-react';

const ArchivedNudgeCard = ({ userGroup, onClick, isSelected }) => {
  const { user, nudges, totalCount, lastArchivedAt } = userGroup;
  
  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  return (
    <div 
      className={`bg-transparent border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-neutral-800/50 hover:border-neutral-600 ${
        isSelected 
          ? 'border-neutral-500 bg-neutral-800/30' 
          : 'border-neutral-700'
      }`}
      onClick={onClick}
    >
      {/* Header with avatar, name and archive icon */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={`${user.name} Profile`} 
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gray-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-base">{user.name}</h3>
          <p className="text-neutral-400 text-sm truncate">{user.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400 text-xs">{formatTimestamp(lastArchivedAt)}</span>
        </div>
      </div>

      {/* Archived nudges counter */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-sm font-medium">
            {totalCount} archived nudge{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Preview of last archived nudge */}
        {nudges.length > 0 && (
          <p className="text-neutral-400 text-sm truncate">
            {nudges[0].message}
          </p>
        )}
      </div>

      {/* Archived status badge */}
      <div className="flex items-center gap-2">
        <div className="px-2 py-1 rounded text-xs font-medium text-gray-400 bg-gray-500/10">
          <span>Archived</span>
        </div>
        
        {/* Last archived timestamp */}
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="w-3 h-3" />
          <span>Last: {formatTimestamp(lastArchivedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ArchivedNudgeCard;