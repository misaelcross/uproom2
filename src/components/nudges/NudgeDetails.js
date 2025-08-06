import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Send, Plus } from 'lucide-react';

const NudgeDetails = ({ nudge, onBack, onUserClick }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replies, setReplies] = useState([
    {
      id: 1,
      message: "Sure, I can help with those frontend fixes! When do you need them completed?",
      timestamp: "2:30 PM",
      date: "Today",
      isFromMe: true
    },
    {
      id: 2,
      message: "Perfect! I'd like to get them done by end of week if possible. I'll send you the detailed specs in a few minutes.",
      timestamp: "2:35 PM", 
      date: "Today",
      isFromMe: false
    },
    {
      id: 3,
      message: "Sounds good! I'll review the specs and give you an estimate on timeline.",
      timestamp: "2:40 PM",
      date: "Today", 
      isFromMe: true
    }
  ]);

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      const newReply = {
        id: replies.length + 1,
        message: replyMessage.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        date: "Today",
        isFromMe: true
      };
      setReplies(prev => [...prev, newReply]);
      setReplyMessage('');
    }
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
        {/* Original Message - Reddit-style post */}
        <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          {/* Timestamp - Centered */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-neutral-400 text-sm">{nudge.timestamp}</span>
          </div>

          {/* Message */}
          <div className="mb-4">
            <p className="text-neutral-300 leading-relaxed">
              {nudge.fullMessage || nudge.message}
            </p>
          </div>

          {/* Attachments */}
          {nudge.attachments && nudge.attachments.length > 0 && (
            <div className="space-y-2">
              {nudge.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-600">
                  <Paperclip className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300 text-sm">{attachment}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div className="space-y-4">
          {replies.map((reply, index) => {
            const showDate = index === 0 || replies[index - 1].date !== reply.date;
            
            return (
              <div key={reply.id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-neutral-500 text-xs bg-neutral-800 px-3 py-1 rounded-full">
                      {reply.date}
                    </span>
                  </div>
                )}
                
                {/* Reply bubble */}
                <div className={`flex ${reply.isFromMe ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3 border border-neutral-700 ${
                    reply.isFromMe 
                      ? 'bg-neutral-800 text-white rounded-lg rounded-bl-none' 
                      : 'bg-neutral-900 text-white rounded-lg rounded-br-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{reply.message}</p>
                    <div className={`text-xs text-neutral-400 mt-1 ${
                      reply.isFromMe ? 'text-left' : 'text-right'
                    }`}>
                      {reply.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-neutral-700">
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">Action completed successfully!</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleAddToTodo}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to my To-Do
          </button>
          
          {/* Reply Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Type your reply..."
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2.5 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-700 disabled:text-neutral-400 text-white border border-neutral-600 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NudgeDetails;