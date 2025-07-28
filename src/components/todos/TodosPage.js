import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import FirstColumn from '../shared/FirstColumn';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import AddTodoInput from './AddTodoInput';
import GroupsView from './GroupsView';
import TodoDetails from './TodoDetails';

const TodosPage = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [newStepText, setNewStepText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('Folder');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

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
      description: 'Update documentation',
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
    }
  ]);

  // Mock data for groups
  const [groups, setGroups] = useState([
    { id: 1, name: 'Work Projects', icon: 'Briefcase', count: 2 },
    { id: 2, name: 'Personal', icon: 'User', count: 1 },
    { id: 3, name: 'Learning', icon: 'BookOpen', count: 0 },
    { id: 4, name: 'Health', icon: 'Heart', count: 0 }
  ]);

  const toggleTodoComplete = (todoId) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const toggleStarred = (todoId) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, starred: !todo.starred } : todo
    ));
  };

  const deleteTodo = (todoId) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo(null);
    }
  };

  const addNewTodo = () => {
    if (newTodoText.trim()) {
      const newTodo = {
        id: Date.now(),
        description: newTodoText,
        completed: false,
        time: '09:00am - 10:00am',
        priority: 'Medium',
        starred: false,
        steps: [],
        createdAt: new Date().toISOString(),
        groupId: selectedGroup?.id || null // Add to selected group if any
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

  const addStep = () => {
    if (newStepText.trim() && selectedTodo) {
      const newStep = {
        id: Date.now(),
        description: newStepText,
        completed: false
      };
      
      const updatedTodos = todos.map(todo => 
        todo.id === selectedTodo.id 
          ? { ...todo, steps: [...todo.steps, newStep] }
          : todo
      );
      
      setTodos(updatedTodos);
      setSelectedTodo({ ...selectedTodo, steps: [...selectedTodo.steps, newStep] });
      setNewStepText('');
    }
  };

  const toggleStepComplete = (stepId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === selectedTodo.id 
        ? { 
            ...todo, 
            steps: todo.steps.map(step => 
              step.id === stepId ? { ...step, completed: !step.completed } : step
            )
          }
        : todo
    );
    
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find(todo => todo.id === selectedTodo.id);
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
        count: 0
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupIcon('Folder');
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
    if (!selectedGroup) return todos;
    // Filter todos by groupId
    return todos.filter(todo => todo.groupId === selectedGroup.id);
  };

  return (
    <div className="min-h-screen bg-neutral-800">
      <div className="flex gap-4 h-screen">
        {/* First column: 60px */}
        <div className="h-full" style={{ width: '60px' }}>
          <FirstColumn />
        </div>

        {/* Second column: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="todos" onNavigate={onNavigate} />
        </div>

        {/* Third column: flex-1 - Main content */}
        <div className="flex-1 flex gap-6 py-4">
          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full">
            <TodoHeader
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              showPeriodDropdown={showPeriodDropdown}
              setShowPeriodDropdown={setShowPeriodDropdown}
              selectedGroup={selectedGroup}
            />

            <div className="flex-1 overflow-y-auto">
              <TodoList
                todos={getFilteredTodos()}
                onToggleComplete={toggleTodoComplete}
                onToggleStar={toggleStarred}
                onDelete={deleteTodo}
                onSelect={setSelectedTodo}
                onUpdatePriority={updateTodoPriority}
              />
            </div>

            <AddTodoInput
              newTodoText={newTodoText}
              setNewTodoText={setNewTodoText}
              onAddTodo={addNewTodo}
            />
          </div>

          {/* Right Column */}
          <div className="w-80 border border-neutral-700 rounded-lg flex flex-col">
            {!selectedTodo ? (
              <GroupsView 
                groups={groups}
                selectedGroup={selectedGroup}
                onSelectGroup={selectGroup}
                showCreateGroup={showCreateGroup}
                setShowCreateGroup={setShowCreateGroup}
                newGroupName={newGroupName}
                setNewGroupName={setNewGroupName}
                newGroupIcon={newGroupIcon}
                setNewGroupIcon={setNewGroupIcon}
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
              />
            ) : (
              <TodoDetails
                todo={selectedTodo}
                onBack={() => setSelectedTodo(null)}
                onToggleComplete={toggleTodoComplete}
                onToggleStar={toggleStarred}
                onAddStep={() => addStep(selectedTodo.id)}
                onDeleteStep={deleteStep}
                onToggleStepComplete={toggleStepComplete}
                onUpdateNotes={updateNotes}
                onDeleteTodo={deleteTodo}
                onUpdateTodoDescription={updateTodoDescription}
                onUpdateStepDescription={(stepId, newDescription) => 
                  updateStepDescription(selectedTodo.id, stepId, newDescription)
                }
              />
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-white text-lg font-semibold mb-4">Delete Group</h3>
              <p className="text-neutral-400 mb-6">
                Are you sure you want to delete this group? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setGroupToDelete(null);
                  }}
                  className="px-4 py-2 border border-neutral-600 rounded-lg text-white hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteGroup(groupToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodosPage;