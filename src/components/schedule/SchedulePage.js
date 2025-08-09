import React, { useState, useMemo } from 'react';
import { Users, CheckCircle, AlertTriangle, TrendingUp, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Sidebar from '../shared/Sidebar';

import MonthCalendar from './MonthCalendar';
import AnimatedBottomSheet from '../shared/AnimatedBottomSheet';
import TopTabsSchedule from './TopTabsSchedule';
import ActionBarSchedule from './ActionBarSchedule';
import LiveNotifications from '../shared/LiveNotifications';
import { usersData } from '../../data/usersData';

// Mock data for groups
const groupsData = [
  {
    id: 1,
    name: 'Development Team',
    description: 'Frontend and Backend developers',
    members: ['1', '2', '3', '4'],
    color: 'bg-blue-600',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Design Team',
    description: 'UI/UX designers and visual artists',
    members: ['5', '6', '7'],
    color: 'bg-purple-600',
    avatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Marketing Team',
    description: 'Digital marketing and content creators',
    members: ['8', '9', '10'],
    color: 'bg-green-600',
    avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Product Team',
    description: 'Product managers and analysts',
    members: ['11', '12'],
    color: 'bg-orange-600',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face'
  }
];

const SchedulePage = ({ onNavigate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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
        day: '02',
        dayName: 'Monday',
        events: [
          {
            id: 1,
            title: `${user.skills && user.skills[0] ? user.skills[0] : 'Project'} Review`,
            time: '2:00pm - 3:30pm',
            isCurrent: false
          },
          {
            id: 2,
            title: 'Team Meeting',
            time: '4:00pm - 5:00pm',
            avatar: user.avatar,
            additionalPeople: '+3',
            isCurrent: true
          }
        ]
      },
      {
        day: '03',
        dayName: 'Tuesday',
        events: [
          {
            id: 3,
            title: 'Daily Standup',
            time: '9:00am - 9:30am',
            isCurrent: false
          },
          {
            id: 4,
            title: `${user.skills && user.skills.length > 0 ? (user.skills[1] || user.skills[0]) : 'General'} Workshop`,
            time: '10:00am - 12:00pm',
            avatar: user.avatar,
            additionalPeople: '+6',
            isCurrent: false
          }
        ]
      }
    ];

    return scheduleTemplates;
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
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
    <div className="min-h-screen bg-neutral-900 pr-6">
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
              activeTab={activeTopTab}
              setActiveTab={setActiveTopTab}
            />
            <LiveNotifications 
              usersData={usersData}
              onUserClick={(user) => console.log('User clicked:', user)}
            />
            <ActionBarSchedule 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onScheduleMeet={() => console.log('Schedule meet clicked')}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Content Area - Team Members List or User Schedule */}
            <div className="flex-1 overflow-y-auto min-h-0 ">
              {selectedUser ? (
                /* User Schedule - Full Width */
                <div className="border border-neutral-700 rounded-lg h-full flex flex-col">
                  {/* Header do Schedule */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-8 h-8 rounded-full object-cover"
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

                  {/* Conteúdo do Schedule */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="space-y-1">
                      {generateUserSchedule(selectedUser).map((dayData) => (
                        <div key={dayData.day} className="flex gap-4 py-4 border-b border-neutral-700">
                          {/* Day Column */}
                          <div className="flex flex-col items-center w-[40px]">
                            <div className="text-white text-xl font-semibold">{dayData.day}</div>
                            <div className="text-neutral-400 text-xs">{dayData.dayName}</div>
                          </div>

                          {/* Events Column */}
                          <div className="flex-1 space-y-3">
                            {dayData.events.map((event) => (
                              <div
                                key={event.id}
                                className={`rounded-lg p-3 ${
                                  event.isCurrent
                                    ? 'bg-neutral-600'
                                    : 'border border-neutral-700 bg-transparent'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className={`text-sm font-medium ${
                                      event.isCurrent ? 'text-neutral-200' : 'text-neutral-500'
                                    }`}>
                                      {event.title}
                                    </div>
                                    <div className="text-white text-xs">{event.time}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {event.avatar && (
                                      <img 
                                        src={event.avatar} 
                                        alt="Avatar" 
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                    )}
                                    {event.additionalPeople && (
                                      <span className={`text-sm ${
                                        event.isCurrent ? 'text-neutral-200' : 'text-neutral-500'
                                      }`}>
                                        {event.additionalPeople}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Team Members List - When no user is selected */
                <div className="border border-neutral-700 rounded-lg overflow-hidden h-full">
                  <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold">
                      {activeTopTab === 'groups' ? 'Groups' : 'Team Members'}
                    </h2>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={activeTopTab === 'groups' ? 'Search groups...' : 'Search members...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    </div>
                  </div>

                  {/* Content List */}
                  <div className="divide-y divide-neutral-700">
                    {activeTopTab === 'groups' ? (
                      /* Groups List */
                      getFilteredAndSortedData().map((group) => (
                        <div
                          key={group.id}
                          className="px-6 py-4 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                          onClick={() => console.log('Group selected:', group)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center`}>
                                <span className="text-white font-semibold text-sm">
                                  {group.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{group.name}</div>
                              <div className="text-neutral-400 text-sm">{group.description}</div>
                            </div>
                            <div className="text-neutral-400 text-sm">
                              {group.members.length} members
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Team Members List */
                      getFilteredAndSortedData().map((user) => {
                        const getStatusDotColor = (availability) => {
                          switch (availability) {
                            case 'Available': return 'bg-green-500';
                            case 'In meeting': return 'bg-blue-500';
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
                            className="px-6 py-4 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${getStatusDotColor(user.availability)} rounded-full border-2 border-gray-900`}></div>
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.name}</div>
                                <div className="text-neutral-400 text-sm">{user.title}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - w-80 (same as dashboard) */}
            <div className="w-80 flex flex-col gap-6 min-h-0">
              {/* Calendar at the top */}
              <div className="w-full flex-shrink-0">
                <MonthCalendar 
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              </div>

              {/* Team Members List or Empty State */}
              <div className="flex-1 min-h-0 flex flex-col">
                {selectedUser ? (
                  /* Team Members List - When user is selected */
                  <div className="border border-neutral-700 rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
                    <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between flex-shrink-0">
                      <h2 className="text-white text-lg font-semibold">Team Members</h2>
                      
                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-32 bg-transparent border border-neutral-600 rounded-lg px-3 py-1 pl-8 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                        />
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-neutral-400" />
                      </div>
                    </div>

                    {/* Team Members List */}
                     <div className="divide-y divide-neutral-700 overflow-y-auto flex-1 min-h-0">
                       {getFilteredAndSortedData().map((user) => {
                        const getStatusDotColor = (availability) => {
                          switch (availability) {
                            case 'Available': return 'bg-green-500';
                            case 'In meeting': return 'bg-blue-500';
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
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${getStatusDotColor(user.availability)} rounded-full border border-gray-900`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm truncate">{user.name}</div>
                                <div className="text-neutral-400 text-xs truncate">{user.title}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="border border-neutral-700 rounded-lg h-full flex flex-col items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">Select a Team Member</h3>
                      <p className="text-neutral-400 text-sm max-w-sm">
                        Choose a team member from the list to view their schedule and see the team list here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
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