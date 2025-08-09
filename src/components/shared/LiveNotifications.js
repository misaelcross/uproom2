import React, { useState, useEffect } from 'react';
import FloatingUserCard from './FloatingUserCard';

const LiveNotifications = ({ usersData, onUserClick }) => {
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      userId: 3, // Sarah Johnson
      activity: "Analyzing sales data",
      timestamp: Date.now() - 300000 // 5 min ago
    },
    {
      id: 2,
      userId: 2, // Marcus Chen
      activity: "Reviewing code for bug fixes",
      timestamp: Date.now() - 600000 // 10 min ago
    },
    {
      id: 3,
      userId: 1, // Alena Siphron
      activity: "Finalizing client proposal draft",
      timestamp: Date.now() - 900000 // 15 min ago
    },
    {
      id: 4,
      userId: 4, // David Rodriguez
      activity: "Keeping up with industry trends",
      timestamp: Date.now() - 1200000 // 20 min ago
    },
    {
      id: 5,
      userId: 5, // Emily Watson
      activity: "Working on data analysis",
      timestamp: Date.now() - 1500000 // 25 min ago
    },
    {
      id: 6,
      userId: 6, // Alex Thompson
      activity: "Deploying new features",
      timestamp: Date.now() - 1800000 // 30 min ago
    }
  ]);

  // Helper function to get user data by ID
  const getUserById = (userId) => {
    return usersData?.find(user => user.id === userId);
  };

  // Handle mouse enter for hover effect
  const handleMouseEnter = (notification, event) => {
    const user = getUserById(notification.userId);
    if (user) {
      setHoveredUser(user);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  // Handle click to show user details
  const handleUserClick = (notification) => {
    if (isDragging) return; // Não clique se estiver arrastando
    const user = getUserById(notification.userId);
    if (user && onUserClick) {
      onUserClick(user);
    }
  };

  // Handle drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(false);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) { // Se o botão esquerdo estiver pressionado
      const deltaX = e.clientX - dragStart;
      if (Math.abs(deltaX) > 5) { // Threshold para iniciar drag
        setIsDragging(true);
        setScrollPosition(prev => Math.max(-200, Math.min(200, prev + deltaX * 0.5)));
        setDragStart(e.clientX);
      }
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => setIsDragging(false), 100); // Pequeno delay para evitar cliques acidentais
  };

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => {
        const updated = [...prev];
        // Atualizar timestamp aleatoriamente
        const randomIndex = Math.floor(Math.random() * updated.length);
        updated[randomIndex] = {
          ...updated[randomIndex],
          timestamp: Date.now()
        };
        return updated.sort((a, b) => b.timestamp - a.timestamp);
      });
    }, 10000); // Atualizar a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (availability) => {
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
    <>
      <div className="flex-1 rounded-lg h-20 p-4 relative overflow-hidden">
        {/* Notifications Container */}
        <div 
          className="flex space-x-3 overflow-hidden relative h-full items-center cursor-grab active:cursor-grabbing select-none"
          style={{ transform: `translateX(${scrollPosition}px)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {notifications.map((notification, index) => {
            const user = getUserById(notification.userId);
            if (!user) return null;
            
            return (
              <div
                key={notification.id}
                className="flex items-center space-x-3 flex-shrink-0 min-w-0 border border-neutral-700 p-2 rounded-md cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                style={{
                  opacity: index > 4 ? 0.3 : 1,
                  transform: index > 4 ? 'scale(0.9)' : 'scale(1)',
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
                onMouseEnter={(e) => !isDragging && handleMouseEnter(notification, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleUserClick(notification)}
              >
                {/* Avatar with Status */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-lg"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-neutral-800 ${getStatusColor(user.availability)}`} />
                </div>

                {/* Activity Description */}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-normal truncate max-w-32">
                    {notification.activity}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Fade Out Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent pointer-events-none" />
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

export default LiveNotifications;