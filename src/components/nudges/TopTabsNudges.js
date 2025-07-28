import React from 'react';

const TopTabsNudges = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-fit bg-neutral-800 rounded-lg h-20 py-4 flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-900 p-1 rounded-lg mb-4">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Sent
        </button>
      </div>
    </div>
  );
};

export default TopTabsNudges;