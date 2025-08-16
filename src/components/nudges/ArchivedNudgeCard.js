import React, { useState } from 'react';
import { Archive, Clock } from 'lucide-react';
import FloatingUserCard from '../shared/FloatingUserCard';
import { usersData } from '../../data/usersData';

const ArchivedNudgeCard = ({ userGroup, onClick, isSelected }) => {
  const { user, nudges, totalCount, lastArchivedAt } = userGroup;
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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

  const getStatusTextColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-400';
      case 'In meeting': return 'text-blue-400';
      case 'Break': return 'text-yellow-400';
      case 'Focus': return 'text-purple-400';
      case 'Emergency': return 'text-red-400';
      case 'Away': return 'text-orange-400';
      case 'Offline': return 'text-gray-400';
      default: return 'text-green-400';
    }
  };

  const handleUserMentionHover = (user, event) => {
    setHoveredUser(user);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleUserMentionLeave = () => {
    setHoveredUser(null);
  };

  // Função para renderizar texto com menções de usuário coloridas por status
  const renderTextWithMentions = (text) => {
    // Regex para encontrar menções @username
    const mentionRegex = /@([\w\s]+?)(?=\s|$|[.,!?])/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Adicionar texto antes da menção
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const mentionName = match[1].trim();
      const user = usersData.find(u => 
        u.name.toLowerCase().includes(mentionName.toLowerCase()) ||
        mentionName.toLowerCase().includes(u.name.toLowerCase())
      );
      
      if (user) {
        parts.push(
          <span
            key={match.index}
            className={`font-semibold cursor-pointer transition-colors hover:opacity-80 ${getStatusTextColor(user.availability)}`}
            onMouseEnter={(e) => handleUserMentionHover(user, e)}
            onMouseLeave={handleUserMentionLeave}
          >
            @{mentionName}
          </span>
        );
      } else {
        parts.push(
          <span key={match.index} className="font-semibold text-white">
            @{mentionName}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
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
            {renderTextWithMentions(nudges[0].message)}
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

      {/* FloatingUserCard */}
      {hoveredUser && (
        <FloatingUserCard
          user={hoveredUser}
          position={mousePosition}
          onClose={() => setHoveredUser(null)}
        />
      )}
    </div>
  );
};

export default ArchivedNudgeCard;