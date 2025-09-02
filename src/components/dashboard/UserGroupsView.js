import React from 'react';

const UserGroupsView = ({ users, onUserClick, onGroupClick, createdGroups = [] }) => {
  // Grupos de exemplo criados pelo usuário
  const defaultGroups = {
    "Q3 Overview": [
      users[0], users[1], users[2], users[3], users[4], users[5]
    ],
    "Client - The Fade Genius": [
      users[6], users[7], users[8], users[9]
    ]
  };

  // Combinar grupos padrão com grupos criados dinamicamente
  const allGroups = {
    ...defaultGroups,
    ...createdGroups.reduce((acc, group) => {
      acc[group.name] = group.members;
      return acc;
    }, {})
  };

  // Função para obter contagem de usuários
  const getUserCount = (users) => {
    return users.length;
  };

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {Object.entries(allGroups).map(([groupName, groupUsers]) => {
        const userCount = getUserCount(groupUsers);
        
        return (
          <div
            key={groupName}
            className="border border-neutral-700 rounded-lg p-4 transition-all duration-200 hover:bg-neutral-800/70 cursor-pointer"
            onClick={() => onGroupClick && onGroupClick({ name: groupName, users: groupUsers })}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-white text-lg font-semibold truncate max-w-[200px]" title={groupName}>
                  {groupName}
                </h3>
                <div className="bg-neutral-700 text-neutral-400 text-xs px-2 py-1 rounded-md aspect-square flex items-center justify-center w-5 h-5">
                  {userCount}
                </div>
              </div>
            </div>

            {/* User Avatars */}
            <div className="flex items-center -space-x-2 relative">
              {groupUsers.slice(0, 5).map((user, index) => {
                const getStatusDotColor = (availability) => {
                  switch (availability) {
                    case 'Available': return 'bg-green-500';
                    case 'Meeting': return 'bg-blue-500';
                    case 'Break': return 'bg-yellow-500';
                    case 'Focus': return 'bg-purple-500';
                    case 'Emergency': return 'bg-red-500';
                    case 'Away': return 'bg-orange-500';
                    case 'Offline': return 'bg-gray-500';
                    default: return 'bg-green-500';
                  }
                };

                return (
                  <div key={user.id} className="relative" style={{ zIndex: index + 1 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserClick(user);
                      }}
                      className="block"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full border border-neutral-800 cursor-pointer hover:border-neutral-200 transition-colors"
                        style={{ 
                          boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.35)'
                        }}
                        title={user.name}
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor(user.availability)} rounded-full border-2 border-neutral-900`}></div>
                    </button>
                  </div>
                );
              })}
              {groupUsers.length > 5 && (
                <div className="relative" style={{ zIndex: 6 }}>
                  <div className="w-9 h-9 rounded-full bg-neutral-700 border border-neutral-800 flex items-center justify-center" style={{ boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.35)' }}>
                    <span className="text-white text-xs font-medium">+{groupUsers.length - 5}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserGroupsView;