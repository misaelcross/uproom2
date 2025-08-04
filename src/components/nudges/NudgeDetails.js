import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Calendar, Plus } from 'lucide-react';

const NudgeDetails = ({ nudge, onBack, onUserClick }) => {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const handleReschedule = () => {
    setIsRescheduling(true);
    setTimeout(() => {
      setIsRescheduling(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleAddToTodo = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSenderClick = () => {
    if (onUserClick && nudge?.sender) {
      onUserClick(nudge.sender);
    }
  };

  if (!nudge) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <p>Select a nudge to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <h2 className="text-white text-lg font-semibold">Nudge Details</h2>
        </div>

        {/* Sender Info - Clickable */}
        <div 
          className="flex items-center gap-4 cursor-pointer hover:bg-neutral-800 rounded-lg p-2 -m-2 transition-colors"
          onClick={handleSenderClick}
        >
          <div className="relative">
            <img 
              src={nudge.sender.avatar} 
              alt={`${nudge.sender.name} Profile`} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor(nudge.sender.status)} rounded-full border-2 border-neutral-900`}></div>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl font-semibold">{nudge.sender.name}</h2>
            <p className="text-neutral-400 text-sm">{nudge.sender.title}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Timestamp - Centered */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-neutral-400 text-sm">{nudge.timestamp}</span>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-neutral-300 leading-relaxed">
            {nudge.message}
          </p>
        </div>

        {/* Attachments */}
        {nudge.attachments && nudge.attachments.length > 0 && (
          <div className="mb-6">
            <div className="space-y-2">
              {nudge.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700">
                  <Paperclip className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300 text-sm">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-neutral-700">
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">Action completed successfully!</p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToTodo}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to my To-Do
          </button>
          
          <button
            onClick={handleReschedule}
            disabled={isRescheduling}
            className="w-full border border-neutral-600 hover:border-neutral-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            {isRescheduling ? 'Rescheduling...' : 'Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NudgeDetails;