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
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Create group</h2>
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
              <Users className="w-8 h-8 text-black" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Create a New Group</h3>
              <p className="text-neutral-400 max-w-sm">
                Organize your team members into groups for better collaboration and communication.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Choose team members to include</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Set a custom group name</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Send group messages instantly</span>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Select Team Members
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

export default CreateGroupSidebar;