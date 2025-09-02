import React from 'react';
import { Users, Calendar, Clock, Send, X } from 'lucide-react';
import useEscapeKey from '../../hooks/useEscapeKey';

const ScheduleMeetingSidebar = ({ isOpen, onClose, onShowEmployeeList }) => {
  // Handle escape key to close the sidebar
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleScheduleClick = () => {
    onShowEmployeeList();
  };

  const quickActions = [
    {
      label: 'Choose team member',
      icon: Users,
      onClick: handleScheduleClick,
      description: 'Select from available team members to get started'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-neutral-900 border border-neutral-700 rounded-lg">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Main illustration */}
        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-12 h-12 text-neutral-500" />
        </div>

        <h3 className="text-xl font-medium text-white mb-2">Schedule Meeting</h3>
        <p className="text-neutral-400 text-center mb-8 max-w-sm">
          Select a team member from your team to schedule a meeting with them.
        </p>

        {/* Features */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <span>View team member availability</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <span>Choose convenient time slots</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <span>Send meeting requests instantly</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-sm space-y-3 mb-6">
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

        {/* Cancel Button */}
        <div className="w-full max-w-sm">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 p-3 hover:bg-neutral-800 border border-neutral-600 hover:border-neutral-500 rounded-lg transition-all duration-200 text-neutral-300 hover:text-white"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingSidebar;