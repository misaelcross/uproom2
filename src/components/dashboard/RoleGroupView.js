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
            className="border border-neutral-700 rounded-lg p-4 transition-all duration-200 hover:bg-neutral-800/70 cursor-pointer"
            onClick={() => onGroupClick && onGroupClick({ role, users: roleUsers })}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-white text-lg font-semibold">{role}</h3>
                <div className="bg-neutral-700 text-neutral-400 text-xs px-2 py-1 rounded-md aspect-square flex items-center justify-center w-5 h-5">
                  {userCount}
                </div>
              </div>
            </div>

            {/* User Avatars */}
             <div className="flex items-center -space-x-2 relative">
              {roleUsers.slice(0, 5).map((user, index) => {
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
              {roleUsers.length > 5 && (
                 <div className="relative" style={{ zIndex: 6 }}>
                   <div className="w-9 h-9 rounded-full bg-neutral-700 border border-neutral-800 flex items-center justify-center" style={{ boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.35)' }}>
                     <span className="text-white text-xs font-medium">+{roleUsers.length - 5}</span>
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

export default RoleGroupView;