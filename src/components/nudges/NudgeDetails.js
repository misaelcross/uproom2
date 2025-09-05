import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Send, Plus, Link2, CheckSquare } from 'lucide-react';
import FloatingUserCard from '../shared/FloatingUserCard';
import AvatarStack from '../shared/AvatarStack';
import RecipientList from './RecipientList';
import EmojiPicker from '../shared/EmojiPicker';
import { usersData } from '../../data/usersData';
import { getStatusColors, formatMentionName } from '../../utils/mentionUtils';
import useEscapeKey from '../../hooks/useEscapeKey';

const NudgeDetails = ({ nudge, onBack, onUserClick, onRecipientListClick }) => {
  // Handle Escape key to close the component view
  useEscapeKey(onBack);

  const [replies, setReplies] = useState([
    {
      id: 1,
      message: "Sure, I can help with those frontend fixes! When do you need them completed?",
      timestamp: "2:30 PM",
      date: "Today",
      isFromMe: true,
      user: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        status: 'online'
      }
    },
    {
      id: 2,
      message: "Perfect! I'd like to get them done by end of week if possible. I'll send you the detailed specs in a few minutes.",
      timestamp: "2:35 PM", 
      date: "Today",
      isFromMe: false,
      user: {
        id: 'user-5',
        name: 'Brent Short',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        status: 'online'
      }
    },
    {
      id: 3,
      message: "Sounds good! I'll review the specs and give you an estimate on timeline.",
      timestamp: "2:40 PM",
      date: "Today", 
      isFromMe: true,
      user: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        status: 'online'
      }
    }
  ]);
  const [replyMessage, setReplyMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [showPollResults, setShowPollResults] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showRecipientList, setShowRecipientList] = useState(false);

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
        isFromMe: true,
        user: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          status: 'online'
        }
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
    if (onUserClick && nudge?.senderName) {
      onUserClick({
        name: nudge.senderName,
        title: nudge.senderTitle,
        avatar: nudge.senderAvatar
      });
    }
  };

  const handleRecipientStackClick = () => {
    setShowRecipientList(true);
  };

  const handleBackFromRecipients = () => {
    setShowRecipientList(false);
  };

  const handleRecipientUserClick = (user) => {
    // Handle individual recipient click - could open user profile or start conversation
    console.log('Recipient clicked:', user);
  };

  const handlePollOptionClick = (optionIndex) => {
    setSelectedPollOption(optionIndex);
    setShowPollResults(true);
  };

  const handleUserMentionHover = (user, event) => {
    setHoveredUser(user);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleUserMentionLeave = () => {
    setHoveredUser(null);
  };

  const handleUserMentionClick = (user) => {
    if (onUserClick) {
      onUserClick(user);
    }
  };



  // Função para renderizar texto com menções de usuário
  const renderTextWithMentions = (text) => {
    // Regex para encontrar menções @username
    const mentionRegex = /@([\w\s]+?)(?=\s|$|[.,!?])/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Adicionar texto antes da menção
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const mentionName = match[1].trim();
      const user = usersData.find(u => 
        u.name.toLowerCase().includes(mentionName.toLowerCase()) ||
        mentionName.toLowerCase().includes(u.name.toLowerCase())
      );
      
      if (user) {
        const colors = getStatusColors(user.availability);
        parts.push(
          <span
            key={match.index}
            className={`inline-block px-2 py-1 rounded font-semibold text-xs cursor-pointer transition-colors hover:opacity-80 ${colors.text} ${colors.bg}`}
            onMouseEnter={(e) => handleUserMentionHover(user, e)}
            onMouseLeave={handleUserMentionLeave}
            onClick={() => handleUserMentionClick(user)}
          >
            @{formatMentionName(user.name)}
          </span>
        );
      } else {
        parts.push(
          <span key={match.index} className="inline-block px-2 py-1 rounded bg-gray-500/10 text-gray-400 font-semibold text-xs">
            @{mentionName}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  if (!nudge) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-400">
        <p>Select a nudge to view details</p>
      </div>
    );
  }

  // Show recipient list if requested
  if (showRecipientList && nudge.isAnnouncement && nudge.recipients) {
    return (
      <RecipientList
        recipients={nudge.recipients}
        onBack={handleBackFromRecipients}
        onUserClick={handleRecipientUserClick}
        title={`Recipients (${nudge.recipients.length})`}
      />
    );
  }

  return (
    <div className="h-full flex flex-col border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700 flex-shrink-0">
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
              src={nudge.senderAvatar} 
              alt={`${nudge.senderName} Profile`} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor('online')} rounded-full border-2 border-neutral-900`}></div>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl font-semibold">{nudge.senderName}</h2>
            <p className="text-neutral-400 text-sm">{nudge.senderTitle}</p>
          </div>
        </div>

        {/* Recipients Info for Announcement Nudges */}
        {nudge.isAnnouncement && nudge.recipients && nudge.recipients.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarStack 
                  users={nudge.recipients}
                  maxVisible={6}
                  size="sm"
                  showStatus={true}
                  onClick={handleRecipientStackClick}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto" data-simplebar>
          <div className="p-6">
        {/* High Priority Badge */}
        {nudge.isHighPriority && (
          <div className="mb-4 flex justify-center">
            <div className="inline-block px-2 py-1 rounded text-xs font-medium text-red-400 bg-red-500/10">
              High priority
            </div>
          </div>
        )}

        {/* Original Message - Reddit-style post */}
        <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          {/* Timestamp - Centered */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-neutral-400 text-sm">{nudge.timestamp}</span>
          </div>

          {/* Message */}
          <div className="mb-4">
            <div className="text-neutral-300 leading-relaxed">
              {renderTextWithMentions(nudge.fullMessage || nudge.message)}
            </div>
          </div>

          {/* Attachments */}
          {nudge.attachments && nudge.attachments.length > 0 && (
            <div className="space-y-2 mb-4">
              {nudge.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-600">
                  <Paperclip className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-300 text-sm">{attachment.name || attachment}</span>
                </div>
              ))}
            </div>
          )}

          {/* To-Do Link */}
          {nudge.todoLink && (
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-600 hover:border-neutral-500 hover:bg-neutral-700 transition-colors cursor-pointer">
                <CheckSquare className="w-4 h-4 text-white" />
                <div className="flex-1">
                  <span className="text-neutral-300 text-sm">{nudge.todoLink.title}</span>
                  <div className="text-neutral-500 text-xs mt-1">To-Do • {nudge.todoLink.status}</div>
                </div>
                <Link2 className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          )}

          {/* Poll Options */}
          {nudge.type === 'poll' && nudge.pollOptions && (
            <div className="mt-4 space-y-3">
              <h4 className="text-neutral-300 font-medium text-sm">Poll Options:</h4>
              {!showPollResults ? (
                // Show clickable options
                <div className="space-y-2">
                  {nudge.pollOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handlePollOptionClick(index)}
                      className="w-full text-left p-3 rounded-lg border border-neutral-600 hover:border-neutral-500 hover:bg-neutral-700 transition-colors text-neutral-300"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              ) : (
                // Show results with percentages
                <div className="space-y-2">
                  {nudge.pollOptions.map((option, index) => {
                    const isSelected = selectedPollOption === index;
                    const percentage = option.percentage || 0;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isSelected 
                            ? 'border-white bg-neutral-500/10' 
                            : 'border-neutral-600'
                        } relative overflow-hidden`}
                      >
                        {/* Progress bar background */}
                        <div 
                          className="absolute inset-0 bg-neutral-700/30 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="relative flex justify-between items-center">
                          <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-neutral-300'}`}>
                            {option.text}
                            {isSelected && ' ✓'}
                          </span>
                          <span className="text-neutral-400 text-sm font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => {
                      setShowPollResults(false);
                      setSelectedPollOption(null);
                    }}
                    className="text-neutral-400 hover:text-neutral-300 text-sm mt-2 transition-colors"
                  >
                    ← Back to options
                  </button>
                </div>
              )}
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
                
                {/* Reply bubble with commenter info */}
                <div className={`flex flex-col ${reply.isFromMe ? 'items-end' : 'items-start'}`}>
                  {/* Commenter name and avatar */}
                  {!reply.isFromMe && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                      <div className="relative">
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        {reply.user.status && (
                          <div 
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${getStatusDotColor(reply.user.status)} rounded-full border border-neutral-900`}
                          />
                        )}
                      </div>
                      <span className="text-neutral-400 text-xs font-medium">
                        {reply.user.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div className={`max-w-[70%] p-3 ${
                    reply.isFromMe 
                      ? 'bg-transparent border border-neutral-700 text-white rounded-lg rounded-br-none' 
                      : 'bg-neutral-800 border border-neutral-700 text-white rounded-lg rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{reply.message}</p>
                    <div className={`text-xs text-neutral-400 mt-1 ${
                      reply.isFromMe ? 'text-right' : 'text-left'
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
        </div>
      </div>

      {/* Actions - Sticky Footer */}
      <div className="sticky bottom-0 p-6 border-t border-neutral-700 bg-neutral-900 rounded-b-lg flex-shrink-0">
        {showSuccess && (
          <div className="mb-4 p-3 bg-neutral-800/50 border border-neutral-500/30 rounded-lg">
            <p className="text-white text-sm">Action completed successfully!</p>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={handleAddToTodo}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Add To-Do
            </button>
            <button
              onClick={() => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
              }}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Create Nudge
            </button>
          </div>
          
          {/* Reply Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder="Type your reply..."
                className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2.5 pr-20 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              {/* Attachment icon positioned to the left of emoji picker */}
              <button className="absolute right-10 top-1/2 transform -translate-y-1/2 p-2 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-700">
                <Paperclip className="w-4 h-4" />
              </button>
              {/* Emoji Picker positioned in bottom-right corner of input */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <EmojiPicker 
                  onEmojiSelect={(emoji, content) => setReplyMessage(prev => prev + emoji)}
                  position="bottom-right"
                />
              </div>
            </div>
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

      {/* Floating User Card */}
      {hoveredUser && (
        <FloatingUserCard
          user={hoveredUser}
          position={mousePosition}
          isVisible={!!hoveredUser}
          onClose={() => setHoveredUser(null)}
        />
      )}
    </div>
  );
};

export default NudgeDetails;