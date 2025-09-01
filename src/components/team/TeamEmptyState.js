import React from 'react';
import { Users, UserPlus, Download, Shield, Edit } from 'lucide-react';

const TeamEmptyState = ({ onAddUser, onImportUsers, onManageRoles, onBulkEdit }) => {
  const quickActions = [
    {
      label: 'Add new user',
      icon: UserPlus,
      onClick: onAddUser,
      description: 'Invite a new team member'
    },
    {
      label: 'Bulk Edit',
      icon: Edit,
      onClick: onBulkEdit,
      description: 'Edit multiple users at once'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-neutral-900 border border-neutral-700 rounded-lg">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Main illustration */}
        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Users className="w-12 h-12 text-neutral-500" />
        </div>

        <h3 className="text-xl font-medium text-white mb-2">Select a user</h3>
        <p className="text-neutral-400 text-center mb-8 max-w-sm">
          Click on a user from the table to view their details or manage your team
        </p>

        {/* Quick Actions */}
        <div className="w-full max-w-sm space-y-3">            
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full flex items-center gap-4 p-4 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 group-hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors">
                <action.icon className="w-5 h-5 text-neutral-300" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{action.label}</div>
                <div className="text-neutral-400 text-sm">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamEmptyState;