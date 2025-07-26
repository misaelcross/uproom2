import React, { useState, useEffect, useRef } from 'react';
import { Settings, LogOut, ChevronRight, User, RefreshCw, BellOff } from 'lucide-react';

const FirstColumn = () => {
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [pauseNotificationsSubmenu, setPauseNotificationsSubmenu] = useState(false);
  const dropdownRef = useRef(null);

  const pauseOptions = [
    { label: '30 minutes', value: '30min' },
    { label: '1 hour', value: '1h' },
    { label: '2 hours', value: '2h' },
    { label: 'Until tomorrow', value: 'tomorrow' },
    { label: 'Until next week', value: 'nextweek' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAvatarDropdownOpen(false);
        setPauseNotificationsSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePauseNotifications = (option) => {
    console.log('Pause notifications for:', option.label);
    setAvatarDropdownOpen(false);
    setPauseNotificationsSubmenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 px-2 py-4 gap-4">
      {/* Logo/Avatar do usuário */}
      <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center border border-neutral-600 align-center">
        <span className="text-white text-lg font-semibold">UR</span>
      </div>

      {/* Espaço flexível */}
      <div className="flex-1"></div>

      {/* Avatar do usuário na parte inferior */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
          className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-neutral-600 transition-all"
        >
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </button>
        {/* Indicador verde de status online */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-800"></div>
        
        {/* Dropdown Menu */}
        {avatarDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-50">
            <div className="p-2">
              {/* Pause Notifications */}
              <div 
                className="relative"
                onMouseEnter={() => setPauseNotificationsSubmenu(true)}
                onMouseLeave={() => setPauseNotificationsSubmenu(false)}
              >
                <button className="w-full flex items-center justify-between p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <BellOff className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-white">Pause notifications</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
                
                {/* Submenu */}
                {pauseNotificationsSubmenu && (
                  <div className="absolute left-full top-0 ml-1 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl">
                    <div className="p-2">
                      {pauseOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePauseNotifications(option)}
                          className="w-full text-left p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-white">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <User className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Profile</span>
              </button>
              
              {/* Change Account */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <RefreshCw className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Change account</span>
              </button>
              
              {/* Divider */}
              <div className="border-t border-neutral-700 my-2"></div>
              
              {/* Settings */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <Settings className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Settings</span>
              </button>
              
              {/* Logout */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <LogOut className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstColumn;