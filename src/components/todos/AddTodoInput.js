import React from 'react';

const AddTodoInput = ({ newTodoText, setNewTodoText, onAddTodo }) => {
  return (
    <div className="border-t border-neutral-700 pt-4 mt-6">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add a new to-do..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddTodo()}
          className="flex-1 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-transparent"
        />
        <button
          onClick={onAddTodo}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTodoInput;