import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ 
  todos, 
  onToggleComplete, 
  onToggleStar, 
  onDelete, 
  onSelect,
  onUpdatePriority 
}) => {
  // Sort todos: starred first, then by completion status
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  return (
    <div className="space-y-3">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onToggleStar={onToggleStar}
          onDelete={onDelete}
          onSelect={onSelect}
          onUpdatePriority={onUpdatePriority}
        />
      ))}
    </div>
  );
};

export default TodoList;