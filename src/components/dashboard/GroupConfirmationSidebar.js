import React, { useState } from 'react';
import { X, ArrowLeft, Users, MessageSquare, Send, Edit3 } from 'lucide-react';

const GroupConfirmationSidebar = ({ isOpen, onClose, onBack, selectedMembers, onConfirm }) => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const groupData = {
        name: groupName.trim(),
        members: selectedMembers,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        createdBy: 'current-user' // This would come from auth context
      };
      
      await onConfirm(groupData);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </button>
            <h2 className="text-lg font-semibold text-white">Confirm Group Creation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Group Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-neutral-400" />
                <label className="text-sm font-medium text-white">Group Name</label>
              </div>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-white transition-colors"
                maxLength={50}
              />
              <p className="text-xs text-neutral-500">{groupName.length}/50 characters</p>
            </div>

            {/* Selected Members */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                <label className="text-sm font-medium text-white">
                  Selected Members ({selectedMembers.length})
                </label>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 bg-neutral-800 rounded-lg">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{member.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{member.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-white">Summary</label>
              </div>
              <div className="p-3 bg-neutral-900 border border-neutral-600 rounded-lg">
                <div className="space-y-1 text-sm text-neutral-300">
                  <p>• Group name: {groupName || 'Not set'}</p>
                  <p>• Members: {selectedMembers.length} selected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-600 mt-auto">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !groupName.trim() || selectedMembers.length === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              isSubmitting || !groupName.trim() || selectedMembers.length === 0
                ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create Group
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupConfirmationSidebar;