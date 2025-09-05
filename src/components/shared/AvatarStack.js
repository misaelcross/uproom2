import React, { useState } from 'react';
import { getStatusColors } from '../../utils/mentionUtils';
import FloatingUserCard from './FloatingUserCard';

const AvatarStack = ({ 
  users = [], 
  maxVisible = 3, 
  size = 'sm', 
  showStatus = true, 
  onClick = null,
  className = '' 
}) => {
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return {
          avatar: 'w-6 h-6',
          status: 'w-2 h-2 -bottom-0.5 -right-0.5 border',
          counter: 'w-6 h-6 text-xs',
          spacing: '-ml-2'
        };
      case 'sm':
        return {
          avatar: 'w-8 h-8',
          status: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 border-2',
          counter: 'w-8 h-8 text-xs',
          spacing: '-ml-2'
        };
      case 'md':
        return {
          avatar: 'w-10 h-10',
          status: 'w-3 h-3 -bottom-0.5 -right-0.5 border-2',
          counter: 'w-10 h-10 text-sm',
          spacing: '-ml-3'
        };
      default:
        return {
          avatar: 'w-8 h-8',
          status: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 border-2',
          counter: 'w-8 h-8 text-xs',
          spacing: '-ml-2'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const handleMouseEnter = (user, event) => {
    setHoveredUser(user);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(users);
    }
  };

  const getStatusDotColor = (status) => {
    const colors = getStatusColors(status);
    return colors.dot;
  };

  return (
    <>
      <div 
        className={`flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={handleClick}
      >
        {visibleUsers.map((user, index) => (
          <div
            key={user.id || index}
            className={`relative ${index > 0 ? sizeClasses.spacing : ''}`}
            onMouseEnter={(e) => handleMouseEnter(user, e)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className={`${sizeClasses.avatar} rounded-full object-cover border-2 border-neutral-900`}
            />
            {showStatus && user.status && (
              <div 
                className={`absolute ${sizeClasses.status} ${getStatusDotColor(user.status)} rounded-full border-neutral-900`}
              />
            )}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div
            className={`${sizeClasses.counter} ${sizeClasses.spacing} bg-neutral-700 border-2 border-neutral-900 rounded-full flex items-center justify-center`}
          >
            <span className="text-neutral-300 font-medium">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>

      {/* Floating User Card */}
      {hoveredUser && (
        <FloatingUserCard
          user={hoveredUser}
          position={mousePosition}
          isVisible={!!hoveredUser}
          onClose={() => setHoveredUser(null)}
        />
      )}
    </>
  );
};

export default AvatarStack;