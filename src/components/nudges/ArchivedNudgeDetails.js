import React, { useState } from 'react';
import { ArrowLeft, Archive, Clock, ChevronDown, ChevronUp, ArchiveRestore } from 'lucide-react';

const ArchivedNudgeDetails = ({ userGroup, onBack, onUnarchive }) => {
  const [expandedNudges, setExpandedNudges] = useState(new Set([userGroup.nudges[0]?.id])); // First nudge expanded by default
  
  const { user, nudges } = userGroup;
  
  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    // If timestamp is already a string in US format, return it as is
    if (typeof timestamp === 'string' && timestamp.includes('/')) {
      return timestamp;
    }
    
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

  // Function to format full date in US format
  const formatFullDate = (timestamp) => {
    // If timestamp is already a string in US format, return it as is
    if (typeof timestamp === 'string' && timestamp.includes('/')) {
      return timestamp;
    }
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Função para expandir/colapsar nudge
  const toggleNudgeExpansion = (nudgeId) => {
    setExpandedNudges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nudgeId)) {
        newSet.delete(nudgeId);
      } else {
        newSet.add(nudgeId);
      }
      return newSet;
    });
  };

  // Função para desarquivar nudge
  const handleUnarchive = (nudge) => {
    if (onUnarchive) {
      onUnarchive(nudge);
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900 border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-neutral-700">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h2 className="text-white font-medium">{user.name}</h2>
            <p className="text-neutral-400 text-sm">{nudges.length} archived nudge{nudges.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Archive className="w-5 h-5 text-neutral-400" />
      </div>

      {/* Lista de nudges */}
      <div className="flex-1 overflow-y-auto">
        {nudges.map((nudge, index) => {
          const isExpanded = expandedNudges.has(nudge.id);
          const isLatest = index === 0;
          
          return (
            <div 
              key={nudge.id} 
              className={`border-b border-neutral-700 ${isLatest ? 'bg-neutral-800/30' : ''}`}
            >
              {isExpanded ? (
                // Nudge expandido (similar ao NudgeDetails original)
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium">{user.name}</h3>
                          <p className="text-neutral-400 text-xs">{user.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400 text-xs">{formatFullDate(nudge.archivedAt)}</span>
                          <button
                            onClick={() => toggleNudgeExpansion(nudge.id)}
                            className="p-1 hover:bg-neutral-700 rounded transition-colors"
                          >
                            <ChevronUp className="w-4 h-4 text-neutral-400" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Complete message */}
                      <div className="bg-neutral-800 rounded-lg p-3 mb-3">
                        <p className="text-white text-sm leading-relaxed">{nudge.message}</p>
                      </div>
                      
                      {/* Attachments if any */}
                      {nudge.attachments && nudge.attachments.length > 0 && (
                        <div className="mb-3">
                          <p className="text-neutral-400 text-xs mb-2">Attachments:</p>
                          <div className="space-y-1">
                            {nudge.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                                <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                                <span>{attachment.name || attachment}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUnarchive(nudge)}
                          className="flex items-center gap-1 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs text-white transition-colors"
                        >
                          <ArchiveRestore className="w-3 h-3" />
                          Unarchive
                        </button>
                        <span className="text-neutral-500 text-xs">
                          Archived on {formatFullDate(nudge.archivedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Nudge compactado (similar ao Gmail)
                <div 
                  className="p-3 hover:bg-neutral-800/50 cursor-pointer transition-colors"
                  onClick={() => toggleNudgeExpansion(nudge.id)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{user.name}</span>
                        <span className="text-neutral-400 text-xs">{formatTimestamp(nudge.archivedAt)}</span>
                      </div>
                      <p className="text-neutral-400 text-sm truncate">{nudge.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Archive className="w-3 h-3 text-neutral-500" />
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArchivedNudgeDetails;