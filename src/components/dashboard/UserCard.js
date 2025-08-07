import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';

const UserCard = ({ user, onClick, isInGroup = false, onRemoveFromGroup }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const getStatusColor = (availability) => {
    switch (availability) {
      case 'Available': return { text: 'text-green-400', bg: 'bg-green-500/10' };
      case 'In meeting': return { text: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'Out for Lunch': return { text: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'Focus': return { text: 'text-purple-400', bg: 'bg-purple-500/10' };
      case 'Emergency': return { text: 'text-red-400', bg: 'bg-red-500/10' };
      case 'Away': return { text: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'Offline': return { text: 'text-gray-400', bg: 'bg-gray-500/10' };
      default: return { text: 'text-green-400', bg: 'bg-green-500/10' };
    }
  };

  const getStatusDotColor = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-green-500';
      case 'In meeting': return 'bg-blue-500';
      case 'Out for Lunch': return 'bg-yellow-500';
      case 'Focus': return 'bg-purple-500';
      case 'Emergency': return 'bg-red-500';
      case 'Away': return 'bg-orange-500';
      case 'Offline': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  // Usar ícones pré-gerados do usuário
  const getUserIcons = () => {
    return user.randomIcons || [];
  };

  const handleEllipsesClick = (e) => {
    e.stopPropagation(); // Previne que o clique no card seja acionado
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option, e) => {
    e.stopPropagation();
    if (option === 'Remove from Group' && onRemoveFromGroup) {
      onRemoveFromGroup();
    } else {
      console.log(`${option} clicked for ${user.name}`);
    }
    setDropdownOpen(false);
  };

  const dropdownOptions = isInGroup ? [
    'Remove from Group',
    'Send Nudge',
    'Set Reminder',
    'Ask to Collaborate',
    'Request to Join Meeting'
  ] : [
    'Send Nudge',
    'Set Reminder',
    'Ask to Collaborate',
    'Request to Join Meeting',
    'Add to a Group'
  ];

  return (
    <div 
      className="bg-transparent border border-neutral-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-neutral-800/50 hover:border-neutral-700 relative"
      onClick={onClick}
    >
      {/* Header com avatar, nome, cargo e menu */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={`${user.name} Profile`} 
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusDotColor(user.availability)} rounded-full border-2 border-gray-900`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-base">{user.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-neutral-400 text-sm truncate">{user.title}</p>
            <span className="text-neutral-400 text-sm whitespace-nowrap">• 2h</span>
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleEllipsesClick}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-neutral-400" />
          </button>
          
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[180px]">
              <div className="py-1">
                {dropdownOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleOptionClick(option, e)}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Atividade atual - truncada em 1 linha */}
      <div className="mb-3">
        {user.currentWork ? (
          <div>
            <p className="text-neutral-400 text-xs mb-1">Currently working on:</p>
            <p className="text-white text-sm truncate">{user.currentWork}</p>
          </div>
        ) : (
          <p className="text-white text-sm truncate">{user.bio}</p>
        )}
      </div>

      {/* Badge de status */}
      <div className="flex items-center gap-2">
        <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.availability).text} ${getStatusColor(user.availability).bg}`}>
          <span>{user.availability}</span>
        </div>
        {/* Ícones dos apps */}
        {(() => {
          const icons = getUserIcons();
          if (icons.length === 0) return null;
          
          const visibleIcons = icons.slice(0, 2);
          const remainingCount = icons.length - 2;
          
          return (
            <div className="flex items-center gap-1">
              {visibleIcons.map((iconUrl, index) => (
                <img 
                  key={index}
                  src={iconUrl} 
                  alt="App icon" 
                  className="w-5 h-5 object-contain"
                />
              ))}
              {remainingCount > 0 && (
                <span className="text-neutral-400 text-xs font-medium">
                  +{remainingCount}
                </span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default UserCard;