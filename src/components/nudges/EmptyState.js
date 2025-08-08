import React from 'react';
import { MessageSquare, BarChart3, Archive, Plus } from 'lucide-react';

const EmptyState = ({ onCreateNudge, onCreatePoll, onViewArchived, sortBy }) => {
  const getEmptyStateContent = () => {
    switch (sortBy) {
      case 'Drafts':
        return {
          title: 'No drafts yet',
          subtitle: 'Create your first draft to get started',
          icon: MessageSquare
        };
      case 'Archived':
        return {
          title: 'No archived nudges',
          subtitle: 'Archived nudges will appear here',
          icon: Archive
        };
      default:
        return {
          title: 'No nudge selected',
          subtitle: 'Select a nudge to view details or create a new one',
          icon: MessageSquare
        };
    }
  };

  const { title, subtitle, icon: Icon } = getEmptyStateContent();

  const quickActions = [
    {
      label: 'Create Nudge',
      icon: MessageSquare,
      onClick: onCreateNudge,
      description: 'Send a message or request'
    },
    {
      label: 'Create Poll',
      icon: BarChart3,
      onClick: onCreatePoll,
      description: 'Gather opinions and feedback'
    },
    {
      label: 'View Archived',
      icon: Archive,
      onClick: onViewArchived,
      description: 'Browse archived conversations'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-neutral-900 border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-neutral-700">
        <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-neutral-400" />
        </div>
        <div>
          <h2 className="text-white font-medium">{title}</h2>
          <p className="text-neutral-400 text-sm">{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Main illustration */}
        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-neutral-500" />
        </div>

        <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
        <p className="text-neutral-400 text-center mb-8 max-w-sm">
          {subtitle}
        </p>

        {/* Quick Actions */}
        {sortBy !== 'Archived' && (
          <div className="w-full max-w-sm space-y-3">
            <h4 className="text-sm font-medium text-neutral-300 mb-4">Quick Actions</h4>
            
            {quickActions.filter(action => 
              sortBy === 'Drafts' ? action.label !== 'View Archived' : true
            ).map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="w-full flex items-center gap-4 p-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 rounded-lg transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-neutral-700 group-hover:bg-neutral-600 rounded-lg flex items-center justify-center transition-colors">
                  <action.icon className="w-5 h-5 text-neutral-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{action.label}</div>
                  <div className="text-neutral-400 text-sm">{action.description}</div>
                </div>
                <Plus className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Archived specific content */}
        {sortBy === 'Archived' && (
          <div className="text-center">
            <p className="text-neutral-500 text-sm">
              When you archive nudges, they'll appear here for easy access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;