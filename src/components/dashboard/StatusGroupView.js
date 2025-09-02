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
    'Meeting': {
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
    'Break': {
      label: 'Break',
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
  const statusOrder = ['Available', 'Focus', 'Meeting', 'Emergency', 'Break', 'Away', 'Offline'];

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
                <div className="bg-neutral-700 text-neutral-400 text-xs rounded-[4px] aspect-square flex items-center justify-center w-4 h-4">
                  {userCount}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${config.textColor} ${config.bgColor}`}>
                {status === 'Meeting' ? 'Meeting' : 
                 status === 'Break' ? 'Break' :
                 status === 'Focus' ? 'Focus' :
                 status === 'Emergency' ? 'Emergency' :
                 status === 'Away' ? 'Away' :
                 status === 'Available' ? 'Available' : 'Offline'}
              </div>
            </div>

            {/* User Avatars */}
              <div className="flex items-center -space-x-2 relative">
               {statusUsers.slice(0, 5).map((user, index) => {
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
               {statusUsers.length > 5 && (
                 <div className="relative" style={{ zIndex: 6 }}>
                   <div className="w-9 h-9 rounded-full bg-neutral-700 border border-neutral-800 flex items-center justify-center" style={{ boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.35)' }}>
                     <span className="text-white text-xs font-medium">+{statusUsers.length - 5}</span>
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

export default StatusGroupView;