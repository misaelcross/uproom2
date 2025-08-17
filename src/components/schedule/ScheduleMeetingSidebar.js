import React from 'react';
import { X, Users, Calendar } from 'lucide-react';

const ScheduleMeetingSidebar = ({ isOpen, onClose, onShowEmployeeList }) => {

  if (!isOpen) return null;

  const handleScheduleClick = () => {
    onShowEmployeeList();
  };

  return (
    <div className="h-full bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Schedule Meeting</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-black" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Schedule a Meeting</h3>
              <p className="text-neutral-400 max-w-sm">
                Select a team member from your team to schedule a meeting with them.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>View team member availability</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Choose convenient time slots</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Send meeting requests instantly</span>
              </div>
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleScheduleClick}
              className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors font-medium"
            >
              <Users className="w-5 h-5" />
              Choose Team Member
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-700">
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Select from available team members to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingSidebar;