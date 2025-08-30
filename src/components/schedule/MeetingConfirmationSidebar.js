import React, { useState } from 'react';
import { X, ArrowLeft, Calendar, Clock, User, MessageSquare, Send } from 'lucide-react';

const MeetingConfirmationSidebar = ({ isOpen, onClose, onBack, employee, timeSlot, dateInfo, onConfirm }) => {
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [selectedDate, setSelectedDate] = useState(dateInfo);
  const [selectedTime, setSelectedTime] = useState(timeSlot);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Available duration options (30 min intervals, max 3 hours)
  const durationOptions = [30, 60, 90, 120, 150, 180];
  
  // Generate available dates (next 7 days)
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      dates.push({ date, dayName, monthDay });
    }
    return dates;
  }, []);
  
  // Generate available time slots (30 min intervals)
  const availableTimeSlots = React.useMemo(() => {
    const slots = [
      '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
      '2:00pm', '2:30pm', '3:00pm', '3:30pm', '4:00pm', '4:30pm'
    ];
    return slots.map(time => ({ time, available: true }));
  }, []);
  
  // Update selected values when props change
  React.useEffect(() => {
    if (dateInfo) setSelectedDate(dateInfo);
    if (timeSlot) setSelectedTime(timeSlot);
  }, [dateInfo, timeSlot]);

  if (!isOpen || !employee || !timeSlot || !dateInfo) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      await onConfirm({
        employee,
        timeSlot: selectedTime,
        dateInfo: selectedDate,
        duration,
        message: message.trim()
      });
    } catch (error) {
      console.error('Error confirming meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'Meeting':
        return 'bg-red-500';
      case 'focus':
        return 'bg-purple-500';
      case 'break':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-500';
      case 'emergency':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full bg-transparent border border-neutral-600 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-600">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </button>
            <h2 className="text-lg font-semibold text-white">Confirm Meeting</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Meeting Details */}
        <div className="space-y-4">
          {/* Employee Info */}
          <div className="px-6 py-4 border-b border-neutral-700">
            <div className="flex items-center gap-3 rounded-lg">
              <div className="relative">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-800 ${getAvailabilityColor(employee.availability)}`}
                ></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{employee.name}</span>
                </div>
                <p className="text-sm text-neutral-400">{employee.title}</p>
                <p className="text-xs text-neutral-500">{employee.department}</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-3">
          
          {/* Date & Time */}
          <div className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-white">Date</label>
              </div>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-neutral-600 hover:bg-neutral-700 transition-colors"
              >
                <Calendar className="w-5 h-5 text-neutral-400" />
                <div className="text-left">
                  <p className="text-white font-medium">{selectedDate?.dayName}</p>
                  <p className="text-sm text-neutral-400">{selectedDate?.monthDay}</p>
                </div>
              </button>
              
              {/* Date Picker */}
              {showDatePicker && (
                <div className="space-y-2 p-3 bg-neutral-900 border border-neutral-600 rounded-lg">
                  {availableDates.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        setShowDatePicker(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left transition-colors ${
                        selectedDate?.dayName === date.dayName && selectedDate?.monthDay === date.monthDay
                          ? 'bg-white text-black'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}
                    >
                      <p className="font-medium">{date.dayName}</p>
                      <p className="text-sm opacity-70">{date.monthDay}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-white">Time</label>
              </div>
              <button
                onClick={() => setShowTimePicker(!showTimePicker)}
                className="w-full flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-neutral-600 hover:bg-neutral-700 transition-colors"
              >
                <Clock className="w-5 h-5 text-neutral-400" />
                <div className="text-left">
                  <p className="text-white font-medium">{selectedTime?.time}</p>
                  <p className="text-sm text-neutral-400">{duration} minutes</p>
                </div>
              </button>
              
              {/* Time Picker */}
              {showTimePicker && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-900 border border-neutral-600 rounded-lg max-h-48 overflow-y-auto">
                  {availableTimeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedTime(slot);
                        setShowTimePicker(false);
                      }}
                      className={`p-2 rounded-lg text-center transition-colors ${
                        selectedTime?.time === slot.time
                          ? 'bg-white text-black'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}
                    >
                      <p className="font-medium">{slot.time}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Duration Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-white">Duration</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDuration(option)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      duration === option
                        ? 'bg-white text-black border-white'
                        : 'bg-neutral-800 text-white border-neutral-600 hover:bg-neutral-700'
                    }`}
                  >
                    {option}min
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white">Message (Optional)</label>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              rows={4}
              className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-white resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">
                {message.length}/500 characters
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-white">Summary</label>
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-600 rounded-lg">
              <div className="space-y-1 text-sm text-neutral-300">
                <p>• Meeting with {employee.name}</p>
                <p>• {selectedDate?.dayName}, {selectedDate?.monthDay} at {selectedTime?.time}</p>
                <p>• Duration: {duration} minutes</p>
                {message.trim() && <p>• Custom message included</p>}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-600 mt-auto">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300  font-medium hover:bg-neutral-800 transition-colors"
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-neutral-200 text-black font-medium rounded-lg hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4"/>
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingConfirmationSidebar;