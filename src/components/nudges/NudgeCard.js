import React from 'react';
import { MoreVertical } from 'lucide-react';

const NudgeCard = ({ nudge, isSelected, onClick }) => {
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-500', text: 'High' };
      case 'normal':
        return { color: 'text-blue-500', text: 'Normal' };
      case 'low':
        return { color: 'text-gray-500', text: 'Low' };
      default:
        return { color: 'text-blue-500', text: 'Normal' };
    }
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

  return (
    <div 
      className={`cursor-pointer transition-all duration-200 rounded-lg p-4 ${
        isSelected 
          ? 'border border-white' 
          : nudge.isRead 
            ? 'bg-transparent border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-800'
            : 'bg-neutral-800 border border-neutral-600 hover:bg-neutral-600 hover:border-neutral-500'
      }`}
      onClick={onClick}
    >
      {/* Header com avatar, nome, cargo e menu */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <img 
            src={nudge.sender.avatar} 
            alt={`${nudge.sender.name} Profile`} 
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusDotColor(nudge.sender.status)} rounded-full border-2 border-gray-900`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-base">{nudge.sender.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-neutral-400 text-sm truncate">{nudge.sender.title}</p>
            <span className="text-neutral-400 text-sm whitespace-nowrap">• {nudge.timestamp}</span>
          </div>
        </div>
        <div className="relative">
          <button
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Mensagem - truncada em 2 linhas */}
      <div className="mb-3">
        <p className="text-white text-sm leading-relaxed">
          {truncateMessage(nudge.message, 2)}
        </p>
      </div>

      {/* Badge de prioridade e notificação */}
      <div className="flex items-center gap-2">
        <div className={`border border-neutral-700 rounded px-2 pb-1 ${getPriorityBadge(nudge.priority).color}`}>
          <span className="text-xs font-medium">{getPriorityBadge(nudge.priority).text}</span>
        </div>
        {!nudge.isRead && (
          <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold leading-none">1</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NudgeCard;