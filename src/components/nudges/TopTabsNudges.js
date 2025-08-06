import React from 'react';

const TopTabsNudges = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-fit rounded-lg h-20 py-4 flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg mb-4 w-fit">
        <button
          onClick={() => setActiveTab('received')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'received'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'sent'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Sent
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

export default TopTabsNudges;