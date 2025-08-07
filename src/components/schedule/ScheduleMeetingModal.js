import React, { useState } from 'react';
import { X, Clock, Calendar, Users, MapPin } from 'lucide-react';

const ScheduleMeetingModal = ({ isOpen, onClose, suggestedSlots = [] }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [meetingLocation, setMeetingLocation] = useState('');

  // Mock attendees data
  const availableAttendees = [
    { id: 1, name: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', status: 'available' },
    { id: 2, name: 'Marcus Rodriguez', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', status: 'busy' },
    { id: 3, name: 'Emma Wilson', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', status: 'available' },
    { id: 4, name: 'Alex Johnson', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', status: 'available' }
  ];

  // Default suggested slots if none provided
  const defaultSlots = [
    { id: 1, date: 'Today', time: '2:00pm - 3:00pm', available: true, conflicts: 0 },
    { id: 2, date: 'Today', time: '3:30pm - 4:30pm', available: true, conflicts: 1 },
    { id: 3, date: 'Tomorrow', time: '10:00am - 11:00am', available: true, conflicts: 0 },
    { id: 4, date: 'Tomorrow', time: '2:00pm - 3:00pm', available: true, conflicts: 2 }
  ];

  const slots = suggestedSlots.length > 0 ? suggestedSlots : defaultSlots;

  const toggleAttendee = (attendee) => {
    setSelectedAttendees(prev => {
      const isSelected = prev.find(a => a.id === attendee.id);
      if (isSelected) {
        return prev.filter(a => a.id !== attendee.id);
      } else {
        return [...prev, attendee];
      }
    });
  };

  const handleScheduleMeeting = () => {
    if (!selectedSlot || !meetingTitle.trim()) return;

    const meetingData = {
      title: meetingTitle,
      description: meetingDescription,
      slot: selectedSlot,
      attendees: selectedAttendees,
      location: meetingLocation
    };

    console.log('Scheduling meeting:', meetingData);
    // Here you would typically send this data to your backend
    
    // Reset form and close modal
    setMeetingTitle('');
    setMeetingDescription('');
    setSelectedSlot(null);
    setSelectedAttendees([]);
    setMeetingLocation('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <h2 className="text-xl font-semibold text-white">Schedule Meeting</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meeting Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Meeting Title *
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Enter meeting title"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>

          {/* Suggested Time Slots */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              <Clock className="w-4 h-4 inline mr-2" />
              Suggested Time Slots
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSlot?.id === slot.id
                      ? 'border-neutral-500 bg-neutral-500/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{slot.time}</div>
                      <div className="text-neutral-400 text-sm">{slot.date}</div>
                    </div>
                    {slot.conflicts > 0 && (
                      <div className="text-orange-400 text-xs">
                        {slot.conflicts} conflict{slot.conflicts > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              <Users className="w-4 h-4 inline mr-2" />
              Attendees
            </label>
            <div className="space-y-2">
              {availableAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  onClick={() => toggleAttendee(attendee)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAttendees.find(a => a.id === attendee.id)
                      ? 'border-neutral-500 bg-neutral-500/10'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <img
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{attendee.name}</div>
                    <div className={`text-xs ${
                      attendee.status === 'available' ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      {attendee.status}
                    </div>
                  </div>
                  {selectedAttendees.find(a => a.id === attendee.id) && (
                    <div className="w-5 h-5 bg-neutral-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="Meeting room, video call link, etc."
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              value={meetingDescription}
              onChange={(e) => setMeetingDescription(e.target.value)}
              placeholder="Meeting agenda, notes, etc."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleScheduleMeeting}
            disabled={!selectedSlot || !meetingTitle.trim()}
            className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;