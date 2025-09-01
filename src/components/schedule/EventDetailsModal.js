import React from 'react';
import { X, Clock, Calendar, Users, MapPin, Paperclip, CheckSquare, MessageSquare, FileText, Edit3 } from 'lucide-react';

const EventDetailsModal = ({ isOpen, onClose, event, onEdit, onLinkContext }) => {
  if (!isOpen || !event) return null;

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Focus': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
      'Available': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      'Meeting': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      'Busy': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
      'Completed': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' }
    };

    const config = statusConfig[status] || statusConfig['Available'];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  // Helper function to get linked items count
  const getLinkedItemsCount = (event) => {
    return (event.linkedTasks?.length || 0) + 
           (event.linkedNudges?.length || 0) + 
           (event.linkedFiles?.length || 0);
  };

  // Helper function to format time duration
  const getEventDuration = (timeString) => {
    if (!timeString) return '';
    const [start, end] = timeString.split(' - ');
    if (!start || !end) return timeString;
    
    // Simple duration calculation (this could be more sophisticated)
    const startTime = new Date(`2024-01-01 ${start}`);
    const endTime = new Date(`2024-01-01 ${end}`);
    const diffMs = endTime - startTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`;
    }
    return `${diffMinutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh]" data-simplebar>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
              {getStatusBadge(event.status)}
            </div>
            <div className="flex items-center gap-4 text-neutral-400 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
                {getEventDuration(event.time) && (
                  <span className="text-neutral-500">({getEventDuration(event.time)})</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Today</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                title="Edit event"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Description */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-2">Description</h3>
            <div className="text-neutral-400 text-sm">
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
            <h3 className="text-sm font-medium text-neutral-300 mb-3">Quick actions</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => onLinkContext && onLinkContext(event)}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"
              >
                <Paperclip className="w-4 h-4" />
                Link Context
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm">
                <Users className="w-4 h-4" />
                Invite Others
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm">
                <Edit3 className="w-4 h-4" />
                Edit Event
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;