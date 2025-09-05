import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { ArrowLeft, Star, Plus, Trash2, X, Check, Clock, Bell, Repeat, MessageCircle, Send, FileText, MoreHorizontal, Smile, Edit3, Paperclip } from 'lucide-react';
import TodoStep from './TodoStep';
import TipTapEditor from '../shared/TipTapEditor';
import EmojiPicker from '../shared/EmojiPicker';
import useEscapeKey from '../../hooks/useEscapeKey';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  usePickerLayout,
  PickersLayoutRoot,
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { TextField, ThemeProvider, createTheme, Select, MenuItem, FormControl, InputLabel, Checkbox } from '@mui/material';
import dayjs from 'dayjs';

// Custom TimePicker Layout with SimpleBar
function CustomTimePickerLayout(props) {
  const { toolbar, tabs, content, actionBar, ownerState } = usePickerLayout(props);

  return (
    <PickersLayoutRoot className={pickersLayoutClasses.root} ownerState={ownerState}>
      {toolbar}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
        sx={{
          '& .MuiMultiSectionDigitalClock-root, & .MuiDigitalClock-root': {
            minHeight: 280,
          },
          '& .MuiList-root': {
            minHeight: 280,
          },
        }}
      >
        {tabs}
        {/* Container com altura explícita para evitar colapso de layout */}
        <div style={{ height: 320, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <SimpleBar style={{ height: '100%', width: '100%' }} autoHide={false}>
            {/* Wrapper interno para garantir minHeight para cálculos do MUI */}
            <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
              {content}
            </div>
          </SimpleBar>
        </div>
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
}

// Material UI dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#171717',
      paper: '#262626',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#262626',
            '& fieldset': {
              borderColor: '#525252',
            },
            '&:hover fieldset': {
              borderColor: '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#a3a3a3',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#525252',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#a3a3a3',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#a3a3a3', // neutral-400
          '&:hover': {
            color: '#ffffff',
            backgroundColor: 'transparent',
          },
          '&.Mui-checked': {
            color: '#ffffff',
          },
        },
      },
    },
    // Enhanced styling for MUI Timer components
    MuiPickersPopper: {
      styleOverrides: {
        root: {
          zIndex: 9999,
          '& .MuiPaper-root': {
            backgroundColor: '#262626',
            border: '1px solid #525252',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          },
          // SimpleBar styling for MUI Timer components
          '& .simplebar-scrollbar': {
            '&:before': {
              backgroundColor: '#525252',
              borderRadius: '4px',
              opacity: '0.8',
            },
            '&.simplebar-visible:before': {
              opacity: '1',
            },
          },
          '& .simplebar-track': {
            backgroundColor: 'transparent',
            '&.simplebar-vertical': {
              width: '15px',
              right: '2px',
            },
          },
          '& .simplebar-content-wrapper': {
            scrollBehavior: 'smooth',
          },
          '& .simplebar-content': {
            '& .MuiMultiSectionDigitalClock-root': {
              color: '#ffffff',
              '& .MuiList-root': {
                color: '#ffffff',
              },
              '& .MuiMenuItem-root': {
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#404040',
                },
                '&.Mui-selected': {
                  backgroundColor: '#ffffff',
                  color: '#000000',
                },
              },
            },
            '& .MuiDigitalClock-root': {
              color: '#ffffff',
              '& .MuiList-root': {
                color: '#ffffff',
              },
              '& .MuiMenuItem-root': {
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#404040',
                },
                '&.Mui-selected': {
                  backgroundColor: '#ffffff',
                  color: '#000000',
                },
              },
            },
          }
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '& .MuiIconButton-root': {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#404040',
            },
          },
          // SimpleBar styling for Calendar Header
          '& .simplebar-scrollbar': {
            '&:before': {
              backgroundColor: '#525252',
              borderRadius: '4px',
              opacity: '0.8',
            },
            '&.simplebar-visible:before': {
              opacity: '1',
            },
          },
          '& .simplebar-track': {
            backgroundColor: 'transparent',
            '&.simplebar-vertical': {
              width: '15px',
              right: '2px',
            },
          },
          '& .simplebar-content-wrapper': {
            scrollBehavior: 'smooth',
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#404040',
          },
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#e5e5e5',
            },
          },
          // SimpleBar styling for Calendar Days
          '& .simplebar-scrollbar': {
            '&:before': {
              backgroundColor: '#525252',
              borderRadius: '4px',
              opacity: '0.8',
            },
            '&.simplebar-visible:before': {
              opacity: '1',
            },
          },
          '& .simplebar-track': {
            backgroundColor: 'transparent',
            '&.simplebar-vertical': {
              width: '15px',
              right: '2px',
            },
          },
          '& .simplebar-content-wrapper': {
            scrollBehavior: 'smooth',
          },
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
          // SimpleBar styling for Clock component
          '& .simplebar-scrollbar': {
            '&:before': {
              backgroundColor: '#525252',
              borderRadius: '4px',
              opacity: '0.8',
            },
            '&.simplebar-visible:before': {
              opacity: '1',
            },
          },
          '& .simplebar-track': {
            backgroundColor: 'transparent',
            '&.simplebar-vertical': {
              width: '15px',
              right: '2px',
            },
          },
          '& .simplebar-content-wrapper': {
            scrollBehavior: 'smooth',
          },
        },
        clock: {
          backgroundColor: '#171717',
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
        thumb: {
          backgroundColor: '#ffffff',
          border: '2px solid #ffffff',
        },
      },
    },
    // Specific TimePicker component styling
    MuiTimePicker: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: '#262626',
            border: '1px solid #525252',
          },
        },
      },
    },
    // TimePicker Clock and List styling
    MuiMultiSectionDigitalClock: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
        },
      },
    },
    // Digital Clock component styling
    MuiDigitalClock: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
        },
        list: {
          backgroundColor: '#262626',
        },
      },
    },
  },
});

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
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onAddEmojiReaction
}) => {
  // Handle Escape key to close the component view
  useEscapeKey(onBack);

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
  const scrollRef = useRef(null);
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
  
  // Comment interaction states
  const [hoveredComment, setHoveredComment] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showCommentMenu, setShowCommentMenu] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [emojiPosition, setEmojiPosition] = useState({ top: 0, left: 0 });
  
  // Local todo state for proper re-rendering
  const [localTodo, setLocalTodo] = useState(todo);

  // Sync local todo state when prop changes
  useEffect(() => {
    setLocalTodo(todo);
  }, [todo]);

  // Save description when it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (description !== localTodo?.description && description.trim() !== '') {
        onUpdateTodoDescription(localTodo.id, description);
      }
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [description, localTodo?.description, localTodo.id, onUpdateTodoDescription]);

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
      setEditedTitle(localTodo.description || '');
    }
  }, [isEditingTitle, localTodo.description]);

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

  // Handle click outside to close comment menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside comment menu
      if (showCommentMenu) {
        const isClickOnMenuButton = event.target.closest('button[data-comment-menu]');
        const isClickOnMenuDropdown = event.target.closest('div[style*="position: fixed"][style*="z-index: 9999"]') && 
                                     event.target.closest('div').textContent.includes('Edit');
        
        if (!isClickOnMenuButton && !isClickOnMenuDropdown) {
          setShowCommentMenu(null);
          setMenuPosition(null);
        }
      }
      
      // Check if click is outside emoji picker
      if (showEmojiPicker) {
        const isClickOnEmojiButton = event.target.closest('button[data-emoji-picker]');
        const isClickOnEmojiDropdown = event.target.closest('div[style*="position: fixed"][style*="z-index: 9999"]') && 
                                      event.target.closest('div').textContent.match(/[👍❤️😂😮😢😡👏🎉]/);
        
        if (!isClickOnEmojiButton && !isClickOnEmojiDropdown) {
          setShowEmojiPicker(null);
          setEmojiPosition(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCommentMenu, showEmojiPicker]);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== localTodo.description) {
      onUpdateTodoDescription(localTodo.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditedTitle(localTodo.description || '');
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (editedDescription.trim() !== description) {
      setDescription(editedDescription.trim());
      onUpdateTodoDescription(localTodo.id, editedDescription.trim());
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
        onUpdateNotes(localTodo.id, editedTodoDescription.trim());
      }
    }
    setIsEditingTodoDescription(false);
  };

  const handleCancelEditTodoDescription = () => {
    setEditedTodoDescription(todoDescription || '');
    setIsEditingTodoDescription(false);
  };

  const handleStartEditingTitle = () => {
    setEditedTitle(localTodo.description || '');
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
    onDeleteTodo(localTodo.id);
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
      onAddStep(localTodo.id, newStepText.trim());
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
      // Smooth scroll to top after adding reminder
      if (scrollRef.current) {
        const scrollableElement = scrollRef.current.getScrollElement();
        scrollableElement.scrollTop = 0;
      }
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
      // Smooth scroll to top after adding duration
      if (scrollRef.current) {
        const scrollableElement = scrollRef.current.getScrollElement();
        scrollableElement.scrollTop = 0;
      }
    }
  };

  const handleRemoveDuration = () => {
    setDuration(null);
  };

  const handleAddRepeat = () => {
    if (repeatOption) {
      setRepeat(repeatOption);
      setShowRepeatForm(false);
      // Smooth scroll to top after adding repeat
      if (scrollRef.current) {
        const scrollableElement = scrollRef.current.getScrollElement();
        scrollableElement.scrollTop = 0;
      }
    }
  };

  const handleRemoveRepeat = () => {
    setRepeat(null);
  };

  const completedSteps = localTodo.steps?.filter(step => step.completed).length || 0;
  const totalSteps = localTodo.steps?.length || 0;

  const handleAddComment = () => {
    // Check if there's actual content in the plain text input
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment, // Store the plain text content
        author: {
          name: 'You',
          avatar: '/api/placeholder/32/32'
        },
        createdAt: new Date()
      };
      
      onAddComment(localTodo.id, comment);
      setNewComment('');
    }
  };

  const handleEditComment = (commentId) => {
    const comment = localTodo.comments?.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditedCommentText(comment.text);
      setShowCommentMenu(null);
    }
  };

  const handleSaveComment = (commentId) => {
    if (editedCommentText.trim()) {
      const updatedText = editedCommentText.trim();
      
      setLocalTodo(prevTodo => {
        const updatedTodo = { ...prevTodo };
        const updatedComments = updatedTodo.comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, text: updatedText };
          }
          return comment;
        });
        
        return { ...updatedTodo, comments: updatedComments };
      });
      
      // Call parent callback to persist changes
      if (onUpdateComment) {
        onUpdateComment(localTodo.id, commentId, updatedText);
      }
      
      setEditingComment(null);
      setEditedCommentText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    setShowDeleteConfirm(commentId);
    setShowCommentMenu(null);
  };

  const confirmDeleteComment = (commentId) => {
    setLocalTodo(prevTodo => {
      const updatedTodo = { ...prevTodo };
      const updatedComments = updatedTodo.comments.filter(comment => comment.id !== commentId);
      
      return { ...updatedTodo, comments: updatedComments };
    });
    
    // Call parent callback to persist changes
    if (onDeleteComment) {
      onDeleteComment(localTodo.id, commentId);
    }
    
    setShowDeleteConfirm(null);
  };

  const handleEmojiReaction = (commentId, emoji) => {
    let updatedReactions;
    
    setLocalTodo(prevTodo => {
      const updatedTodo = { ...prevTodo };
      const updatedComments = updatedTodo.comments.map(comment => {
        if (comment.id === commentId) {
          const reactions = comment.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            // Increment count if reaction already exists
            existingReaction.count += 1;
          } else {
            // Add new reaction
            reactions.push({ emoji, count: 1 });
          }
          
          updatedReactions = reactions;
          return { ...comment, reactions };
        }
        return comment;
      });
      
      return { ...updatedTodo, comments: updatedComments };
    });
    
    // Call parent callback to persist changes
    if (onAddEmojiReaction) {
      onAddEmojiReaction(localTodo.id, commentId, emoji);
    }
    
    setShowEmojiPicker(null);
    setEmojiPosition(null);
  };

  return (
    <>
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            {localTodo.editedAt ? (
              <span>Edited {getTimeAgo(localTodo.editedAt)}</span>
            ) : (
              <span>Created {getTimeAgo(localTodo.createdAt || new Date())}</span>
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
      <SimpleBar 
        ref={scrollRef}
        className="flex-1 p-4 space-y-6" 
        style={{ height: 'calc(100vh - 120px)' }}
        options={{
          autoHide: false,
          scrollbarMinSize: 20,
          scrollbarMaxSize: 20,
          clickOnTrack: true,
          forceVisible: 'y'
        }}
        scrollableNodeProps={{
          style: {
            scrollBehavior: 'smooth'
          }
        }}
      >
        {/* Todo Title and Description */}
        <div className="space-y-3">
          {/* Title - Truncated to one line */}
          <div className="flex items-center space-x-3">
            <ThemeProvider theme={darkTheme}>
              <Checkbox
                checked={localTodo.completed}
                onChange={() => onToggleComplete(localTodo.id)}
                size="small"
                sx={{
                  padding: 0,
                  width: 16,
                  height: 16,
                  '& .MuiSvgIcon-root': {
                    fontSize: 16,
                  },
                }}
              />
            </ThemeProvider>
            
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
                    localTodo.completed ? 'line-through text-neutral-500' : 'text-white'
                  }`}
                >
                  {cleanMentionText(localTodo.description) || 'Untitled Todo'}
                </h1>
              )}
            </div>
            
            {!isEditingTitle && (
              <ThemeProvider theme={darkTheme}>
                <Checkbox
                  checked={localTodo.starred}
                  onChange={() => onToggleStar(localTodo.id)}
                  icon={<Star className="w-5 h-5" />}
                  checkedIcon={<Star className="w-5 h-5 fill-white" />}
                  sx={{
                    padding: '4px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem'
                    }
                  }}
                />
              </ThemeProvider>
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
        {localTodo.sourceNudge && (
          <div className="space-y-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
            <h3 className="text-lg font-medium text-white">Context from Nudge</h3>
            
            {/* Sender Information */}
            <div className="flex items-center space-x-3">
              <img 
                src={localTodo.sourceNudge.sender.avatar} 
                alt={localTodo.sourceNudge.sender.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{localTodo.sourceNudge.sender.name}</p>
                <p className="text-neutral-400 text-sm">{localTodo.sourceNudge.sender.title}</p>
              </div>
            </div>

            {/* Original Message */}
            <div className="p-3 bg-neutral-700 rounded-lg">
              <p className="text-neutral-300">{localTodo.sourceNudge.message}</p>
            </div>

            {/* Attachments */}
            {localTodo.sourceNudge.attachments && localTodo.sourceNudge.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {localTodo.sourceNudge.attachments.map((attachment, index) => (
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
            {localTodo.sourceNudge.links && localTodo.sourceNudge.links.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Links</h4>
                <div className="space-y-2">
                  {localTodo.sourceNudge.links.map((link, index) => (
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
            {localTodo.steps && localTodo.steps.length > 0 ? (
              localTodo.steps.map((step) => (
                <TodoStep
                  key={step.id}
                  step={step}
                  onToggleComplete={() => onToggleStepComplete(localTodo.id, step.id)}
                  onDelete={() => onDeleteStep(localTodo.id, step.id)}
                  onUpdateDescription={(newDescription) => onUpdateStepDescription(localTodo.id, step.id, newDescription)}
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
          <h3 className="text-lg font-medium text-white">Quick actions</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Reminder */}
            <button
              onClick={() => {
                setShowReminderForm(!showReminderForm);
                if (!showReminderForm) {
                  setShowDurationForm(false);
                  setShowRepeatForm(false);
                  // Smooth scroll to form area
                  setTimeout(() => {
                    if (scrollRef.current) {
                      const scrollableElement = scrollRef.current.getScrollElement();
                      const formElement = scrollableElement.querySelector('.reminder-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }
                  }, 100);
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
                  // Smooth scroll to form area
                  setTimeout(() => {
                    if (scrollRef.current) {
                      const scrollableElement = scrollRef.current.getScrollElement();
                      const formElement = scrollableElement.querySelector('.duration-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }
                  }, 100);
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
                  // Smooth scroll to form area
                  setTimeout(() => {
                    if (scrollRef.current) {
                      const scrollableElement = scrollRef.current.getScrollElement();
                      const formElement = scrollableElement.querySelector('.repeat-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }
                  }, 100);
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
            <div className="reminder-form p-4 bg-neutral-800 border border-neutral-600 rounded-lg space-y-3">
              <h4 className="text-white font-medium">Set reminder</h4>
              <div className="grid grid-cols-1 gap-3">
                <DatePicker
                  label="Reminder Date"
                  value={newReminderDate ? dayjs(newReminderDate) : null}
                  onChange={(newValue) => {
                    setNewReminderDate(newValue ? newValue.format('YYYY-MM-DD') : '');
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ width: '100%' }}
                />
                <TimePicker
                  label="Reminder Time"
                  value={newReminderTime ? dayjs(`2000-01-01T${newReminderTime}`) : null}
                  onChange={(newValue) => {
                    setNewReminderTime(newValue ? newValue.format('HH:mm') : '');
                  }}
                  desktopModeMediaQuery="@media (min-width:0px)"
                  views={["hours", "minutes"]}
                  ampm
                  timeSteps={{ minutes: 5 }}
                  sx={{ width: '100%' }}
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
            <div className="duration-form p-4 bg-neutral-800 border border-neutral-600 rounded-lg space-y-3">
              <h4 className="text-white font-medium">Set duration</h4>
              <div className="grid grid-cols-2 gap-3">
                <TimePicker
                  label="Start Time"
                  value={durationStart ? dayjs(`2000-01-01T${durationStart}`) : null}
                  onChange={(newValue) => {
                    setDurationStart(newValue ? newValue.format('HH:mm') : '');
                  }}
                  desktopModeMediaQuery="@media (min-width:0px)"
                  views={["hours", "minutes"]}
                  ampm
                  timeSteps={{ minutes: 5 }}
                  sx={{ width: '100%' }}
                />
                <TimePicker
                  label="End Time"
                  value={durationEnd ? dayjs(`2000-01-01T${durationEnd}`) : null}
                  onChange={(newValue) => {
                    setDurationEnd(newValue ? newValue.format('HH:mm') : '');
                  }}
                  desktopModeMediaQuery="@media (min-width:0px)"
                  views={["hours", "minutes"]}
                  ampm
                  timeSteps={{ minutes: 5 }}
                  sx={{ width: '100%' }}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddDuration}
                  disabled={!durationStart || !durationEnd}
                  className="flex-1 px-3 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set duration
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
            <div className="repeat-form p-4 bg-neutral-800 border border-neutral-600 rounded-lg space-y-3">
              <h4 className="text-white font-medium">Set repeat</h4>
              <FormControl fullWidth>
                <InputLabel id="repeat-select-label">Repeat Frequency</InputLabel>
                <Select
                  labelId="repeat-select-label"
                  value={repeatOption}
                  label="Repeat Frequency"
                  onChange={(e) => setRepeatOption(e.target.value)}
                  sx={{
                     backgroundColor: '#262626',
                     color: '#ffffff',
                     '& .MuiSelect-icon': {
                       color: '#ffffff',
                     },
                     '& .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#525252',
                     },
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#ffffff',
                     },
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#ffffff',
                     },
                   }}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="weekdays">Weekdays (Mon-Fri)</MenuItem>
                  <MenuItem value="weekends">Weekends (Sat-Sun)</MenuItem>
                </Select>
              </FormControl>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddRepeat}
                  className="flex-1 px-3 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
                >
                  Set repeat
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
              <h4 className="text-white font-medium">Active reminders</h4>
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
              {localTodo.comments?.length || 0}
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-3">
              {/* Existing Comments */}
              {localTodo.comments && localTodo.comments.length > 0 && (
                <SimpleBar 
                  className="space-y-3 max-h-48"
                  options={{
                    autoHide: false,
                    scrollbarMinSize: 15,
                    scrollbarMaxSize: 15,
                    clickOnTrack: true,
                    forceVisible: 'y'
                  }}
                  scrollableNodeProps={{
                    style: {
                      scrollBehavior: 'smooth'
                    }
                  }}
                >
                  {localTodo.comments.map((comment) => {
                    const isOwnComment = comment.author.name === 'You';
                    const isHovered = hoveredComment === comment.id;
                    const isEditing = editingComment === comment.id;
                    
                    return (
                      <div 
                        key={comment.id} 
                        className="flex space-x-3 relative group"
                        onMouseEnter={() => setHoveredComment(comment.id)}
                        onMouseLeave={() => setHoveredComment(null)}
                      >
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <img 
                            src={comment.author.avatar} 
                            alt={comment.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                        </div>
                        <div className="flex-1 relative">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white text-sm font-medium">{comment.author.name}</span>
                            <span className="text-neutral-400 text-xs">{getTimeAgo(comment.createdAt)}</span>
                          </div>
                          
                          {isEditing ? (
                            <div className="space-y-2">
                              <TipTapEditor
                                value={editedCommentText}
                                onChange={setEditedCommentText}
                                placeholder="Edit comment..."
                                showToolbar={false}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSaveComment(comment.id)}
                                  className="px-3 py-1 bg-white text-black rounded text-xs hover:bg-neutral-200 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 border border-neutral-600 text-white rounded text-xs hover:bg-neutral-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="text-neutral-300 text-sm"
                              dangerouslySetInnerHTML={{ __html: comment.text }}
                            />
                          )}
                          
                          {/* Hover Actions */}
                          {isHovered && !isEditing && (
                            <div className="absolute top-0 right-0">
                              {isOwnComment ? (
                                <div className="relative">
                                  <button
                                    data-comment-menu
                                    onClick={(e) => {
                                      if (showCommentMenu === comment.id) {
                                        setShowCommentMenu(null);
                                      } else {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setMenuPosition({
                                          top: rect.bottom + window.scrollY + 4,
                                          left: rect.right + window.scrollX - 128 // 128px is min-w-32
                                        });
                                        setShowCommentMenu(comment.id);
                                      }
                                    }}
                                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                  

                                </div>
                              ) : (
                                <div className="relative">
                                  <button
                                    data-emoji-picker
                                    onClick={(e) => {
                                      if (showEmojiPicker === comment.id) {
                                        setShowEmojiPicker(null);
                                      } else {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setEmojiPosition({
                                          top: rect.bottom + window.scrollY + 4,
                                          left: rect.right + window.scrollX - 150 // Approximate emoji picker width
                                        });
                                        setShowEmojiPicker(comment.id);
                                      }
                                    }}
                                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                  >
                                    <Smile className="w-4 h-4" />
                                  </button>
                                  

                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Emoji Reactions Display */}
                          {comment.reactions && comment.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {comment.reactions.map((reaction, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-1 px-2 py-1 bg-neutral-800 rounded-full text-xs"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-neutral-400">{reaction.count}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Delete Confirmation Modal */}
                        {showDeleteConfirm === comment.id && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 max-w-sm mx-4">
                              <h3 className="text-white text-lg font-medium mb-4">Delete Comment</h3>
                              <p className="text-neutral-300 text-sm mb-6">
                                Are you sure you want to delete this comment? This action cannot be undone.
                              </p>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => confirmDeleteComment(comment.id)}
                                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="flex-1 px-4 py-2 border border-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </SimpleBar>
              )}

              {/* Add Comment */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add a comment..."
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2.5 pr-20 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  {/* Attachment icon positioned to the left of emoji picker */}
                  <button className="absolute right-10 top-1/2 transform -translate-y-1/2 p-2 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-700">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  {/* Emoji Picker positioned in bottom-right corner of input */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <EmojiPicker 
                      onEmojiSelect={(emoji, content) => setNewComment(prev => prev + emoji)}
                      position="bottom-right"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-700 disabled:text-neutral-400 text-white border border-neutral-600 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center"
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
              Are you sure you want to delete "{cleanMentionText(localTodo.description)}"? This action cannot be undone.
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
      </LocalizationProvider>
    </ThemeProvider>
    
    {/* Comment Menu Portal */}
    {showCommentMenu && menuPosition && createPortal(
      <div 
        className="fixed bg-neutral-800 border border-neutral-600 rounded-md shadow-lg p-2 min-w-[120px]"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
          zIndex: 9999
        }}
      >
        <button
          onClick={() => {
            handleEditComment(showCommentMenu);
            setShowCommentMenu(null);
            setMenuPosition(null);
          }}
          className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 rounded flex items-center gap-2 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => {
            handleDeleteComment(showCommentMenu);
            setShowCommentMenu(null);
            setMenuPosition(null);
          }}
          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-700 rounded flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>,
      document.body
    )}
    
    {/* Emoji Picker Portal */}
    {showEmojiPicker && emojiPosition && createPortal(
      <div 
        className="fixed bg-neutral-800 border border-neutral-600 rounded-md shadow-lg p-2"
        style={{
          top: `${emojiPosition.top}px`,
          left: `${emojiPosition.left}px`,
          zIndex: 9999
        }}
      >
        <div className="grid grid-cols-4 gap-1">
          {['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🎉'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                handleEmojiReaction(showEmojiPicker, emoji);
                setShowEmojiPicker(null);
                setEmojiPosition(null);
              }}
              className="p-2 hover:bg-neutral-700 rounded text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default TodoDetails;