import React, { useState, useEffect, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import { Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserCard from './components/dashboard/UserCard';
import UserDetails from './components/dashboard/UserDetails';
import Schedule from './components/schedule/Schedule';
import SchedulePage from './components/schedule/SchedulePage';
import EventDetailsSidebar from './components/schedule/EventDetailsSidebar';
import LinkContextSidebar from './components/schedule/LinkContextSidebar';
import ScheduleMeetingSidebar from './components/schedule/ScheduleMeetingSidebar';
import EmployeeListSidebar from './components/schedule/EmployeeListSidebar';
import EmployeeAvailabilitySidebar from './components/schedule/EmployeeAvailabilitySidebar';
import MeetingConfirmationSidebar from './components/schedule/MeetingConfirmationSidebar';
import CreateGroupSidebar from './components/dashboard/CreateGroupSidebar';
import GroupMemberSelectionSidebar from './components/dashboard/GroupMemberSelectionSidebar';
import GroupConfirmationSidebar from './components/dashboard/GroupConfirmationSidebar';
import StatusGroupView from './components/dashboard/StatusGroupView';
import StatusGroupDetails from './components/dashboard/StatusGroupDetails';
import useNudgeStore from './store/nudgeStore';
import RoleGroupView from './components/dashboard/RoleGroupView';
import RoleGroupDetails from './components/dashboard/RoleGroupDetails';
import UserGroupsView from './components/dashboard/UserGroupsView';
import UserGroupDetails from './components/dashboard/UserGroupDetails';
import PollCreationSidebar from './components/nudges/PollCreationSidebar';
import AnimatedBottomSheet from './components/shared/AnimatedBottomSheet';
import SecondaryBottomSheet from './components/shared/SecondaryBottomSheet';
import NudgePage from './components/nudges/NudgePage';
import TodosPage from './components/todos/TodosPage';
import TeamPage from './components/team/TeamPage';
import FilesPage from './components/files/FilesPage';
import Sidebar from './components/shared/Sidebar';

import TopTabs from './components/dashboard/TopTabs';
import LiveNotifications from './components/shared/LiveNotifications';
import ActionBar from './components/dashboard/ActionBar';
import { usersData } from './data/usersData';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' ou 'nudges'
  const [rightPanelContent, setRightPanelContent] = useState('schedule');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedRoleGroup, setSelectedRoleGroup] = useState(null);
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Event selected for sidebar details
  const [isLinkingContext, setIsLinkingContext] = useState(false); // Context linking sidebar state
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false); // Schedule meeting sidebar state
  const [schedulingStep, setSchedulingStep] = useState('initial'); // 'initial', 'employees', 'availability', 'confirmation'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [previousContext, setPreviousContext] = useState(null);
  const [usersWithIcons, setUsersWithIcons] = useState([]);
  
  // Estados para criação de grupos
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupCreationStep, setGroupCreationStep] = useState('initial'); // 'initial', 'members', 'confirmation'
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [sortBy, setSortBy] = useState('Newest');
  const [topTabActive, setTopTabActive] = useState('overview');
  
  // Estados para o Bottom Sheet
  const [activeTab, setActiveTab] = useState('send');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  // Create dark theme for Material-UI components
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        paper: '#262626', // neutral-800
      },
      success: {
        main: '#10b981', // green-500
      },
      error: {
        main: '#ef4444', // red-500
      },
      text: {
        primary: '#ffffff',
      },
    },
    components: {
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiPaper-root': {
              backgroundColor: '#262626',
              border: '1px solid #404040',
            },
          },
        },
      },
    },
  });

  // Hook do store de nudges
  const { simulateNewNudge } = useNudgeStore();

  // Ref para o Sidebar
  const sidebarRef = useRef(null);
  
  // Ref para o SimpleBar da coluna direita (para controlar scroll)
  const rightPanelScrollRef = useRef(null);

  // Função para lidar com Set Reminder
  const handleSetReminder = (userName) => {
    if (sidebarRef.current && sidebarRef.current.fillReminderWithUser) {
      sidebarRef.current.fillReminderWithUser(userName);
    }
  };

  // Função para reverter sidebar direita para visualização padrão
  const resetRightSidebar = () => {
    setRightPanelContent('schedule');
    setSelectedUser(null);
    setSelectedGroup(null);
    setSelectedRoleGroup(null);
    setSelectedUserGroup(null);
    setPreviousContext(null);
  };

  // Event listener para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        resetRightSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Reset scroll quando o schedulingStep mudar
  useEffect(() => {
    if (rightPanelScrollRef.current && isScheduleMeetingOpen) {
      rightPanelScrollRef.current.getScrollElement().scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [schedulingStep, isScheduleMeetingOpen]);

  // Reset scroll quando selectedEvent mudar (Event Details)
  useEffect(() => {
    if (rightPanelScrollRef.current && selectedEvent) {
      rightPanelScrollRef.current.getScrollElement().scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedEvent]);

  // Função para gerar ícones aleatórios
  const generateRandomIcons = () => {
    const allIcons = [
      'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
      'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg',
      'https://cdn.worldvectorlogo.com/logos/jira-1.svg',
      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg',
      'https://www.svgrepo.com/show/353597/confluence.svg',
      'https://www.svgrepo.com/show/354463/trello.svg'
    ];
    
    const iconCount = Math.floor(Math.random() * 6);
    if (iconCount === 0) return [];
    
    const shuffled = [...allIcons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, iconCount);
  };

  // Gerar ícones uma única vez no carregamento
  useEffect(() => {
    const usersWithRandomIcons = usersData.map(user => ({
      ...user,
      randomIcons: generateRandomIcons()
    }));
    setUsersWithIcons(usersWithRandomIcons);
  }, []);

  const showUserDetails = (user) => {
    if (rightPanelContent === 'group' && selectedGroup) {
      setPreviousContext({ type: 'group', data: selectedGroup });
    } else if (rightPanelContent === 'roleGroup' && selectedRoleGroup) {
      setPreviousContext({ type: 'roleGroup', data: selectedRoleGroup });
    } else if (rightPanelContent === 'userGroup' && selectedUserGroup) {
      setPreviousContext({ type: 'userGroup', data: selectedUserGroup });
    } else {
      setPreviousContext({ type: 'schedule', data: null });
    }
    
    setSelectedUser(user);
    setRightPanelContent('userDetails');
  };

  const goBackFromUserDetails = () => {
    setSelectedUser(null);
    
    if (previousContext) {
      if (previousContext.type === 'group') {
        setSelectedGroup(previousContext.data);
        setRightPanelContent('group');
      } else if (previousContext.type === 'roleGroup') {
        setSelectedRoleGroup(previousContext.data);
        setRightPanelContent('roleGroup');
      } else if (previousContext.type === 'userGroup') {
        setSelectedUserGroup(previousContext.data);
        setRightPanelContent('userGroup');
      } else {
        setRightPanelContent('schedule');
      }
      setPreviousContext(null);
    } else {
      setRightPanelContent('schedule');
    }
  };

  const handleUserSelect = (user) => {
    const userWithIcons = usersWithIcons.find(u => u.id === user.id);
    if (userWithIcons) {
      showUserDetails(userWithIcons);
    }
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const getSortedUsers = () => {
    let sortedUsers = [...usersWithIcons];
    
    switch (sortBy) {
      case 'Alphabetical (A–Z)':
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Alphabetical (Z–A)':
        sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Role':
        sortedUsers.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Status':
        sortedUsers.sort((a, b) => a.availability.localeCompare(b.availability));
        break;
      case 'Department':
        sortedUsers.sort((a, b) => a.department.localeCompare(b.department));
        break;
      case 'Newest':
        sortedUsers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
      case 'Oldest':
        sortedUsers.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
        break;
      default:
        break;
    }
    
    return sortedUsers;
  };

  const showGroupDetails = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    setSelectedRoleGroup(null);
    setRightPanelContent('group');
  };

  const closeGroupDetails = () => {
    setSelectedGroup(null);
    setRightPanelContent('schedule');
  };

  const showRoleGroupDetails = (roleGroup) => {
    setSelectedRoleGroup(roleGroup);
    setSelectedUser(null);
    setSelectedGroup(null);
    setRightPanelContent('roleGroup');
  };

  const closeRoleGroupDetails = () => {
    setSelectedRoleGroup(null);
    setRightPanelContent('schedule');
  };

  const showUserGroupDetails = (userGroup) => {
    setSelectedUserGroup(userGroup);
    setSelectedUser(null);
    setSelectedGroup(null);
    setSelectedRoleGroup(null);
    setRightPanelContent('userGroup');
  };

  const closeUserGroupDetails = () => {
    setSelectedUserGroup(null);
    setRightPanelContent('schedule');
  };

  // Handle collaborate button click
  const handleCollaborate = () => {
    // Close any open sidebars first
    if (isCreateGroupOpen) {
      handleCloseCreateGroup();
    }
    
    // Open the schedule meeting flow
    setRightPanelContent('schedule');
    setSelectedEvent(null);
    setSelectedUser(null);
    setSelectedGroup(null);
    setSelectedRoleGroup(null);
    setSelectedUserGroup(null);
    setIsLinkingContext(false);
    
    // Trigger the schedule meeting sidebar
    handleOpenScheduleMeeting();
  };

  // Event details sidebar handlers
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
    setIsLinkingContext(false);
  };

  // Context linking handlers
  const handleLinkContext = (event) => {
    setSelectedEvent(event);
    setIsLinkingContext(true);
  };

  const handleBackFromLinking = () => {
    setIsLinkingContext(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    console.log('Event updated:', updatedEvent);
    setIsLinkingContext(false);
  };

  const handleOpenScheduleMeeting = () => {
    // Close Create Group sidebar if it's open
    if (isCreateGroupOpen) {
      handleCloseCreateGroup();
    }
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

  const addNudge = useNudgeStore(state => state.addNewNudge);

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleConfirmMeeting = async (meetingData) => {
    try {
      const { employee, timeSlot, dateInfo, message } = meetingData;
      
      // Create nudge for meeting request
      const meetingNudge = {
        id: `meeting-${Date.now()}`,
        senderId: 'current-user', // You would get this from your auth context
        senderName: 'You',
        senderTitle: 'Meeting Organizer',
        senderAvatar: '/path/to/your/avatar.jpg', // You would get this from your auth context
        recipientId: employee.id,
        recipientName: employee.name,
        message: `Meeting request: ${dateInfo.dayName}, ${dateInfo.monthDay} at ${timeSlot.time}`,
        fullMessage: `Hi ${employee.name}! I would like to schedule a meeting with you on ${dateInfo.dayName}, ${dateInfo.monthDay} at ${timeSlot.time} (30 minutes).${message ? `\n\nMessage: ${message}` : ''}\n\nPlease confirm your availability.`,
        timestamp: new Date().toISOString(),
        type: 'meeting_request',
        priority: 'normal',
        isRead: false,
        isPinned: false,
        isHighPriority: false,
        attachments: [],
        replies: [],
        meetingDetails: {
          date: dateInfo.monthDay,
          time: timeSlot.time,
          duration: '30 minutes',
          organizer: 'You',
          participant: employee.name
        }
      };
      
      // Add nudge to store
      addNudge(meetingNudge);
      
      console.log('Meeting request sent:', meetingNudge);
      showSnackbar(`Meeting request sent to ${employee.name}!`, 'success');
      handleCloseScheduleMeeting();
    } catch (error) {
      console.error('Error confirming meeting:', error);
      showSnackbar('Failed to send meeting request. Please try again.', 'error');
    }
  };

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

  // Funções para criação de grupos
  const handleOpenCreateGroup = () => {
    // Close Schedule Meeting sidebar if it's open
    if (isScheduleMeetingOpen) {
      handleCloseScheduleMeeting();
    }
    setIsCreateGroupOpen(true);
    setGroupCreationStep('initial');
  };

  const handleCloseCreateGroup = () => {
    setIsCreateGroupOpen(false);
    setGroupCreationStep('initial');
    setSelectedGroupMembers([]);
  };

  const handleShowMemberSelection = () => {
    setGroupCreationStep('members');
  };

  const handleSelectGroupMember = (member) => {
    setSelectedGroupMembers(prev => {
      const isSelected = prev.find(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleContinueToConfirmation = () => {
    setGroupCreationStep('confirmation');
  };

  const handleBackToMemberSelection = () => {
    setGroupCreationStep('members');
  };

  const handleBackToInitial = () => {
    setGroupCreationStep('initial');
    setSelectedGroupMembers([]);
  };

  const handleConfirmGroupCreation = async (groupData) => {
    try {
      const newGroup = {
        id: `group-${Date.now()}`,
        ...groupData,
        memberCount: groupData.members.length,
        createdAt: new Date().toISOString()
      };
      
      // Adicionar o novo grupo à lista de grupos criados
      setCreatedGroups(prev => [...prev, newGroup]);
      
      console.log('Group created:', newGroup);
      alert(`Group "${groupData.name}" created successfully!`);
      handleCloseCreateGroup();
    } catch (error) {
      console.error('Error creating group:', error);
      throw error; // Re-throw para que o componente possa lidar com o erro
    }
  };



  // Se estiver na página de nudges, renderizar NudgePage
  if (currentPage === 'nudges') {
    return <NudgePage 
      onNavigate={setCurrentPage} 
      onOpenPollCreation={() => setRightPanelContent('pollCreation')}
    />;
  }

  // Se estiver na página de schedule, renderizar SchedulePage
  if (currentPage === 'schedule') {
    return <SchedulePage onNavigate={setCurrentPage} />;
  }

  // Se estiver na página de todos, renderizar TodosPage
  if (currentPage === 'todos') {
    return <TodosPage onNavigate={setCurrentPage} />;
  }

  // Se estiver na página de team, renderizar TeamPage
  if (currentPage === 'team') {
    return <TeamPage onNavigate={setCurrentPage} />;
  }

  // Se estiver na página de files, renderizar FilesPage
  if (currentPage === 'files') {
    return <FilesPage onNavigate={setCurrentPage} />;
  }



  // Renderizar Dashboard (página padrão)
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="h-screen bg-neutral-900 pr-6 overflow-hidden">
      <div className="flex gap-4 h-screen">
        {/* Primeira coluna: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar ref={sidebarRef} currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>

        {/* Segunda coluna: flex-1 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Primeira linha: 3 divs retangulares */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabs activeTab={topTabActive} setActiveTab={setTopTabActive} users={usersWithIcons} />
            <LiveNotifications 
              usersData={usersWithIcons}
              onUserClick={showUserDetails}
            />

            <ActionBar onUserSelect={handleUserSelect} onSortChange={handleSortChange} onInvite={handleOpenCreateGroup} onCollaborate={handleCollaborate} sortBy={sortBy} />
          </div>

          {/* Segunda linha: Grid e coluna direita */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Grid de cards ou visualização por status/cargo */}
            <SimpleBar className="flex-1 min-h-0">
              {topTabActive === 'groups' ? (
                <UserGroupsView 
                  users={usersWithIcons} 
                  onUserClick={showUserDetails}
                  onGroupClick={showUserGroupDetails}
                  createdGroups={createdGroups}
                />
              ) : sortBy === 'Status' ? (
                 <StatusGroupView 
                   users={usersWithIcons} 
                   onUserClick={showUserDetails}
                   onGroupClick={showGroupDetails}
                 />
               ) : sortBy === 'Role' ? (
                 <RoleGroupView 
                   users={usersWithIcons} 
                   onUserClick={showUserDetails}
                   onGroupClick={showRoleGroupDetails}
                 />
               ) : (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  {getSortedUsers().map((user) => (
                    <UserCard 
                      key={user.id} 
                      user={user}
                      onClick={() => showUserDetails(user)}
                      onSetReminder={handleSetReminder}
                    />
                  ))}
                </div>
              )}
            </SimpleBar>

            {/* Coluna direita */}
            <SimpleBar 
              ref={rightPanelScrollRef} 
              className={rightPanelContent === 'userDetails' ? '' : 'pb-12'} 
              style={{ width: '350px' }}
              forceVisible={rightPanelContent !== 'userDetails'}
            >
              {rightPanelContent === 'schedule' && !selectedEvent && !isScheduleMeetingOpen && !isCreateGroupOpen && <Schedule onEventSelect={handleEventSelect} onScheduleMeeting={handleOpenScheduleMeeting} onLinkContext={handleLinkContext} />}
              {rightPanelContent === 'schedule' && selectedEvent && !isLinkingContext && (
                <EventDetailsSidebar
                  event={selectedEvent}
                  onClose={handleCloseEventDetails}
                  onEdit={(event) => {
                    console.log('Edit event:', event);
                  }}
                  onLinkContext={handleLinkContext}
                />
              )}
              {rightPanelContent === 'schedule' && selectedEvent && isLinkingContext && (
                <LinkContextSidebar
                  event={selectedEvent}
                  onBack={handleBackFromLinking}
                  onSave={handleUpdateEvent}
                />
              )}
              {rightPanelContent === 'schedule' && isScheduleMeetingOpen && (
                <>
                  {schedulingStep === 'initial' && (
                    <ScheduleMeetingSidebar
                      isOpen={isScheduleMeetingOpen}
                      onClose={handleCloseScheduleMeeting}
                      onShowEmployeeList={handleShowEmployeeList}
                    />
                  )}
                  {schedulingStep === 'employees' && (
                    <EmployeeListSidebar
                      isOpen={true}
                      onClose={handleCloseScheduleMeeting}
                      onSelectEmployee={handleSelectEmployee}
                    />
                  )}
                  {schedulingStep === 'availability' && (
                    <EmployeeAvailabilitySidebar
                      isOpen={true}
                      onClose={handleCloseScheduleMeeting}
                      onBack={handleBackToEmployees}
                      employee={selectedEmployee}
                      onSelectTimeSlot={handleSelectTimeSlot}
                    />
                  )}
                  {schedulingStep === 'confirmation' && (
                    <MeetingConfirmationSidebar
                      isOpen={true}
                      onClose={handleCloseScheduleMeeting}
                      onBack={handleBackToAvailability}
                      employee={selectedEmployee}
                      timeSlot={selectedTimeSlot}
                      dateInfo={selectedDateInfo}
                      onConfirm={handleConfirmMeeting}
                    />
                  )}
                </>
              )}
              {rightPanelContent === 'schedule' && isCreateGroupOpen && (
                <>
                  {groupCreationStep === 'initial' && (
                    <CreateGroupSidebar
                      isOpen={isCreateGroupOpen}
                      onClose={handleCloseCreateGroup}
                      onShowMemberSelection={handleShowMemberSelection}
                    />
                  )}
                  {groupCreationStep === 'members' && (
                    <GroupMemberSelectionSidebar
                      isOpen={true}
                      onClose={handleCloseCreateGroup}
                      onBack={handleBackToInitial}
                      selectedMembers={selectedGroupMembers}
                      onMemberToggle={handleSelectGroupMember}
                      onContinue={handleContinueToConfirmation}
                    />
                  )}
                  {groupCreationStep === 'confirmation' && (
                    <GroupConfirmationSidebar
                      isOpen={true}
                      onClose={handleCloseCreateGroup}
                      onBack={handleBackToMemberSelection}
                      selectedMembers={selectedGroupMembers}
                      onConfirm={handleConfirmGroupCreation}
                    />
                  )}
                </>
              )}
              {rightPanelContent === 'userDetails' && selectedUser && (
                <UserDetails user={selectedUser} onBack={goBackFromUserDetails} />
              )}
              {rightPanelContent === 'group' && selectedGroup && (
                <StatusGroupDetails 
                  group={selectedGroup} 
                  onUserClick={showUserDetails}
                  onClose={closeGroupDetails}
                />
              )}
              {rightPanelContent === 'roleGroup' && selectedRoleGroup && (
                <RoleGroupDetails 
                  group={selectedRoleGroup} 
                  onUserClick={showUserDetails}
                  onClose={closeRoleGroupDetails}
                />
              )}
              {rightPanelContent === 'userGroup' && selectedUserGroup && (
                <UserGroupDetails 
                  group={selectedUserGroup} 
                  onUserClick={showUserDetails}
                  onClose={closeUserGroupDetails}
                  allUsers={usersWithIcons}
                />
              )}
              {rightPanelContent === 'pollCreation' && (
                <PollCreationSidebar
                  onBack={() => setRightPanelContent(null)}
                  onCreatePoll={(pollData) => {
                    console.log('Poll created:', pollData);
                    // Here we would integrate with the nudge store or poll creation logic
                    setRightPanelContent(null);
                  }}
                />
              )}
            </SimpleBar>
          </div>
        </div>
      </div>

      {/* Animated Bottom Sheet - Principal (Direita) */}
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

      {/* Secondary Bottom Sheet - Secundário (Esquerda) */}
      <SecondaryBottomSheet />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            backgroundColor: snackbar.severity === 'success' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: '#ffffff',
            },
            '& .MuiAlert-action': {
              color: '#ffffff',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;