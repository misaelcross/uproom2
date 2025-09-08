import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Link, ArrowLeft, SquarePen, Plus, Search, MoreVertical } from 'lucide-react';
import { Checkbox, ThemeProvider, createTheme } from '@mui/material';
import UserCard from './UserCard';

const UserGroupDetails = ({ group, onUserClick, onClose, allUsers }) => {
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState(group?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupMembers, setGroupMembers] = useState(group?.users || []);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [editMembersMode, setEditMembersMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const textareaRef = useRef(null);
  const nameInputRef = useRef(null);
  const moreOptionsRef = useRef(null);

  // Material UI theme for checkbox
  const checkboxTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffffff',
      },
    },
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: '#a3a3a3', // neutral-400
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'transparent',
            },
            '&.Mui-checked': {
              color: '#ffffff',
            },
          },
        },
      },
    },
  });

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [message]);

  // Focus on name input when editing
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Close more options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMoreOptions(false);
      }
    };

    if (showMoreOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreOptions]);

  if (!group) return null;

  const handleSendNudge = () => {
    if (message.trim()) {
      console.log(`Sending nudge to ${groupName} group: ${message}`);
      setMessage('');
    }
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    // Aqui você salvaria o nome do grupo
    console.log(`Group name changed to: ${groupName}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setGroupName(group.name);
      setIsEditingName(false);
    }
  };

  // Filtrar usuários disponíveis para adicionar (excluindo os já no grupo)
  const availableUsers = allUsers?.filter(user => 
    !groupMembers.find(member => member.id === user.id) &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddMember = (user) => {
    setGroupMembers(prev => [...prev, user]);
    setSearchTerm('');
    setShowAddMember(false);
    console.log(`Added ${user.name} to group ${groupName}`);
  };

  const handleRemoveMember = (userId) => {
    setGroupMembers(prev => prev.filter(member => member.id !== userId));
    console.log(`Removed user ${userId} from group ${groupName}`);
  };

  const handleMemberSelection = (userId) => {
    setSelectedMembers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleRemoveSelectedMembers = () => {
    if (selectedMembers.length > 0) {
      setGroupMembers(prev => prev.filter(member => !selectedMembers.includes(member.id)));
      setSelectedMembers([]);
      console.log(`Removed ${selectedMembers.length} members from group ${groupName}`);
    }
  };

  return (
    <div className="w-80 flex flex-col h-full border border-neutral-700 rounded-lg overflow-hidden pb-12">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center justify-between flex-1">
            <h2 className="text-lg font-semibold text-white">Group Details</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditingName(true)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SquarePen size={18} />
              </button>
              <div className="relative pt-1" ref={moreOptionsRef}>
                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                
                {/* More Options Dropdown */}
                {showMoreOptions && (
                  <div className="absolute top-full right-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[160px]">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setEditMembersMode(!editMembersMode);
                          setSelectedMembers([]);
                          setShowMoreOptions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800 transition-colors"
                      >
                        {editMembersMode ? 'Cancel Edit' : 'Edit Members'}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this group?')) {
                            console.log('Deleting group:', groupName);
                            onClose();
                          }
                          setShowMoreOptions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
                      >
                        Delete Group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Group Info */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyPress}
                className="text-lg font-medium text-white bg-transparent border border-neutral-600 rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
              />
            ) : (
              <h3 className="text-lg font-medium text-white">{groupName}</h3>
            )}
            <p className="text-neutral-400">{groupMembers.length} {groupMembers.length === 1 ? 'member' : 'members'}</p>
          </div>
        </div>
      </div>

      {/* Quick Nudge */}
      <div className="px-6 py-3 border-b border-neutral-700">
        <h3 className="text-md mb-3 text-white">Quick Nudge</h3>
        
        {/* Message Input */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 resize-none focus:outline-none focus:border-blue-500 transition-colors min-h-[44px] overflow-hidden"
              rows="1"
              style={{ height: 'auto' }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                <Link size={20} />
              </button>
            </div>
            
            <button
              onClick={handleSendNudge}
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send size={16} />
              <span>Send Nudge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group Members */}
      <div className="flex-1 px-6 py-3" data-simplebar>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md text-white">Group Members</h3>
          <div className="flex items-center space-x-2">
            {editMembersMode && selectedMembers.length > 0 && (
              <button
                onClick={handleRemoveSelectedMembers}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Remove ({selectedMembers.length})
              </button>
            )}
            {!editMembersMode && (
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Add Member Search */}
        {showAddMember && (
          <div className="mb-4 p-3 rounded-lg border border-neutral-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for user..."
                className="w-full bg-transparent border border-neutral-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Search Results */}
            {searchTerm && availableUsers.length > 0 && (
              <div className="mt-2 max-h-32" data-simplebar>
                {availableUsers.slice(0, 5).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddMember(user)}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white text-sm">{user.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {groupMembers.map((user, index) => (
            <div key={user.id} className="relative">
              {editMembersMode && (
                <div className="absolute top-4 left-4 z-10">
                  <ThemeProvider theme={checkboxTheme}>
                    <Checkbox
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => handleMemberSelection(user.id)}
                      size="small"
                      sx={{
                        padding: 0,
                        width: 16,
                        height: 16,
                        '& .MuiSvgIcon-root': {
                          fontSize: 16,
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
              )}
              <UserCard
                key={user.id}
                user={user}
                onClick={editMembersMode ? () => handleMemberSelection(user.id) : () => onUserClick(user)}
                isInGroup={true}
                isGroupLeader={index === 0} // First member is the group leader
                onRemoveFromGroup={!editMembersMode ? () => handleRemoveMember(user.id) : undefined}
                isSelectionMode={editMembersMode}
                isSelected={selectedMembers.includes(user.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserGroupDetails;