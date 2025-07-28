import React from 'react';

const RoleGroupView = ({ users, onUserClick, onGroupClick }) => {
  // Agrupar usuários por cargo
  const groupedUsers = users.reduce((groups, user) => {
    const role = user.title;
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(user);
    return groups;
  }, {});

  // Função para obter contagem de usuários
  const getUserCount = (users) => {
    return users.length;
  };

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {Object.entries(groupedUsers).map(([role, roleUsers]) => {
        const userCount = getUserCount(roleUsers);
        
        return (
          <div
            key={role}
            className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 transition-all duration-200 hover:bg-neutral-800/70 cursor-pointer"
            onClick={() => onGroupClick && onGroupClick({ role, users: roleUsers })}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-white text-lg font-semibold">{role}</h3>
                <div className="bg-neutral-700 text-neutral-400 text-xs px-2 py-1 rounded aspect-square flex items-center justify-center w-5 h-5">
                  {userCount}
                </div>
              </div>
            </div>

            {/* User Avatars */}
            <div className="flex items-center space-x-2">
              {roleUsers.slice(0, 5).map((user, index) => (
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
              {roleUsers.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">+{roleUsers.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoleGroupView;