import React, { useState, useMemo } from 'react';
import { Search, Users, Building, ChevronDown, X } from 'lucide-react';

// Mock groups data
const groupsData = [
  {
    id: 'team-design',
    name: 'Design Team',
    type: 'team',
    memberCount: 8,
    description: 'UI/UX Designers',
    members: [
      { id: 101, name: "Ana Silva", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
      { id: 102, name: "Carlos Santos", avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
    ]
  },
  {
    id: 'team-dev',
    name: 'Development Team',
    type: 'team',
    memberCount: 12,
    description: 'Frontend & Backend Developers',
    members: [
      { id: 103, name: "Maria Costa", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
      { id: 104, name: "João Oliveira", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
    ]
  },
  {
    id: 'team-qa',
    name: 'QA Team',
    type: 'team',
    memberCount: 5,
    description: 'Quality Assurance Engineers',
    members: [
      { id: 107, name: "Lucia Ferreira", avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
    ]
  },
  {
    id: 'dept-engineering',
    name: 'Engineering Department',
    type: 'department',
    memberCount: 25,
    description: 'All Engineering Teams',
    members: []
  },
  {
    id: 'dept-product',
    name: 'Product Department',
    type: 'department',
    memberCount: 15,
    description: 'Product Management & Design',
    members: []
  },
  {
    id: 'company-all',
    name: 'All Company',
    type: 'company',
    memberCount: 50,
    description: 'Everyone in the company',
    members: []
  }
];

const GroupSelector = ({ selectedGroups, onGroupsChange, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groupsData;
    return groupsData.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Add group to selection
  const handleGroupSelect = (group) => {
    const isAlreadySelected = selectedGroups.find(g => g.id === group.id);
    if (!isAlreadySelected) {
      onGroupsChange([...selectedGroups, group]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Remove group from selection
  const handleGroupRemove = (groupId) => {
    onGroupsChange(selectedGroups.filter(group => group.id !== groupId));
  };

  // Get icon for group type
  const getGroupIcon = (type) => {
    switch (type) {
      case 'team':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'department':
        return <Building className="w-4 h-4 text-purple-400" />;
      case 'company':
        return <Building className="w-4 h-4 text-green-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get total member count
  const getTotalMemberCount = () => {
    return selectedGroups.reduce((total, group) => total + group.memberCount, 0);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Group Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search teams, departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full border border-neutral-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-neutral-500 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Dropdown Content */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => handleGroupSelect(group)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-neutral-700 transition-colors text-left"
                  >
                    {getGroupIcon(group.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{group.name}</div>
                      <div className="text-neutral-400 text-xs truncate">{group.description}</div>
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {group.memberCount} members
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-neutral-400 text-sm text-center">
                  No groups found
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Selected Groups */}
      {selectedGroups.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Broadcasting to:
            </label>
            <span className="text-xs text-neutral-500">
              {getTotalMemberCount()} total members
            </span>
          </div>
          
          <div className="space-y-2">
            {selectedGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between bg-neutral-700 rounded-lg px-3 py-2"
              >
                <div className="flex items-center space-x-2">
                  {getGroupIcon(group.type)}
                  <div>
                    <span className="text-white text-sm font-medium">{group.name}</span>
                    <span className="text-neutral-400 text-xs ml-2">
                      ({group.memberCount} members)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleGroupRemove(group.id)}
                  className="text-neutral-400 hover:text-neutral-100 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Announcement Preview */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-medium">Announcement Preview</span>
            </div>
            <p className="text-neutral-300 text-sm">
              This message will be sent as an announcement to{' '}
              <span className="font-medium text-white">
                {selectedGroups.length === 1 
                  ? selectedGroups[0].name 
                  : `${selectedGroups.length} groups`
                }
              </span>
              {' '}reaching <span className="font-medium text-white">{getTotalMemberCount()} people</span>.
            </p>
            <p className="text-neutral-400 text-xs mt-1">
              Recipients will receive this as a high-priority notification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;