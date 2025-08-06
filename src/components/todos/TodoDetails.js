import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Star, Plus, Trash2, X, Check, Clock, Bell, Repeat, Users, MessageCircle, Send } from 'lucide-react';
import TodoStep from './TodoStep';

const TodoDetails = ({ 
  todo, 
  onBack, 
  onToggleComplete, 
  onToggleStar, 
  onAddStep, 
  onDeleteStep, 
  onToggleStepComplete,
  onUpdateNotes,
  onDeleteTodo,
  onUpdateTodoDescription,
  onUpdateStepDescription 
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showDurationForm, setShowDurationForm] = useState(false);
  const [showRepeatForm, setShowRepeatForm] = useState(false);
  const [newStepText, setNewStepText] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [durationStart, setDurationStart] = useState('');
  const [durationEnd, setDurationEnd] = useState('');
  const [repeatOption, setRepeatOption] = useState('daily');
  const [reminders, setReminders] = useState(todo?.reminders || []);
  const [duration, setDuration] = useState(todo?.duration || null);
  const [repeat, setRepeat] = useState(todo?.repeat || null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true); // Always show comments
  const [description, setDescription] = useState(todo?.description || '');
  const [selectedAssignees, setSelectedAssignees] = useState(todo?.assignees || []);
  const [showMentionForm, setShowMentionForm] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const titleInputRef = useRef(null);
  const descriptionRef = useRef(null);

  // Mock users data for assignments and mentions
  const mockUsers = [
    { id: 1, name: 'Alex Johnson', title: 'Frontend Developer', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 2, name: 'Sarah Chen', title: 'UX Designer', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 3, name: 'Mike Rodriguez', title: 'Backend Developer', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  ];

  const mockTeams = [
    { id: 1, name: 'Design Team', members: 5 },
    { id: 2, name: 'Development Team', members: 8 },
    { id: 3, name: 'QA Team', members: 3 },
  ];

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  if (!todo) return null;

  const completedSteps = todo.steps?.filter(step => step.completed).length || 0;
  const totalSteps = todo.steps?.length || 0;

  // Function to calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(todo.description);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== todo.description) {
      onUpdateTodoDescription(todo.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleTitleBlur = () => {
    handleTitleSave();
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTodo(todo.id);
    setShowDeleteModal(false);
    onBack();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleAddStep = () => {
    if (newStepText.trim()) {
      onAddStep(newStepText.trim());
      setNewStepText('');
    }
  };

  const handleAddReminder = () => {
    if (newReminderDate && newReminderTime) {
      const newReminder = { id: Date.now(), date: newReminderDate, time: newReminderTime };
      setReminders([...reminders, newReminder]);
      setShowReminderForm(false);
      setNewReminderDate('');
      setNewReminderTime('');
    }
  };

  const handleRemoveReminder = (reminderId) => {
    setReminders(reminders.filter(r => r.id !== reminderId));
  };

  const handleAddDuration = () => {
    if (durationStart && durationEnd) {
      setDuration({ start: durationStart, end: durationEnd });
      setShowDurationForm(false);
      setDurationStart('');
      setDurationEnd('');
    }
  };

  const handleRemoveDuration = () => {
    setDuration(null);
  };

  const handleAddRepeat = () => {
    if (repeatOption) {
      setRepeat(repeatOption);
      setShowRepeatForm(false);
    }
  };

  const handleRemoveRepeat = () => {
    setRepeat(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <button
          onClick={onBack}
          className="flex items-center text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Todo Title and Description */}
        <div className="space-y-3">
          {/* Title - Truncated to one line */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-neutral-800 border-neutral-600'
                  : 'border-neutral-400 hover:border-white'
              }`}
            >
              {todo.completed && (
                <Check className="w-3 h-3 text-white" />
              )}
            </button>
            
            <div className="flex-1 flex items-center space-x-2">
              {isEditingTitle ? (
                <>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onBlur={handleTitleBlur}
                    className="flex-1 bg-transparent border border-neutral-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <button
                    onClick={handleTitleCancel}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleTitleSave}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <h2
                  onClick={handleTitleClick}
                  className={`text-xl font-medium cursor-pointer hover:text-neutral-300 transition-colors truncate ${
                    todo.completed ? 'line-through text-neutral-500' : 'text-white'
                  }`}
                  title={todo.description}
                >
                  {todo.description}
                </h2>
              )}
            </div>

            {!isEditingTitle && (
              <button
                onClick={() => onToggleStar(todo.id)}
                className={`transition-colors ${
                  todo.starred ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Star className={`w-5 h-5 ${todo.starred ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>

          {/* Description Field with @ mentions support */}
          <div className="relative">
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                // Handle @ mentions here
                const text = e.target.value;
                const cursorPosition = e.target.selectionStart;
                const textBeforeCursor = text.substring(0, cursorPosition);
                const lastAtIndex = textBeforeCursor.lastIndexOf('@');
                
                if (lastAtIndex !== -1 && lastAtIndex === cursorPosition - 1) {
                  // Show mention dropdown
                  setShowMentionForm(true);
                  setMentionSearch('');
                } else if (lastAtIndex !== -1) {
                  const mentionText = textBeforeCursor.substring(lastAtIndex + 1);
                  if (!mentionText.includes(' ') && mentionText.length > 0) {
                    setShowMentionForm(true);
                    setMentionSearch(mentionText);
                  } else {
                    setShowMentionForm(false);
                  }
                } else {
                  setShowMentionForm(false);
                }
              }}
              placeholder="Add description... (use @ to mention someone)"
              className="w-full h-24 bg-transparent border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            />
            
            {/* Mention Dropdown */}
            {showMentionForm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
                {mockUsers
                  .filter(user => user.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                  .map(user => (
                    <div 
                      key={`mention-${user.id}`}
                      onClick={() => {
                        const cursorPosition = descriptionRef.current.selectionStart;
                        const textBeforeCursor = description.substring(0, cursorPosition);
                        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
                        const textAfterCursor = description.substring(cursorPosition);
                        
                        const newText = description.substring(0, lastAtIndex) + `@${user.name} ` + textAfterCursor;
                        setDescription(newText);
                        setShowMentionForm(false);
                      }}
                      className="flex items-center space-x-2 p-2 hover:bg-neutral-700 rounded cursor-pointer"
                    >
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                      <div>
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-neutral-400 text-xs">{user.title}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Context Information from Nudge */}
        {todo.sourceNudge && (
          <div className="space-y-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
            <h3 className="text-lg font-medium text-white">Context from Nudge</h3>
            
            {/* Sender Information */}
            <div className="flex items-center space-x-3">
              <img 
                src={todo.sourceNudge.sender.avatar} 
                alt={todo.sourceNudge.sender.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-white text-sm font-medium">{todo.sourceNudge.sender.name}</p>
                <p className="text-neutral-400 text-xs">{todo.sourceNudge.sender.title}</p>
              </div>
            </div>

            {/* Original Message */}
            {todo.sourceNudge.originalMessage && (
              <div className="bg-neutral-700 p-3 rounded border border-neutral-600">
                <p className="text-neutral-300 text-sm">{todo.sourceNudge.originalMessage}</p>
              </div>
            )}

            {/* Attachments */}
            {todo.sourceNudge.attachments && todo.sourceNudge.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {todo.sourceNudge.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-neutral-700 rounded">
                      <span className="text-white text-sm">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {todo.sourceNudge.links && todo.sourceNudge.links.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Links</h4>
                <div className="space-y-2">
                  {todo.sourceNudge.links.map((link, index) => (
                    <div key={index} className="p-2 bg-neutral-700 rounded">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                        {link.title || link.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Steps Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Steps</h3>
            <span className="text-sm text-neutral-400">
              Tasks: {completedSteps} of {totalSteps}
            </span>
          </div>

          {/* Progress Bar */}
          {totalSteps > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(completedSteps / totalSteps) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="text-sm text-neutral-400 text-center">
                {Math.round((completedSteps / totalSteps) * 100)}% Complete
              </div>
            </div>
          )}

          <div className="space-y-2">
            {todo.steps?.map((step) => (
              <TodoStep
                key={step.id}
                step={step}
                onToggleComplete={onToggleStepComplete}
                onDelete={onDeleteStep}
                onUpdateDescription={onUpdateStepDescription}
              />
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                placeholder="Add a step..."
                className="flex-1 bg-transparent border border-neutral-600 rounded px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button
                onClick={handleAddStep}
                disabled={!newStepText.trim()}
                className="px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="space-y-4">
          {/* Reminders Section */}
          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Reminders</h4>
            {reminders && reminders.length > 0 ? (
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-neutral-400" />
                      <span className="text-white text-sm">
                        {new Date(reminder.date + 'T' + reminder.time).toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleRemoveReminder(reminder.id)}
                      className="text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            
            {showReminderForm ? (
              <div className="space-y-2 p-3 border border-neutral-600 rounded">
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={newReminderDate}
                    onChange={(e) => setNewReminderDate(e.target.value)}
                    className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowReminderForm(false);
                      setNewReminderDate('');
                      setNewReminderTime('');
                    }}
                    className="flex-1 px-3 py-2 border border-neutral-600 rounded text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddReminder}
                    disabled={!newReminderDate || !newReminderTime}
                    className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowReminderForm(true)}
                className="flex items-center text-neutral-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add reminder
              </button>
            )}
          </div>

          {/* Duration Section */}
          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Duration</h4>
            {duration ? (
              <div className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span className="text-white text-sm">
                    {duration.start} - {duration.end}
                  </span>
                </div>
                <button 
                  onClick={handleRemoveDuration}
                  className="text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : null}
            
            {showDurationForm ? (
              <div className="space-y-2 p-3 border border-neutral-600 rounded">
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={durationStart}
                    onChange={(e) => setDurationStart(e.target.value)}
                    placeholder="Start time"
                    className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={durationEnd}
                    onChange={(e) => setDurationEnd(e.target.value)}
                    placeholder="End time"
                    className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDurationForm(false)}
                    className="flex-1 px-3 py-2 border border-neutral-600 rounded text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDuration}
                    disabled={!durationStart || !durationEnd}
                    className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowDurationForm(true)}
                className="flex items-center text-neutral-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add duration
              </button>
            )}
          </div>

          {/* Repeat Section */}
          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Repeat</h4>
            {repeat ? (
              <div className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                <div className="flex items-center space-x-2">
                  <Repeat className="w-4 h-4 text-neutral-400" />
                  <span className="text-white text-sm capitalize">
                    {repeat}
                  </span>
                </div>
                <button 
                  onClick={handleRemoveRepeat}
                  className="text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : null}
            
            {showRepeatForm ? (
              <div className="space-y-2 p-3 border border-neutral-600 rounded">
                <select
                  value={repeatOption}
                  onChange={(e) => setRepeatOption(e.target.value)}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowRepeatForm(false)}
                    className="flex-1 px-3 py-2 border border-neutral-600 rounded text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRepeat}
                    className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowRepeatForm(true)}
                className="flex items-center text-neutral-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add repeat
              </button>
            )}
          </div>

          {/* Assignments Section */}
          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Assignees</h4>
            {selectedAssignees && selectedAssignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedAssignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center space-x-2 bg-neutral-700 rounded-full px-3 py-1">
                    <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full" />
                    <span className="text-white text-sm">{assignee.name}</span>
                    <button 
                      onClick={() => {
                        setSelectedAssignees(selectedAssignees.filter(a => a.id !== assignee.id));
                      }}
                      className="text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {showAssignForm ? (
              <div className="space-y-2 p-3 border border-neutral-600 rounded">
                <input
                  type="text"
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {mockUsers
                    .filter(user => user.name.toLowerCase().includes(assigneeSearch.toLowerCase()))
                    .map(user => {
                      const isSelected = selectedAssignees.some(a => a.id === user.id);
                      return (
                        <div 
                          key={user.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAssignees(selectedAssignees.filter(a => a.id !== user.id));
                            } else {
                              setSelectedAssignees([...selectedAssignees, user]);
                            }
                          }}
                          className={`flex items-center space-x-2 p-2 hover:bg-neutral-600 rounded cursor-pointer ${
                            isSelected ? 'bg-blue-900/30 border border-blue-600' : ''
                          }`}
                        >
                          <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                          <div className="flex-1">
                            <p className="text-white text-sm">{user.name}</p>
                            <p className="text-neutral-400 text-xs">{user.title}</p>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      );
                    })}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowAssignForm(false);
                      setAssigneeSearch('');
                    }}
                    className="flex-1 px-3 py-2 border border-neutral-600 rounded text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save assignees logic here
                      console.log('Saving assignees:', selectedAssignees);
                      setShowAssignForm(false);
                      setAssigneeSearch('');
                    }}
                    className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAssignForm(true)}
                className="flex items-center text-neutral-400 hover:text-white transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Assign to someone
              </button>
            )}
          </div>



          {/* Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-neutral-400">Comments</h4>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center text-neutral-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {todo.comments?.length || 0}
                </span>
              </button>
            </div>

            {showComments && (
              <div className="space-y-3">
                {/* Existing Comments */}
                {todo.comments && todo.comments.length > 0 && (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {todo.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 p-3 bg-neutral-800 rounded-lg">
                        <img 
                          src={comment.author.avatar} 
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white text-sm font-medium">{comment.author.name}</span>
                            <span className="text-neutral-400 text-xs">{getTimeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-neutral-300 text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        // Add comment logic here
                        console.log('Adding comment:', newComment);
                        setNewComment('');
                      }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      if (newComment.trim()) {
                        // Add comment logic here
                        console.log('Adding comment:', newComment);
                        setNewComment('');
                      }
                    }}
                    disabled={!newComment.trim()}
                    className="px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Notes</h4>
            <textarea
              value={todo.notes || ''}
              onChange={(e) => onUpdateNotes(todo.id, e.target.value)}
              placeholder="Add notes..."
              className="w-full h-24 bg-transparent border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-700 flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {todo.editedAt ? (
            <span>Edited {getTimeAgo(todo.editedAt)}</span>
          ) : (
            <span>Created {getTimeAgo(todo.createdAt || new Date())}</span>
          )}
        </div>
        <button
          onClick={handleDeleteClick}
          className="flex items-center text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete to-do
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Delete To-do</h3>
            <p className="text-neutral-400 mb-6">
              Are you sure you want to delete "{todo.description}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-neutral-600 rounded-lg text-white hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoDetails;