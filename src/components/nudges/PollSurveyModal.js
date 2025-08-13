import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart3, Users, Eye, EyeOff } from 'lucide-react';

const PollSurveyModal = ({ isOpen, onClose, onCreatePoll }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
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
    onClose();
    
    // Reset form
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md max-h-[90vh]" data-simplebar>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Create {pollData.type === 'poll' ? 'Poll' : 'Survey'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPollData(prev => ({ ...prev, type: 'poll' }))}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                pollData.type === 'poll'
                  ? 'border-white bg-white/10 text-white'
                  : 'border-neutral-600 text-neutral-400 hover:border-neutral-500'
              }`}
            >
              <BarChart3 className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Poll</div>
            </button>
            <button
              type="button"
              onClick={() => setPollData(prev => ({ ...prev, type: 'survey' }))}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                pollData.type === 'survey'
                  ? 'border-white bg-white/10 text-white'
                  : 'border-neutral-600 text-neutral-400 hover:border-neutral-500'
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Survey</div>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={pollData.title}
              onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's your question?"
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-white focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={pollData.description}
              onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more context..."
              rows={3}
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-white focus:outline-none resize-none"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Options *
            </label>
            <div className="space-y-2">
              {pollData.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-white focus:outline-none"
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
                className="w-full p-3 border-2 border-dashed border-neutral-600 rounded-lg text-neutral-400 hover:border-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <Plus className="w-4 h-4 mx-auto mb-1" />
                Add Option
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
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
                  pollData.isAnonymous ? 'bg-neutral-900' : 'bg-neutral-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  pollData.isAnonymous ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Allow multiple choices</span>
              <button
                type="button"
                onClick={() => setPollData(prev => ({ ...prev, allowMultipleChoices: !prev.allowMultipleChoices }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  pollData.allowMultipleChoices ? 'bg-neutral-900' : 'bg-neutral-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  pollData.allowMultipleChoices ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Send to
            </label>
            <select
              value={pollData.targetAudience}
              onChange={(e) => setPollData(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-white focus:outline-none"
            >
              <option value="team">My Team</option>
              <option value="department">Department</option>
              <option value="custom">Custom Group</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Deadline (optional)
            </label>
            <input
              type="datetime-local"
              value={pollData.deadline}
              onChange={(e) => setPollData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-white focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border border-neutral-600 rounded-lg text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 p-3 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white font-medium transition-colors"
            >
              Create {pollData.type === 'poll' ? 'Poll' : 'Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollSurveyModal;