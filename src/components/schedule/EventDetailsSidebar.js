import React from 'react';
import { X, Users, MapPin, Check, MessageSquare, FileText, Edit3 } from 'lucide-react';
import SimpleBar from 'simplebar-react';

const EventDetailsSidebar = ({ event, onClose, onEdit, borderClasses = "border border-neutral-700 rounded-lg", isCurrentUser = true }) => {
  if (!event) return null;

  // Helper function to get status badge with same styling as event cards
  const getStatusBadge = (status, originalStatus = null) => {
    const statusConfig = {
      'Focus': { text: 'text-purple-400', bg: 'bg-purple-500/10' },
      'Available': { text: 'text-green-400', bg: 'bg-green-500/10' },
      'Meeting': { text: 'text-blue-400', bg: 'bg-blue-500/10' },
      'Break': { text: 'text-orange-400', bg: 'bg-orange-500/10' },
      'Emergency': { text: 'text-red-400', bg: 'bg-red-500/10' },
      'Away': { text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
      'Offline': { text: 'text-gray-400', bg: 'bg-gray-500/10' },
      'Busy': { text: 'text-red-400', bg: 'bg-red-500/10' },
      'Completed': { text: 'text-neutral-300', bg: 'bg-neutral-700' }
    };
    
    const config = statusConfig[status] || statusConfig['Available'];
    const displayText = status === 'Completed' && originalStatus ? originalStatus : status;
    
    return (
      <div className={`px-2 py-1 rounded text-xs font-medium ${config.text} ${config.bg}`}>
        {displayText}
      </div>
    );
  };

  // Helper function to format duration
  const formatDuration = (duration) => {
    if (!duration) return 'Duration not specified';
    return duration;
  };

  // Helper function to count linked items
  const getLinkedItemsCount = (event) => {
    const tasksCount = event.linkedTasks ? event.linkedTasks.length : 0;
    const nudgesCount = event.linkedNudges ? event.linkedNudges.length : 0;
    const filesCount = event.linkedFiles ? event.linkedFiles.length : 0;
    return tasksCount + nudgesCount + filesCount;
  };

  return (
    <div className={`w-full bg-transparent overflow-hidden flex flex-col ${borderClasses}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-700 flex-shrink-0">
        <h2 className="text-white text-lg font-semibold">Event Details</h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <SimpleBar className="flex-shrink-0" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="px-6 py-5 space-y-6">
        {/* Event Title and Status */}
        <div>
          <h1 className="text-white text-xl font-bold mb-2">{event.title}</h1>
          <div className="inline-block">
            {getStatusBadge(event.status || 'Available', event.originalStatus)}
          </div>
        </div>

        {/* Event Details Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <span>Time</span>
            </div>
            <div className="text-neutral-400 text-sm">
              {event.time || 'Time not specified'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-neutral-300">
              Duration
            </div>
            <div className="text-neutral-400 text-sm">
              {formatDuration(event.duration)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <span>Date</span>
            </div>
            <div className="text-neutral-400 text-sm">
              {event.date || 'Date not specified'}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-2">Description</h3>
          <div className="text-neutral-400 text-sm leading-relaxed">
            {event.description || 'No description provided for this event.'}
          </div>
        </div>

        {/* Attendees */}
        {(event.avatar || event.additionalPeople || event.attendees) && (
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-3">Attendees</h3>
            <div className="flex flex-wrap gap-2">
              {/* Current user */}
              {event.avatar && (
                <div className="flex items-center gap-2 bg-neutral-700/50 rounded-lg px-2 py-1">
                  <img 
                    src={event.avatar} 
                    alt="You" 
                    className="w-6 h-6 rounded-full object-cover border border-neutral-600"
                  />
                  <div className="text-white text-sm">You</div>
                </div>
              )}
              
              {/* Other attendees from attendees array */}
              {event.attendees && event.attendees.map((attendee, index) => (
                attendee.name !== 'You' && (
                  <div key={index} className="flex items-center gap-2 bg-neutral-700/50 rounded-lg px-2 py-1">
                    {attendee.avatar ? (
                      <img 
                        src={attendee.avatar} 
                        alt={attendee.name} 
                        className="w-6 h-6 rounded-full object-cover border border-neutral-600"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center text-neutral-300 text-xs font-medium">
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-neutral-400 text-sm">{attendee.name}</div>
                  </div>
                )
              ))}
              
              {/* Additional people count (fallback for legacy data) */}
              {event.additionalPeople && !event.attendees && (
                <div className="flex items-center gap-2 bg-neutral-700/50 rounded-lg px-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center text-neutral-300 text-xs font-medium">
                    {event.additionalPeople}
                  </div>
                  <div className="text-neutral-400 text-sm">Others</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-2">Location</h3>
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{event.location || 'No location specified'}</span>
          </div>
        </div>

        {/* Linked Context */}
        {getLinkedItemsCount(event) > 0 && (
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-3">Linked Context</h3>
            <div className="space-y-3">
              {/* Linked To-do */}
              {event.linkedTasks && event.linkedTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
                    <Check className="w-3 h-3" />
                    <span>To-do ({event.linkedTasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {event.linkedTasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded text-sm">
                        <Check className="w-3 h-3 text-neutral-400" />
                        <span className="text-white">{task.title || `Task ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Nudges */}
              {event.linkedNudges && event.linkedNudges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
                    <MessageSquare className="w-3 h-3" />
                    <span>Nudges ({event.linkedNudges.length})</span>
                  </div>
                  <div className="space-y-1">
                    {event.linkedNudges.map((nudge, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded text-sm">
                        <MessageSquare className="w-3 h-3 text-neutral-400" />
                        <span className="text-white">{nudge.title || `Nudge ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Files */}
              {event.linkedFiles && event.linkedFiles.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
                    <FileText className="w-3 h-3" />
                    <span>Files ({event.linkedFiles.length})</span>
                  </div>
                  <div className="space-y-1">
                    {event.linkedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded text-sm">
                        <FileText className="w-3 h-3 text-neutral-400" />
                        <span className="text-white">{file.name || `File ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions - Only show for current user's events */}
        {isCurrentUser && (
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-3">Quick actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg transition-colors text-sm">
                <Users className="w-4 h-4" />
                Invite Others
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg transition-colors text-sm">
                <Edit3 className="w-4 h-4" />
                Edit Event
              </button>
            </div>
          </div>
        )}
      </div>
      </SimpleBar>

      {/* Footer - Only show for current user's events */}
      {isCurrentUser && (
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg transition-colors">
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailsSidebar;