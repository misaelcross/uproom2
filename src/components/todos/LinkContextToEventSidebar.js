import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Check, Paperclip, Plus, X, Clock, Users } from 'lucide-react';
import SimpleBar from 'simplebar-react';

const LinkContextToEventSidebar = ({ todo, onClose, onSave, isOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(todo?.linkedEvents || []);

  // Mock data for events
  const mockEvents = [
    {
      id: 1,
      title: 'Team Standup',
      date: '2024-01-15',
      time: '09:00 AM',
      duration: '30 min',
      attendees: ['Sarah Chen', 'Alex Johnson'],
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Project Review',
      date: '2024-01-16',
      time: '02:00 PM',
      duration: '1 hour',
      attendees: ['Emma Wilson', 'Marcus Rodriguez'],
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Client Presentation',
      date: '2024-01-17',
      time: '10:00 AM',
      duration: '45 min',
      attendees: ['Sarah Chen', 'Lauren Potter'],
      type: 'presentation'
    },
    {
      id: 4,
      title: 'Sprint Planning',
      date: '2024-01-18',
      time: '01:00 PM',
      duration: '2 hours',
      attendees: ['Alex Johnson', 'Emma Wilson', 'Marcus Rodriguez'],
      type: 'planning'
    }
  ];

  // Filter events based on search query
  const filteredEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.attendees.some(attendee => attendee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleEventSelection = (event) => {
    setSelectedEvents(prev => 
      prev.find(e => e.id === event.id)
        ? prev.filter(e => e.id !== event.id)
        : [...prev, event]
    );
  };

  const removeSelectedEvent = (event) => {
    setSelectedEvents(prev => prev.filter(e => e.id !== event.id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedEvents);
    }
    onClose();
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
      case 'presentation': return { bg: 'bg-purple-500/20', text: 'text-purple-400' };
      case 'planning': return { bg: 'bg-green-500/20', text: 'text-green-400' };
      default: return { bg: 'bg-neutral-500/20', text: 'text-neutral-400' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-neutral-700">
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">Link Context to Event</h2>
          <p className="text-sm text-neutral-400">Connect this todo to relevant events</p>
        </div>
      </div>

      <SimpleBar className="flex-1">
        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Events List */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Available Events
            </h3>
            <div className="space-y-2">
              {filteredEvents.map((event) => {
                const isSelected = selectedEvents.find(e => e.id === event.id);
                const typeColors = getEventTypeColor(event.type);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => toggleEventSelection(event)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/5 border-white'
                        : 'bg-neutral-800 border-neutral-600 hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{event.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${typeColors.bg} ${typeColors.text}`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time} ({event.duration})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.attendees.length} attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-white border-white'
                          : 'border-neutral-500'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-black" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Events */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              Linked Events ({selectedEvents.length})
            </h3>
            
            {selectedEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedEvents.map((event) => {
                  const typeColors = getEventTypeColor(event.type);
                  
                  return (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{event.title}</span>
                          <span className={`px-2 py-1 rounded text-xs ${typeColors.bg} ${typeColors.text}`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <span>{event.date} at {event.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeSelectedEvent(event)}
                        className="text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No events linked yet</p>
                <p className="text-sm">Select events from above to link them to this todo</p>
              </div>
            )}
          </div>
        </div>
      </SimpleBar>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-700">
        <button
          onClick={onClose}
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

export default LinkContextToEventSidebar;