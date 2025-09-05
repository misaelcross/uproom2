import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pin, PinOff, Eye, CheckCircle2, Flag, EyeOff, Archive, Plus } from 'lucide-react';
import FloatingUserCard from '../shared/FloatingUserCard';
import AvatarStack from '../shared/AvatarStack';
import { usersData } from '../../data/usersData';
import { getStatusColors, formatMentionName } from '../../utils/mentionUtils';

const NudgeCard = ({ nudge, isSelected, onClick, onCreateTodo, onMarkComplete, onReply, onSnooze, onArchive, onMarkUnread, onPinNudge, onMarkResolved, onMarkPriority, onMarkRead, onCreateNudge }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-green-500';
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
  const renderTextWithMentions = (text, isPreview = false) => {
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
        if (isPreview) {
          // Para preview, apenas texto simples formatado
          parts.push(`@${formatMentionName(user.name)}`);
        } else {
          // Para visualização completa, com cores e interações
          const colors = getStatusColors(user.availability);
          parts.push(
            <span
              key={match.index}
              className={`inline-block px-2 py-1 rounded font-semibold text-xs cursor-pointer transition-colors hover:opacity-80 ${colors.text} ${colors.bg}`}
              onMouseEnter={(e) => handleUserMentionHover(user, e)}
              onMouseLeave={handleUserMentionLeave}
            >
              @{formatMentionName(user.name)}
            </span>
          );
        }
      } else {
        if (isPreview) {
          parts.push(`@${mentionName}`);
        } else {
          parts.push(
            <span key={match.index} className="inline-block px-2 py-1 rounded bg-gray-500/10 text-gray-400 font-semibold text-xs">
              @{mentionName}
            </span>
          );
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };



  // Truncar mensagem para 2 linhas
  const truncateMessage = (text, maxLines = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 8; // Aproximadamente 8 palavras por linha
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Define colors based on priority
  const getPriorityHoverColors = () => {
    if (nudge.isHighPriority || nudge.priority === 'high') {
      return nudge.isRead 
        ? 'bg-transparent border border-neutral-800 hover:bg-red-500/10 hover:border-red-500/20'
        : 'bg-neutral-800 border border-neutral-600 hover:bg-red-500/10 hover:border-red-500/20';
    } else if (nudge.priority === 'medium') {
      return nudge.isRead 
        ? 'bg-transparent border border-neutral-800 hover:bg-orange-500/10 hover:border-orange-500/20'
        : 'bg-neutral-800 border border-neutral-600 hover:bg-red-500/10 hover:border-red-500/20';
    } else {
      return nudge.isRead 
        ? 'bg-transparent border border-neutral-800 hover:bg-neutral-800/50 hover:border-neutral-700'
        : 'bg-neutral-800 border border-neutral-600 hover:bg-red-500/10 hover:border-red-500/20';
    }
  };

  const handleCardClick = () => {
    // Mark as read if unread, but don't cause layout shifts
    if (!nudge.isRead && onMarkRead) {
      onMarkRead(nudge.id);
    }
    // Call the original onClick handler
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`cursor-pointer transition-all duration-200 rounded-lg p-4 group ${
        isSelected 
          ? 'border border-white' 
          : getPriorityHoverColors()
      }`}
      onClick={handleCardClick}
    >
      {/* Header com avatar, nome, cargo e menu */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <img 
            src={nudge.senderAvatar} 
            alt={`${nudge.senderName} Profile`} 
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor('online')} rounded-full border-2 border-neutral-900`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-base">{nudge.senderName}</h3>
          <div className="flex items-center gap-2">
            <p className="text-neutral-400 text-sm truncate">{nudge.senderTitle}</p>
            <span className="text-neutral-400 text-sm whitespace-nowrap">• {nudge.timestamp}</span>
          </div>
        </div>
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          {/* Avatar Stack for announcement nudges */}
          {nudge.isAnnouncement && nudge.recipients && nudge.recipients.length > 0 && (
            <AvatarStack 
              users={nudge.recipients}
              maxVisible={3}
              size="xs"
              showStatus={false}
              className="mr-1"
            />
          )}
          
          {/* Pin icon when pinned */}
          {nudge.isPinned && (
            <Pin className="w-4 h-4 text-white fill-white" />
          )}
          <button
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <MoreVertical className="w-4 h-4 text-neutral-400" />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-8 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {!nudge.isRead ? (
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      if (onMarkRead) {
                        onMarkRead(nudge.id);
                      }
                    }}
                  >
                    <EyeOff className="w-4 h-4" />
                    Mark as read
                  </button>
                ) : (
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      if (onMarkUnread) {
                        onMarkUnread(nudge.id);
                      }
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Mark as unread
                  </button>
                )}
                <button
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    if (onPinNudge) {
                      onPinNudge(nudge.id);
                    }
                  }}
                >
                  {nudge.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {nudge.isPinned ? 'Remove pin' : 'Pin nudge'}
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    if (onMarkPriority) {
                      onMarkPriority(nudge.id);
                    }
                  }}
                >
                  <Flag className="w-4 h-4" />
                  {nudge.isHighPriority ? 'Remove priority' : 'Mark as priority'}
                </button>
                {!nudge.isRead && (
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      if (onMarkResolved) {
                        onMarkResolved(nudge.id);
                      }
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as resolved
                  </button>
                )}
                <button
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    if (onArchive) {
                      onArchive(nudge.id);
                    }
                  }}
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    if (onCreateNudge) {
                      onCreateNudge({
                        name: nudge.senderName,
                        avatar: nudge.senderAvatar
                      });
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create Nudge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mensagem com notificação - truncada em 2 linhas */}
      <div className="mb-3 flex items-start justify-between gap-3">
        {/* Message - takes available width */}
        <div className="flex-1 min-w-0">
          <p 
            className="text-neutral-300 text-sm leading-relaxed line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
          >
            {renderTextWithMentions(truncateMessage(nudge.message || nudge.fullMessage), true)}
          </p>
        </div>
        
        {/* Notification Badge - Always on the right */}
        {!nudge.isRead && (
          <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-[4px] flex items-center justify-center">
            <span className="text-white text-xs font-bold leading-none">1</span>
          </div>
        )}
      </div>

      {/* High priority badge */}
      {nudge.isHighPriority && (
        <div className="flex justify-start">
          <div className="px-2 py-1 rounded text-xs font-medium text-red-400 bg-red-500/10">
            High priority
          </div>
        </div>
      )}

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

export default NudgeCard;