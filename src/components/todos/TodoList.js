import React from 'react';
import { ChevronRight } from 'lucide-react';
import TodoItem from './TodoItem';

const TodoList = ({ 
  todos, 
  onToggleComplete, 
  onToggleStar, 
  onDelete, 
  onSelect,
  onUpdatePriority,
  completedTodosCollapsed,
  setCompletedTodosCollapsed,
  selectedGroup,
  groups
}) => {
  // Separate active and completed todos
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  
  // Sort active todos: starred first
  const sortedActiveTodos = [...activeTodos].sort((a, b) => {
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    return 0;
  });

  return (
    <div className="space-y-3 w-full">
      {/* Active todos */}
      {sortedActiveTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onToggleStar={onToggleStar}
          onDelete={onDelete}
          onSelect={onSelect}
          onUpdatePriority={onUpdatePriority}
          completedTodosCollapsed={completedTodosCollapsed}
          setCompletedTodosCollapsed={setCompletedTodosCollapsed}
          selectedGroup={selectedGroup}
          groups={groups}
        />
      ))}
      
      {/* Accordion for completed todos */}
      {completedTodos.length > 0 && (
        <div className="border-t border-neutral-700 pt-3 mt-3">
          <button
            onClick={() => setCompletedTodosCollapsed(!completedTodosCollapsed)}
            className="w-full flex items-center justify-between p-2 hover:bg-neutral-800 rounded transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ChevronRight className={`h-4 w-4 text-neutral-400 transition-transform ${
                !completedTodosCollapsed ? 'rotate-90' : ''
              }`} />
              <span className="text-sm text-neutral-400">Finished</span>
              <span className="text-xs bg-neutral-700 text-neutral-400 w-5 h-5 rounded-md flex items-center justify-center">
                {completedTodos.length}
              </span>
            </div>
          </button>
          
          {/* Completed todos */}
          {!completedTodosCollapsed && (
            <div className="space-y-3 mt-3 pl-2">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onToggleStar={onToggleStar}
                  onDelete={onDelete}
                  onSelect={onSelect}
                  onUpdatePriority={onUpdatePriority}
                  completedTodosCollapsed={completedTodosCollapsed}
                  setCompletedTodosCollapsed={setCompletedTodosCollapsed}
                  selectedGroup={selectedGroup}
                  groups={groups}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;