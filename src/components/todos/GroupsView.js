import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Check,
  Clock,
  Users,
  MoreVertical,
  UserPlus,
  FolderPlus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const GroupsView = ({ 
  folders, 
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
  onDeleteGroup,
  newGroupExpirationDate,
  setNewGroupExpirationDate,
  newGroupIsShared,
  setNewGroupIsShared,
  onMoveFolder,
  onAddPersonToFolder,
  onRemovePersonFromFolder,
  onCreateSubFolder,
  onReorderFolders
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

  // State for dropdown menu
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  // State for drag and drop with dnd-kit
  const [activeId, setActiveId] = useState(null);
  
  // State for expanded folders
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  
  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // State for adding people
  const [showAddPeople, setShowAddPeople] = useState(null);
  const [showCreateSubFolder, setShowCreateSubFolder] = useState(null);
  const [newSubFolderName, setNewSubFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock users data for adding to folders
  const availableUsers = [
    { id: 1, name: 'John Doe', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 2, name: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 3, name: 'Mike Johnson', avatar: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 4, name: 'Emily Davis', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 5, name: 'Alex Wilson', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (groupId, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === groupId ? null : groupId);
  };
  
  // Drag and drop handlers with dnd-kit
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const rootFolders = getRootFolders();
      const oldIndex = rootFolders.findIndex(folder => folder.id === active.id);
      const newIndex = rootFolders.findIndex(folder => folder.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder folders
        const position = oldIndex < newIndex ? 'below' : 'above';
        onReorderFolders(active.id, over.id, position);
      } else if (over) {
        // Move to different parent
        const targetFolder = folders.find(f => f.id === over.id);
        if (targetFolder) {
          onMoveFolder(active.id, targetFolder.id);
        }
      }
    }
    
    setActiveId(null);
  };
  
  // Folder expansion
  const toggleFolderExpansion = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };
  
  // Create sub-folder
  const handleCreateSubFolder = (parentId) => {
    if (newSubFolderName.trim()) {
      onCreateSubFolder(parentId, newSubFolderName);
      setNewSubFolderName('');
      setShowCreateSubFolder(null);
    }
  };
  
  // Add person to folder
  const handleAddPersonToFolder = (folderId, user) => {
    onAddPersonToFolder(folderId, user);
    setSearchTerm('');
  };
  
  // Remove person from folder
  const handleRemovePersonFromFolder = (folderId, userId) => {
    onRemovePersonFromFolder(folderId, userId);
  };
  
  // Filter users based on search term
  const getFilteredUsers = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    const assignedUserIds = folder?.assignedUsers?.map(u => u.id) || [];
    
    return availableUsers
      .filter(user => !assignedUserIds.includes(user.id))
      .filter(user => 
        searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };
  
  // Get sub-folders
  const getSubFolders = (parentId) => {
    if (!folders || !Array.isArray(folders)) {
      return [];
    }
    return folders.filter(folder => folder.parentId === parentId);
  };
  
  // Get root folders (no parent)
  const getRootFolders = () => {
    if (!folders || !Array.isArray(folders)) {
      return [];
    }
    return folders.filter(folder => !folder.parentId);
  };

  if (showCreateGroup) {
    return (
      <div className="p-6 flex-1">
        <h3 className="text-white text-lg font-semibold mb-4">Create New Folder</h3>
        
        <div className="space-y-2">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Folder Name</label>
            <input
              type="text"
              placeholder="Enter folder name..."
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
              className="flex-1 px-4 py-2 border border-neutral-600 rounded-lg text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-800 border border-neutral-600 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sortable Folder Component
  const SortableFolder = ({ folder, level = 0 }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: folder.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const subFolders = getSubFolders(folder.id);
    const hasSubFolders = subFolders.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    
    return (
      <div ref={setNodeRef} style={{ ...style, marginLeft: `${level * 20}px` }} className="mb-2">
        <div 
          className={`flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-800 transition-colors ${
            selectedGroup?.id === folder.id ? 'bg-neutral-800 border-neutral-600' : 'border-neutral-700'
          }`}
        >
          {/* Drag handle */}
          <div 
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 mr-2 hover:bg-neutral-700 rounded"
            {...attributes}
            {...listeners}
          >
            <div className="w-2 h-4 flex flex-col justify-center space-y-0.5">
              <div className="w-full h-0.5 bg-neutral-500 rounded"></div>
              <div className="w-full h-0.5 bg-neutral-500 rounded"></div>
              <div className="w-full h-0.5 bg-neutral-500 rounded"></div>
            </div>
          </div>
          
          {/* Clickable area for expansion */}
          <div 
            className="flex-1 flex items-center cursor-pointer"
            onClick={() => {
              onSelectGroup(folder);
              // Only expand if this folder is being selected (not deselected)
              if (!selectedGroup || selectedGroup.id !== folder.id) {
                // Close all other folders first
                setExpandedFolders(new Set([folder.id]));
              } else {
                // If clicking the same folder, toggle its expansion
                toggleFolderExpansion(folder.id);
              }
            }}
          >
            <div className="flex items-center gap-3">
              {renderIcon(folder.icon)}
              
              {editingGroup === folder.id ? (
                <input
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleEditGroup(folder.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  onBlur={() => handleEditGroup(folder.id)}
                  className="bg-transparent text-white focus:outline-none border-b border-white"
                  autoFocus
                />
              ) : (
                <span className="text-white">{folder.name}</span>
              )}
              

            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {editingGroup === folder.id ? (
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
                    handleEditGroup(folder.id);
                  }}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Counter */}
                <span className="text-xs bg-neutral-700 text-neutral-400 w-5 h-5 rounded flex items-center justify-center">
                  {folder.count}
                </span>
                
                {/* Three-dot menu */}
                <div className="relative" ref={openDropdown === folder.id ? dropdownRef : null}>
                  <button
                    onClick={(e) => toggleDropdown(folder.id, e)}
                    className="text-neutral-400 hover:text-white transition-colors p-1 hover:bg-neutral-600 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown menu */}
                  {openDropdown === folder.id && (
                    <div className="absolute right-0 top-8 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 min-w-[160px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(folder);
                          setOpenDropdown(null);
                        }}
                        className="w-full flex items-center gap-2 p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors text-sm first:rounded-t-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      {/* Only show Add Sub-folder option for root folders (no parentId) */}
                      {!folder.parentId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCreateSubFolder(folder.id);
                            setOpenDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors text-sm"
                        >
                          <FolderPlus className="w-4 h-4" />
                          <span>Add Sub-folder</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddPeople(folder.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full flex items-center gap-2 p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors text-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add People</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteGroup(folder.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full flex items-center gap-2 p-2 text-neutral-400 hover:text-neutral-500 hover:bg-neutral-700 transition-colors text-sm last:rounded-b-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Sub-folder creation form */}
        {showCreateSubFolder === folder.id && (
          <div className="mt-3 p-3 bg-neutral-800 border border-neutral-700 rounded-lg" style={{ marginLeft: `${(level + 1) * 20}px` }}>
            <input
              type="text"
              placeholder="Enter sub-folder name..."
              value={newSubFolderName}
              onChange={(e) => setNewSubFolderName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreateSubFolder(folder.id);
                if (e.key === 'Escape') setShowCreateSubFolder(null);
              }}
              className="w-full bg-transparent text-white border border-neutral-600 rounded px-2 py-1 focus:outline-none focus:border-white"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleCreateSubFolder(folder.id)}
                className="px-3 py-1 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateSubFolder(null)}
                className="px-3 py-1 border border-neutral-600 text-white rounded text-sm hover:bg-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Add people form */}
        {showAddPeople === folder.id && (
          <div className="mt-3 p-3 bg-neutral-800 border border-neutral-700 rounded-lg" style={{ marginLeft: `${(level + 1) * 20}px` }}>
            <h4 className="text-white text-sm font-medium mb-3">Add People to Folder</h4>
            
            {/* Currently assigned users */}
            {folder.assignedUsers && folder.assignedUsers.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {folder.assignedUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-2 bg-neutral-700 rounded-md px-2 py-2">
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                      <span className="text-white text-sm">{user.name}</span>
                      <button
                        onClick={() => handleRemovePersonFromFolder(folder.id, user.id)}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search input with dropdown */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 text-white border border-neutral-600 rounded-lg px-3 py-2 focus:outline-none focus:border-white text-sm placeholder-neutral-400"
              />
              
              {/* Dropdown results - only show when typing */}
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 bg-neutral-700 border border-neutral-600 rounded-b-lg max-h-40 z-10" data-simplebar>
                  {getFilteredUsers(folder.id).length > 0 ? (
                    getFilteredUsers(folder.id).map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleAddPersonToFolder(folder.id, user)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-neutral-600 text-left transition-colors"
                      >
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-sm">{user.name}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-neutral-400 text-sm py-2 px-3">
                      No users found matching your search.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setShowAddPeople(null);
                  setSearchTerm('');
                }}
                className="w-1/2 px-3 py-2 border border-neutral-600 text-white rounded text-sm hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddPeople(null);
                  setSearchTerm('');
                }}
                className="w-1/2 px-3 py-2 bg-neutral-700 text-white rounded text-sm hover:bg-neutral-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
        
        {/* Render sub-folders */}
        {isExpanded && (
          <div className="mt-2 space-y-2">
            {subFolders.map(subFolder => (
              <SortableFolder key={subFolder.id} folder={subFolder} level={level + 1} />
            ))}
            
            {/* Only show Create New Subfolder button for root folders (level 0) */}
            {level === 0 && (
              <div style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCreateSubFolder(folder.id);
                  }}
                  className="flex items-center space-x-2 p-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create New Subfolder</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getRootFolders();
  const activeFolder = activeId ? folders.find(f => f.id === activeId) : null;

  return (
    <div className="p-6 flex-1">
      <h3 className="text-white text-lg font-semibold mb-4">Folders</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rootFolders.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {rootFolders.map(folder => (
              <SortableFolder key={folder.id} folder={folder} level={0} />
            ))}
            
            <button 
              onClick={() => setShowCreateGroup(true)}
              className="w-full flex items-center gap-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-600 transition-colors text-white"
            >
              <Plus className="w-4 h-4" />
              <span className="">Create new folder</span>
            </button>
          </div>
        </SortableContext>
        
        <DragOverlay>
          {activeFolder ? (
            <div className="flex items-center gap-3 p-3 border border-neutral-600 rounded-lg bg-neutral-800 opacity-90">
              {renderIcon(activeFolder.icon)}
              <span className="text-white">{activeFolder.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default GroupsView;