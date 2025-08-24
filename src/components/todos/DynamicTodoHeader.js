import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import FloatingUserCard from '../shared/FloatingUserCard';

const DynamicTodoHeader = ({ selectedGroup, onBack }) => {
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Don't render if no group is selected
  if (!selectedGroup) {
    return null;
  }

  return (
    <>
    <div className="flex items-center justify-between px-4 h-[60px] bg-neutral-800 border border-neutral-700 rounded-lg mb-4">
      {/* Left side - Back button and Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {selectedGroup.name}
        </h2>
      </div>

      {/* Right side - People avatars */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {selectedGroup.assignedUsers.map((user, index) => {
            const getStatusDotColor = (availability) => {
              switch (availability) {
                case 'Available': return 'bg-green-500';
                case 'In meeting': return 'bg-blue-500';
                case 'Break': return 'bg-yellow-500';
                case 'Focus': return 'bg-purple-500';
                case 'Emergency': return 'bg-red-500';
                case 'Away': return 'bg-orange-500';
                case 'Offline': return 'bg-gray-500';
                default: return 'bg-green-500';
              }
            };

            return (
              <div key={user.id} className="relative" style={{ zIndex: index + 1 }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-neutral-800 cursor-pointer hover:border-neutral-200 transition-colors"
                  style={{ 
                    boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.35)'
                  }}
                  title={user.name}
                  onMouseEnter={(e) => {
                    setHoveredUser(user);
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredUser(null)}
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor(user.availability)} rounded-full border-2 border-neutral-900`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Floating User Card */}
    <FloatingUserCard 
      user={hoveredUser}
      position={mousePosition}
      isVisible={!!hoveredUser}
    />
    </>
  );
};

export default DynamicTodoHeader;