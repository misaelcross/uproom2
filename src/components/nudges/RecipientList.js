import React, { useState } from 'react';
import { ArrowLeft, Search, Users } from 'lucide-react';
import FloatingUserCard from '../shared/FloatingUserCard';
import { getStatusColors } from '../../utils/mentionUtils';
import SimpleBar from 'simplebar-react';

const RecipientList = ({ recipients = [], onBack, onUserClick, title = "Recipients" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Filter recipients based on search term
  const filteredRecipients = recipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipient.title && recipient.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusDotColor = (status) => {
    const colors = getStatusColors(status);
    return colors.dot;
  };

  const handleUserClick = (user) => {
    if (onUserClick) {
      onUserClick(user);
    }
  };

  const handleMouseEnter = (user, event) => {
    setHoveredUser(user);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  return (
    <div className="h-full flex flex-col border border-neutral-700 rounded-lg bg-neutral-900">
      {/* Header */}
      <div className="px-5 pt-4 pb-6 border-b border-neutral-700 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="hover:bg-neutral-800 rounded-lg p-1 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-white text-lg font-semibold">{title}</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
          />
        </div>
      </div>

      {/* Recipients List */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar className="h-full">
          <div className="p-4 space-y-2">
            {filteredRecipients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">
                  {searchTerm ? 'No recipients found' : 'No recipients available'}
                </p>
              </div>
            ) : (
              filteredRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer group"
                  onClick={() => handleUserClick(recipient)}
                  onMouseEnter={(e) => handleMouseEnter(recipient, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Avatar with Status */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={recipient.avatar}
                      alt={recipient.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {recipient.status && (
                      <div 
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor(recipient.status)} rounded-full border-2 border-neutral-900`}
                      />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate group-hover:text-white">
                      {recipient.name}
                    </h3>
                    {recipient.title && (
                      <p className="text-neutral-400 text-xs truncate">
                        {recipient.title}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  {recipient.status && (
                    <div className="flex-shrink-0">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        recipient.status === 'online' 
                          ? 'bg-green-500/10 text-green-400'
                          : recipient.status === 'away'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : recipient.status === 'busy'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-neutral-500/10 text-neutral-400'
                      }`}>
                        {recipient.status}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </SimpleBar>
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

export default RecipientList;