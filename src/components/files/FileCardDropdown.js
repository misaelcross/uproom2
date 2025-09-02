import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, MessageSquare, Download, Share, Trash2 } from 'lucide-react';

const FileCardDropdown = ({ file, onGoToOriginalMessage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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

  const handleEllipsesClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option, e) => {
    e.stopPropagation();
    
    switch (option) {
      case 'Go to original message':
        if (onGoToOriginalMessage) {
          onGoToOriginalMessage(file);
        }
        break;
      case 'Download':
        console.log(`Download ${file.name}`);
        break;
      case 'Share':
        console.log(`Share ${file.name}`);
        break;
      case 'Delete':
        console.log(`Delete ${file.name}`);
        break;
      default:
        console.log(`${option} clicked for ${file.name}`);
    }
    
    setDropdownOpen(false);
  };

  const dropdownOptions = [
    { label: 'Go to original message', icon: MessageSquare },
    { label: 'Download', icon: Download },
    { label: 'Share', icon: Share },
    { label: 'Delete', icon: Trash2 }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleEllipsesClick}
        className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
      >
        <MoreHorizontal className="h-4 w-4 text-neutral-400" />
      </button>
      
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[180px]">
          <div className="py-1">
            {dropdownOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={index}
                  onClick={(e) => handleOptionClick(option.label, e)}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCardDropdown;