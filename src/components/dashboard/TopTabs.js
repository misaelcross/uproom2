import React from 'react';

const TopTabs = ({ activeTab, setActiveTab, users = [] }) => {
  // Get current work summary for overview tab
  const getCurrentWorkSummary = () => {
    const onlineUsers = users.filter(user => user.status === 'online');
    const activeProjects = onlineUsers.filter(user => user.currentWork).length;
    
    if (activeProjects === 0) return "No active work";
    if (activeProjects === 1) return "1 person working";
    return `${activeProjects} people working`;
  };

  return (
    <div className="w-fit rounded-lg h-20 py-4 flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg mb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs">Overview</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

export default TopTabs;