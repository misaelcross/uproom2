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
    <div className="w-fit rounded-lg h-20 py-4 flex flex-col justify-center">

      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Overview
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

export default TopTabs;