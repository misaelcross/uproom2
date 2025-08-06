import React, { useState } from 'react';
import { ChevronDown, MoreVertical, Plus, Paperclip, Headset } from 'lucide-react';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import EventContextModal from './EventContextModal';

const Schedule = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Initialize schedule data in state
  const [scheduleData, setScheduleData] = useState([
    {
      day: '02',
      dayName: 'Monday',
      events: [
        {
          id: 1,
          title: 'Team Meeting',
          time: '11:30am - 12:00pm',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: true,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 2,
          title: 'Lunch break',
          time: '12:00am - 1:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 3,
          title: 'Product Review',
          time: '13:00pm - 4:30pm',
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
      dayName: 'Tuesday',
      events: [
        {
          id: 4,
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
          id: 5,
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
          id: 6,
          title: 'Lunch break',
          time: '12:00am - 1:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 7,
          title: 'Free for talk',
          time: '13:00pm - 2:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 8,
          title: 'Product Review',
          time: '13:00pm - 4:30pm',
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
      day: '04',
      dayName: 'Wednesday',
      events: [
        {
          id: 9,
          title: 'Team Meeting',
          time: '11:30am - 12:00am',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: false,
          status: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 10,
          title: 'Lunch break',
          time: '12:00am - 1:00pm',
          isCurrent: false,
          status: 'Available',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    }
  ]);

  // Function to handle opening context modal
  const handleOpenContextModal = (event) => {
    setSelectedEvent(event);
    setIsContextModalOpen(true);
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
      'Focus': { text: 'text-purple-500' },
      'Available': { text: 'text-green-500' },
      'Meeting': { text: 'text-blue-500' }
    };
    
    const config = statusConfig[status] || statusConfig['Available'];
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border border-neutral-700 ${config.text}`}>
        {status}
      </div>
    );
  };

  return (
    <div className="border border-neutral-700 rounded-lg max-w-md h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
        <h2 className="text-white text-lg font-semibold">My Schedule</h2>
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
      <div className="flex-1 overflow-y-auto px-6 pb-6">
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
                      className={`rounded-lg p-4 border ${getStatusColors(event.status)}`}
                    >
                      {/* Header with title and time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-medium text-white">
                          {event.title}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {event.time}
                        </div>
                      </div>

                    {/* Bottom section with status, actions, and avatar */}
                    <div className="flex items-center justify-between">
                      {/* Left side - Status badge */}
                      <div className="flex items-center gap-2">
                        {event.status && getStatusBadge(event.status)}
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
                              onClick={() => handleOpenContextModal(event)}
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
      </div>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Event Context Modal */}
      <EventContextModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        event={selectedEvent}
        onUpdateEvent={handleUpdateEvent}
      />
    </div>
  );
};

export default Schedule;