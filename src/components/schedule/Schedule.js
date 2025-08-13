import React, { useState } from 'react';
import { ChevronDown, MoreVertical, Plus, Paperclip, Headset } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import EventContextModal from './EventContextModal';
import EventDetailsModal from './EventDetailsModal';

const Schedule = ({ fullWidth = false, viewMode = 'Day', scheduleData: externalScheduleData = null, userName = null }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contextModalSource, setContextModalSource] = useState(null); // 'details' or 'direct'
  
  // Default schedule data for current user
  const defaultScheduleData = [
    {
      day: '30',
      dayName: 'Sunday',
      events: [
        {
          id: 1,
          title: 'Family Time',
          time: '10:00am - 12:00pm',
          date: 'Sunday, July 30, 2025',
          duration: '2 hours',
          description: 'Quality time with family. Planned activities include board games and outdoor activities.',
          location: 'Home',
          isCurrent: false,
          status: 'Available',
          attendees: [
            { name: 'You', avatar: null },
            { name: 'Family Members', avatar: null }
          ],
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    },
    {
      day: '01',
      dayName: 'Monday',
      events: [
        {
          id: 2,
          title: 'Team Meeting',
          time: '11:30am - 12:00pm',
          date: 'Monday, July 01, 2025',
          duration: '30 minutes',
          description: 'Weekly team sync to discuss project progress, blockers, and upcoming milestones.',
          location: 'Conference Room A / Zoom',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: true,
          status: 'Meeting',
          attendees: [
            { name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop' },
            { name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop' },
            { name: 'Emma Davis', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop' },
            { name: 'Alex Rodriguez', avatar: null }
          ],
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 3,
          title: 'Lunch break',
          time: '12:00pm - 1:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 4,
          title: 'Product Review',
          time: '1:00pm - 4:30pm',
          date: 'Monday, July 01, 2025',
          duration: '3 hours 30 minutes',
          description: 'Comprehensive review of the new product features, user feedback analysis, and planning for next iteration.',
          location: 'Design Studio',
          isCurrent: false,
          status: 'Focus',
          attendees: [
            { name: 'You', avatar: null },
            { name: 'Product Team', avatar: null }
          ],
          linkedTasks: [
            { id: 1, title: 'Prepare user feedback report', completed: true },
            { id: 2, title: 'Review design mockups', completed: false }
          ],
          linkedNudges: [
            { id: 1, title: 'Follow up on user testing results' }
          ],
          linkedFiles: [
            { id: 1, name: 'Product_Review_Q3.pdf', type: 'pdf' },
            { id: 2, name: 'User_Feedback_Analysis.xlsx', type: 'excel' }
          ]
        }
      ]
    },
    {
      day: '02',
      dayName: 'Tuesday',
      events: [
        {
          id: 5,
          title: 'Daily Meeting',
          time: '09:30am - 10:00am',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          isCurrent: false,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 6,
          title: 'Clients Meeting',
          time: '10:15am - 12:00pm',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          isCurrent: false,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 7,
          title: 'Lunch break',
          time: '12:00pm - 1:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 8,
          title: 'Free for talk',
          time: '1:00pm - 2:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 9,
          title: 'Product Review',
          time: '2:00pm - 4:30pm',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: false,
          status: 'Focus',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    },
    {
      day: '03',
      dayName: 'Wednesday',
      events: [
        {
          id: 10,
          title: 'Team Meeting',
          time: '11:30am - 12:00pm',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: false,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 11,
          title: 'Lunch break',
          time: '12:00pm - 1:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    },
    {
      day: '04',
      dayName: 'Thursday',
      events: [
        {
          id: 12,
          title: 'Sprint Planning',
          time: '9:00am - 11:00am',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+5',
          isCurrent: false,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 13,
          title: 'Code Review',
          time: '2:00pm - 3:30pm',
          isCurrent: false,
          status: 'Focus',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    },
    {
      day: '05',
      dayName: 'Friday',
      events: [
        {
          id: 14,
          title: 'Weekly Retrospective',
          time: '10:00am - 11:00am',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+4',
          isCurrent: false,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 15,
          title: 'Team Lunch',
          time: '12:30pm - 2:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    },
    {
      day: '06',
      dayName: 'Saturday',
      events: []
    }
  ];

  // Use external data if provided, otherwise use default data and state management
  const [internalScheduleData, setInternalScheduleData] = useState(defaultScheduleData);
  const scheduleData = externalScheduleData || internalScheduleData;
  const setScheduleData = externalScheduleData ? () => {} : setInternalScheduleData;

  // Function to handle opening context modal
  const handleOpenContextModal = (event, source = 'direct') => {
    setSelectedEvent(event);
    setContextModalSource(source);
    setIsContextModalOpen(true);
  };

  // Function to handle opening event details modal
  const handleOpenEventDetails = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  // Function to handle opening context modal from event details
  const handleLinkContextFromDetails = (event) => {
    setIsEventDetailsModalOpen(false);
    handleOpenContextModal(event, 'details');
  };

  // Function to handle closing context modal
  const handleCloseContextModal = () => {
    setIsContextModalOpen(false);
    // If context modal was opened from details modal, return to details modal
    if (contextModalSource === 'details') {
      setIsEventDetailsModalOpen(true);
    }
    setContextModalSource(null);
  };

  // Function to update event with new context
  const handleUpdateEvent = (updatedEvent) => {
    setScheduleData(prevData => 
      prevData.map(dayData => ({
        ...dayData,
        events: dayData.events.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        )
      }))
    );
  };

  // Helper function to get total linked items count
  const getLinkedItemsCount = (event) => {
    return (event.linkedTasks?.length || 0) + 
           (event.linkedNudges?.length || 0) + 
           (event.linkedFiles?.length || 0);
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Focus': { text: 'text-purple-400', bg: 'bg-purple-500/10' },
      'Available': { text: 'text-green-400', bg: 'bg-green-500/10' },
      'Meeting': { text: 'text-blue-400', bg: 'bg-blue-500/10' }
    };
    
    const config = statusConfig[status] || statusConfig['Available'];
    
    return (
      <div className={`px-2 py-1 rounded text-xs font-medium ${config.text} ${config.bg}`}>
        {status}
      </div>
    );
  };

  return (
    <div className={`border border-neutral-700 rounded-lg h-full flex flex-col ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {/* Fixed Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
        <h2 className="text-white text-lg font-semibold">
          {userName ? `${userName}'s Schedule` : 'My Schedule'}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center justify-center px-3 py-2 border border-neutral-700 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            <Headset className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 px-3 py-2 border border-neutral-700 text-white rounded-lg">
            <span className="text-sm">Jul 2025</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <SimpleBar className="flex-1 px-6 pb-6">
        {viewMode === 'Week' ? (
          /* Week View - Days in columns */
          <div className="grid grid-cols-7 gap-2 h-full">
            {scheduleData.map((dayData) => (
              <div key={dayData.day} className="flex flex-col">
                {/* Day Header */}
                <div className="flex flex-col items-center mb-3 pb-2 border-b border-neutral-700">
                  <div className="text-white text-lg font-semibold">{dayData.day}</div>
                  <div className="text-neutral-400 text-xs">{dayData.dayName}</div>
                </div>

                {/* Events for this day */}
                <div className="space-y-2 flex-1">
                  {dayData.events.length > 0 ? dayData.events.map((event) => {
                    // Define colors based on status
                    const getStatusColors = (status) => {
                      switch(status) {
                        case 'Focus':
                          return 'bg-purple-500/10 border-purple-500/20';
                        case 'Available':
                          return 'bg-green-500/10 border-green-500/20';
                        case 'Meeting':
                          return 'bg-blue-500/10 border-blue-500/20';
                        default:
                          return 'bg-neutral-500/10 border-neutral-500/20';
                      }
                    };

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleOpenEventDetails(event)}
                        className={`rounded p-1.5 border ${getStatusColors(event.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {/* Header with title and status */}
                        <div className="flex items-start justify-between mb-1">
                          <div className="text-xs font-medium text-white truncate flex-1 pr-1">
                            {event.title}
                          </div>
                          <div className="flex items-center">
                            {event.status && getStatusBadge(event.status, 'xs')}
                          </div>
                        </div>

                        {/* Time */}
                        <div className="text-xs text-neutral-300 mb-1">
                          {event.time}
                        </div>

                        {/* Bottom section with actions and avatar */}
                        <div className="flex items-center justify-between">
                          {/* Paperclip icon with counter */}
                          <div className="flex items-center gap-1">
                            {getLinkedItemsCount(event) > 0 && (
                              <span className="text-[10px] text-neutral-400">
                                {getLinkedItemsCount(event)}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenContextModal(event);
                              }}
                              className="p-0.5 hover:bg-opacity-20 hover:bg-white rounded transition-colors text-neutral-400"
                              title="Link tasks, nudges, and files"
                            >
                              <Paperclip className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          {/* Avatar and additional people count */}
                          <div className="flex items-center gap-1">
                            {event.avatar && (
                              <img 
                                src={event.avatar} 
                                alt="Avatar" 
                                className="w-4 h-4 rounded-full object-cover border border-gray-200"
                              />
                            )}
                            {event.additionalPeople && (
                              <span className="text-xs text-white">
                                {event.additionalPeople}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-xs text-neutral-500 text-center py-4">
                      No events
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Day View - Days in rows (original layout) */
          <div className="space-y-1">
            {scheduleData.map((dayData) => (
              <div key={dayData.day} className="flex gap-4 py-4 border-b border-neutral-700">
                {/* Day Column */}
                <div className="flex flex-col items-center w-[50px]">
                  <div className="text-white text-2xl font-semibold">{dayData.day}</div>
                  <div className="text-neutral-400 text-xs">{dayData.dayName}</div>
                </div>

                {/* Events Column */}
                <div className="flex-1 space-y-3">
                  {dayData.events.map((event) => {
                    // Define colors based on status
                    const getStatusColors = (status) => {
                      switch(status) {
                        case 'Focus':
                          return 'bg-purple-500/10 border-purple-500/20';
                        case 'Available':
                          return 'bg-green-500/10 border-green-500/20';
                        case 'Meeting':
                          return 'bg-blue-500/10 border-blue-500/20';
                        default:
                          return 'bg-neutral-500/10 border-neutral-500/20';
                      }
                    };

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleOpenEventDetails(event)}
                        className={`rounded-lg p-2 border ${getStatusColors(event.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {/* Header with title and status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-medium text-white">
                            {event.title}
                          </div>
                          <div className="flex items-center gap-2">
                            {event.status && getStatusBadge(event.status)}
                          </div>
                        </div>

                      {/* Bottom section with time, actions, and avatar */}
                      <div className="flex items-center justify-between">
                        {/* Left side - Time */}
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-neutral-300">
                            {event.time}
                          </div>
                        </div>

                          {/* Right side - Actions and avatar */}
                          <div className="flex items-center gap-1">
                            {/* Paperclip icon with counter */}
                            <div className="flex items-center gap-1">
                              {getLinkedItemsCount(event) > 0 && (
                                <span className="text-[10px] text-neutral-400">
                                  {getLinkedItemsCount(event)}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenContextModal(event);
                                }}
                                className="p-1 hover:bg-opacity-20 hover:bg-white rounded transition-colors text-neutral-400"
                                title="Link tasks, nudges, and files"
                              >
                                <Paperclip className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Avatar and additional people count */}
                            <div className="flex items-center gap-1">
                              {event.avatar && (
                                <img 
                                  src={event.avatar} 
                                  alt="Avatar" 
                                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                />
                              )}
                              {event.additionalPeople && (
                                <span className="text-xs text-white">
                                  {event.additionalPeople}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </SimpleBar>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Event Context Modal */}
      <EventContextModal
        isOpen={isContextModalOpen}
        onClose={handleCloseContextModal}
        event={selectedEvent}
        onUpdateEvent={handleUpdateEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => setIsEventDetailsModalOpen(false)}
        event={selectedEvent}
        onLinkContext={handleLinkContextFromDetails}
        onEdit={(event) => {
          setIsEventDetailsModalOpen(false);
          // Aqui você pode abrir um modal de edição ou navegar para uma página de edição
          console.log('Edit event:', event);
        }}
        onDelete={(event) => {
          setIsEventDetailsModalOpen(false);
          // Aqui você pode implementar a lógica de exclusão
          console.log('Delete event:', event);
        }}
      />
    </div>
  );
};

export default Schedule;