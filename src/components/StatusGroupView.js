import React from 'react';

const StatusGroupView = ({ users, onUserClick, onGroupClick }) => {
  // Agrupar usuários por status
  const groupedUsers = users.reduce((groups, user) => {
    const status = user.availability;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(user);
    return groups;
  }, {});

  // Configuração dos status com cores e informações
  const statusConfig = {
    'In meeting': {
      label: 'In a Meeting',
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    'Away': {
      label: 'Away',
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    'Focus': {
      label: 'Focus',
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    'Available': {
      label: 'Available',
      color: 'bg-green-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    'Emergency': {
      label: 'Emergency',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    'Out for Lunch': {
      label: 'Out for Lunch',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    'Offline': {
      label: 'Offline',
      color: 'bg-gray-500',
      textColor: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20'
    }
  };

  // Função para obter contagem de usuários
  const getUserCount = (users) => {
    return users.length;
  };

  // Definir ordem específica dos status
  const statusOrder = ['Available', 'Focus', 'In meeting', 'Emergency', 'Out for Lunch', 'Away', 'Offline'];

  // Ordenar os grupos de acordo com a ordem definida
  const sortedGroupEntries = statusOrder
    .filter(status => groupedUsers[status]) // Apenas incluir status que têm usuários
    .map(status => [status, groupedUsers[status]]);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {sortedGroupEntries.map(([status, statusUsers]) => {
        const config = statusConfig[status] || statusConfig['Available'];
        const userCount = getUserCount(statusUsers);
        
        return (
          <div
            key={status}
            className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 transition-all duration-200 hover:bg-opacity-20 cursor-pointer`}
            onClick={() => onGroupClick && onGroupClick({ status, users: statusUsers, config })}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-white text-lg font-semibold">{config.label}</h3>
                <div className="bg-neutral-700 text-neutral-400 text-xs rounded aspect-square flex items-center justify-center w-4 h-4">
                  {userCount}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${config.textColor} ${config.bgColor}`}>
                {status === 'In meeting' ? 'In meeting' : 
                 status === 'Out for Lunch' ? 'Out for Lunch' :
                 status === 'Focus' ? 'Focus' :
                 status === 'Emergency' ? 'Emergency' :
                 status === 'Away' ? 'Away' :
                 status === 'Available' ? 'Available' : 'Offline'}
              </div>
            </div>

            {/* User Avatars */}
            <div className="flex items-center space-x-2">
              {statusUsers.slice(0, 5).map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => onUserClick(user)}
                  className="relative hover:scale-110 transition-transform"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-neutral-700"
                  />
                </button>
              ))}
              {statusUsers.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">+{statusUsers.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusGroupView;