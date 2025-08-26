import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Paperclip } from 'lucide-react';
import SimpleBar from 'simplebar-react';

const MonthlyCalendar = ({ 
  fullWidth = false, 
  scheduleData: externalScheduleData = null, 
  userName = null, 
  onEventSelect = null 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1600);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Default schedule data for monthly view
  const defaultScheduleData = [
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
        },
        {
          id: 6,
          title: 'Code Review',
          time: '5:00pm - 6:00pm',
          date: 'Monday, July 01, 2025',
          duration: '1 hour',
          description: 'Review pull requests and discuss code improvements.',
          location: 'Development Room',
          isCurrent: false,
          status: 'Available',
          attendees: [
            { name: 'You', avatar: null },
            { name: 'Dev Team', avatar: null }
          ],
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        },
        {
          id: 7,
          title: 'Sprint Planning',
          time: '6:30pm - 7:30pm',
          date: 'Monday, July 01, 2025',
          duration: '1 hour',
          description: 'Plan tasks for the upcoming sprint.',
          location: 'Conference Room B',
          isCurrent: false,
          status: 'Meeting',
          attendees: [
            { name: 'You', avatar: null },
            { name: 'Scrum Team', avatar: null }
          ],
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    },
    {
      day: '15',
      dayName: 'Tuesday',
      events: [
        {
          id: 5,
          title: 'Client Presentation',
          time: '2:00pm - 3:30pm',
          date: 'Tuesday, July 15, 2025',
          duration: '1 hour 30 minutes',
          description: 'Present quarterly results and upcoming project roadmap to key stakeholders.',
          location: 'Main Conference Room',
          isCurrent: false,
          status: 'Meeting',
          attendees: [
            { name: 'You', avatar: null },
            { name: 'Client Team', avatar: null }
          ],
          linkedTasks: [],
          linkedNudges: [],
          linkedFiles: []
        }
      ]
    }
  ];

  // Use external data if provided, otherwise use default
  const scheduleData = externalScheduleData || defaultScheduleData;

  // Helper function to check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create calendar grid
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = scheduleData.find(d => parseInt(d.day) === day);
      days.push({
        day,
        events: dayData ? dayData.events : [],
        isToday: isToday(year, month, day)
      });
    }
    
    return {
      year,
      month,
      days,
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long' })
    };
  }, [currentDate, scheduleData]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Available': { bg: 'bg-green-500', text: 'Available' },
      'Meeting': { bg: 'bg-blue-500', text: 'Meeting' },
      'Focus': { bg: 'bg-purple-500', text: 'Focus' },
      'Break': { bg: 'bg-yellow-500', text: 'Break' },
      'Away': { bg: 'bg-orange-500', text: 'Away' },
      'Emergency': { bg: 'bg-red-500', text: 'Emergency' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-500', text: status };
    
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white ${config.bg}`}>
        {config.text}
      </span>
    );
  };

  const getLinkedItemsCount = (event) => {
    const tasksCount = event.linkedTasks ? event.linkedTasks.length : 0;
    const nudgesCount = event.linkedNudges ? event.linkedNudges.length : 0;
    const filesCount = event.linkedFiles ? event.linkedFiles.length : 0;
    return tasksCount + nudgesCount + filesCount;
  };

  const handleEventClick = (event) => {
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      {/* Calendar Grid */}
      <SimpleBar className="flex-1 py-1">
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-neutral-400 text-sm font-medium">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarData.days.map((dayData, index) => (
            <div key={index} className="aspect-square border border-neutral-700 rounded-lg p-1 flex flex-col">
              {dayData && (
                <>
                  {/* Day number */}
                  <div className={`text-sm font-medium mb-1 flex-shrink-0 ${
                    dayData.isToday 
                      ? 'text-blue-400 bg-blue-500/20 rounded-full w-6 h-6 flex items-center justify-center' 
                      : 'text-white'
                  }`}>
                    {dayData.day}
                  </div>
                  
                  {/* Events */}
                  <div className="space-y-1 flex-1 flex flex-col">
                    {dayData.events.slice(0, isLargeScreen ? 2 : 1).map((event) => {
                      const getStatusColors = (status) => {
                        switch(status) {
                          case 'Focus':
                            return 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30';
                          case 'Available':
                            return 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30';
                          case 'Meeting':
                            return 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30';
                          default:
                            return 'bg-neutral-700/50 border-neutral-600 hover:bg-neutral-700';
                        }
                      };

                      return (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`p-1 rounded border cursor-pointer transition-all duration-200 flex-shrink-0 ${getStatusColors(event.status)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] font-medium text-white truncate flex-1">
                              {event.title}
                            </div>
                            {getLinkedItemsCount(event) > 0 && (
                              <div className="flex items-center gap-0.5 ml-1">
                                <span className="text-[8px] text-neutral-400">
                                  {getLinkedItemsCount(event)}
                                </span>
                                <Paperclip className="w-2 h-2 text-neutral-400" />
                              </div>
                            )}
                          </div>
                          <div className="text-[8px] text-neutral-300 truncate">
                            {event.time}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* See More button */}
                    {dayData.events.length > (isLargeScreen ? 2 : 1) && (
                      <button className="mt-auto bg-neutral-700/50 hover:bg-neutral-600/50 border border-neutral-600 rounded text-[9px] text-neutral-300 py-1 px-2 transition-colors duration-200 flex-shrink-0">
                        See More ({dayData.events.length - (isLargeScreen ? 2 : 1)})
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </SimpleBar>
    </>
  );
};

export default MonthlyCalendar;