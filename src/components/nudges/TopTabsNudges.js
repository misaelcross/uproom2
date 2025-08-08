import React from 'react';

const TopTabsNudges = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-fit rounded-lg h-20 py-4 flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg mb-4 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'unread'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setActiveTab('priority')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'priority'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          High Priority
        </button>
        <button
          onClick={() => setActiveTab('polls')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'polls'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Polls
        </button>
      </div>
    </div>
  );
};

export default TopTabsNudges;