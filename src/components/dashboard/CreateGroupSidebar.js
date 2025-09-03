import React from 'react';
import { X, Users, UserPlus } from 'lucide-react';

const CreateGroupSidebar = ({ isOpen, onClose, onShowMemberSelection }) => {

  if (!isOpen) return null;

  const handleCreateClick = () => {
    onShowMemberSelection();
  };

  return (
    <div className="h-full bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Create group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Main illustration */}
        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Users className="w-12 h-12 text-neutral-500" />
        </div>

        <h3 className="text-xl font-medium text-white mb-2">Create Group</h3>
        <p className="text-neutral-400 text-center mb-8 max-w-sm">
          Organize your team members into groups for better collaboration and communication.
        </p>

        {/* Features */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <span>Choose team members to include</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <span>Set a custom group name</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <span>Send group messages instantly</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-sm space-y-3 mb-6">
          <button
            onClick={handleCreateClick}
            className="w-full flex items-center gap-4 p-4 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-lg transition-all duration-200 group"
          >
            <div className="w-10 h-10 group-hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors">
              <UserPlus className="w-5 h-5 text-neutral-300" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Select Team Members</div>
              <div className="text-neutral-400 text-sm">Choose from available team members to get started</div>
            </div>
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};

export default CreateGroupSidebar;