import React from 'react';

const TopTabsSchedule = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-fit min-w-0 rounded-lg h-20 py-4 flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg mb-4 w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'members'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Team members
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'groups'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Groups
        </button>
      </div>
    </div>
  );
};

export default TopTabsSchedule;