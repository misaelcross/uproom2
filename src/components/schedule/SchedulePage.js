import React, { useState, useMemo } from 'react';
import { Users, CheckCircle, AlertTriangle, TrendingUp, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { IconButton, InputBase, Collapse } from '@mui/material';
import SimpleBar from 'simplebar-react';
import Sidebar from '../shared/Sidebar';

import MonthCalendar from './MonthCalendar';
import AnimatedBottomSheet from '../shared/AnimatedBottomSheet';
import TopTabsSchedule from './TopTabsSchedule';
import ActionBarSchedule from './ActionBarSchedule';
import LiveNotifications from '../shared/LiveNotifications';
import Schedule from './Schedule';
import EventDetailsSidebar from './EventDetailsSidebar';

import ScheduleMeetingSidebar from './ScheduleMeetingSidebar';
import EmployeeListSidebar from './EmployeeListSidebar';
import EmployeeAvailabilitySidebar from './EmployeeAvailabilitySidebar';
import MeetingConfirmationSidebar from './MeetingConfirmationSidebar';
import { usersData } from '../../data/usersData';

// Mock data for groups
const groupsData = [
  {
    id: 1,
    name: 'Development Team',
    description: 'Frontend and Backend developers',
    members: ['1', '2', '3', '4'],
    color: 'bg-blue-600',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
  },
  {
    id: 2,
    name: 'Design Team',
    description: 'UI/UX designers and visual artists',
    members: ['5', '6', '7'],
    color: 'bg-purple-600',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
  },
  {
    id: 3,
    name: 'Marketing Team',
    description: 'Digital marketing and content creators',
    members: ['8', '9', '10'],
    color: 'bg-green-600',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
  },
  {
    id: 4,
    name: 'Product Team',
    description: 'Product managers and analysts',
    members: ['11', '12'],
    color: 'bg-orange-600',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
  }
];

const SchedulePage = ({ onNavigate }) => {
  // Definir o usuário atual (primeiro usuário como exemplo)
  const currentUser = usersData[0]; // Alex Thompson como usuário atual
  
  const [selectedUser, setSelectedUser] = useState(null); // null = My Schedule, user = schedule do usuário selecionado
  const [selectedGroup, setSelectedGroup] = useState(null); // null = no group selected, group = schedule do grupo selecionado
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null); // Event selected for sidebar details

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [timeFrame, setTimeFrame] = useState('Day');
  
  // AnimatedBottomSheet state
  const [activeTab, setActiveTab] = useState('received');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  
  // TopTabs state
  const [activeTopTab, setActiveTopTab] = useState('members');

  // Mock data for widgets
  const weekStats = {
    productivity: 87,
    tasksCreated: 24,
    tasksCompleted: 18,
    tasksPending: 6,
    overdueTasks: 3
  };

  // Get unique roles and statuses for filters using useMemo
  const uniqueRoles = useMemo(() => [...new Set(usersData.map(user => user.title))], []);
  const uniqueStatuses = useMemo(() => [...new Set(usersData.map(user => user.availability))], []);

  // Initialize filters with all options selected
  React.useEffect(() => {
    if (roleFilter.length === 0) {
      setRoleFilter(uniqueRoles);
    }
    if (statusFilter.length === 0) {
      setStatusFilter(uniqueStatuses);
    }
  }, [roleFilter.length, statusFilter.length, uniqueRoles, uniqueStatuses]);

  // Sort function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter functions
  const handleRoleFilter = (role) => {
    setRoleFilter(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Get filtered and sorted data
  const getFilteredAndSortedData = () => {
    if (activeTopTab === 'groups') {
      // Return groups data with search filter
      let filteredGroups = groupsData.filter(group => {
        const searchMatch = searchTerm.trim() === '' || 
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch;
      });

      // Sort groups by name
      if (sortConfig.key === 'name') {
        filteredGroups.sort((a, b) => {
          const aValue = a.name;
          const bValue = b.name;
          
          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      return filteredGroups;
    } else {
      // Return users data (members tab)
      let filteredData = usersData.filter(user => {
        // Filtro por role e status
        const roleMatch = roleFilter.includes(user.title);
        const statusMatch = statusFilter.includes(user.availability);
        
        // Filtro por busca de nome
        const searchMatch = searchTerm.trim() === '' || 
          user.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return roleMatch && statusMatch && searchMatch;
      });

      if (sortConfig.key) {
        filteredData.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];

          if (sortConfig.key === 'name') {
            aValue = a.name;
            bValue = b.name;
          } else if (sortConfig.key === 'role') {
            aValue = a.title;
            bValue = b.title;
          } else if (sortConfig.key === 'status') {
            aValue = a.availability;
            bValue = b.availability;
          }

          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      return filteredData;
    }
  };

  // Function to generate personalized schedule based on selected user
  const generateUserSchedule = (user) => {
    if (!user) return [];

    const scheduleTemplates = [
      {
        day: '30',
        dayName: 'Sunday',
        events: [
          {
            id: 1,
            title: 'Personal Time',
            time: '10:00am - 12:00pm',
            date: 'Sunday, July 30, 2025',
            duration: '2 hours',
            description: `Personal time for ${user.name} to focus on individual tasks and planning.`,
            location: 'Home Office',
            isCurrent: false,
            status: 'Available',
            attendees: [
              { name: user.name, avatar: user.avatar }
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
            title: `${user.skills && user.skills[0] ? user.skills[0] : 'Project'} Review`,
            time: '2:00pm - 3:30pm',
            date: 'Monday, July 01, 2025',
            duration: '1 hour 30 minutes',
            description: `Review session focused on ${user.skills && user.skills[0] ? user.skills[0] : 'project'} deliverables and progress.`,
            location: 'Conference Room B',
            avatar: user.avatar,
            isCurrent: false,
            status: 'Focus',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Team Lead', avatar: null }
            ],
            linkedTasks: [
              { id: 1, title: 'Prepare review materials', completed: true },
              { id: 2, title: 'Update project documentation', completed: false }
            ],
            linkedNudges: [],
            linkedFiles: []
          },
          {
            id: 3,
            title: 'Team Meeting',
            time: '4:00pm - 5:00pm',
            date: 'Monday, July 01, 2025',
            duration: '1 hour',
            description: 'Weekly team sync meeting to discuss progress and blockers.',
            location: 'Main Conference Room',
            avatar: user.avatar,
            additionalPeople: '+3',
            isCurrent: true,
            status: 'Meeting',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop' },
              { name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop' },
              { name: 'Emma Davis', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop' }
            ],
            linkedTasks: [],
            linkedNudges: [],
            linkedFiles: []
          }
        ]
      },
      {
        day: '02',
        dayName: 'Tuesday',
        events: [
          {
            id: 4,
            title: 'Daily Standup',
            time: '9:00am - 9:30am',
            date: 'Tuesday, July 02, 2025',
            duration: '30 minutes',
            description: 'Daily standup meeting to sync with the team.',
            location: 'Team Area',
            avatar: user.avatar,
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Development Team', avatar: null }
            ],
            linkedTasks: [],
            linkedNudges: [],
            linkedFiles: []
          },
          {
            id: 5,
            title: `${user.skills && user.skills.length > 0 ? (user.skills[1] || user.skills[0]) : 'General'} Workshop`,
            time: '10:00am - 12:00pm',
            date: 'Tuesday, July 02, 2025',
            duration: '2 hours',
            description: `Workshop session focused on ${user.skills && user.skills.length > 0 ? (user.skills[1] || user.skills[0]) : 'general'} skills development.`,
            location: 'Training Room',
            avatar: user.avatar,
            additionalPeople: '+6',
            isCurrent: false,
            status: 'Focus',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Workshop Participants', avatar: null }
            ],
            linkedTasks: [
              { id: 3, title: 'Prepare workshop materials', completed: true }
            ],
            linkedNudges: [
              { id: 1, title: 'Follow up on workshop feedback' }
            ],
            linkedFiles: [
              { id: 1, name: 'Workshop_Materials.pdf', type: 'pdf' }
            ]
          }
        ]
      },
      {
        day: '03',
        dayName: 'Wednesday',
        events: [
          {
            id: 6,
            title: 'Client Meeting',
            time: '11:00am - 12:30pm',
            date: 'Wednesday, July 03, 2025',
            duration: '1 hour 30 minutes',
            description: 'Meeting with client to discuss project requirements and timeline.',
            location: 'Client Office / Zoom',
            avatar: user.avatar,
            additionalPeople: '+2',
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Client Representative', avatar: null },
              { name: 'Account Manager', avatar: null }
            ],
            linkedTasks: [
              { id: 4, title: 'Prepare client presentation', completed: false }
            ],
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
            id: 7,
            title: 'Sprint Planning',
            time: '9:00am - 11:00am',
            date: 'Thursday, July 04, 2025',
            duration: '2 hours',
            description: 'Sprint planning session for the upcoming development cycle.',
            location: 'Planning Room',
            avatar: user.avatar,
            additionalPeople: '+5',
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Scrum Team', avatar: null }
            ],
            linkedTasks: [
              { id: 5, title: 'Review backlog items', completed: true },
              { id: 6, title: 'Estimate story points', completed: false }
            ],
            linkedNudges: [],
            linkedFiles: [
              { id: 2, name: 'Sprint_Backlog.xlsx', type: 'excel' }
            ]
          }
        ]
      },
      {
        day: '05',
        dayName: 'Friday',
        events: [
          {
            id: 8,
            title: 'Team Retrospective',
            time: '3:00pm - 4:00pm',
            date: 'Friday, July 05, 2025',
            duration: '1 hour',
            description: 'Weekly retrospective to discuss what went well and areas for improvement.',
            location: 'Retrospective Room',
            avatar: user.avatar,
            additionalPeople: '+4',
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: user.name, avatar: user.avatar },
              { name: 'Team Members', avatar: null }
            ],
            linkedTasks: [],
            linkedNudges: [
              { id: 2, title: 'Implement retrospective action items' }
            ],
            linkedFiles: []
          }
        ]
      }
    ];

    return scheduleTemplates;
  };

  // Function to generate group schedule based on selected group
  const generateGroupSchedule = (group) => {
    if (!group) return [];

    const scheduleTemplates = [
      {
        day: '30',
        dayName: 'Sunday',
        events: []
      },
      {
        day: '01',
        dayName: 'Monday',
        events: [
          {
            id: 1,
            title: `${group.name} Planning`,
            time: '9:00am - 10:30am',
            date: 'Monday, July 01, 2025',
            duration: '1 hour 30 minutes',
            description: `Weekly planning session for ${group.name} to align on priorities and deliverables.`,
            location: 'Team Room',
            avatar: group.avatar,
            additionalPeople: `+${group.members.length - 1}`,
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: group.name, avatar: group.avatar }
            ],
            linkedTasks: [
              { id: 1, title: 'Review team objectives', completed: true },
              { id: 2, title: 'Plan sprint activities', completed: false }
            ],
            linkedNudges: [],
            linkedFiles: []
          },
          {
            id: 2,
            title: `${group.name} Standup`,
            time: '2:00pm - 2:30pm',
            date: 'Monday, July 01, 2025',
            duration: '30 minutes',
            description: `Daily standup for ${group.name} to sync on progress and blockers.`,
            location: 'Team Area',
            avatar: group.avatar,
            additionalPeople: `+${group.members.length - 1}`,
            isCurrent: true,
            status: 'Meeting',
            attendees: [
              { name: group.name, avatar: group.avatar }
            ],
            linkedTasks: [],
            linkedNudges: [],
            linkedFiles: []
          }
        ]
      },
      {
        day: '02',
        dayName: 'Tuesday',
        events: [
          {
            id: 3,
            title: `${group.name} Workshop`,
            time: '10:00am - 12:00pm',
            date: 'Tuesday, July 02, 2025',
            duration: '2 hours',
            description: `Collaborative workshop for ${group.name} to work on key initiatives.`,
            location: 'Workshop Room',
            avatar: group.avatar,
            additionalPeople: `+${group.members.length - 1}`,
            isCurrent: false,
            status: 'Focus',
            attendees: [
              { name: group.name, avatar: group.avatar }
            ],
            linkedTasks: [
              { id: 3, title: 'Prepare workshop materials', completed: true }
            ],
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
            id: 4,
            title: `${group.name} Review`,
            time: '3:00pm - 4:00pm',
            date: 'Wednesday, July 03, 2025',
            duration: '1 hour',
            description: `Weekly review session for ${group.name} to assess progress and next steps.`,
            location: 'Conference Room',
            avatar: group.avatar,
            additionalPeople: `+${group.members.length - 1}`,
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: group.name, avatar: group.avatar }
            ],
            linkedTasks: [
              { id: 4, title: 'Compile progress report', completed: false }
            ],
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
            id: 5,
            title: `${group.name} Retrospective`,
            time: '4:00pm - 5:00pm',
            date: 'Friday, July 05, 2025',
            duration: '1 hour',
            description: `Weekly retrospective for ${group.name} to discuss improvements and celebrate wins.`,
            location: 'Retrospective Room',
            avatar: group.avatar,
            additionalPeople: `+${group.members.length - 1}`,
            isCurrent: false,
            status: 'Meeting',
            attendees: [
              { name: group.name, avatar: group.avatar }
            ],
            linkedTasks: [],
            linkedNudges: [
              { id: 1, title: 'Implement retrospective action items' }
            ],
            linkedFiles: []
          }
        ]
      }
    ];

    return scheduleTemplates;
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null); // Clear group selection when user is selected
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null); // Clear user selection when group is selected
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  // Event details sidebar handlers
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };





  const handleUpdateEvent = (updatedEvent) => {
    // Here you would typically update the event in your data store
    console.log('Updated event:', updatedEvent);
    setSelectedEvent(updatedEvent);
  };

  // Meeting scheduling handlers
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [schedulingStep, setSchedulingStep] = useState('initial');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  
  const handleOpenScheduleMeeting = () => {
    setIsScheduleMeetingOpen(true);
    setSchedulingStep('initial');
  };

  const handleCloseScheduleMeeting = () => {
    setIsScheduleMeetingOpen(false);
    setSchedulingStep('initial');
    setSelectedEmployee(null);
    setSelectedTimeSlot(null);
    setSelectedDateInfo(null);
  };

  const handleShowEmployeeList = () => {
    setSchedulingStep('employees');
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSchedulingStep('availability');
  };

  const handleSelectTimeSlot = (timeSlot, dateInfo) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedDateInfo(dateInfo);
    setSchedulingStep('confirmation');
  };

  const handleBackToEmployees = () => {
    setSelectedEmployee(null);
    setSchedulingStep('employees');
  };

  const handleBackToAvailability = () => {
    setSelectedTimeSlot(null);
    setSelectedDateInfo(null);
    setSchedulingStep('availability');
  };

  const handleConfirmMeeting = async (meetingData) => {
    try {
      console.log('Meeting confirmed:', meetingData);
      handleCloseScheduleMeeting();
    } catch (error) {
      console.error('Error confirming meeting:', error);
    }
  };

  // AnimatedBottomSheet helper functions
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="h-screen bg-neutral-900 pr-6 overflow-hidden">
      <div className="flex gap-4 h-screen">
        {/* First column: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="schedule" onNavigate={onNavigate} />
        </div>
        {/* Second column: flex-1 - Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Tabs, Live Notifications and Actions */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabsSchedule 
              timeFrame={timeFrame}
              onTimeFrameChange={handleTimeFrameChange}
            />
            <LiveNotifications 
              usersData={usersData}
              onUserClick={(user) => console.log('User clicked:', user)}
            />
            <ActionBarSchedule 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onScheduleMeet={handleOpenScheduleMeeting}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Content Area - My Schedule or Selected User Schedule */}
            <SimpleBar className="flex-1 min-h-0">
              {selectedUser ? (
                /* User Schedule */
                <div className="border border-neutral-700 rounded-lg h-full flex flex-col">
                  {/* Header do usuário selecionado */}
                  <div className="py-4 px-6 border-b border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedUser.avatar} 
                          alt={selectedUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-white font-medium">{selectedUser.name}</h3>
                          <p className="text-neutral-400 text-sm">{selectedUser.title}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-neutral-400 hover:text-white text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do Schedule */}
                  <div className="flex-1 overflow-hidden">
                    <Schedule 
                      fullWidth={true} 
                      viewMode={timeFrame} 
                      scheduleData={generateUserSchedule(selectedUser)}
                      userName={selectedUser.name}
                      onEventSelect={handleEventSelect}
                      noBorder={true}
                    />
                  </div>
                </div>
              ) : selectedGroup ? (
                /* Group Schedule */
                <div className="border border-neutral-700 rounded-lg h-full flex flex-col">
                  {/* Header do grupo selecionado */}
                  <div className="py-4 px-6 border-b border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${selectedGroup.color} rounded-full flex items-center justify-center`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{selectedGroup.name}</h3>
                          <p className="text-neutral-400 text-sm">{selectedGroup.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedGroup(null)}
                        className="text-neutral-400 hover:text-white text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do Schedule */}
                  <div className="flex-1 overflow-hidden">
                    <Schedule 
                      fullWidth={true} 
                      viewMode={timeFrame} 
                      scheduleData={generateGroupSchedule(selectedGroup)}
                      userName={selectedGroup.name}
                      onEventSelect={handleEventSelect}
                      noBorder={true}
                    />
                  </div>
                </div>
              ) : (
                /* My Schedule - Default view */
                <Schedule 
                  fullWidth={true} 
                  viewMode={timeFrame} 
                  onEventSelect={handleEventSelect}
                />
              )}
            </SimpleBar>

            {/* Right Column - 350px (same as dashboard) */}
            <div className="flex flex-col gap-6 min-h-0" style={{ width: '350px' }}>
              {selectedEvent ? (
                /* Event Details - Full Height */
                <div className="flex-1 min-h-0 flex flex-col">
                  <EventDetailsSidebar
                    event={selectedEvent}
                    onClose={handleCloseEventDetails}
                    onEdit={(event) => {
                      console.log('Edit event:', event);
                    }}
                  />
                </div>
              ) : isScheduleMeetingOpen ? (
                /* Meeting Scheduling Sidebars - Full Height with SimpleBar */
                <SimpleBar className="flex-1 min-h-0">
                  {schedulingStep === 'initial' && (
                    <ScheduleMeetingSidebar
                      isOpen={true}
                      onClose={handleCloseScheduleMeeting}
                      onShowEmployeeList={handleShowEmployeeList}
                    />
                  )}
                  
                  {schedulingStep === 'employees' && (
                    <EmployeeListSidebar
                      isOpen={true}
                      onClose={handleCloseScheduleMeeting}
                      onSelectEmployee={handleSelectEmployee}
                      onBack={handleCloseScheduleMeeting}
                    />
                  )}
                  
                  {schedulingStep === 'availability' && selectedEmployee && (
                    <EmployeeAvailabilitySidebar
                      isOpen={true}
                      employee={selectedEmployee}
                      onClose={handleCloseScheduleMeeting}
                      onSelectTimeSlot={handleSelectTimeSlot}
                      onBack={handleBackToEmployees}
                    />
                  )}
                  
                  {schedulingStep === 'confirmation' && selectedEmployee && selectedTimeSlot && selectedDateInfo && (
                    <MeetingConfirmationSidebar
                      isOpen={true}
                      employee={selectedEmployee}
                      timeSlot={selectedTimeSlot}
                      dateInfo={selectedDateInfo}
                      onClose={handleCloseScheduleMeeting}
                      onConfirm={handleConfirmMeeting}
                      onBack={handleBackToAvailability}
                    />
                  )}
                </SimpleBar>
              ) : (
                /* Default Layout - Calendar + Team Members */
                <>
                  {/* Calendar at the top */}
                  <div className="w-full flex-shrink-0">
                    <MonthCalendar 
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>

                  {/* Team Members List */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div className="border border-neutral-700 rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
                    <div className="py-4 px-3 border-b border-neutral-700 flex items-center justify-between flex-shrink-0">
                      {/* Team Members / Groups Tabs */}
                      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg w-fit">
                        <button
                          onClick={() => setActiveTopTab('members')}
                          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                            activeTopTab === 'members'
                              ? 'bg-neutral-700 text-white'
                              : 'bg-transparent text-neutral-400 hover:text-gray-300'
                          }`}
                        >
                          Members
                        </button>
                        <button
                          onClick={() => setActiveTopTab('groups')}
                          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                            activeTopTab === 'groups'
                              ? 'bg-neutral-700 text-white'
                              : 'bg-transparent text-neutral-400 hover:text-gray-300'
                          }`}
                        >
                          Groups
                        </button>
                      </div>
                      
                      {/* Compact Search Input */}
                      <div className="flex items-center">
                        <Collapse in={searchExpanded} orientation="horizontal">
                          <InputBase
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={() => {
                              if (!searchTerm) {
                                setSearchExpanded(false);
                              }
                            }}
                            autoFocus={searchExpanded}
                            sx={{
                              ml: 1,
                              width: searchExpanded ? 110 : 0,
                              '& .MuiInputBase-input': {
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: '14px',
                                backgroundColor: 'transparent',
                                border: '1px solid #525252',
                                borderRadius: '8px',
                                '&::placeholder': {
                                  color: '#a3a3a3',
                                  opacity: 1
                                },
                                '&:focus': {
                                  outline: 'none',
                                  borderColor: 'white',
                                  boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)'
                                }
                              }
                            }}
                          />
                        </Collapse>
                        <IconButton
                          onClick={() => {
                            if (searchExpanded && searchTerm) {
                              setSearchTerm('');
                            } else {
                              setSearchExpanded(!searchExpanded);
                            }
                          }}
                          sx={{
                            color: '#a3a3a3',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white'
                            }
                          }}
                        >
                          <Search size={18} />
                        </IconButton>
                      </div>
                    </div>

                  {/* Content List - Team Members or Groups */}
                  <SimpleBar className="divide-y divide-neutral-700 flex-1 min-h-0">
                    {activeTopTab === 'members' ? (
                      // Team Members List
                      getFilteredAndSortedData().map((user) => {
                        const getStatusDotColor = (availability) => {
                          switch (availability) {
                            case 'Available': return 'bg-green-500';
                            case 'Meeting': return 'bg-blue-500';
                            case 'Break': return 'bg-yellow-500';
                            case 'Focus': return 'bg-purple-500';
                            case 'Emergency': return 'bg-red-500';
                            case 'Away': return 'bg-orange-500';
                            case 'Offline': return 'bg-gray-500';
                            default: return 'bg-green-500';
                          }
                        };

                        return (
                          <div
                            key={user.id}
                            className={`px-4 py-3 hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                              selectedUser?.id === user.id ? 'bg-neutral-800' : ''
                            }`}
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusDotColor(user.availability)} rounded-full border-2 border-neutral-900`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm truncate">{user.name}</div>
                                <div className="text-neutral-400 text-xs truncate">{user.title}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Groups List
                      groupsData
                        .filter(group => 
                          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((group) => {
                          // Helper function to get group color styling with transparency
                          const getGroupColorStyling = (colorClass) => {
                            const colorMap = {
                              'bg-blue-600': { bg: 'bg-blue-500/10', icon: 'text-blue-400' },
                              'bg-purple-600': { bg: 'bg-purple-500/10', icon: 'text-purple-400' },
                              'bg-green-600': { bg: 'bg-green-500/10', icon: 'text-green-400' },
                              'bg-orange-600': { bg: 'bg-orange-500/10', icon: 'text-orange-400' },
                              'bg-red-600': { bg: 'bg-red-500/10', icon: 'text-red-400' },
                              'bg-yellow-600': { bg: 'bg-yellow-500/10', icon: 'text-yellow-400' },
                              'bg-pink-600': { bg: 'bg-pink-500/10', icon: 'text-pink-400' },
                              'bg-indigo-600': { bg: 'bg-indigo-500/10', icon: 'text-indigo-400' }
                            };
                            return colorMap[colorClass] || { bg: 'bg-blue-500/10', icon: 'text-blue-400' };
                          };

                          const groupStyling = getGroupColorStyling(group.color);

                          return (
                          <div
                            key={group.id}
                            className="px-4 py-3 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                            onClick={() => handleGroupSelect(group)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className={`w-8 h-8 ${groupStyling.bg} rounded-full flex items-center justify-center`}>
                                  <Users className={`w-4 h-4 ${groupStyling.icon}`} />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm truncate">{group.name}</div>
                                <div className="text-neutral-400 text-xs truncate">{group.description}</div>
                              </div>
                              <div className="text-neutral-400 text-xs">
                                {group.members.length} members
                              </div>
                            </div>
                          </div>
                        );
                        })
                    )}
                  </SimpleBar>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* AnimatedBottomSheet */}
      <AnimatedBottomSheet
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        message={message}
        setMessage={setMessage}
        toggleUserSelection={toggleUserSelection}
        removeSelectedUser={removeSelectedUser}
      />


    </div>
  );
};

export default SchedulePage;