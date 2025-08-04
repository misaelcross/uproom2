import React from 'react';

const FloatingUserCard = ({ user, position, isVisible }) => {
  if (!user || !isVisible) return null;

  // Calcular posição para evitar que saia da tela
  const cardWidth = 300;
  const cardHeight = 200; // altura aproximada do card
  const margin = 10;
  
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - cardWidth - margin),
    y: position.y + margin
  };
  
  // Se o card sair da parte inferior da tela, mostrar acima do cursor
  if (adjustedPosition.y + cardHeight > window.innerHeight) {
    adjustedPosition.y = position.y - cardHeight - margin;
  }

  const getStatusColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-500';
      case 'In meeting': return 'text-blue-500';
      case 'Out for Lunch': return 'text-yellow-500';
      case 'Focus': return 'text-purple-500';
      case 'Emergency': return 'text-red-500';
      case 'Away': return 'text-orange-500';
      case 'Offline': return 'text-gray-500';
      default: return 'text-green-500';
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

  return (
    <div 
      className="fixed z-50 bg-neutral-900 border border-neutral-700 rounded-lg p-4 shadow-2xl transition-all duration-200 pointer-events-none"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        width: '300px'
      }}
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
        <div className="flex-1">
          <h3 className="text-white font-medium text-base">{user.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-neutral-400 text-sm">{user.title}</p>
            <span className="text-neutral-400 text-sm">• 2h</span>
          </div>
        </div>
      </div>

      {/* Atividade atual - truncada em 1 linha */}
      <div className="mb-3">
        <p className="text-white text-sm truncate">{user.bio}</p>
      </div>

      {/* Badge de status */}
      <div className="flex items-center gap-2">
        <div className={`border border-neutral-700 rounded px-2 pb-1 ${getStatusColor(user.availability)}`}>
          <span className="text-xs font-medium">{user.availability}</span>
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

export default FloatingUserCard;