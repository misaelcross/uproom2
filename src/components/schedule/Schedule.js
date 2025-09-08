import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Plus, X, Save, Users, Link } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';


import MonthlyCalendar from './MonthlyCalendar';
import { usersData } from '../../data/usersData';


const Schedule = ({ fullWidth = false, viewMode = 'Day', scheduleData: externalScheduleData = null, userName = null, onEventSelect = null, noBorder = false }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1600);

  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: null,
    endTime: null,
    people: [],
    links: []
  });

  // People dropdown state
  const [peopleSearchTerm, setPeopleSearchTerm] = useState('');
  const [isPeopleDropdownOpen, setIsPeopleDropdownOpen] = useState(false);
  const [peopleDropdownPosition, setPeopleDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const peopleInputRef = useRef(null);
  const peopleDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // People dropdown functions
  const updatePeopleDropdownPosition = () => {
    if (peopleInputRef.current) {
      const rect = peopleInputRef.current.getBoundingClientRect();
      setPeopleDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Close people dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (peopleDropdownRef.current && !peopleDropdownRef.current.contains(event.target) &&
          peopleInputRef.current && !peopleInputRef.current.contains(event.target)) {
        setIsPeopleDropdownOpen(false);
        setPeopleSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update position when dropdown opens
  useEffect(() => {
    if (isPeopleDropdownOpen) {
      updatePeopleDropdownPosition();
    }
  }, [isPeopleDropdownOpen]);

  // Filter users based on search term
  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(peopleSearchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(peopleSearchTerm.toLowerCase())
  );

  // Handle user selection
  const handleUserSelect = (user) => {
    const isAlreadySelected = newEvent.people.find(person => person.id === user.id);
    if (!isAlreadySelected) {
      setNewEvent({
        ...newEvent,
        people: [...newEvent.people, { id: user.id, name: user.name, avatar: user.avatar }]
      });
    }
    setPeopleSearchTerm('');
    setIsPeopleDropdownOpen(false);
  };

  // Remove person from selection
  const handlePersonRemove = (personId) => {
    setNewEvent({
      ...newEvent,
      people: newEvent.people.filter(person => person.id !== personId)
    });
  };
  

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
          title: 'Project Presentation',
          time: '9:00am - 10:30am',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+2',
          isCurrent: false,
          status: 'Completed',
          originalStatus: 'Meeting',
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 12,
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
          status: 'Completed',
          originalStatus: 'Focus',
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



  // Function to handle opening event details modal
  const handleOpenEventDetails = (event) => {
    if (onEventSelect) {
      onEventSelect(event);
    } else {
      setSelectedEvent(event);
    }
  };



  // Function to handle saving new event
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;
    
    // Format time string from start and end times
    const formattedTime = `${newEvent.startTime.format('h:mmA').toLowerCase()} - ${newEvent.endTime.format('h:mmA').toLowerCase()}`;
    
    // Create new event object
    const eventToAdd = {
      id: Date.now(), // Simple ID generation
      title: newEvent.title,
      time: formattedTime,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      duration: '1 hour', // Default duration
      description: '',
      location: '',
      isCurrent: false,
      status: 'Available',
      attendees: [{ name: 'You', avatar: null }, ...newEvent.people],
      linkedTasks: [],
      linkedNudges: [],
      linkedFiles: newEvent.links
    };
    
    // Add to current day (simplified - in real app would need proper date handling)
    const today = new Date().getDate().toString().padStart(2, '0');
    const updatedScheduleData = scheduleData.map(dayData => {
      if (dayData.day === today) {
        return {
          ...dayData,
          events: [...dayData.events, eventToAdd]
        };
      }
      return dayData;
    });
    
    // Reset form and close
    setNewEvent({ title: '', startTime: null, endTime: null, people: [], links: [] });
    setIsAddingEvent(false);
  };

  // Function to cancel adding event
  const handleCancelAddEvent = () => {
    setNewEvent({ title: '', startTime: null, endTime: null, people: [], links: [] });
    setIsAddingEvent(false);
  };





  // Helper function to get status badge styling
  const getStatusBadge = (status, originalStatus = null) => {
    const statusConfig = {
      'Focus': { text: 'text-purple-400', bg: 'bg-purple-500/10' },
      'Available': { text: 'text-green-400', bg: 'bg-green-500/10' },
      'Meeting': { text: 'text-blue-400', bg: 'bg-blue-500/10' },
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

  return (
    <div className={`${noBorder ? '' : 'border border-neutral-700 rounded-lg'} h-full flex flex-col ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      {/* Fixed Header - Only show for own schedule */}
      {!userName && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
          <h2 className="text-white text-lg font-semibold">
            My Schedule
          </h2>
          <div className="flex items-center gap-3">
            <button
                onClick={() => setIsAddingEvent(true)}
                className="flex items-center justify-center px-3 py-2 border border-neutral-700 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
              <span className="text-sm">Add Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <SimpleBar className="flex-1 px-6 pb-6">
        {viewMode === 'Month' ? (
          /* Month View - Calendar Grid */
          <MonthlyCalendar 
            fullWidth={true}
            scheduleData={scheduleData}
            userName={userName}
            onEventSelect={onEventSelect}
          />
        ) : viewMode === 'Week' ? (
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
                  {dayData.events.length > 0 ? dayData.events
                    .sort((a, b) => {
                      // Sort completed events first
                      if (a.status === 'Completed' && b.status !== 'Completed') return -1;
                      if (a.status !== 'Completed' && b.status === 'Completed') return 1;
                      return 0;
                    })
                    .map((event) => {
                    // Define colors based on status
                    const getStatusColors = (status) => {
                      switch(status) {
                        case 'Focus':
                          return 'border-neutral-700 hover:bg-purple-500/10 hover:border-purple-500/20';
                        case 'Available':
                          return 'border-neutral-700 hover:bg-green-500/10 hover:border-green-500/20';
                        case 'Meeting':
                          return 'border-neutral-700 hover:bg-blue-500/10 hover:border-blue-500/20';
                        case 'Completed':
                          return 'border-neutral-700';
                        default:
                          return 'border-neutral-700 hover:bg-neutral-500/10 hover:border-neutral-500/20';
                      }
                    };

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleOpenEventDetails(event)}
                        className={`rounded p-1.5 border ${getStatusColors(event.status)} cursor-pointer transition-all duration-200 ${
                          event.status === 'Completed' ? 'bg-neutral-800' : ''
                        }`}
                      >
                        {/* First line: Title, attachment icon, and people */}
                        <div className="flex items-center justify-between mb-1">
                          <div className={`text-xs font-medium truncate flex-1 ${
                            event.status === 'Completed' ? 'text-neutral-400' : 'text-white'
                          }`}>
                            {event.title}
                          </div>
                          {/* Right side: Attachment icon and people grouped together */}
                          <div className="flex items-center gap-1 ml-2">
                            {/* People avatars immediately after attachment icon */}
                            {(event.avatar || event.additionalPeople) && (
                              <div className="flex items-center gap-1">
                                {event.avatar && (
                                  <div className="relative">
                                    <img 
                                      src={event.avatar} 
                                      alt="Avatar" 
                                      className="w-4 h-4 rounded-full object-cover border border-gray-200"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                                  </div>
                                )}
                                {event.additionalPeople && (
                                  <span className={`text-xs ${
                                    event.status === 'Completed' ? 'text-neutral-400' : 'text-white'
                                  }`}>
                                    {event.additionalPeople}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Second line: Badge and timestamp in column */}
                        <div className="flex flex-col gap-1">
                          {/* Status badge */}
                          <div className="flex items-center">
                            {event.status && getStatusBadge(event.status, event.originalStatus)}
                          </div>
                          
                          {/* Time */}
                          <div className={`text-xs ${
                            event.status === 'Completed' ? 'text-neutral-400' : 'text-neutral-300'
                          }`}>
                            {event.time}
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
            {scheduleData.map((dayData, dayIndex) => (
              <div key={dayData.day} className="flex gap-4 py-4 border-b border-neutral-700">
                {/* Day Column */}
                <div className="flex flex-col items-center w-[50px]">
                  <div className="text-white text-2xl font-semibold">{dayData.day}</div>
                  <div className="text-neutral-400 text-xs">{dayData.dayName}</div>
                </div>

                {/* Events Column */}
                <div className="flex-1 space-y-3">
                  {/* Add Event Card - Show as first item when adding */}
                  {isAddingEvent && dayIndex === 0 && (
                    <div className="rounded-lg p-3 border border-neutral-600 bg-neutral-800/50 transition-all duration-200">
                      {/* Title Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="Event title"
                          className="w-full text-sm font-medium text-white bg-transparent border-none outline-none placeholder-neutral-400"
                          autoFocus
                        />
                      </div>

                      {/* Time Input */}
                      <div className="mb-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <div className={`${fullWidth ? 'flex gap-3 items-center' : 'flex flex-col gap-3'}`}>
                            <div className="flex-1">
                              <TimePicker
                                label="Start Time"
                                value={newEvent.startTime}
                                onChange={(newValue) => setNewEvent({ ...newEvent, startTime: newValue })}
slotProps={{
                                  textField: {
                                    size: 'small',
                                    sx: {
                                      width: '100%',
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'transparent',
                                        color: fullWidth ? '#a3a3a3' : '#d4d4d8',
                                        fontSize: '0.875rem',
                                        '& fieldset': {
                                          borderColor: '#404040',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: fullWidth ? '#d4d4d8' : '#737373',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#ffffff',
                                        },
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: fullWidth ? '#a3a3a3' : '#a3a3a3',
                                        fontSize: '0.875rem',
                                        '&.Mui-focused': {
                                          color: '#ffffff',
                                        },
                                      },
                                      '& .MuiSvgIcon-root': {
                                        color: fullWidth ? '#a3a3a3' : '#a3a3a3',
                                      },
                                    },
                                  },
                                  popper: {
                                    sx: {
                                      '& .MuiPaper-root': {
                                        backgroundColor: '#262626',
                                        border: '1px solid #404040',
                                        '& .MuiList-root': {
                                          backgroundColor: '#262626',
                                        },
                                        '& .MuiMenuItem-root': {
                                          color: '#ffffff',
                                          '&:hover': {
                                            backgroundColor: '#404040',
                                          },
                                          '&.Mui-selected': {
                                            backgroundColor: '#404040',
                                            color: '#ffffff',
                                            '&:hover': {
                                              backgroundColor: '#525252',
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <TimePicker
                                label="End Time"
                                value={newEvent.endTime}
                                onChange={(newValue) => setNewEvent({ ...newEvent, endTime: newValue })}
slotProps={{
                                  textField: {
                                    size: 'small',
                                    sx: {
                                      width: '100%',
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'transparent',
                                        color: fullWidth ? '#a3a3a3' : '#d4d4d8',
                                        fontSize: '0.875rem',
                                        '& fieldset': {
                                          borderColor: '#404040',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: fullWidth ? '#d4d4d8' : '#737373',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#ffffff',
                                        },
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: fullWidth ? '#a3a3a3' : '#a3a3a3',
                                        fontSize: '0.875rem',
                                        '&.Mui-focused': {
                                          color: '#ffffff',
                                        },
                                      },
                                      '& .MuiSvgIcon-root': {
                                        color: fullWidth ? '#a3a3a3' : '#a3a3a3',
                                      },
                                    },
                                  },
                                  popper: {
                                    sx: {
                                      '& .MuiPaper-root': {
                                        backgroundColor: '#262626',
                                        border: '1px solid #404040',
                                        '& .MuiList-root': {
                                          backgroundColor: '#262626',
                                        },
                                        '& .MuiMenuItem-root': {
                                          color: '#ffffff',
                                          '&:hover': {
                                            backgroundColor: '#404040',
                                          },
                                          '&.Mui-selected': {
                                            backgroundColor: '#404040',
                                            color: '#ffffff',
                                            '&:hover': {
                                              backgroundColor: '#525252',
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </LocalizationProvider>
                      </div>

                      {/* People and Links - Responsive Layout */}
                      <div className={`mb-3 ${
                        fullWidth 
                          ? 'flex items-center justify-between' 
                          : 'flex flex-col gap-3'
                      }`}>
                        {/* People Input */}
                        <div className="flex-1 relative">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-neutral-400" />
                            <div className="flex-1">

                              {/* Search Input */}
                              <input
                                ref={peopleInputRef}
                                type="text"
                                value={peopleSearchTerm}
                                onChange={(e) => setPeopleSearchTerm(e.target.value)}
                                onFocus={() => {
                                  setIsPeopleDropdownOpen(true);
                                  updatePeopleDropdownPosition();
                                }}
                                placeholder="Add people"
                                className="text-sm text-neutral-400 bg-transparent border-none outline-none placeholder-neutral-500 w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Links Input */}
                        <div className={`flex items-center gap-2 flex-1 ${
                          fullWidth ? 'ml-4' : 'ml-0'
                        }`}>
                          <Link className="w-4 h-4 text-neutral-400" />
                          <input
                            type="url"
                            placeholder="Add links"
                            className="text-sm text-neutral-400 bg-transparent border-none outline-none placeholder-neutral-500 flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                setNewEvent({
                                  ...newEvent,
                                  links: [...newEvent.links, { url: e.target.value.trim(), title: 'Link' }]
                                });
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Added People Tags */}
                      {newEvent.people.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {newEvent.people.map((person, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded-full flex items-center gap-1"
                            >
                              {person.name}
                              <button
                                onClick={() => {
                                  setNewEvent({
                                    ...newEvent,
                                    people: newEvent.people.filter((_, i) => i !== index)
                                  });
                                }}
                                className="hover:text-white"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Added Links */}
                      {newEvent.links.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {newEvent.links.map((link, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between px-2 py-1 bg-neutral-700 rounded text-xs"
                            >
                              <span className="text-neutral-300 truncate">{link.url}</span>
                              <button
                                onClick={() => {
                                  setNewEvent({
                                    ...newEvent,
                                    links: newEvent.links.filter((_, i) => i !== index)
                                  });
                                }}
                                className="text-neutral-400 hover:text-white ml-2"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleCancelAddEvent}
                          className="px-3 py-1 text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEvent}
                          disabled={!newEvent.title || !newEvent.startTime || !newEvent.endTime}
                          className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-2 ${
                            newEvent.title && newEvent.startTime && newEvent.endTime
                              ? 'bg-white text-black hover:bg-neutral-200'
                              : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {dayData.events
                    .sort((a, b) => {
                      // Sort completed events first
                      if (a.status === 'Completed' && b.status !== 'Completed') return -1;
                      if (a.status !== 'Completed' && b.status === 'Completed') return 1;
                      return 0;
                    })
                    .map((event) => {
                    // Define colors based on status
                    const getStatusColors = (status) => {
                      switch(status) {
                        case 'Focus':
                          return 'border-neutral-700 hover:bg-purple-500/10 hover:border-purple-500/20';
                        case 'Available':
                          return 'border-neutral-700 hover:bg-green-500/10 hover:border-green-500/20';
                        case 'Meeting':
                          return 'border-neutral-700 hover:bg-blue-500/10 hover:border-blue-500/20';
                        case 'Completed':
                          return 'border-neutral-700';
                        default:
                          return 'border-neutral-700 hover:bg-neutral-500/10 hover:border-neutral-500/20';
                      }
                    };

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleOpenEventDetails(event)}
                        className={`rounded-lg p-2 border ${getStatusColors(event.status)} cursor-pointer transition-all duration-200 ${
                          event.status === 'Completed' ? 'bg-neutral-800' : ''
                        }`}
                      >
                        {/* First line: Title, attachment icon, and people */}
                        <div className="flex items-center justify-between mb-2">
                          <div className={`text-sm font-medium flex-1 truncate ${
                            event.status === 'Completed' ? 'text-neutral-400' : 'text-white'
                          }`}>
                            {event.title}
                          </div>
                          {/* Right side: Attachment icon and people grouped together */}
                          <div className="flex items-center gap-1 ml-2">
                            {/* People avatars immediately after attachment icon */}
                            {(event.avatar || event.additionalPeople) && (
                              <div className="flex items-center gap-1">
                                {event.avatar && (
                                  <div className="relative">
                                    <img 
                                      src={event.avatar} 
                                      alt="Avatar" 
                                      className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                                  </div>
                                )}
                                {event.additionalPeople && (
                                  <span className={`text-xs ${
                                    event.status === 'Completed' ? 'text-neutral-400' : 'text-white'
                                  }`}>
                                    {event.additionalPeople}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Second line: Badge and timestamp */}
                        <div className="flex items-center justify-between">
                          {/* Status badge on the left */}
                          <div className="flex items-center">
                            {event.status && getStatusBadge(event.status, event.originalStatus)}
                          </div>
                          
                          {/* Time on the right */}
                          <div className={`text-xs font-medium ${
                            event.status === 'Completed' ? 'text-neutral-400' : 'text-neutral-300'
                          }`}>
                            {event.time}
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




      {/* People Dropdown */}
      {isPeopleDropdownOpen && createPortal(
        <div
          ref={peopleDropdownRef}
          className="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg"
          style={{
            top: `${peopleDropdownPosition.top}px`,
            left: `${peopleDropdownPosition.left}px`,
            width: `${peopleDropdownPosition.width}px`,
            minWidth: '200px'
          }}
        >
          <SimpleBar className="max-h-48">
            <div className="py-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelected = newEvent.people.find(person => person.id === user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`px-3 py-2 cursor-pointer hover:bg-neutral-700 flex items-center gap-2 ${
                        isSelected ? 'bg-neutral-700 opacity-50' : ''
                      }`}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center">
                          <span className="text-xs text-neutral-300">{user.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-neutral-200">{user.name}</div>
                        <div className="text-xs text-neutral-400">{user.title}</div>
                      </div>
                      {isSelected && (
                        <div className="text-xs text-neutral-400">Selected</div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-sm text-neutral-400">
                  No users found
                </div>
              )}
            </div>
          </SimpleBar>
        </div>,
        document.body
      )}

    </div>
  );
};

export default Schedule;