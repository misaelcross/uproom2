import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, ArrowUpRight, Download, Share, Trash2 } from 'lucide-react';

const FileCardDropdown = ({ file, onGoToOriginalMessage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
    
    if (!dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 200 // 200px is the dropdown width
      });
    }
    
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option, e) => {
    e.stopPropagation();
    
    switch (option) {
      case 'Mentioned In':
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
    { label: 'Mentioned In', icon: ArrowUpRight },
    { label: 'Download', icon: Download },
    { label: 'Share', icon: Share },
    { label: 'Delete', icon: Trash2 }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleEllipsesClick}
        className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
        title="More options"
      >
        <MoreHorizontal className="h-4 w-4 text-neutral-400" />
      </button>
      
      {/* Dropdown Menu */}
      {dropdownOpen && createPortal(
        <div 
          className="fixed bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-[9999] min-w-[200px]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default FileCardDropdown;