import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, BarChart3, Users, Eye, EyeOff, Copy, GripVertical } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

// Dark theme for MUI DateTimePicker to match TodoDetails styling
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
    MuiPickersPopper: {
      styleOverrides: {
        root: {
          zIndex: 9999,
          '& .MuiPaper-root': {
            backgroundColor: '#262626',
            border: '1px solid #525252',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          },
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
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
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
    MuiMultiSectionDigitalClock: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
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
      },
    },
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
    MuiDigitalClock: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
        },
        list: {
          backgroundColor: '#262626',
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
      },
    },
  },
});

const PollCreationSidebar = ({ onBack, onCreatePoll }) => {
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    type: 'poll', // 'poll' or 'survey'
    options: ['', ''],
    isAnonymous: false,
    allowMultipleChoices: false,
    deadline: '',
    targetAudience: 'team' // 'team', 'department', 'custom'
  });

  // Survey-specific state
  const [surveyQuestions, setSurveyQuestions] = useState([
    {
      id: Date.now(),
      title: '',
      type: 'multiple_choice', // 'multiple_choice', 'single_choice', 'short_answer', 'paragraph'
      options: [''],
      required: false
    }
  ]);

  const handleAddOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  // Survey question handlers
  const handleAddQuestion = () => {
    setSurveyQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        title: '',
        type: 'multiple_choice',
        options: [''],
        required: false
      }
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    if (surveyQuestions.length === 1) {
      // Reset to standard view if only one question
      setSurveyQuestions([{
        id: Date.now(),
        title: '',
        type: 'multiple_choice',
        options: [''],
        required: false
      }]);
    } else {
      setSurveyQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const handleDuplicateQuestion = (questionId) => {
    const questionToDuplicate = surveyQuestions.find(q => q.id === questionId);
    if (questionToDuplicate) {
      setSurveyQuestions(prev => [
        ...prev,
        {
          ...questionToDuplicate,
          id: Date.now(),
          title: questionToDuplicate.title + ' (Copy)'
        }
      ]);
    }
  };

  const handleQuestionChange = (questionId, field, value) => {
    setSurveyQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleQuestionOptionChange = (questionId, optionIndex, value) => {
    setSurveyQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) }
        : q
    ));
  };

  const handleAddQuestionOption = (questionId) => {
    setSurveyQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, ''] }
        : q
    ));
  };

  const handleRemoveQuestionOption = (questionId, optionIndex) => {
    setSurveyQuestions(prev => prev.map(q => 
      q.id === questionId && q.options.length > 1
        ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
        : q
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (pollData.type === 'poll') {
      // Validate poll form
      if (!pollData.title.trim()) {
        alert('Please enter a title');
        return;
      }
      
      const validOptions = pollData.options.filter(option => option.trim());
      if (validOptions.length < 2) {
        alert('Please provide at least 2 options');
        return;
      }

      const newPoll = {
        id: Date.now(),
        ...pollData,
        options: validOptions.map(option => ({
          text: option.trim(),
          votes: 0,
          voters: []
        })),
        createdAt: new Date().toISOString(),
        status: 'active',
        totalVotes: 0
      };

      onCreatePoll(newPoll);
    } else {
      // Validate survey form
      const validQuestions = surveyQuestions.filter(q => q.title.trim());
      if (validQuestions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      // Validate required questions have proper options for choice types
      for (const question of validQuestions) {
        if ((question.type === 'multiple_choice' || question.type === 'single_choice') && 
            question.options.filter(opt => opt.trim()).length < 2) {
          alert(`Question "${question.title}" needs at least 2 options`);
          return;
        }
      }

      const newSurvey = {
        id: Date.now(),
        title: pollData.title || 'Survey',
        description: pollData.description,
        type: 'survey',
        questions: validQuestions.map(q => ({
          ...q,
          options: q.options.filter(opt => opt.trim())
        })),
        isAnonymous: pollData.isAnonymous,
        deadline: pollData.deadline,
        targetAudience: pollData.targetAudience,
        createdAt: new Date().toISOString(),
        status: 'active',
        responses: []
      };

      onCreatePoll(newSurvey);
    }
    
    onBack();
    
    // Reset forms
    setPollData({
      title: '',
      description: '',
      type: 'poll',
      options: ['', ''],
      isAnonymous: false,
      allowMultipleChoices: false,
      deadline: '',
      targetAudience: 'team'
    });
    
    setSurveyQuestions([{
      id: Date.now(),
      title: '',
      type: 'multiple_choice',
      options: [''],
      required: false
    }]);
  };

  return (
    <div className="h-full flex flex-col border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-300">
            Create {pollData.type === 'poll' ? 'Poll' : 'Survey'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <SimpleBar className="flex-1">
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="flex items-center space-x-2 bg-neutral-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setPollData(prev => ({ ...prev, type: 'poll' }))}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  pollData.type === 'poll'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Poll</span>
              </button>
              <button
                type="button"
                onClick={() => setPollData(prev => ({ ...prev, type: 'survey' }))}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  pollData.type === 'survey'
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Survey</span>
              </button>
            </div>

            {pollData.type === 'poll' ? (
              <>
                {/* Title */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-400">Title *</label>
                  <input
                    type="text"
                    value={pollData.title}
                    onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's your question?"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-400">Description (optional)</label>
                  <textarea
                    value={pollData.description}
                    onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add more context..."
                    rows={3}
                    className="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-400">Options *</label>
                  <div className="space-y-2">
                    {pollData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        />
                        {pollData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="w-full flex items-center justify-center space-x-2 h-12 bg-transparent border-2 border-dashed border-neutral-600 hover:border-neutral-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    >
                      <Plus className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-400 text-sm">Add Option</span>
                    </button>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {pollData.isAnonymous ? (
                        <EyeOff className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-neutral-400" />
                      )}
                      <span className="text-sm text-neutral-300">Anonymous voting</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPollData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        pollData.isAnonymous ? 'bg-white' : 'bg-neutral-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-neutral-800 rounded-full transition-transform ${
                        pollData.isAnonymous ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
                    <span className="text-sm text-neutral-300">Multiple selections</span>
                    <button
                      type="button"
                      onClick={() => setPollData(prev => ({ ...prev, allowMultipleChoices: !prev.allowMultipleChoices }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        pollData.allowMultipleChoices ? 'bg-white' : 'bg-neutral-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-neutral-800 rounded-full transition-transform ${
                        pollData.allowMultipleChoices ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Survey Title */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-400">Survey Title (optional)</label>
                  <input
                    type="text"
                    value={pollData.title}
                    onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Survey title..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>

                {/* Survey Description */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-400">Description (optional)</label>
                  <textarea
                    value={pollData.description}
                    onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add survey description..."
                    rows={2}
                    className="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  />
                </div>

                {/* Survey Questions */}
                <div className="space-y-4">
                  {surveyQuestions.map((question, questionIndex) => (
                    <div key={question.id} className="bg-neutral-800 rounded-lg p-4 space-y-4">
                      {/* Question Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm font-medium text-neutral-400">Question {questionIndex + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateQuestion(question.id)}
                            className="p-1.5 text-neutral-400 hover:bg-neutral-700 rounded transition-colors"
                            title="Duplicate question"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(question.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Remove question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Title */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={question.title}
                          onChange={(e) => handleQuestionChange(question.id, 'title', e.target.value)}
                          placeholder="Enter your question..."
                          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        />
                      </div>

                      {/* Answer Type Dropdown */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-500">Answer Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            handleQuestionChange(question.id, 'type', newType);
                            // Reset options for non-choice types
                            if (newType === 'short_answer' || newType === 'paragraph') {
                              handleQuestionChange(question.id, 'options', []);
                            } else if (question.options.length === 0) {
                              handleQuestionChange(question.id, 'options', ['']);
                            }
                          }}
                          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="single_choice">Single Choice</option>
                          <option value="short_answer">Short Answer</option>
                          <option value="paragraph">Paragraph</option>
                        </select>
                      </div>

                      {/* Answer Options (for choice types) */}
                      {(question.type === 'multiple_choice' || question.type === 'single_choice') && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-neutral-500">Options</label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleQuestionOptionChange(question.id, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                />
                                {question.options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveQuestionOption(question.id, optionIndex)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleAddQuestionOption(question.id)}
                              className="w-full flex items-center justify-center space-x-2 h-10 bg-transparent border border-dashed border-neutral-600 hover:border-neutral-500 rounded-lg transition-colors text-sm"
                            >
                              <Plus className="w-3 h-3 text-neutral-400" />
                              <span className="text-neutral-400">Add Option</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Required Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-400">Required</span>
                        <button
                          type="button"
                          onClick={() => handleQuestionChange(question.id, 'required', !question.required)}
                          className={`w-10 h-5 rounded-full transition-colors ${
                            question.required ? 'bg-white' : 'bg-neutral-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-neutral-800 rounded-full transition-transform ${
                            question.required ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Question Button */}
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full flex items-center justify-center space-x-2 h-12 bg-transparent border-2 border-dashed border-neutral-600 hover:border-neutral-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  >
                    <Plus className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-400 text-sm">Add Question</span>
                  </button>
                </div>

                {/* Survey Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {pollData.isAnonymous ? (
                        <EyeOff className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-neutral-400" />
                      )}
                      <span className="text-sm text-neutral-300">Anonymous responses</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPollData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        pollData.isAnonymous ? 'bg-white' : 'bg-neutral-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-neutral-800 rounded-full transition-transform ${
                        pollData.isAnonymous ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Target Audience */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-400">Send to</label>
              <select
                value={pollData.targetAudience}
                onChange={(e) => setPollData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              >
                <option value="team">My Team</option>
                <option value="department">Department</option>
                <option value="custom">Custom Group</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-400">Deadline (optional)</label>
              <ThemeProvider theme={darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Select deadline"
                    value={pollData.deadline ? dayjs(pollData.deadline) : null}
                    onChange={(newValue) => {
                      setPollData(prev => ({ 
                        ...prev, 
                        deadline: newValue ? newValue.format('YYYY-MM-DDTHH:mm') : '' 
                      }));
                    }}
                    slotProps={{
                      textField: {
                        sx: {
                          width: '100%',
                          '& .MuiInputBase-root': {
                            backgroundColor: '#262626',
                            borderColor: '#525252',
                            color: '#ffffff',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#a3a3a3',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#ffffff',
                          },
                          '& .MuiOutlinedInput-root': {
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
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>

          </form>
        </div>
      </SimpleBar>

      {/* Footer with Action Buttons */}
      <div className="p-6 border-t border-neutral-700 space-y-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-neutral-500"
        >
          <span className="font-medium text-neutral-300">Cancel</span>
        </button>
        
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={pollData.type === 'poll' 
            ? (!pollData.title.trim() || pollData.options.filter(option => option.trim()).length < 2)
            : (surveyQuestions.filter(q => q.title.trim()).length === 0)
          }
          className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
            (pollData.type === 'poll' 
              ? (!pollData.title.trim() || pollData.options.filter(option => option.trim()).length < 2)
              : (surveyQuestions.filter(q => q.title.trim()).length === 0))
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600'
          }`}
        >
          <span className={`font-medium ${
            (pollData.type === 'poll' 
              ? (!pollData.title.trim() || pollData.options.filter(option => option.trim()).length < 2)
              : (surveyQuestions.filter(q => q.title.trim()).length === 0)) ? 'text-neutral-400' : 'text-white'
          }`}>
            Create {pollData.type === 'poll' ? 'Poll' : 'Survey'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PollCreationSidebar;