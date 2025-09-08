import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import Sidebar from '../shared/Sidebar';

import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import AddTodoInput from './AddTodoInput';
import GroupsView from './GroupsView';
import TodoDetails from './TodoDetails';
import DynamicTodoHeader from './DynamicTodoHeader';
import AnimatedBottomSheet from '../shared/AnimatedBottomSheet';
import TopTabsTodos from './TopTabsTodos';
import ActionBarTodos from './ActionBarTodos';
import LiveNotifications from '../shared/LiveNotifications';
import { usersData } from '../../data/usersData';

const TodosPage = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Day');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [newTodoText, setNewTodoText] = useState('');

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('Folder');
  const [newGroupIsShared, setNewGroupIsShared] = useState(false);
  const [newGroupExpirationDate, setNewGroupExpirationDate] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [resetExpandedFolders, setResetExpandedFolders] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  
  // Catch-up mode state
  const [catchUpMode, setCatchUpMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // AnimatedBottomSheet state
  const [activeTab, setActiveTab] = useState('received');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  
  // TopTabs state
  const [activeTopTab, setActiveTopTab] = useState('todos');
  
  // Accordion state for completed todos
  const [completedTodosCollapsed, setCompletedTodosCollapsed] = useState(true);

  // Mock data for todos
  const [todos, setTodos] = useState([
    {
      id: 1,
      description: 'Review project proposal',
      completed: false,
      time: '08:30am - 10:00am',
      priority: 'High',
      starred: false,
      steps: [
        { id: 1, description: 'Read document', completed: true },
        { id: 2, description: 'Prepare feedback', completed: false }
      ],
      comments: [
        {
          id: 1,
          text: 'I have reviewed the initial draft. Looks good overall!',
          author: usersData.find(user => user.id === 2), // Sarah Johnson
          createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 minutes ago
        }
      ],
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      groupId: 1 // Work Projects
    },
    {
      id: 2,
      description: 'Team meeting preparation',
      completed: true,
      time: '10:30am - 11:00am',
      priority: 'Medium',
      starred: true,
      steps: [],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      groupId: 1 // Work Projects
    },
    {
      id: 3,
      description: '@Sarah Johnson test',
      completed: false,
      time: '02:00pm - 04:00pm',
      priority: 'Low',
      starred: false,
      steps: [
        { id: 1, description: 'Review current docs', completed: false },
        { id: 2, description: 'Add new sections', completed: false },
        { id: 3, description: 'Proofread', completed: false }
      ],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      groupId: 2 // Personal
    },
    // Add some missed todos for catch-up mode demo
    {
      id: 4,
      description: 'Call client about project update',
      completed: false,
      time: '09:00am - 09:30am',
      priority: 'High',
      starred: false,
      steps: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (overdue)
      groupId: 1,
      missed: true
    },
    {
      id: 5,
      description: 'Submit expense report',
      completed: false,
      time: '02:00pm - 02:30pm',
      priority: 'Medium',
      starred: false,
      steps: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
      groupId: 2,
      missed: true
    }
  ]);

  // Mock data for groups
  const [groups, setGroups] = useState([
    { 
      id: 1, 
      name: 'Work Projects', 
      icon: 'Briefcase', 
      count: 2, 
      isShared: false,
      order: 0,
      assignedUsers: [
        usersData.find(user => user.id === 1), // John Smith
        usersData.find(user => user.id === 2)  // Sarah Johnson
      ].filter(Boolean)
    },
    { id: 2, name: 'Personal', icon: 'User', count: 1, isShared: false, order: 1, assignedUsers: [] },
    { id: 3, name: 'Learning', icon: 'BookOpen', count: 0, isShared: false, order: 2, assignedUsers: [] },
    { id: 4, name: 'Health', icon: 'Heart', count: 0, isShared: false, order: 3, assignedUsers: [] },
    { 
      id: 5, 
      name: 'Project Alpha Team', 
      icon: 'Users', 
      count: 0, 
      isShared: true, 
      order: 4,
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      assignedUsers: [
        usersData.find(user => user.id === 3), // Marcus Chen
        usersData.find(user => user.id === 4), // Emily Davis
        usersData.find(user => user.id === 5)  // David Rodriguez
      ].filter(Boolean)
    },
    {
      id: 6,
      name: 'Development',
      icon: 'Folder',
      count: 0,
      isShared: false,
      parentId: 1,
      assignedUsers: [
        usersData.find(user => user.id === 6), // Lisa Park
        usersData.find(user => user.id === 7)  // Michael Brown
      ].filter(Boolean)
    },
    {
      id: 7,
      name: 'Design',
      icon: 'Folder',
      count: 0,
      isShared: false,
      parentId: 1,
      assignedUsers: [
        usersData.find(user => user.id === 8), // Jessica Lee
        usersData.find(user => user.id === 10) // Kevin Wilson
      ].filter(Boolean)
    }
  ]);

  const toggleTodoComplete = (todoId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    
    // Update selectedTodo if it's the same todo being toggled
    if (selectedTodo && selectedTodo.id === todoId) {
      const updatedTodo = updatedTodos.find(todo => todo.id === todoId);
      setSelectedTodo(updatedTodo);
    }
  };

  const toggleStarred = (todoId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, starred: !todo.starred } : todo
    );
    setTodos(updatedTodos);
    
    // Sincronizar selectedTodo se for o mesmo todo
    if (selectedTodo && selectedTodo.id === todoId) {
      const updatedSelectedTodo = updatedTodos.find(todo => todo.id === todoId);
      setSelectedTodo(updatedSelectedTodo);
    }
  };

  const deleteTodo = (todoId) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo(null);
    }
  };

  const addNewTodo = (nudgeData = null) => {
    if (newTodoText.trim()) {
      const newTodo = {
        id: Date.now(),
        description: newTodoText,
        completed: false,
        time: nudgeData?.dueTime || '',
        priority: nudgeData?.priority || 'none',
        starred: false,
        steps: [],
        createdAt: new Date().toISOString(),
        groupId: selectedGroup?.id || null,
        // Context-aware data from nudges
        sourceNudge: nudgeData ? {
          id: nudgeData.id,
          sender: nudgeData.sender,
          attachments: nudgeData.attachments || [],
          links: nudgeData.links || [],
          originalMessage: nudgeData.message
        } : null,
        mentions: nudgeData?.mentions || [],
        dueDate: nudgeData?.dueDate || null
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      
      // Update group count if creating in a group
      if (selectedGroup) {
        setGroups(groups.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, count: group.count + 1 }
            : group
        ));
      }
    }
  };

  // Function to create todo from nudge
  const createTodoFromNudge = (nudge) => {
    const newTodo = {
      id: Date.now(),
      description: nudge.message || nudge.title,
      completed: false,
      time: nudge.dueTime || '',
      priority: nudge.priority || 'Medium',
      starred: false,
      steps: [],
      createdAt: new Date().toISOString(),
      groupId: selectedGroup?.id || null,
      // Auto-inherited context from nudge
      sourceNudge: {
        id: nudge.id,
        sender: nudge.sender,
        attachments: nudge.attachments || [],
        links: nudge.links || [],
        originalMessage: nudge.message
      },

      mentions: [],
      dueDate: nudge.dueDate || null
    };
    setTodos([...todos, newTodo]);
    
    // Update group count if creating in a group
    if (selectedGroup) {
      setGroups(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, count: group.count + 1 }
          : group
      ));
    }
    
    return newTodo;
  };

  const addStep = (todoId, stepText) => {
    if (stepText && stepText.trim()) {
      const newStep = {
        id: Date.now(),
        description: stepText.trim(),
        completed: false
      };
      
      const updatedTodos = todos.map(todo => 
        todo.id === todoId 
          ? { ...todo, steps: [...(todo.steps || []), newStep] }
          : todo
      );
      
      setTodos(updatedTodos);
      
      // Update selectedTodo if it's the same todo
      if (selectedTodo && selectedTodo.id === todoId) {
        setSelectedTodo({ ...selectedTodo, steps: [...(selectedTodo.steps || []), newStep] });
      }
    }
  };

  const toggleStepComplete = (todoId, stepId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            steps: todo.steps.map(step => 
              step.id === stepId ? { ...step, completed: !step.completed } : step
            )
          }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === todoId);
    setSelectedTodo(updatedTodo);
  };

  const deleteStep = (stepId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === selectedTodo.id 
        ? { ...todo, steps: todo.steps.filter(step => step.id !== stepId) }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === selectedTodo.id);
    setSelectedTodo(updatedTodo);
  };

  const createGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        icon: newGroupIcon,
        count: 0,
        isShared: newGroupIsShared,
        expirationDate: newGroupIsShared ? newGroupExpirationDate : null
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupIcon('Folder');
      setNewGroupIsShared(false);
      setNewGroupExpirationDate('');
      setShowCreateGroup(false);
    }
  };

  const selectGroup = (group) => {
    setSelectedGroup(selectedGroup?.id === group.id ? null : group);
    setSelectedTodo(null);
  };

  const editGroup = (groupId, newName) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, name: newName } : group
    ));
    setEditingGroup(null);
    setEditGroupName('');
  };

  const deleteGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };
  
  // Move folder to another folder (for drag and drop)
  const moveFolder = (draggedFolderId, targetFolderId) => {
    setGroups(groups.map(group => 
      group.id === draggedFolderId 
        ? { ...group, parentId: targetFolderId || undefined }
        : group
    ));
  };
  
  // Function to reorder folders at the same level
  const reorderFolders = (draggedFolderId, targetFolderId, position) => {
    const draggedFolder = groups.find(g => g.id === draggedFolderId);
    const targetFolder = groups.find(g => g.id === targetFolderId);
    
    if (!draggedFolder || !targetFolder) return;
    
    // Only allow reordering at root level (folders without parentId)
    if (draggedFolder.parentId || targetFolder.parentId) return;
    
    const rootFolders = groups.filter(g => !g.parentId).sort((a, b) => (a.order || 0) - (b.order || 0));
    const otherGroups = groups.filter(g => g.parentId);
    
    // Remove dragged folder from current position
    const filteredFolders = rootFolders.filter(f => f.id !== draggedFolderId);
    
    // Find target index
    const targetIndex = filteredFolders.findIndex(f => f.id === targetFolderId);
    
    // Insert dragged folder at new position
    const newOrder = [...filteredFolders];
    if (position === 'above') {
      newOrder.splice(targetIndex, 0, draggedFolder);
    } else {
      newOrder.splice(targetIndex + 1, 0, draggedFolder);
    }
    
    // Update order property for all root folders
    const reorderedFolders = newOrder.map((folder, index) => ({
      ...folder,
      order: index
    }));
    
    // Combine with other groups (subfolders)
    setGroups([...reorderedFolders, ...otherGroups]);
  };
  
  // Add person to folder
  const addPersonToFolder = (folderId, user) => {
    setGroups(groups.map(group => 
      group.id === folderId 
        ? { 
            ...group, 
            assignedUsers: group.assignedUsers 
              ? [...group.assignedUsers.filter(u => u.id !== user.id), user]
              : [user]
          }
        : group
    ));
  };
  
  // Remove person from folder
  const removePersonFromFolder = (folderId, userId) => {
    setGroups(groups.map(group => 
      group.id === folderId 
        ? { 
            ...group, 
            assignedUsers: group.assignedUsers 
              ? group.assignedUsers.filter(u => u.id !== userId)
              : []
          }
        : group
    ));
  };
  
  // Create sub-folder with single-level restriction
  const createSubFolder = (parentId, name) => {
    // Find the parent folder
    const parentFolder = groups.find(group => group.id === parentId);
    
    // Only allow subfolder creation if parent is a root folder (no parentId)
    if (parentFolder && parentFolder.parentId) {
      console.warn('Cannot create subfolder: Parent folder is already a subfolder. Only one level of nesting is allowed.');
      return;
    }
    
    const newSubFolder = {
      id: Date.now(),
      name: name,
      icon: 'Folder',
      count: 0,
      isShared: false,
      parentId: parentId,
      assignedUsers: []
    };
    setGroups([...groups, newSubFolder]);
  };
  
  // Merge two folders
  const mergeFolders = (sourceId, targetId) => {
    const sourceFolder = groups.find(group => group.id === sourceId);
    const targetFolder = groups.find(group => group.id === targetId);
    
    if (!sourceFolder || !targetFolder) {
      console.error('Source or target folder not found');
      return;
    }
    
    // Create merged folder with combined name
    const mergedFolder = {
      ...targetFolder,
      name: `${sourceFolder.name}/${targetFolder.name}`,
      count: sourceFolder.count + targetFolder.count,
      assignedUsers: [
        ...(targetFolder.assignedUsers || []),
        ...(sourceFolder.assignedUsers || []).filter(
          user => !(targetFolder.assignedUsers || []).some(u => u.id === user.id)
        )
      ]
    };
    
    // Update todos to point to the merged folder
    const updatedTodos = todos.map(todo => {
      if (todo.groupId === sourceId) {
        return { ...todo, groupId: targetId };
      }
      return todo;
    });
    
    // Update subfolders to point to the merged folder
    const updatedGroups = groups.map(group => {
      if (group.parentId === sourceId) {
        return { ...group, parentId: targetId };
      }
      if (group.id === targetId) {
        return mergedFolder;
      }
      return group;
    }).filter(group => group.id !== sourceId); // Remove source folder
    
    setTodos(updatedTodos);
    setGroups(updatedGroups);
    
    // Clear selection if merged folder was selected
    if (selectedGroup?.id === sourceId) {
      setSelectedGroup(null);
    }
  };

  // Function to update todo description
  const updateTodoDescription = (todoId, newDescription) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, description: newDescription }
        : todo
    ));
  };

  // Function to update step description
  const updateStepDescription = (todoId, stepId, newDescription) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? {
            ...todo,
            steps: todo.steps.map(step =>
              step.id === stepId
                ? { ...step, description: newDescription }
                : step
            )
          }
        : todo
    ));
  };

  // Function to update todo priority
  const updateTodoPriority = (todoId, newPriority) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, priority: newPriority }
        : todo
    ));
  };

  // Function to add comment to todo
  const addComment = (todoId, comment) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, comments: [...(todo.comments || []), comment] }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === todoId);
    setSelectedTodo(updatedTodo);
  };

  // Function to update comment
  const updateComment = (todoId, commentId, newText) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId 
        ? {
            ...todo,
            comments: (todo.comments || []).map(comment =>
              comment.id === commentId
                ? { ...comment, text: newText }
                : comment
            )
          }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === todoId);
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo(updatedTodo);
    }
  };

  // Function to delete comment
  const deleteComment = (todoId, commentId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId 
        ? {
            ...todo,
            comments: (todo.comments || []).filter(comment => comment.id !== commentId)
          }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === todoId);
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo(updatedTodo);
    }
  };

  // Function to add emoji reaction to comment
  const addEmojiReaction = (todoId, commentId, emoji) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId 
        ? {
            ...todo,
            comments: (todo.comments || []).map(comment => {
              if (comment.id === commentId) {
                const reactions = comment.reactions || [];
                const existingReaction = reactions.find(r => r.emoji === emoji);
                
                if (existingReaction) {
                  existingReaction.count += 1;
                } else {
                  reactions.push({ emoji, count: 1 });
                }
                
                return { ...comment, reactions };
              }
              return comment;
            })
          }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === todoId);
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo(updatedTodo);
    }
  };
  


  // Function to update todo notes
  const updateNotes = (todoId, newNotes) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, notes: newNotes }
        : todo
    ));
    // Also update selectedTodo if it's the same todo
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo({ ...selectedTodo, notes: newNotes });
    }
  };

  const getFilteredTodos = () => {
    let filteredTodos = todos;
    
    // Filter by active tab (todos or catch-up)
    if (activeTopTab === 'catchup') {
      filteredTodos = filteredTodos.filter(todo => todo.missed);
    } else {
      // For todos tab, exclude missed todos
      filteredTodos = filteredTodos.filter(todo => !todo.missed);
    }
    
    // Filter by selected group
    if (selectedGroup && activeTopTab !== 'catchup') {
      filteredTodos = filteredTodos.filter(todo => todo.groupId === selectedGroup.id);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filteredTodos = filteredTodos.filter(todo => 
        todo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.steps.some(step => step.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filteredTodos;
  };

  // Get count of missed todos
  const getMissedTodosCount = () => {
    return todos.filter(todo => todo.missed && !todo.completed).length;
  };

  // Get count of pending todos
  const getPendingTodosCount = () => {
    return todos.filter(todo => !todo.completed && !todo.missed).length;
  };

  // Handle date navigation
  const handleDateNavigation = (direction) => {
    // This is a placeholder function for date navigation
    // In a real implementation, this would update the current date state
    // and filter todos based on the selected date
    console.log(`Navigate ${direction} day`);
    
    // Example implementation:
    // if (direction === 'previous') {
    //   setCurrentDate(prevDate => new Date(prevDate.getTime() - 24 * 60 * 60 * 1000));
    // } else if (direction === 'next') {
    //   setCurrentDate(prevDate => new Date(prevDate.getTime() + 24 * 60 * 60 * 1000));
    // }
  };

  // Helper functions for AnimatedBottomSheet
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="h-screen bg-neutral-900 pr-6 overflow-hidden">
      <div className="flex gap-4 h-screen">
        {/* First column: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="todos" onNavigate={onNavigate} />
        </div>

        {/* Second column: flex-1 - Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Tabs, Live Notifications and Actions */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabsTodos 
              activeTab={activeTopTab}
              setActiveTab={setActiveTopTab}
              catchUpCount={getMissedTodosCount()}
            />
            <LiveNotifications 
              usersData={usersData}
              onUserClick={(user) => console.log('User clicked:', user)}
            />
            <ActionBarTodos 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreateGroup={() => setShowCreateGroup(true)}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              showPeriodDropdown={showPeriodDropdown}
              setShowPeriodDropdown={setShowPeriodDropdown}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">
              {/* Headers - show TodoHeader when no folder selected, DynamicTodoHeader when folder selected */}
              {selectedGroup ? (
                <DynamicTodoHeader 
                  selectedGroup={selectedGroup} 
                  onBack={() => {
                setSelectedGroup(null);
                setSelectedTodo(null);
                setResetExpandedFolders(true);
                // Reset the flag after a brief delay
                setTimeout(() => setResetExpandedFolders(false), 100);
              }}
                />
              ) : (
                <TodoHeader onNavigateDate={handleDateNavigation} />
              )}
              
              {/* Todo List with scroll */}
              <SimpleBar className="flex-1 pb-20">
                <TodoList
                  todos={getFilteredTodos()}
                  onToggleComplete={toggleTodoComplete}
                  onToggleStar={toggleStarred}
                  onDelete={deleteTodo}
                  onSelect={setSelectedTodo}
                  onUpdatePriority={updateTodoPriority}
                  completedTodosCollapsed={completedTodosCollapsed}
                  setCompletedTodosCollapsed={setCompletedTodosCollapsed}
                  selectedGroup={selectedGroup}
                  groups={groups}
                />
              </SimpleBar>

              {/* Fixed Add Todo Input at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4">
                <AddTodoInput
                  newTodoText={newTodoText}
                  setNewTodoText={setNewTodoText}
                  onAddTodo={addNewTodo}
                />
              </div>
            </div>

          {/* Right Column */}
          <div className="border border-neutral-700 rounded-lg flex flex-col pb-12" style={{ width: '350px' }}>
            {!selectedTodo ? (
              <GroupsView 
                folders={groups}
                selectedGroup={selectedGroup}
                onSelectGroup={selectGroup}
                showCreateGroup={showCreateGroup}
                setShowCreateGroup={setShowCreateGroup}
                newGroupName={newGroupName}
                setNewGroupName={setNewGroupName}
                newGroupIcon={newGroupIcon}
                setNewGroupIcon={setNewGroupIcon}
                newGroupIsShared={newGroupIsShared}
                setNewGroupIsShared={setNewGroupIsShared}
                newGroupExpirationDate={newGroupExpirationDate}
                setNewGroupExpirationDate={setNewGroupExpirationDate}
                onCreateGroup={createGroup}
                editingGroup={editingGroup}
                setEditingGroup={setEditingGroup}
                editGroupName={editGroupName}
                setEditGroupName={setEditGroupName}
                onEditGroup={editGroup}
                onDeleteGroup={(groupId) => {
                  setGroupToDelete(groupId);
                  setShowDeleteModal(true);
                }}
                onMoveFolder={moveFolder}
                onAddPersonToFolder={addPersonToFolder}
                onRemovePersonFromFolder={removePersonFromFolder}
                onCreateSubFolder={createSubFolder}
                onReorderFolders={reorderFolders}
                onMergeFolders={mergeFolders}
                resetExpandedFolders={resetExpandedFolders}
              />
            ) : (
              <TodoDetails
                todo={selectedTodo}
                onBack={() => setSelectedTodo(null)}
                onToggleComplete={toggleTodoComplete}
                onToggleStar={toggleStarred}
                onAddStep={(todoId, stepText) => addStep(todoId, stepText)}
                onDeleteStep={deleteStep}
                onToggleStepComplete={toggleStepComplete}
                onUpdateNotes={updateNotes}
                onDeleteTodo={deleteTodo}
                onUpdateTodoDescription={updateTodoDescription}
                onUpdateStepDescription={(stepId, newDescription) =>
                  updateStepDescription(selectedTodo.id, stepId, newDescription)
                }
                onAddComment={addComment}
                onUpdateComment={updateComment}
                onDeleteComment={deleteComment}
                onAddEmojiReaction={addEmojiReaction}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete {groupToDelete ? 'Folder' : 'Todo'}
            </h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete this {groupToDelete ? 'folder' : 'todo'}? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setGroupToDelete(null);
                  setTodoToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-neutral-700 text-white rounded-lg hover:bg-neutral-700/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (groupToDelete) {
                    deleteGroup(groupToDelete);
                  } else if (todoToDelete) {
                    deleteTodo(todoToDelete);
                  }
                  setShowDeleteModal(false);
                  setGroupToDelete(null);
                  setTodoToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

        {/* AnimatedBottomSheet */}
        <AnimatedBottomSheet
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          toggleUserSelection={toggleUserSelection}
          removeSelectedUser={removeSelectedUser}
          message={message}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
};

export default TodosPage;