import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  LayoutDashboard,
  Zap,
  Bell,
  BarChart3,
  Clock,
  LogOut,
  Edit,
  Trash2
} from 'lucide-react';

const Sidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Available');
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Review last update on the documentation for the event next week', completed: false },
    { id: 2, text: 'Check client\'s Q3 proposal', completed: true }
  ]);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutos em segundos
  const [currentPomodoro, setCurrentPomodoro] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');
  const [hoveredReminder, setHoveredReminder] = useState(null);
  const [remindersCollapsed, setRemindersCollapsed] = useState(false);
  const [pomodoroCollapsed, setPomodoroCollapsed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedStatusOption, setSelectedStatusOption] = useState(null);
  const [showStatusError, setShowStatusError] = useState(false);

  // Status options
  const statusOptions = [
    { name: 'Available', color: 'bg-green-500', dotColor: 'bg-green-500' },
    { name: 'Focus', color: 'bg-purple-500', dotColor: 'bg-purple-500' },
    { name: 'In Meeting', color: 'bg-blue-500', dotColor: 'bg-blue-500' },
    { name: 'Emergency', color: 'bg-red-500', dotColor: 'bg-red-500' },
    { name: 'Out for Lunch', color: 'bg-yellow-500', dotColor: 'bg-yellow-500' },
    { name: 'Away', color: 'bg-orange-500', dotColor: 'bg-orange-500' },
    { name: 'Offline', color: 'bg-gray-500', dotColor: 'bg-gray-500' }
  ];

  // Timer do Pomodoro
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      // Próximo pomodoro
      if (currentPomodoro < 4) {
        setCurrentPomodoro(prev => prev + 1);
        setPomodoroTime(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime, currentPomodoro]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Função para calcular o progresso de cada barra do Pomodoro
  const getPomodoroProgress = (barNumber) => {
    const totalTime = 25 * 60; // 25 minutos em segundos
    
    if (barNumber < currentPomodoro) {
      // Barras anteriores estão completas
      return 100;
    } else if (barNumber === currentPomodoro) {
      // Barra atual mostra o progresso
      const elapsed = totalTime - pomodoroTime;
      return (elapsed / totalTime) * 100;
    } else {
      // Barras futuras estão vazias
      return 0;
    }
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

  const cancelCreatingReminder = () => {
    setIsCreatingReminder(false);
    setNewReminderText('');
  };

  const confirmCreateReminder = () => {
    if (newReminderText.trim()) {
      const newId = Math.max(...reminders.map(r => r.id), 0) + 1;
      setReminders(prev => [...prev, {
        id: newId,
        text: newReminderText.trim(),
        completed: false
      }]);
      setIsCreatingReminder(false);
      setNewReminderText('');
    }
  };

  const startPomodoro = () => {
    setPomodoroActive(true);
  };

  const pausePomodoro = () => {
    setPomodoroActive(false);
  };

  const stopPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroTime(25 * 60);
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
      // Se está fechando o dropdown, resetar a seleção
      setSelectedStatusOption(null);
      setStatusMessage('');
      setShowStatusError(false);
    } else {
      // Se está abrindo o dropdown, definir o status atual como selecionado
      const currentStatusObj = statusOptions.find(s => s.name === currentStatus);
      setSelectedStatusOption(currentStatusObj);
    }
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const getToggleBackgroundColor = () => {
    if (isAvailable) return 'bg-green-500';
    
    switch (currentStatus) {
      case 'In Meeting': return 'bg-blue-500';
      case 'Focus': return 'bg-purple-500';
      case 'Emergency': return 'bg-red-500';
      case 'Out for Lunch': return 'bg-yellow-500';
      case 'Away': return 'bg-orange-500';
      case 'Offline': return 'bg-gray-500';
      default: return 'bg-neutral-600';
    }
  };

  const getCurrentStatusColor = () => {
    const status = statusOptions.find(s => s.name === currentStatus);
    return status ? status.dotColor : 'bg-green-500';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', count: null },
    { icon: Check, label: 'To-dos', count: 2 },
    { icon: Calendar, label: 'Schedule', count: null },
    { icon: Zap, label: 'Nudge', count: null },
    { icon: Bell, label: 'Notifications', count: 5 },
    { icon: Users, label: 'Team', count: null },
    { icon: BarChart3, label: 'Activity', count: null },
    { icon: Clock, label: 'Reports', count: null }
  ];

  const uncompletedReminders = reminders.filter(r => !r.completed).length;

  return (
    <div className="w-[300px] h-full bg-neutral-800 flex flex-col overflow-hidden">
      {/* Header com nome da empresa e dropdown */}
      <div className="p-2 border-b border-neutral-700">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between text-white hover:bg-neutral-700 rounded-lg p-2 transition-colors"
        >
          <span className="font-medium">Universe Reactive</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {dropdownOpen && (
          <div className="mt-2 bg-neutral-700 rounded-lg border border-neutral-600 shadow-lg">
            <div className="p-2">
              <div className="text-sm text-neutral-300 p-2 hover:bg-neutral-600 rounded cursor-pointer">Switch Organization</div>
              <div className="text-sm text-neutral-300 p-2 hover:bg-neutral-600 rounded cursor-pointer">Organization Settings</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links e Widgets - Área com scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between h-7 px-3 rounded-md text-sm transition-colors hover:bg-neutral-900 ${
                item.label === 'Dashboard' ? 'bg-neutral-700 text-white' : 'text-neutral-300'
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
          ))}
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
                  {reminders.map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className="flex items-start space-x-2 group"
                      onMouseEnter={() => setHoveredReminder(reminder.id)}
                      onMouseLeave={() => setHoveredReminder(null)}
                    >
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`mt-0.5 w-4 h-4 min-w-[16px] min-h-[16px] border-2 flex items-center justify-center transition-colors rounded flex-shrink-0 ${
                          reminder.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-neutral-500 hover:border-neutral-400'
                        }`}
                      >
                        {reminder.completed && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </button>
                      <div className="flex-1 flex items-start justify-between">
                        <button
                          onClick={() => toggleReminder(reminder.id)}
                          className={`text-xs text-left hover:opacity-80 transition-opacity flex-1 ${
                            reminder.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'
                          }`}
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
                    </div>
                  ))}
                  
                  {/* New reminder creation */}
                  {isCreatingReminder && (
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 w-4 h-4 min-w-[16px] min-h-[16px] border-2 border-neutral-500 rounded flex-shrink-0" />
                      <div className="flex-1 flex items-center space-x-3">
                        <input
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

        {/* Pomodoro Section */}
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
                  {/* Left side: Title and loading bars */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-3">Working on Q4 Project</h4>
                    
                    {/* Pomodoro indicators */}
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((num) => {
                        const progress = getPomodoroProgress(num);
                        return (
                          <div
                            key={num}
                            className="w-6 h-1 bg-neutral-600 rounded-full relative overflow-hidden"
                          >
                            <div
                              className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right side: Timer and button */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-400">{formatTime(pomodoroTime)}</span>
                    <button
                      onClick={pomodoroActive ? pausePomodoro : startPomodoro}
                      className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-full transition-colors"
                    >
                      {pomodoroActive ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer fixo com Status e Upgrade */}
      <div className="border-t border-neutral-700 bg-neutral-800">
        {/* Status Dropdown */}
        <div className="px-4 pt-4 pb-2 relative">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white">{currentStatus}</span>
              </div>
              
              <button
                onClick={handleStatusClick}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${getToggleBackgroundColor()}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

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
                        selectedStatusOption?.name === status.name ? 'bg-neutral-700' : ''
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
                    Cancelar
                  </button>
                  <button 
                    onClick={setNewStatus}
                    disabled={!selectedStatusOption || statusMessage.trim().length < 3}
                    className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                      selectedStatusOption && statusMessage.trim().length >= 3
                        ? 'bg-white text-black hover:bg-gray-100'
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
          <button className="w-full bg-white text-black font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
            <span>Upgrade to Pro</span>
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;