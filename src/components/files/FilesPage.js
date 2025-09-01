import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  File, 
  FileText, 
  Image, 
  Video,
  Download,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import SimpleBar from 'simplebar-react';
import Sidebar from '../shared/Sidebar';
import LiveNotifications from '../shared/LiveNotifications';
import { usersData } from '../../data/usersData';

const FilesPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Sample file data with English content
  const files = [
    {
      id: 1,
      name: 'Project Proposal.pdf',
      type: 'document',
      size: '2.4 MB',
      modified: '2 hours ago',
      sharedBy: 'Sarah Johnson',
      icon: FileText
    },
    {
      id: 2,
      name: 'Marketing Strategy.docx',
      type: 'document', 
      size: '1.8 MB',
      modified: '5 hours ago',
      sharedBy: 'Marcus Chen',
      icon: FileText
    },
    {
      id: 3,
      name: 'Team Meeting Recording.mp4',
      type: 'media',
      size: '45.2 MB', 
      modified: '1 day ago',
      sharedBy: 'Emily Watson',
      icon: Video
    },
    {
      id: 4,
      name: 'Budget Analysis.xlsx',
      type: 'document',
      size: '892 KB',
      modified: '2 days ago', 
      sharedBy: 'David Rodriguez',
      icon: File
    },
    {
      id: 5,
      name: 'Product Mockup.png',
      type: 'media',
      size: '3.1 MB',
      modified: '3 days ago',
      sharedBy: 'Alex Thompson', 
      icon: Image
    }
  ];

  // Sample media thumbnails
  const mediaThumbnails = [
    {
      id: 1,
      name: 'Product Mockup.png',
      type: 'image'
    },
    {
      id: 2, 
      name: 'Team Photo.jpg',
      type: 'image'
    },
    {
      id: 3,
      name: 'Presentation.mp4', 
      type: 'video'
    },
    {
      id: 4,
      name: 'Logo Design.svg',
      type: 'image'
    }
  ];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'documents' && file.type === 'document') ||
                     (activeTab === 'media' && file.type === 'media');
    return matchesSearch && matchesTab;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.modified) - new Date(a.modified);
    } else {
      return new Date(a.modified) - new Date(b.modified);
    }
  });

  const TopTabsFiles = () => {
    return (
      <div className="w-fit min-w-0 rounded-lg h-20 py-4 flex flex-col justify-center">
        <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-neutral-700 text-white'
                : 'bg-transparent text-neutral-400 hover:text-gray-300'
            }`}
          >
            All Files
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-neutral-700 text-white'
                : 'bg-transparent text-neutral-400 hover:text-gray-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-neutral-700 text-white'
                : 'bg-transparent text-neutral-400 hover:text-gray-300'
            }`}
          >
            Media
          </button>
        </div>
      </div>
    );
  };

  const ActionBarFiles = () => {
    return (
      <div className="w-fit min-w-0 rounded-lg h-20 p-4 flex items-center space-x-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center space-x-2 px-4 py-2 bg-transparent hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Sort</span>
            <ChevronDown className="h-4 w-4 text-white" />
          </button>
          
          {showSortDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[120px]">
              <div className="py-1">
                <button
                  onClick={() => { setSortBy('newest'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    sortBy === 'newest' ? 'bg-neutral-700 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    sortBy === 'oldest' ? 'bg-neutral-700 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors">
          <Upload className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-medium">Upload</span>
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen bg-neutral-900 pr-6 overflow-hidden">
      <div className="flex gap-4 h-screen">
        {/* First column: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="files" onNavigate={onNavigate} />
        </div>

        {/* Second column: flex-1 - Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Tabs, Live Notifications and Actions */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabsFiles />
            <LiveNotifications 
              usersData={usersData}
              onUserClick={(user) => console.log('User clicked:', user)}
            />
            <ActionBarFiles />
          </div>

          {/* Main Content Area */}
          <div className="flex gap-2 flex-1 min-h-0 pb-2">
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full">
              <SimpleBar className="flex-1">
                <div className="space-y-4 pr-4">
                  {sortedFiles.map((file) => {
                    const IconComponent = file.icon;
                    return (
                      <div key={file.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-neutral-800/50 transition-colors group border-neutral-700 border">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-neutral-800/50 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-neutral-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium text-sm">{file.name}</h3>
                            <p className="text-neutral-400 text-xs">
                              {file.size} • Modified {file.modified} • Shared by {file.sharedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                            <Download className="h-4 w-4 text-neutral-400" />
                          </button>
                          <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SimpleBar>
            </div>

            {/* Right Sidebar - Media Thumbnails */}
            <div className="w-[350px] flex flex-col border border-neutral-700 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-white font-semibold text-lg mb-4">Recent Media</h2>
                <div className="grid grid-cols-2 gap-3">
                  {mediaThumbnails.map((media) => (
                    <div key={media.id} className="aspect-square bg-neutral-800/50 rounded-lg flex items-center justify-center hover:bg-neutral-700/50 transition-colors cursor-pointer">
                      {media.type === 'video' ? (
                        <Video className="h-8 w-8 text-neutral-400" />
                      ) : (
                        <Image className="h-8 w-8 text-neutral-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;