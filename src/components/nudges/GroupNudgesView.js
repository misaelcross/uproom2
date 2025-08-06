import React from 'react';

const GroupNudgesView = ({ users, onCreateGroupNudge }) => {
  // Grupos de exemplo criados pelo usuário
  const userGroups = {
    "Q3 Overview": [
      users[0], users[1], users[2], users[3], users[4], users[5]
    ],
    "Client - The Fade Genius": [
      users[6], users[7], users[8], users[9]
    ]
  };

  // Função para obter contagem de usuários
  const getUserCount = (users) => {
    return users.length;
  };

  // Função para lidar com criação de nudge para grupo
  const handleCreateNudge = (groupName, groupUsers) => {
    onCreateGroupNudge({ name: groupName, users: groupUsers });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Send Nudge to Groups</h2>
        <span className="text-neutral-400 text-sm">{Object.keys(userGroups).length} groups</span>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {Object.entries(userGroups).map(([groupName, groupUsers]) => {
          const userCount = getUserCount(groupUsers);
          
          return (
            <div
              key={groupName}
              className="border border-neutral-700 rounded-lg p-4 transition-all duration-200 hover:bg-neutral-800/70"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-white text-lg font-semibold truncate max-w-[200px]" title={groupName}>
                    {groupName}
                  </h3>
                  <div className="bg-neutral-700 text-neutral-400 text-xs px-2 py-1 rounded aspect-square flex items-center justify-center w-5 h-5">
                    {userCount}
                  </div>
                </div>
                <button
                  onClick={() => handleCreateNudge(groupName, groupUsers)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Send Nudge
                </button>
              </div>

              {/* User Avatars */}
              <div className="flex items-center space-x-2">
                {groupUsers.slice(0, 5).map((user, index) => (
                  <div
                    key={user.id}
                    className="relative"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-neutral-700"
                    />
                    {/* Status indicator */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-800 ${
                      user.status === 'online' ? 'bg-green-500' :
                      user.status === 'away' ? 'bg-yellow-500' :
                      user.status === 'busy' ? 'bg-red-500' : 'bg-neutral-500'
                    }`}></div>
                  </div>
                ))}
                {groupUsers.length > 5 && (
                  <div className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">+{groupUsers.length - 5}</span>
                  </div>
                )}
              </div>

              {/* Group members preview */}
              <div className="mt-3 pt-3 border-t border-neutral-700">
                <div className="flex flex-wrap gap-1">
                  {groupUsers.slice(0, 3).map((user, index) => (
                    <span key={user.id} className="text-neutral-400 text-xs">
                      {user.name}{index < Math.min(groupUsers.length - 1, 2) ? ',' : ''}
                    </span>
                  ))}
                  {groupUsers.length > 3 && (
                    <span className="text-neutral-500 text-xs">
                      and {groupUsers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupNudgesView;