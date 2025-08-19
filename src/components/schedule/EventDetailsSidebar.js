import React from 'react';
import { X, Clock, Calendar, Users, MapPin, Paperclip, CheckSquare, MessageSquare, FileText, Edit3 } from 'lucide-react';
import SimpleBar from 'simplebar-react';

const EventDetailsSidebar = ({ event, onClose, onEdit, onLinkContext }) => {
  if (!event) return null;

  // Helper function to format event status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-green-400';
      case 'Meeting': return 'text-blue-400';
      case 'Focus': return 'text-purple-400';
      case 'Break': return 'text-yellow-400';
      case 'Emergency': return 'text-red-400';
      case 'Away': return 'text-orange-400';
      case 'Offline': return 'text-gray-400';
      default: return 'text-green-400';
    }
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
    <div className="w-full h-full bg-transparent rounded-lg overflow-hidden flex flex-col">
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
      <SimpleBar className="flex-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="px-6 py-5 space-y-6">
        {/* Event Title and Status */}
        <div>
          <h1 className="text-white text-xl font-bold mb-2">{event.title}</h1>
          <div className={`text-sm font-medium ${getStatusColor(event.status)}`}>
            {event.status || 'Available'}
          </div>
        </div>

        {/* Time and Duration */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Time</h3>
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{event.time || 'Time not specified'}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Duration</h3>
            <div className="text-neutral-400 text-sm">
              {formatDuration(event.duration)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Date</h3>
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{event.date || 'Date not specified'}</span>
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
        {(event.avatar || event.additionalPeople) && (
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-3">Attendees</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {event.avatar && (
                  <img 
                    src={event.avatar} 
                    alt="Attendee" 
                    className="w-8 h-8 rounded-full object-cover border border-neutral-600"
                  />
                )}
                <div className="text-white text-sm">You</div>
              </div>
              {event.additionalPeople && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-neutral-300 text-xs font-medium">
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
              {/* Linked Tasks */}
              {event.linkedTasks && event.linkedTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
                    <CheckSquare className="w-3 h-3" />
                    <span>Tasks ({event.linkedTasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {event.linkedTasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded text-sm">
                        <CheckSquare className="w-3 h-3 text-neutral-400" />
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

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-neutral-300 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => onLinkContext && onLinkContext(event)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"
            >
              <Paperclip className="w-4 h-4" />
              Link Context
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm">
              <Users className="w-4 h-4" />
              Invite Others
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm">
              <Edit3 className="w-4 h-4" />
              Edit Event
            </button>
          </div>
        </div>
      </div>

        {/* Footer */}
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
      </SimpleBar>
    </div>
  );
};

export default EventDetailsSidebar;