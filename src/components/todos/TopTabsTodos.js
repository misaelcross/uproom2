import React from 'react';

const TopTabsTodos = ({ activeTab, setActiveTab, catchUpCount = 0 }) => {
  return (
    <div className="w-fit min-w-0 rounded-lg h-20 py-4 flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg mb-4 w-fit">
        <button
          onClick={() => setActiveTab('todos')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'todos'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          To-dos
        </button>
        <button
          onClick={() => setActiveTab('catchup')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'catchup'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Catch-up {catchUpCount > 0 && `(${catchUpCount})`}
        </button>
      </div>
    </div>
  );
};

export default TopTabsTodos;