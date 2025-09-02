import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, MessageSquare, CheckSquare, Paperclip, Plus, X, File, FileSpreadsheet, Palette, Folder } from 'lucide-react';
import SimpleBar from 'simplebar-react';

const LinkContextSidebar = ({ event, onBack, onUpdateEvent }) => {
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
      timestamp: '2d',
      priority: 'normal',
      preview: 'Quick question about the new API endpoints...'
    }
  ];

  // Mock data for files
  const mockFiles = [
    { id: 1, name: 'Project_Proposal.pdf', type: 'pdf', size: '2.4 MB', lastModified: '2 hours ago' },
    { id: 2, name: 'Design_Mockups.fig', type: 'figma', size: '15.2 MB', lastModified: '1 day ago' },
    { id: 3, name: 'Meeting_Notes.docx', type: 'doc', size: '156 KB', lastModified: '3 days ago' },
    { id: 4, name: 'Budget_Analysis.xlsx', type: 'excel', size: '892 KB', lastModified: '1 week ago' }
  ];

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return { bg: 'bg-red-500/20', text: 'text-red-400' };
      case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400' };
      case 'low': return { bg: 'bg-green-500/20', text: 'text-green-400' };
      default: return { bg: 'bg-neutral-500/20', text: 'text-neutral-400' };
    }
  };

  const getFileIcon = (type) => {
    const iconProps = { className: "w-5 h-5 text-neutral-400" };
    switch (type) {
      case 'pdf': return <div className="p-2 bg-neutral-800 rounded"><FileText {...iconProps} /></div>;
      case 'doc': case 'docx': return <div className="p-2 bg-neutral-800 rounded"><File {...iconProps} /></div>;
      case 'excel': case 'xlsx': return <div className="p-2 bg-neutral-800 rounded"><FileSpreadsheet {...iconProps} /></div>;
      case 'figma': return <div className="p-2 bg-neutral-800 rounded"><Palette {...iconProps} /></div>;
      default: return <div className="p-2 bg-neutral-800 rounded"><Folder {...iconProps} /></div>;
    }
  };

  // Filter data based on search query
  const filteredData = {
    tasks: mockTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    nudges: mockNudges.filter(nudge => 
      nudge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nudge.sender.toLowerCase().includes(searchQuery.toLowerCase())
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
    onBack();
  };

  const removeSelectedItem = (type, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i.id !== item.id)
    }));
  };

  if (!event) return null;

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
          <div>
            <h2 className="text-xl font-semibold text-neutral-300">
              Link Context to Event
            </h2>
            <p className="text-neutral-400 text-sm mt-1">{event.title} - {event.time}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <SimpleBar className="flex-1">
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('nudges')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'nudges'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Nudges</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'files'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Files</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-400">Available {activeTab}</h3>
            <SimpleBar className="max-h-64">              <div className="space-y-2">
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
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{file.name}</div>
                      <div className="text-neutral-400 text-xs">
                        {file.size} • {file.lastModified}
                      </div>
                    </div>
                  </div>
                </div>
              ))}              </div>            </SimpleBar>
          </div>

          {/* Selected Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-400">Linked Context</h3>
            
            {/* Selected Tasks */}
            {selectedItems.tasks.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-neutral-500 mb-2 flex items-center">
                  <CheckSquare className="w-3 h-3 mr-2" />
                  Tasks ({selectedItems.tasks.length})
                </h4>
                <div className="space-y-1">
                  {selectedItems.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                      <span className="text-white text-sm">{task.title}</span>
                      <button
                        onClick={() => removeSelectedItem('tasks', task)}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
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
              <div>
                <h4 className="text-xs font-medium text-neutral-500 mb-2 flex items-center">
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Nudges ({selectedItems.nudges.length})
                </h4>
                <div className="space-y-1">
                  {selectedItems.nudges.map((nudge) => (
                    <div key={nudge.id} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                      <span className="text-white text-sm">{nudge.title}</span>
                      <button
                        onClick={() => removeSelectedItem('nudges', nudge)}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
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
              <div>
                <h4 className="text-xs font-medium text-neutral-500 mb-2 flex items-center">
                  <FileText className="w-3 h-3 mr-2" />
                  Files ({selectedItems.files.length})
                </h4>
                <div className="space-y-1">
                  {selectedItems.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-white text-sm">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeSelectedItem('files', file)}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
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
                <p className="text-sm">Select items from above to link them to this event</p>
              </div>
            )}
          </div>
        </div>
      </SimpleBar>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-700">
        <button
          onClick={onBack}
          className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg transition-colors"
        >
          Save Context
        </button>
      </div>
    </div>
  );
};

export default LinkContextSidebar;