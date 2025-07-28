import React, { useState } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Sidebar from '../shared/Sidebar';
import FirstColumn from '../shared/FirstColumn';
import MonthCalendar from './MonthCalendar';
import Schedule from './Schedule';
import { usersData } from '../../data/usersData';

const SchedulePage = ({ onNavigate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for widgets
  const weekStats = {
    productivity: 87,
    tasksCreated: 24,
    tasksCompleted: 18,
    tasksPending: 6,
    overdueTasks: 3
  };

  // Get unique roles and statuses for filters
  const uniqueRoles = [...new Set(usersData.map(user => user.title))];
  const uniqueStatuses = [...new Set(usersData.map(user => user.availability))];

  // Initialize filters with all options selected
  React.useEffect(() => {
    if (roleFilter.length === 0) {
      setRoleFilter(uniqueRoles);
    }
    if (statusFilter.length === 0) {
      setStatusFilter(uniqueStatuses);
    }
  }, []);

  // Function to get team members status
  const getTeamStatus = () => {
    const statusCounts = usersData.reduce((acc, user) => {
      const status = user.availability || 'Available';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return statusCounts;
  };

  const teamStatus = getTeamStatus();

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

  return (
    <div className="min-h-screen bg-neutral-800">
      <div className="flex gap-4 h-screen">
        {/* First column: 60px */}
        <div className="h-full" style={{ width: '60px' }}>
          <FirstColumn />
        </div>

        {/* Second column: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="schedule" onNavigate={onNavigate} />
        </div>
        {/* Third column: flex-1 - Main content */}
        <div className="flex-1 flex gap-6 py-4">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
          {/* Week Widgets */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Widget 1: Team Productivity */}
            <div className="border border-neutral-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-950/50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-white">{weekStats.productivity}</div>
                  <div className="text-neutral-400 text-xs">Productivity %</div>
                </div>
              </div>
            </div>

            {/* Widget 2: Created Tasks */}
            <div className="border border-neutral-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-950/50 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-300" />
                </div>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-white">{weekStats.tasksCreated}</div>
                  <div className="text-neutral-400 text-xs">Created Tasks</div>
                </div>
              </div>
            </div>

            {/* Widget 3: Completed Tasks */}
            <div className="border border-neutral-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-950/50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                </div>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-white">{weekStats.tasksCompleted}</div>
                  <div className="text-neutral-400 text-xs">Completed Tasks</div>
                </div>
              </div>
            </div>

            {/* Widget 4: Overdue Tasks */}
            <div className="border border-neutral-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-950/50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-300" />
                </div>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-white">{weekStats.overdueTasks}</div>
                  <div className="text-neutral-400 text-xs">Overdue Tasks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="border border-neutral-700 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
              <h2 className="text-white text-xl font-semibold">Team Members</h2>
              
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>
            
            {/* Table Header */}
            <div className="px-6 py-3 text-neutral-400 text-sm font-medium">
              <div className="grid grid-cols-3 gap-4">
                {/* Member Column with Sort */}
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <span>Member</span>
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
                
                {/* Role Column with Filter Dropdown */}
                <div className="relative">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  >
                    <span>Role</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  
                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <div className="p-3 space-y-2">
                        {uniqueRoles.map(role => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-700 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={roleFilter.includes(role)}
                              onChange={() => handleRoleFilter(role)}
                              className="w-4 h-4 border-2 border-neutral-500 rounded bg-transparent checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0"
                              style={{
                                accentColor: '#000000'
                              }}
                            />
                            <span className="text-white text-sm">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Status Column with Filter Dropdown */}
                <div className="relative">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <span>Status</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <div className="p-3 space-y-2">
                        {uniqueStatuses.map(status => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-700 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={statusFilter.includes(status)}
                              onChange={() => handleStatusFilter(status)}
                              className="w-4 h-4 border-2 border-neutral-500 rounded bg-transparent checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0"
                              style={{
                                accentColor: '#000000'
                              }}
                            />
                            <span className="text-white text-sm">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="divide-y divide-neutral-700">
              {getFilteredAndSortedData().map((user) => {
                // Status functions (copied from UserCard)
                const getStatusColor = (availability) => {
                  switch (availability) {
                    case 'Available': return 'text-green-500';
                    case 'In meeting': return 'text-blue-500';
                    case 'Out for Lunch': return 'text-yellow-500';
                    case 'Focus': return 'text-purple-500';
                    case 'Emergency': return 'text-red-500';
                    case 'Away': return 'text-orange-500';
                    case 'Offline': return 'text-gray-500';
                    default: return 'text-green-500';
                  }
                };

                const getStatusDotColor = (availability) => {
                  switch (availability) {
                    case 'Available': return 'bg-green-500';
                    case 'In meeting': return 'bg-blue-500';
                    case 'Out for Lunch': return 'bg-yellow-500';
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
                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* Avatar and Name */}
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
                        </div>
                      </div>
                      
                      {/* Role */}
                      <div className="text-neutral-300">{user.title}</div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <div className={`border border-neutral-700 rounded px-2 pb-1 ${getStatusColor(user.availability)}`}>
                          <span className="text-xs">{user.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

          {/* Coluna Direita */}
          <div className="w-80 space-y-6">
          {/* Calendário */}
          <MonthCalendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />

          {/* Schedule */}
          <div className="flex-1">
            {selectedUser ? (
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
                                  ? 'bg-cyan-600'
                                  : 'border border-neutral-700 bg-transparent'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className={`text-sm font-medium ${
                                    event.isCurrent ? 'text-cyan-200' : 'text-neutral-500'
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
                                      event.isCurrent ? 'text-cyan-200' : 'text-neutral-500'
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
              /* Estado Vazio */
              <div className="border border-neutral-700 rounded-lg h-full flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-white font-medium mb-2">Select a Member</h3>
                <p className="text-neutral-400 text-sm text-center">
                  Click on a team member in the table to see their schedule
                </p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;