import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Link, ArrowLeft } from 'lucide-react';
import UserCard from './UserCard';

const RoleGroupDetails = ({ group, onUserClick, onClose }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [message]);

  if (!group) return null;

  const handleSendNudge = () => {
    if (message.trim()) {
      console.log(`Sending nudge to ${group.role} group: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className="w-80 flex flex-col h-full border border-neutral-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-white">Role Details</h2>
        </div>
        
        {/* Role Info */}
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-medium text-white">{group.role}</h3>
            <p className="text-neutral-400">{group.users.length} {group.users.length === 1 ? 'user' : 'users'}</p>
          </div>
        </div>
      </div>

      {/* Quick Nudge */}
      <div className="px-6 py-3 border-b border-neutral-700">
        <h3 className="text-md mb-3 text-white">Quick Nudge</h3>
        
        {/* Message Input */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 resize-none focus:outline-none focus:border-blue-500 transition-colors min-h-[44px] overflow-hidden"
              rows="1"
              style={{ height: 'auto' }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                <Link size={20} />
              </button>
            </div>
            
            <button
              onClick={handleSendNudge}
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send size={16} />
              <span>Send Nudge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <h3 className="text-md text-white mb-4">Role Members</h3>
        <div className="space-y-4">
          {group.users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => onUserClick(user)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleGroupDetails;