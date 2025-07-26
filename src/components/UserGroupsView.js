import React from 'react';

const UserGroupsView = ({ users, onUserClick, onGroupClick }) => {
  // Grupos de exemplo criados pelo usuário
  const userGroups = {
    "Q3 Overview": [
      users[0], users[1], users[2], users[3], users[4], users[5]
    ],
    "Cliente - The Fade Genius": [
      users[6], users[7], users[8], users[9]
    ]
  };

  // Função para obter tempo desde última atualização
  const getLastUpdateTime = (users) => {
    // Simulando diferentes tempos
    const times = ['2m', '12m', '3h', '23m', '4h', '1h', '1h'];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Função para obter contagem de usuários
  const getUserCount = (users) => {
    return users.length;
  };

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {Object.entries(userGroups).map(([groupName, groupUsers]) => {
        const userCount = getUserCount(groupUsers);
        const lastUpdate = getLastUpdateTime(groupUsers);
        
        return (
          <div
            key={groupName}
            className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 transition-all duration-200 hover:bg-neutral-800/70 cursor-pointer"
            onClick={() => onGroupClick && onGroupClick({ name: groupName, users: groupUsers })}
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
            </div>

            {/* User Avatars */}
            <div className="flex items-center space-x-2">
              {groupUsers.slice(0, 5).map((user, index) => (
                <button
                  key={user.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(user);
                  }}
                  className="relative hover:scale-110 transition-transform"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-neutral-700"
                  />
                </button>
              ))}
              {groupUsers.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">+{groupUsers.length - 5}</span>
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