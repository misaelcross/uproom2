import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import SimpleBar from 'simplebar-react';
import { 
  Calendar, 
  Users, 
  X, 
  Play, 
  Pause, 
  ChevronDown,
  Check,
  LayoutDashboard,
  Bell,
  BarChart3,
  Zap,
  Plus,
  Trash2,
  Clock,
  Filter,
  Edit,
  MessageSquare,
  CheckSquare,
  Settings,
  Building2,
  UserPlus,
  BellOff,
  ChevronRight,
  User,
  RefreshCw,
  LogOut,
  Activity
} from 'lucide-react';
import { usersData } from '../../data/usersData';

const Sidebar = forwardRef(({ currentPage, onNavigate, rightPanelContent, setRightPanelContent, onSetReminder }, ref) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pauseNotificationsSubmenu, setPauseNotificationsSubmenu] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);
  
  // Assumindo que o primeiro usuário é o usuário atual
  const currentUser = usersData[0];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Available');
  const [reminders, setReminders] = useState([
    { 
      id: 1, 
      text: 'Review last update on the documentation for the event next week', 
      completed: false,
      createdAt: new Date('2024-01-15T10:30:00'),
      dueDate: new Date('2024-01-22T14:00:00'),
      priority: 'high',
      mentions: ['@john', '@sarah']
    },
    { 
      id: 2, 
      text: 'Check client\'s Q3 proposal', 
      completed: true,
      createdAt: new Date('2024-01-10T09:15:00'),
      dueDate: new Date('2024-01-20T16:30:00'),
      priority: 'medium',
      mentions: ['@mike']
    }
  ]);
  const [reminderSortBy, setReminderSortBy] = useState('recent'); // 'recent', 'oldest', 'priority'
  const [showReminderSort, setShowReminderSort] = useState(false);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutos em segundos
  const [currentPomodoro, setCurrentPomodoro] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');
  const [hoveredReminder, setHoveredReminder] = useState(null);
  const [remindersCollapsed, setRemindersCollapsed] = useState(false);
  const [completedRemindersCollapsed, setCompletedRemindersCollapsed] = useState(true);
  const [pomodoroCollapsed, setPomodoroCollapsed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedStatusOption, setSelectedStatusOption] = useState(null);
  const [showStatusError, setShowStatusError] = useState(false);
  const reminderInputRef = useRef(null);

  // Função para preencher automaticamente o campo de lembrete
  const fillReminderWithUser = (userName) => {
    const reminderText = `@${userName} `;
    setNewReminderText(reminderText);
    setIsCreatingReminder(true);
    
    // Focar no input após um pequeno delay para garantir que ele foi renderizado
    setTimeout(() => {
      if (reminderInputRef.current) {
        reminderInputRef.current.focus();
        // Posicionar cursor no final do texto
        reminderInputRef.current.setSelectionRange(reminderText.length, reminderText.length);
      }
    }, 100);
  };

  // Expor a função através de useImperativeHandle
  useImperativeHandle(ref, () => ({
    fillReminderWithUser
  }), []);

  // Pause notifications options
  const pauseOptions = [
    { label: '30 minutes', value: '30min' },
    { label: '1 hour', value: '1h' },
    { label: '2 hours', value: '2h' },
    { label: 'Until tomorrow', value: 'tomorrow' },
    { label: 'Until next week', value: 'nextweek' }
  ];

  // Status options
  const statusOptions = [
    { name: 'Available', color: 'bg-green-500', dotColor: 'bg-green-500' },
    { name: 'Focus', color: 'bg-purple-500', dotColor: 'bg-purple-500' },
    { name: 'In meeting', color: 'bg-blue-500', dotColor: 'bg-blue-500' },
    { name: 'Emergency', color: 'bg-red-500', dotColor: 'bg-red-500' },
    { name: 'Break', color: 'bg-yellow-500', dotColor: 'bg-yellow-500' },
    { name: 'Away', color: 'bg-orange-500', dotColor: 'bg-orange-500' },
    { name: 'Offline', color: 'bg-gray-500', dotColor: 'bg-gray-500' }
  ];

  // useEffect para fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se clicou no botão do avatar, não fazer nada (deixar o onClick do botão lidar)
      if (avatarButtonRef.current && avatarButtonRef.current.contains(event.target)) {
        return;
      }
      
      // Se clicou fora do dropdown, fechar
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setPauseNotificationsSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Timer do Pomodoro
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      // Proximo pomodoro
      if (currentPomodoro < 4) {
        setCurrentPomodoro(prev => prev + 1);
        setPomodoroTime(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime, currentPomodoro]);

  const handlePauseNotifications = (option) => {
    console.log('Pause notifications for:', option.label);
    setDropdownOpen(false);
    setPauseNotificationsSubmenu(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  const toggleReminder = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const startCreatingReminder = () => {
    setIsCreatingReminder(true);
    setNewReminderText('');
  };

  // Funcao para obter avatar do usuario baseado na mencao
  const getUserAvatarFromMention = (mention) => {
    // Remove o @ do inicio da mencao
    const username = mention.replace("@", "").toLowerCase();
    
    // Procura o usuario baseado no nome (primeira parte do nome)
    const user = usersData.find(user => 
      user.name.toLowerCase().split(' ')[0] === username ||
      user.name.toLowerCase().includes(username)
    );
    
    return user ? user.avatar : null;
  };

  const cancelCreatingReminder = () => {
    setIsCreatingReminder(false);
    setNewReminderText('');
  };

  const confirmCreateReminder = () => {
    if (newReminderText.trim()) {
      const newId = Math.max(...reminders.map(r => r.id), 0) + 1;
      const mentions = newReminderText.match(/@\w+/g) || [];
      setReminders(prev => [...prev, {
        id: newId,
        text: newReminderText.trim(),
        completed: false,
        createdAt: new Date(),
        dueDate: null,
        priority: 'medium',
        mentions: mentions
      }]);
      setIsCreatingReminder(false);
      setNewReminderText('');
    }
  };

  // Function to sort reminders
  const getSortedReminders = () => {
    const sortedReminders = [...reminders];
    
    switch (reminderSortBy) {
      case 'recent':
        return sortedReminders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sortedReminders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'dueDate':
        return sortedReminders.sort((a, b) => {
          // Reminders without due date go to the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      default:
        return sortedReminders;
    }
  };





  const selectStatus = (status) => {
    setSelectedStatusOption(status);
    setShowStatusError(false);
  };

  const setNewStatus = () => {
    if (!selectedStatusOption) return;
    
    if (statusMessage.trim().length < 3) {
      setShowStatusError(true);
      return;
    }
    
    setCurrentStatus(selectedStatusOption.name);
    setIsAvailable(selectedStatusOption.name === 'Available');
    
    // Auto-start pomodoro when Focus is selected
    if (selectedStatusOption.name === 'Focus') {
      setPomodoroActive(true);
      setPomodoroTime(25 * 60); // Reset timer
      setCurrentPomodoro(1);
    } else {
      setPomodoroActive(false);
    }
    
    setStatusDropdownOpen(false);
    setSelectedStatusOption(null);
    setStatusMessage('');
    setShowStatusError(false);
  };

  const cancelStatusChange = () => {
    setSelectedStatusOption(null);
    setStatusMessage('');
    setShowStatusError(false);
    setStatusDropdownOpen(false);
  };

  const handleStatusClick = () => {
    if (statusDropdownOpen) {
      // Se esta fechando o dropdown, resetar a selecao
      setSelectedStatusOption(null);
      setStatusMessage('');
      setShowStatusError(false);
    } else {
      // Se esta abrindo o dropdown, definir o status atual como selecionado
      const currentStatusObj = statusOptions.find(s => s.name === currentStatus);
      setSelectedStatusOption(currentStatusObj);
    }
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const getToggleBackgroundColor = () => {
    switch (currentStatus) {
      case 'Available': return 'bg-green-500';
      case 'Focus': return 'bg-purple-500';
      case 'In meeting': return 'bg-blue-500';
      case 'Emergency': return 'bg-red-500';
      case 'Break': return 'bg-yellow-500';
      case 'Away': return 'bg-orange-500';
      case 'Offline': return 'bg-gray-500';
      default: return 'bg-neutral-500';
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', count: null },
    { icon: Check, label: 'To-dos', count: 2 },
    { icon: Calendar, label: 'Schedule', count: null },
    { icon: Zap, label: 'Nudge', count: null },
    { icon: Users, label: 'Team', count: null },
    { icon: Activity, label: 'Pulse', count: null }
  ];

  const uncompletedReminders = reminders.filter(r => !r.completed).length;
  const completedReminders = reminders.filter(r => r.completed);
  const activeReminders = reminders.filter(r => !r.completed);

  return (
    <div className="w-[300px] h-full flex flex-col" data-current-page={currentPage}>
      {/* Header com avatar do usuário e dropdown */}
      <div className="p-2 border-b border-neutral-700 relative">
        <div className="flex items-center justify-between">
          <button 
            ref={avatarButtonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-white hover:bg-neutral-800 rounded-lg p-2 transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-sm">{currentUser.name}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
            <Bell className="h-4 w-4 text-neutral-400 hover:text-white" />
          </button>
        </div>
        
        {dropdownOpen && (
          <div className="absolute top-full left-2 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-[9999]" ref={dropdownRef}>
            <div className="p-2">
              {/* Seção da empresa */}
              <div className="flex items-center gap-3 p-2 border-b border-neutral-700 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">UR</span>
                </div>
                <span className="text-white font-medium">Universe Reactive</span>
              </div>
              
              <button className="w-full text-left text-sm text-white p-2 hover:bg-neutral-700 rounded-lg transition-colors mb-2 flex items-center gap-3">
                <Plus className="h-4 w-4 text-neutral-400" />
                Add organization
              </button>
              
              <div className="border-t border-neutral-700 my-2"></div>
              
              {/* Pause Notifications */}
              <div 
                className="relative"
                onMouseEnter={() => setPauseNotificationsSubmenu(true)}
                onMouseLeave={() => setPauseNotificationsSubmenu(false)}
              >
                <button className="w-full flex items-center justify-between p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <BellOff className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-white">Pause notifications</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
                
                {/* Submenu */}
                {pauseNotificationsSubmenu && (
                  <div 
                    className="absolute left-full top-0 ml-1 w-40 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-[9999]"
                    onMouseEnter={() => setPauseNotificationsSubmenu(true)}
                    onMouseLeave={() => setPauseNotificationsSubmenu(false)}
                  >
                    <div className="p-2">
                      {pauseOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePauseNotifications(option)}
                          className="w-full text-left p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-white">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <User className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Profile</span>
              </button>
              
              {/* Change Account */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <RefreshCw className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Change account</span>
              </button>
              
              {/* Divider */}
              <div className="border-t border-neutral-700 my-2"></div>
              
              {/* Settings */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <Settings className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Settings</span>
              </button>
              
              {/* Logout */}
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors text-left">
                <LogOut className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-white">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links e Widgets - Área com scroll */}
      <SimpleBar className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {navItems.map((item, index) => {
            const isActive = (item.label === 'Dashboard' && currentPage === 'dashboard') || 
                           (item.label === 'Nudge' && currentPage === 'nudges') ||
                           (item.label === 'Schedule' && currentPage === 'schedule') ||
                           (item.label === 'To-dos' && currentPage === 'todos') ||
                           (item.label === 'Team' && currentPage === 'team') ||
                           (item.label === 'Pulse' && currentPage === 'pulse');
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.label === 'Dashboard') {
                    onNavigate('dashboard');
                  } else if (item.label === 'Nudge') {
                    onNavigate('nudges');
                  } else if (item.label === 'Schedule') {
                    onNavigate('schedule');
                  } else if (item.label === 'To-dos') {
                    onNavigate('todos');
                  } else if (item.label === 'Team') {
                    onNavigate('team');
                  } else if (item.label === 'Pulse') {
                    onNavigate('pulse');
                  }
                }}
                className={`w-full flex items-center justify-between h-7 px-3 rounded-md text-sm transition-colors hover:bg-neutral-800 ${
                  isActive ? 'bg-neutral-800 text-white' : 'text-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className="text-xs bg-neutral-700 text-neutral-400 w-5 h-5 rounded flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Reminders Section */}
        <div className="p-4">
          <div className="border border-neutral-700 rounded-lg overflow-hidden">
            {/* Header do Reminders */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-white">Reminders</h3>
                <span className="text-xs bg-neutral-700 text-neutral-400 w-5 h-5 rounded flex items-center justify-center">
                  {uncompletedReminders}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowReminderSort(!showReminderSort)}
                    className="p-1 hover:bg-neutral-600 rounded transition-colors"
                  >
                    <Filter className="h-3 w-3 text-neutral-400 hover:text-neutral-300" />
                  </button>
                  {showReminderSort && (
                    <div className="absolute right-0 top-6 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 min-w-32">
                      <button
                        onClick={() => {
                          setReminderSortBy('dueDate');
                          setShowReminderSort(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-700 transition-colors ${
                          reminderSortBy === 'dueDate' ? 'text-white' : 'text-neutral-400'
                        }`}
                      >
                        Due Date
                      </button>

                      <button
                        onClick={() => {
                          setReminderSortBy('recent');
                          setShowReminderSort(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-700 transition-colors ${
                          reminderSortBy === 'recent' ? 'text-white' : 'text-neutral-400'
                        }`}
                      >
                        Recent
                      </button>
                      <button
                        onClick={() => {
                          setReminderSortBy('oldest');
                          setShowReminderSort(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-700 transition-colors rounded-b-lg ${
                          reminderSortBy === 'oldest' ? 'text-white' : 'text-neutral-400'
                        }`}
                      >
                        Oldest
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={startCreatingReminder}
                  className="p-1 hover:bg-neutral-600 rounded transition-colors"
                >
                  <Edit className="h-3 w-3 text-neutral-400 hover:text-neutral-300" />
                </button>
                <button
                  onClick={() => setRemindersCollapsed(!remindersCollapsed)}
                  className="p-1 hover:bg-neutral-600 rounded transition-colors"
                >
                  {remindersCollapsed ? (
                    <ChevronDown className="h-3 w-3 text-neutral-400 hover:text-neutral-300" />
                  ) : (
                    <X className="h-3 w-3 text-neutral-400 hover:text-neutral-300" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Conteúdo do Reminders */}
            {!remindersCollapsed && (
              <div className="border-t border-neutral-700 p-4">
                <div className="space-y-3">
                  {/* Lembretes ativos (não concluídos) */}
                  {activeReminders.map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className="flex items-start space-x-2 group"
                      onMouseEnter={() => setHoveredReminder(reminder.id)}
                      onMouseLeave={() => setHoveredReminder(null)}
                    >
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="mt-0.5 w-4 h-4 min-w-[16px] min-h-[16px] border-2 flex items-center justify-center transition-colors rounded flex-shrink-0 border-neutral-500 hover:border-neutral-400"
                      >
                      </button>
                      <div className="flex-1 flex flex-col space-y-1">
                        <div className="flex items-start justify-between">
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className="text-xs text-left hover:opacity-80 transition-opacity flex-1 text-neutral-300"
                          >
                            {reminder.text}
                          </button>
                          {hoveredReminder === reminder.id && (
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="ml-2 p-1 hover:bg-neutral-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3 w-3 text-neutral-400 hover:text-red-400" />
                            </button>
                          )}
                        </div>
                        
                        {/* Mentions and date */}
                        <div className="flex items-center space-x-2 text-xs">
                          {/* Single mention */}
                          {reminder.mentions && reminder.mentions.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {(() => {
                                const firstMention = reminder.mentions[0];
                                const avatar = getUserAvatarFromMention(firstMention);
                                return avatar ? (
                                  <img
                                    src={avatar}
                                    alt={firstMention}
                                    className="w-6 h-6 rounded-full border border-neutral-600"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-neutral-600 border border-neutral-600 flex items-center justify-center">
                                    <span className="text-[10px] text-white font-medium">
                                      {firstMention.replace("@", "").charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                );
                              })()} 
                            </div>
                          )}
                          
                          {/* Due date */}
                          {reminder.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              <span className="text-neutral-500">
                                {new Date(reminder.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Acordeão para lembretes finalizados */}
                  {completedReminders.length > 0 && (
                    <div className="border-t border-neutral-700 pt-1 mt-1">
                      <button
                        onClick={() => setCompletedRemindersCollapsed(!completedRemindersCollapsed)}
                        className="w-full flex items-center justify-between p-2 hover:bg-neutral-800 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <ChevronRight className={`h-3 w-3 text-neutral-400 transition-transform ${
                            !completedRemindersCollapsed ? 'rotate-90' : ''
                          }`} />
                          <span className="text-xs text-neutral-400">Finished</span>
                          <span className="text-xs bg-neutral-700 text-neutral-400 w-5 h-5 rounded flex items-center justify-center">
                            {completedReminders.length}
                          </span>
                        </div>
                      </button>
                      
                      {/* Lembretes finalizados */}
                      {!completedRemindersCollapsed && (
                        <div className="space-y-3 mt-3 pl-2">
                          {completedReminders.map((reminder) => (
                            <div 
                              key={reminder.id} 
                              className="flex items-start space-x-2 group"
                              onMouseEnter={() => setHoveredReminder(reminder.id)}
                              onMouseLeave={() => setHoveredReminder(null)}
                            >
                              <button
                                onClick={() => toggleReminder(reminder.id)}
                                className="mt-0.5 w-4 h-4 min-w-[16px] min-h-[16px] border-2 flex items-center justify-center transition-colors rounded flex-shrink-0 bg-white"
                              >
                                <Check className="h-3 w-3 text-black" />
                              </button>
                              <div className="flex-1 flex flex-col space-y-1">
                                <div className="flex items-start justify-between">
                                  <button
                                    onClick={() => toggleReminder(reminder.id)}
                                    className="text-xs text-left hover:opacity-80 transition-opacity flex-1 text-neutral-500 line-through"
                                  >
                                    {reminder.text}
                                  </button>
                                  {hoveredReminder === reminder.id && (
                                    <button
                                      onClick={() => deleteReminder(reminder.id)}
                                      className="ml-2 p-1 hover:bg-neutral-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 className="h-3 w-3 text-neutral-400 hover:text-red-400" />
                                    </button>
                                  )}
                                </div>
                                
                                {/* Mentions and date */}
                                <div className="flex items-center space-x-2 text-xs">
                                  {/* Single mention */}
                                  {reminder.mentions && reminder.mentions.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      {(() => {
                                        const firstMention = reminder.mentions[0];
                                        const avatar = getUserAvatarFromMention(firstMention);
                                        return avatar ? (
                                          <img
                                            src={avatar}
                                            alt={firstMention}
                                            className="w-6 h-6 rounded-full border border-neutral-600"
                                          />
                                        ) : (
                                          <div className="w-6 h-6 rounded-full bg-neutral-600 border border-neutral-600 flex items-center justify-center">
                                            <span className="text-[10px] text-white font-medium">
                                              {firstMention.replace("@", "").charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                        );
                                      })()} 
                                    </div>
                                  )}
                                  
                                  {/* Due date */}
                                  {reminder.dueDate && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-neutral-500" />
                                      <span className="text-neutral-500">
                                        {new Date(reminder.dueDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* New reminder creation */}
                  {isCreatingReminder && (
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 w-4 h-4 min-w-[16px] min-h-[16px] border-2 border-neutral-500 rounded flex-shrink-0" />
                      <div className="flex-1 flex items-center space-x-3">
                        <input
                          ref={reminderInputRef}
                          type="text"
                          value={newReminderText}
                          onChange={(e) => setNewReminderText(e.target.value)}
                          placeholder="Digite seu lembrete..."
                          className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              confirmCreateReminder();
                            } else if (e.key === 'Escape') {
                              cancelCreatingReminder();
                            }
                          }}
                        />
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={cancelCreatingReminder}
                            className="p-1 hover:bg-neutral-600 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3 text-neutral-400 hover:text-red-400" />
                          </button>
                          <button
                            onClick={confirmCreateReminder}
                            className="p-1 hover:bg-neutral-600 rounded transition-colors"
                          >
                            <Check className="h-3 w-3 text-neutral-400 hover:text-green-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pomodoro Section - Only show when Focus status is active */}
        {currentStatus === 'Focus' && (
          <div className="px-4 pb-4">
            <div className="border border-neutral-700 rounded-lg overflow-hidden">
              {/* Header do Pomodoro */}
              <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-medium text-white">Pomodoro</h3>
                <button
                  onClick={() => setPomodoroCollapsed(!pomodoroCollapsed)}
                  className="p-1 hover:bg-neutral-600 rounded transition-colors"
                >
                  {pomodoroCollapsed ? (
                    <ChevronDown className="h-3 w-3 text-neutral-400 hover:text-neutral-300" />
                  ) : (
                    <X className="h-3 w-3 text-neutral-400 hover:text-neutral-300" />
                  )}
                </button>
              </div>
              
              {/* Conteúdo do Pomodoro */}
              {!pomodoroCollapsed && (
                <div className="border-t border-neutral-700 p-4">
                  <div className="flex items-center justify-between">
                    {/* Left side: Title and Focus badge */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-3">Product Review</h4>
                      

                    </div>

                    {/* Right side: Timer only */}
                    <div className="flex items-center">
                      <span className="text-sm text-neutral-400">{formatTime(pomodoroTime)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SimpleBar>

      {/* Footer fixo com Status e Upgrade */}
      <div className="border-t border-neutral-700">
        {/* Status Dropdown */}
        <div className="px-4 pt-4 pb-2 relative">
          <button
            onClick={handleStatusClick}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white">{currentStatus}</span>
              </div>
              
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${getToggleBackgroundColor()}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-neutral-800 transition-transform ${
                    currentStatus !== 'Offline' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Status Dropdown Menu */}
          {statusDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-50">
              <div className="p-4">
                
                {/* Status Options */}
                <div className="pb-1">
                  {statusOptions.map((status) => (
                    <button
                      key={status.name}
                      onClick={() => selectStatus(status)}
                      className={`w-full flex items-center justify-between p-2 hover:bg-neutral-700 transition-colors rounded-lg ${
                        selectedStatusOption?.name === status.name ? 'bg-neutral-800' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
                        <span className="text-sm text-white">{status.name}</span>
                      </div>
                      {selectedStatusOption?.name === status.name && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Status Message Input */}
                <div className="py-3 border-t border-neutral-700">
                  <textarea
                    value={statusMessage}
                    onChange={(e) => {
                      setStatusMessage(e.target.value);
                      if (showStatusError && e.target.value.trim().length >= 3) {
                        setShowStatusError(false);
                      }
                    }}
                    placeholder="Give more details..."
                    className={`w-full bg-neutral-800 border rounded-lg p-3 text-sm text-white placeholder-neutral-400 resize-none focus:outline-none min-h-[40px] max-h-[120px] overflow-y-auto transition-colors ${
                      showStatusError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-neutral-700 focus:border-neutral-600'
                    }`}
                    rows="1"
                    style={{
                      height: 'auto',
                      minHeight: '40px'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                  {showStatusError && (
                    <p className="text-red-400 text-xs mt-1">
                      Por favor, digite pelo menos 3 caracteres para definir o status.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-neutral-700 flex space-x-2">
                  <button 
                    onClick={cancelStatusChange}
                    className="flex-1 border border-neutral-600 text-neutral-300 font-medium py-2 px-4 rounded-lg hover:border-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={setNewStatus}
                    disabled={!selectedStatusOption || statusMessage.trim().length < 3}
                    className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                      selectedStatusOption && statusMessage.trim().length >= 3
                        ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-600'
                        : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    Set Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        <div className="px-4 pb-4">
          <button className="w-full bg-neutral-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-neutral-700 border border-neutral-600 transition-colors flex items-center justify-center space-x-2">
            <span>Upgrade to Pro</span>
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;