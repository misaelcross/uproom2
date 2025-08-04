import React from 'react';
import { 
  Plus, 
  Briefcase, 
  User, 
  BookOpen, 
  Heart, 
  Folder,
  Home,
  Star,
  Calendar,
  Settings,
  Edit3,
  Trash2,
  X,
  Check
} from 'lucide-react';

const GroupsView = ({ 
  groups, 
  selectedGroup,
  onSelectGroup,
  showCreateGroup,
  setShowCreateGroup,
  newGroupName,
  setNewGroupName,
  newGroupIcon,
  setNewGroupIcon,
  onCreateGroup,
  editingGroup,
  setEditingGroup,
  editGroupName,
  setEditGroupName,
  onEditGroup,
  onDeleteGroup
}) => {
  const iconComponents = {
    Briefcase,
    User,
    BookOpen,
    Heart,
    Folder,
    Home,
    Star,
    Calendar,
    Settings
  };

  const iconOptions = Object.keys(iconComponents);

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName] || Folder;
    return <IconComponent className="w-4 h-4 text-neutral-400" />;
  };

  const handleCreateGroup = () => {
    onCreateGroup();
  };

  const handleEditGroup = (groupId) => {
    onEditGroup(groupId, editGroupName);
  };

  const startEdit = (group) => {
    setEditingGroup(group.id);
    setEditGroupName(group.name);
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setEditGroupName('');
  };

  if (showCreateGroup) {
    return (
      <div className="p-6 flex-1">
        <h3 className="text-white text-lg font-semibold mb-4">Create New Group</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
              className="w-full border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-transparent"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-3 gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewGroupIcon(icon)}
                  className={`p-2 border rounded-lg flex items-center justify-center transition-colors ${
                    newGroupIcon === icon 
                      ? 'border-white bg-neutral-700' 
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  {renderIcon(icon)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowCreateGroup(false)}
              className="flex-1 px-4 py-2 border border-neutral-600 rounded-lg text-white hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1">
      <h3 className="text-white text-lg font-semibold mb-4">My Groups</h3>
      <div className="space-y-3">
        {groups.map(group => (
          <div key={group.id}>
            <div 
              className={`flex items-center justify-between p-3 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer ${
                selectedGroup?.id === group.id ? 'bg-neutral-800' : ''
              }`}
              onClick={() => onSelectGroup(group)}
            >
              <div className="flex items-center gap-3">
                {renderIcon(group.icon)}
                {editingGroup === group.id ? (
                  <input
                    type="text"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleEditGroup(group.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    onBlur={() => handleEditGroup(group.id)}
                    className="bg-transparent text-white focus:outline-none border-b border-white"
                    autoFocus
                  />
                ) : (
                  <span className="text-white">{group.name}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {editingGroup === group.id ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEdit();
                      }}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGroup(group.id);
                      }}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  // Counter with sidebar design - square background
                  <span className="text-xs bg-neutral-700 text-neutral-400 w-5 h-5 rounded flex items-center justify-center">
                    {group.count}
                  </span>
                )}
              </div>
            </div>
            
            {/* Accordion-style buttons - only show when group is selected and not editing */}
            {selectedGroup?.id === group.id && editingGroup !== group.id && (
              <div className="mt-2 ml-7 space-y-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(group);
                  }}
                  className="w-full flex items-center gap-2 p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGroup(group.id);
                  }}
                  className="w-full flex items-center gap-2 p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-700 rounded transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        ))}
        
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="w-full flex items-center gap-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-600 transition-colors text-white"
        >
          <Plus className="w-4 h-4" />
          <span className="">Create new group</span>
        </button>
      </div>
    </div>
  );
};

export default GroupsView;