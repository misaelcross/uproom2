import React, { useState } from 'react';
import { X, Search, File, Zap, Check, Paperclip, Plus, FileText, MessageSquare } from 'lucide-react';

const EventContextModal = ({ isOpen, onClose, event, onUpdateEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedItems, setSelectedItems] = useState({
    tasks: event?.linkedTasks || [],
    nudges: event?.linkedNudges || [],
    files: event?.linkedFiles || []
  });

  // Mock data for tasks
  const mockTasks = [
    { id: 1, title: 'Review project proposal', priority: 'High', completed: false, assignee: 'Sarah Chen' },
    { id: 2, title: 'Update documentation', priority: 'Medium', completed: false, assignee: 'Alex Johnson' },
    { id: 3, title: 'Team meeting preparation', priority: 'Low', completed: true, assignee: 'Emma Wilson' },
    { id: 4, title: 'Client feedback review', priority: 'High', completed: false, assignee: 'Marcus Rodriguez' }
  ];

  // Mock data for nudges
  const mockNudges = [
    { 
      id: 1, 
      title: 'Frontend fixes needed', 
      sender: 'Brent Short', 
      timestamp: '1h',
      priority: 'high',
      preview: 'I need you to help with me with a series of quick frontend fixes...'
    },
    { 
      id: 2, 
      title: 'Presentation slides', 
      sender: 'Lauren Potter', 
      timestamp: '1d',
      priority: 'normal',
      preview: 'Great work on that presentation today! Could you share...'
    },
    { 
      id: 3, 
      title: 'API integration question', 
      sender: 'Marcus Chen', 
      timestamp: '3d',
      priority: 'normal',
      preview: 'Quick question about the API integration...'
    }
  ];

  // Mock data for files
  const mockFiles = [
    { id: 1, name: 'Project_Requirements.pdf', type: 'pdf', size: '2.4 MB', lastModified: '2 hours ago' },
    { id: 2, name: 'Design_Mockups.figma', type: 'figma', size: '15.2 MB', lastModified: '1 day ago' },
    { id: 3, name: 'Meeting_Notes.docx', type: 'docx', size: '156 KB', lastModified: '3 days ago' },
    { id: 4, name: 'Budget_Spreadsheet.xlsx', type: 'xlsx', size: '892 KB', lastModified: '1 week ago' }
  ];

  const filteredData = {
    tasks: mockTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    nudges: mockNudges.filter(nudge => 
      nudge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nudge.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nudge.preview.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    files: mockFiles.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const toggleItemSelection = (type, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].find(i => i.id === item.id)
        ? prev[type].filter(i => i.id !== item.id)
        : [...prev[type], item]
    }));
  };

  const handleSave = () => {
    if (onUpdateEvent) {
      onUpdateEvent({
        ...event,
        linkedTasks: selectedItems.tasks,
        linkedNudges: selectedItems.nudges,
        linkedFiles: selectedItems.files
      });
    }
    onClose();
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'figma': return '🎨';
      case 'docx': return '📝';
      case 'xlsx': return '📊';
      default: return '📁';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { text: 'text-red-400', bg: 'bg-red-500/10' };
      case 'Medium': return { text: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'Low': return { text: 'text-green-400', bg: 'bg-green-500/10' };
      case 'high': return { text: 'text-red-400', bg: 'bg-red-500/10' };
      case 'normal': return { text: 'text-blue-400', bg: 'bg-blue-500/10' };
      default: return { text: 'text-neutral-400', bg: 'bg-neutral-500/10' };
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Link Context to Event</h2>
            <p className="text-neutral-400 text-sm mt-1">{event.title} - {event.time}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Tabs and Search */}
          <div className="w-1/3 border-r border-neutral-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-neutral-700">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'tasks'
                    ? 'text-neutral-400 border-b-2 border-neutral-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Check className="w-4 h-4 inline mr-2" />
                To-do ({selectedItems.tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('nudges')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'nudges'
                    ? 'text-neutral-400 border-b-2 border-neutral-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Nudges ({selectedItems.nudges.length})
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'files'
                    ? 'text-neutral-400 border-b-2 border-neutral-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <File className="w-4 h-4 inline mr-2" />
                Files ({selectedItems.files.length})
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-neutral-700">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 p-4 space-y-2" data-simplebar>
              {activeTab === 'tasks' && filteredData.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleItemSelection('tasks', task)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedItems.tasks.find(t => t.id === task.id)
                      ? 'border-neutral-500 bg-neutral-500/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{task.title}</div>
                      <div className="text-neutral-400 text-xs mt-1">
                        Assigned to {task.assignee}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority).text} ${getPriorityColor(task.priority).bg}`}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'nudges' && filteredData.nudges.map((nudge) => (
                <div
                  key={nudge.id}
                  onClick={() => toggleItemSelection('nudges', nudge)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedItems.nudges.find(n => n.id === nudge.id)
                      ? 'border-neutral-500 bg-neutral-500/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <div className="text-white font-medium text-sm">{nudge.title}</div>
                  <div className="text-neutral-400 text-xs mt-1">
                    From {nudge.sender} • {nudge.timestamp}
                  </div>
                  <div className="text-neutral-500 text-xs mt-1 line-clamp-2">
                    {nudge.preview}
                  </div>
                </div>
              ))}

              {activeTab === 'files' && filteredData.files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => toggleItemSelection('files', file)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedItems.files.find(f => f.id === file.id)
                      ? 'border-neutral-500 bg-neutral-500/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{file.name}</div>
                      <div className="text-neutral-400 text-xs">
                        {file.size} • {file.lastModified}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Selected Items */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-4">Linked Context</h3>
              
              {/* Selected To-do */}
              {selectedItems.tasks.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    To-do ({selectedItems.tasks.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedItems.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                        <span className="text-white text-sm">{task.title}</span>
                        <button
                          onClick={() => toggleItemSelection('tasks', task)}
                          className="text-neutral-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Nudges */}
              {selectedItems.nudges.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nudges ({selectedItems.nudges.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedItems.nudges.map((nudge) => (
                      <div key={nudge.id} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                        <span className="text-white text-sm">{nudge.title}</span>
                        <button
                          onClick={() => toggleItemSelection('nudges', nudge)}
                          className="text-neutral-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Files */}
              {selectedItems.files.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Files ({selectedItems.files.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedItems.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-neutral-700 rounded">
                        <div className="flex items-center gap-2">
                          <span>{getFileIcon(file.type)}</span>
                          <span className="text-white text-sm">{file.name}</span>
                        </div>
                        <button
                          onClick={() => toggleItemSelection('files', file)}
                          className="text-neutral-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.values(selectedItems).every(arr => arr.length === 0) && (
                <div className="text-center py-8 text-neutral-500">
                  <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No context linked yet</p>
                  <p className="text-sm">Select items from the left panel to link them to this event</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Save Context
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventContextModal;