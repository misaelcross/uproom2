import React, { useState, useRef, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { ArrowLeft, Star, Plus, Trash2, X, Check, Clock, Bell, Repeat, MessageCircle, Send, FileText } from 'lucide-react';
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
  onUpdateStepDescription,
  onAddComment 
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTodoDescription, setIsEditingTodoDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
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
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [description, setDescription] = useState(todo?.description || '');
  const [showMentionForm, setShowMentionForm] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showDescriptionField, setShowDescriptionField] = useState(!!todo?.description);
  const [todoDescription, setTodoDescription] = useState(todo?.notes || '');
  const [editedTodoDescription, setEditedTodoDescription] = useState('');
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionEditRef = useRef(null);

  // Save description when it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (description !== todo?.description && description.trim() !== '') {
        onUpdateTodoDescription(todo.id, description);
      }
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [description, todo?.description, todo.id, onUpdateTodoDescription]);

  const mockUsers = [
    { id: 1, name: 'John Doe', title: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
    { id: 2, name: 'Jane Smith', title: 'Backend Developer', avatar: '/api/placeholder/32/32' },
    { id: 3, name: 'Mike Johnson', title: 'Designer', avatar: '/api/placeholder/32/32' },
    { id: 4, name: 'Sarah Wilson', title: 'Product Manager', avatar: '/api/placeholder/32/32' }
  ];

  // Function to clean HTML mentions and return plain text
  const cleanMentionText = (text) => {
    if (!text) return '';
    // Remove HTML tags from mentions like <span class="mention bg-white text-black px-1 py-0.5 rounded text-sm">@John Doe</span>
    return text.replace(/<[^>]*>/g, '');
  };

  useEffect(() => {
    if (isEditingTitle) {
      setEditedTitle(todo.description || '');
    }
  }, [isEditingTitle, todo.description]);

  useEffect(() => {
    if (isEditingDescription) {
      setEditedDescription(description || '');
    }
  }, [isEditingDescription, description]);

  // Sync duration state when todo changes
  useEffect(() => {
    setDuration(todo?.duration || null);
    setReminders(todo?.reminders || []);
    setRepeat(todo?.repeat || null);
    setTodoDescription(todo?.notes || '');
    setDescription(todo?.description || '');
  }, [todo]);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== todo.description) {
      onUpdateTodoDescription(todo.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditedTitle(todo.description || '');
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (editedDescription.trim() !== description) {
      setDescription(editedDescription.trim());
      onUpdateTodoDescription(todo.id, editedDescription.trim());
    }
    setIsEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setEditedDescription(description || '');
    setIsEditingDescription(false);
  };

  const handleStartEditingTodoDescription = () => {
    setEditedTodoDescription(todoDescription || '');
    setIsEditingTodoDescription(true);
  };

  const handleSaveTodoDescription = () => {
    if (editedTodoDescription.trim() !== todoDescription) {
      setTodoDescription(editedTodoDescription.trim());
      if (onUpdateNotes) {
        onUpdateNotes(todo.id, editedTodoDescription.trim());
      }
    }
    setIsEditingTodoDescription(false);
  };

  const handleCancelEditTodoDescription = () => {
    setEditedTodoDescription(todoDescription || '');
    setIsEditingTodoDescription(false);
  };

  const handleStartEditingTitle = () => {
    setEditedTitle(todo.description || '');
    setIsEditingTitle(true);
  };

  const handleStartEditingDescription = () => {
    setEditedDescription(description || '');
    setIsEditingDescription(true);
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleAddStep = () => {
    if (newStepText.trim()) {
      onAddStep(todo.id, newStepText.trim());
      setNewStepText('');
    }
  };

  const handleAddReminder = () => {
    if (newReminderDate && newReminderTime) {
      const newReminder = {
        id: Date.now(),
        date: newReminderDate,
        time: newReminderTime,
        datetime: new Date(`${newReminderDate}T${newReminderTime}`)
      };
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

  const completedSteps = todo.steps?.filter(step => step.completed).length || 0;
  const totalSteps = todo.steps?.length || 0;

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment.trim(),
        author: {
          name: 'You',
          avatar: '/api/placeholder/32/32'
        },
        createdAt: new Date()
      };
      
      onAddComment(todo.id, comment);
      setNewComment('');
    }
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
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-neutral-400">
            {todo.editedAt ? (
              <span>Edited {getTimeAgo(todo.editedAt)}</span>
            ) : (
              <span>Created {getTimeAgo(todo.createdAt || new Date())}</span>
            )}
          </div>
          <button
            onClick={handleDeleteClick}
            className="text-neutral-400 hover:text-neutral-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <SimpleBar className="flex-1 p-4 space-y-6" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Todo Title and Description */}
        <div className="space-y-3">
          {/* Title - Truncated to one line */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                todo.completed
                  ? 'bg-white border-white'
                  : 'border-neutral-400 hover:border-white'
              }`}
            >
              {todo.completed && (
                <Check className="w-2.5 h-2.5 text-black" />
              )}
            </button>
            
            <div className="flex-1 flex items-start space-x-2">
              {isEditingTitle ? (
                <div className="flex-1 space-y-2">
                  <textarea
                    ref={titleRef}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSaveTitle();
                      } else if (e.key === 'Escape') {
                        handleCancelEditTitle();
                      }
                    }}
                    className="w-full bg-transparent text-white text-lg font-medium border border-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                    style={{ minHeight: '40px' }}
                    autoFocus
                    rows={1}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveTitle}
                      className="px-3 py-1 bg-white text-black rounded text-sm hover:bg-neutral-200 transition-colors"
                   >
                     Save
                   </button>
                   <button
                     onClick={handleCancelEditTitle}
                     className="px-3 py-1 border border-neutral-600 text-white rounded text-sm hover:bg-neutral-700 transition-colors"
                   >
                     Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <h1
                  onClick={handleStartEditingTitle}
                  className={`flex-1 text-lg font-medium cursor-pointer hover:text-neutral-300 transition-colors whitespace-pre-wrap break-words ${
                    todo.completed ? 'line-through text-neutral-500' : 'text-white'
                  }`}
                >
                  {cleanMentionText(todo.description) || 'Untitled Todo'}
                </h1>
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

          {/* Description Field */}
          <div className="mt-4">
            {isEditingTodoDescription ? (
              <div className="space-y-2">
                <textarea
                  value={editedTodoDescription}
                  onChange={(e) => setEditedTodoDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSaveTodoDescription();
                    } else if (e.key === 'Escape') {
                      handleCancelEditTodoDescription();
                    }
                  }}
                  placeholder="Add a description..."
                  className="w-full bg-neutral-800 text-white rounded border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none placeholder-neutral-400"
                  rows={3}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveTodoDescription}
                    className="px-3 py-1 bg-white text-black rounded text-sm hover:bg-neutral-200 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditTodoDescription}
                    className="px-3 py-1 border border-neutral-600 text-white rounded text-sm hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {todoDescription ? (
                  <div
                    onClick={handleStartEditingTodoDescription}
                    className="cursor-pointer hover:text-neutral-200 transition-colors"
                  >
                    <p className="text-neutral-300 whitespace-pre-wrap">{todoDescription}</p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartEditingTodoDescription}
                    className="flex items-center space-x-2 text-neutral-400 hover:text-neutral-300 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Description</span>
                  </button>
                )}
              </div>
            )}
          </div>


        </div>

        {/* Context from Nudge */}
        {todo.sourceNudge && (
          <div className="space-y-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
            <h3 className="text-lg font-medium text-white">Context from Nudge</h3>
            
            {/* Sender Information */}
            <div className="flex items-center space-x-3">
              <img 
                src={todo.sourceNudge.sender.avatar} 
                alt={todo.sourceNudge.sender.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{todo.sourceNudge.sender.name}</p>
                <p className="text-neutral-400 text-sm">{todo.sourceNudge.sender.title}</p>
              </div>
            </div>

            {/* Original Message */}
            <div className="p-3 bg-neutral-700 rounded-lg">
              <p className="text-neutral-300">{todo.sourceNudge.message}</p>
            </div>

            {/* Attachments */}
            {todo.sourceNudge.attachments && todo.sourceNudge.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {todo.sourceNudge.attachments.map((attachment, index) => (
                    <div key={index} className="p-2 bg-neutral-700 rounded flex items-center space-x-2">
                      <div className="w-8 h-8 bg-neutral-600 rounded flex items-center justify-center">
                        <span className="text-xs text-neutral-400">{attachment.type.toUpperCase()}</span>
                      </div>
                      <span className="text-neutral-300 text-sm">{attachment.name}</span>
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
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-300 text-sm">
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
        <div className="space-y-2 mt-4">
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
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-2">
            {todo.steps && todo.steps.length > 0 ? (
              todo.steps.map((step) => (
                <TodoStep
                  key={step.id}
                  step={step}
                  onToggleComplete={() => onToggleStepComplete(todo.id, step.id)}
                  onDelete={() => onDeleteStep(todo.id, step.id)}
                  onUpdateDescription={(newDescription) => onUpdateStepDescription(todo.id, step.id, newDescription)}
                />
              ))
            ) : (
              <p className="text-neutral-400 text-sm italic">No steps added yet</p>
            )}
          </div>

          {/* Add Step */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddStep();
                }
              }}
              placeholder="Add a step..."
              className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-neutral-400 min-w-0"
            />
            <button
              onClick={handleAddStep}
              disabled={!newStepText.trim()}
              className="flex px-3 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 pt-6">
          <h3 className="text-lg font-medium text-white">Quick Actions</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Reminder */}
            <button
              onClick={() => {
                setShowReminderForm(!showReminderForm);
                if (!showReminderForm) {
                  setShowDurationForm(false);
                  setShowRepeatForm(false);
                }
              }}
              className="flex flex-col items-center p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-600"
            >
              <Bell className="w-5 h-5 text-neutral-400 mb-1" />
              <span className="text-xs text-neutral-400">Reminder</span>
            </button>

            {/* Duration */}
            <button
              onClick={() => {
                setShowDurationForm(!showDurationForm);
                if (!showDurationForm) {
                  setShowReminderForm(false);
                  setShowRepeatForm(false);
                }
              }}
              className="flex flex-col items-center p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-600"
            >
              <Clock className="w-5 h-5 text-neutral-400 mb-1" />
              <span className="text-xs text-neutral-400">Duration</span>
            </button>

            {/* Repeat */}
            <button
              onClick={() => {
                setShowRepeatForm(!showRepeatForm);
                if (!showRepeatForm) {
                  setShowReminderForm(false);
                  setShowDurationForm(false);
                }
              }}
              className="flex flex-col items-center p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-600"
            >
              <Repeat className="w-5 h-5 text-neutral-400 mb-1" />
              <span className="text-xs text-neutral-400">Repeat</span>
            </button>
          </div>

          {/* Reminder Form */}
          {showReminderForm && (
            <div className="p-4 bg-neutral-800 border border-neutral-600 rounded-lg space-y-3">
              <h4 className="text-white font-medium">Set Reminder</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                  className="px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  className="px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddReminder}
                  disabled={!newReminderDate || !newReminderTime}
                  className="flex-1 px-3 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Reminder
                </button>
                <button
                  onClick={() => setShowReminderForm(false)}
                  className="px-3 py-2 border border-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Duration Form */}
          {showDurationForm && (
            <div className="p-4 bg-neutral-800 border border-neutral-600 rounded-lg space-y-3">
              <h4 className="text-white font-medium">Set Duration</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={durationStart}
                  onChange={(e) => setDurationStart(e.target.value)}
                  placeholder="Start time"
                  className="px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="time"
                  value={durationEnd}
                  onChange={(e) => setDurationEnd(e.target.value)}
                  placeholder="End time"
                  className="px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddDuration}
                  disabled={!durationStart || !durationEnd}
                  className="flex-1 px-3 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Duration
                </button>
                <button
                  onClick={() => setShowDurationForm(false)}
                  className="px-3 py-2 border border-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Repeat Form */}
          {showRepeatForm && (
            <div className="p-4 bg-neutral-800 border border-neutral-600 rounded-lg space-y-3">
              <h4 className="text-white font-medium">Set Repeat</h4>
              <select
                value={repeatOption}
                onChange={(e) => setRepeatOption(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white"
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
                  onClick={handleAddRepeat}
                  className="flex-1 px-3 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
                >
                  Set Repeat
                </button>
                <button
                  onClick={() => setShowRepeatForm(false)}
                  className="px-3 py-2 border border-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Active Reminders */}
          {reminders.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Active Reminders</h4>
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-2 bg-neutral-800 rounded border border-neutral-600">
                  <span className="text-neutral-300 text-sm">
                    {reminder.date} at {reminder.time}
                  </span>
                  <button
                    onClick={() => handleRemoveReminder(reminder.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Active Duration */}
          {duration && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Duration</h4>
              <div className="flex items-center justify-between p-2 bg-neutral-800 rounded border border-neutral-600">
                <span className="text-neutral-300 text-sm">
                  {duration.start} - {duration.end}
                </span>
                <button
                  onClick={handleRemoveDuration}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Active Repeat */}
          {repeat && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Repeat</h4>
              <div className="flex items-center justify-between p-2 bg-neutral-800 rounded border border-neutral-600">
                <span className="text-neutral-300 text-sm capitalize">
                  {repeat}
                </span>
                <button
                  onClick={handleRemoveRepeat}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-lg font-medium text-white">Comments</span>
            <span className="text-sm text-neutral-400">
              {todo.comments?.length || 0}
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-3">
              {/* Existing Comments */}
              {todo.comments && todo.comments.length > 0 && (
                <SimpleBar className="space-y-3 max-h-48">
                  {todo.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <img 
                          src={comment.author.avatar} 
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white text-sm font-medium">{comment.author.name}</span>
                          <span className="text-neutral-400 text-xs">{getTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-neutral-300 text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </SimpleBar>
              )}

              {/* Add Comment */}
              <div className="flex items-stretch space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-neutral-400 min-w-0"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-3 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Transparent spacer div */}
              <div className="h-44 bg-transparent"></div>
            </div>
          </div>
        </div>
      </SimpleBar>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Delete To-do</h3>
            <p className="text-neutral-400 mb-6">
              Are you sure you want to delete "{cleanMentionText(todo.description)}"? This action cannot be undone.
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
                className="flex-1 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg transition-colors"
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