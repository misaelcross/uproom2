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
        <div className="flex gap-2">
          {selectedGroup.assignedUsers.map((user, index) => (
            <img
              key={user.id}
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full border-2 border-neutral-800 cursor-pointer hover:border-neutral-600 transition-colors"
              title={user.name}
              onMouseEnter={(e) => {
                setHoveredUser(user);
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredUser(null)}
            />
          ))}
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