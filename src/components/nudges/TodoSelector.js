import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, CheckSquare, Clock, AlertCircle, X, Plus } from 'lucide-react';
import SimpleBar from 'simplebar-react';

// Mock todos data
const todosData = [
  {
    id: 'todo-1',
    title: 'Review design mockups',
    description: 'Check the new dashboard designs and provide feedback',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-15',
    project: 'Dashboard Redesign'
  },
  {
    id: 'todo-2',
    title: 'Update API documentation',
    description: 'Add new endpoints and update existing ones',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-20',
    project: 'API Development'
  },
  {
    id: 'todo-3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-18',
    project: 'DevOps'
  },
  {
    id: 'todo-4',
    title: 'Write unit tests',
    description: 'Add test coverage for new features',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-25',
    project: 'Quality Assurance'
  },
  {
    id: 'todo-5',
    title: 'User research interviews',
    description: 'Conduct interviews with 5 users about new features',
    priority: 'low',
    status: 'pending',
    dueDate: '2024-01-30',
    project: 'User Research'
  }
];

const TodoSelector = ({ selectedTodos, onTodosChange, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update position when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      updateDropdownPosition();
    }
  }, [isDropdownOpen]);

  // Filter todos based on search term
  const filteredTodos = useMemo(() => {
    if (!searchTerm.trim()) return todosData;
    return todosData.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.project.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Add todo to selection
  const handleTodoSelect = (todo) => {
    const isAlreadySelected = selectedTodos.find(t => t.id === todo.id);
    if (!isAlreadySelected) {
      onTodosChange([...selectedTodos, todo]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Remove todo from selection
  const handleTodoRemove = (todoId) => {
    onTodosChange(selectedTodos.filter(todo => todo.id !== todoId));
  };

  // Create new todo
  const handleCreateNewTodo = () => {
    if (newTodoTitle.trim()) {
      const newTodo = {
        id: `todo-new-${Date.now()}`,
        title: newTodoTitle.trim(),
        description: 'Created from nudge',
        priority: 'medium',
        status: 'pending',
        assignee: null,
        dueDate: null,
        project: 'General',
        isNew: true
      };
      onTodosChange([...selectedTodos, newTodo]);
      setNewTodoTitle('');
      setShowCreateNew(false);
      setIsDropdownOpen(false);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-neutral-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 text-neutral-400" />;
      case 'in-progress':
        return <AlertCircle className="w-3 h-3 text-neutral-400" />;
      case 'completed':
        return <CheckSquare className="w-3 h-3 text-green-400" />;
      default:
        return <Clock className="w-3 h-3 text-neutral-400" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Todo Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search and add To-dos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full border border-neutral-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-neutral-500 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </div>

        {/* Search Results - Rendered as Portal */}
        {(isDropdownOpen && (filteredTodos.length > 0 || searchTerm.trim())) && createPortal(
          <div 
            ref={dropdownRef}
            className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-[9999] max-h-48 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            <SimpleBar style={{ maxHeight: '192px' }}>
              {/* Create New Todo Option */}
              {searchTerm.trim() && (
                <button
                  onClick={() => setShowCreateNew(true)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-neutral-700 transition-colors text-left border-b border-neutral-700"
                >
                  <Plus className="w-4 h-4 text-neutral-400" />
                  <div className="flex-1">
                    <div className="text-neutral-400 text-sm font-medium">Create new todo</div>
                    <div className="text-neutral-400 text-xs">"{searchTerm}"</div>
                  </div>
                </button>
              )}

              {/* Existing Todos */}
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={() => handleTodoSelect(todo)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-neutral-700 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(todo.status)}
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority).replace('text-', 'bg-')}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{todo.title}</div>
                      <div className="text-neutral-400 text-xs truncate">{todo.project}</div>
                    </div>
                  </button>
                ))
              ) : searchTerm.trim() ? (
                <div className="p-3 text-neutral-400 text-sm text-center">
                  No todos found
                </div>
              ) : (
                <div className="p-3 text-neutral-400 text-sm text-center">
                  Start typing to search todos
                </div>
              )}
            </SimpleBar>
          </div>,
          document.body
        )}

        {/* Create New Todo Modal */}
        {showCreateNew && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowCreateNew(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-40 p-4">
              <h4 className="text-white font-medium mb-3">Create new todo</h4>
              <input
                type="text"
                placeholder="Todo title..."
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTodo()}
                className="w-full border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-500 bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 mb-3"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateNewTodo}
                  disabled={!newTodoTitle.trim()}
                  className="flex-1 bg-neutral-600 hover:bg-neutral-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateNew(false)}
                  className="px-3 py-2 border border-neutral-600 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Todos */}
      {selectedTodos.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400">
            Linked Todos ({selectedTodos.length}):
          </label>
          
          <div className="space-y-2">
            {selectedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between bg-neutral-700 rounded-lg px-3 py-2"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(todo.status)}
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority).replace('text-', 'bg-')}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {todo.title}
                      {todo.isNew && <span className="ml-2 text-xs text-neutral-400">(New)</span>}
                    </div>
                    <div className="text-neutral-400 text-xs truncate">{todo.project}</div>
                  </div>

                </div>
                <button
                  onClick={() => handleTodoRemove(todo.id)}
                  className="text-neutral-400 hover:text-neutral-100 p-1 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Todo Link Preview */}
          <div className="bg-neutral-500/10 border border-neutral-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-400 text-sm font-medium">Todo Integration</span>
            </div>
            <p className="text-neutral-300 text-sm">
              This nudge will be linked to{' '}
              <span className="font-medium text-white">
                {selectedTodos.length === 1 
                  ? selectedTodos[0].title 
                  : `${selectedTodos.length} todos`
                }
              </span>.
            </p>
            <p className="text-neutral-400 text-xs mt-1">
              Recipients can view and interact with linked todos directly from the nudge.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoSelector;