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
            {quickActions.filter(action => 
              sortBy === 'Drafts' ? action.label !== 'View Archived' : true
            ).map((action, index) => (
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