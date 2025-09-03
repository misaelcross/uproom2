import React from 'react';
import { X, ArrowLeft, Calendar, Clock } from 'lucide-react';
import MonthCalendar from './MonthCalendar';

const EmployeeAvailabilitySidebar = ({ isOpen, onClose, onBack, employee, onSelectTimeSlot }) => {
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [showCalendar, setShowCalendar] = React.useState(true);
  
  // Function to handle time slot confirmation
  const handleConfirmTimeSlot = (employee, slot, dateInfo) => {
    // Call the original onSelectTimeSlot function with correct parameter order
    onSelectTimeSlot(slot, dateInfo);
  };
  
  // Generate sample availability data for the selected employee (memoized to prevent re-generation)
  const availabilityData = React.useMemo(() => {
    if (!employee || !selectedDate) return [];
    
    const generateAvailability = () => {
      const baseDate = new Date(selectedDate);
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        
        // Generate time slots based on employee availability status
        const timeSlots = [];
        const isAvailable = employee.availability === 'Available' || employee.availability === 'Focus';
        
        if (isAvailable && i < 5) { // Only weekdays for available employees
          const slots = [
            '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
            '2:00pm', '2:30pm', '3:00pm', '3:30pm', '4:00pm', '4:30pm'
          ];
          
          // Create a deterministic seed based on employee ID to ensure consistent results
          const seed = employee.id || 1;
          let random = seed;
          const seededRandom = () => {
            random = (random * 9301 + 49297) % 233280;
            return random / 233280;
          };
          
          // Select slots as available using seeded random
          slots.forEach((slot, index) => {
            if (seededRandom() > 0.3) { // 70% chance of being available
              timeSlots.push({
                time: slot,
                available: true
              });
            }
          });
        }
        
        days.push({
          date,
          dayName,
          monthDay,
          timeSlots
        });
      }
      
      return days;
    };
    
    return generateAvailability();
  }, [employee, selectedDate]);
   
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  // Handle back to calendar
  const handleBackToCalendar = () => {
    setShowCalendar(true);
    setSelectedSlot(null);
  };

  if (!isOpen || !employee) return null;
   
  const selectedDateData = availabilityData.find(day => {
    const dayDate = new Date(day.date);
    return dayDate.toDateString() === selectedDate.toDateString();
  }) || { 
    dayName: selectedDate.toLocaleDateString('en-US', { weekday: 'long' }), 
    monthDay: selectedDate.getDate(), 
    timeSlots: [] 
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
    <div className="h-full bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <button
              onClick={showCalendar ? onBack : handleBackToCalendar}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </button>
            <h2 className="text-lg font-semibold text-white">
              {showCalendar ? 'Select Date' : 'Select Time'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Employee Info */}
        <div className="px-6 py-4 border-b border-neutral-700">
          <div className="flex items-center gap-3">
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
            <div>
              <h3 className="text-white font-medium">{employee.name}</h3>
              <p className="text-sm text-neutral-400">{employee.title}</p>
              <p className="text-xs text-neutral-500">{employee.department}</p>
            </div>
          </div>
        </div>

        {showCalendar ? (
          /* Calendar Selection */
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Choose a date</h3>
              <p className="text-sm text-neutral-400 mb-4">
                Select a date to view {employee.name}'s availability
              </p>
            </div>
            <MonthCalendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        ) : (
          /* Time Slots Selection */
          <>
            {/* Date Header */}
            <div className="px-6 py-4 border-b border-neutral-700">
              <div className="flex items-center gap-2 text-neutral-300">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{selectedDateData.dayName}, {selectedDateData.monthDay}</span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="p-6 flex-1 overflow-y-auto">
              {selectedDateData.timeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-400 mb-2">No availability on this date</p>
                  <p className="text-sm text-neutral-500">
                    {employee.name} is currently {employee.availability.toLowerCase()}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateData.timeSlots.map((slot, index) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    
                    if (isSelected) {
                      // Show selected slot with confirm button
                      return (
                        <div key={index} className="space-x-2 flex">
                          {/* Selected time slot */}
                          <div className="flex items-center justify-center w-full p-2 rounded-lg bg-neutral-800 border border-white text-white">
                            <span className="font-medium">{slot.time}</span>
                          </div>
                          
                          {/* Confirm button */}
                          <button
                            onClick={() => handleConfirmTimeSlot(employee, slot, selectedDateData)}
                            className="w-full p-3 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors"
                          >
                            <span className="font-medium">Confirm</span>
                          </button>
                        </div>
                      );
                    }
                    
                    // Normal time slot
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className="w-full p-3 rounded-lg border border-neutral-700 text-white bg-transparent hover:bg-neutral-800 transition-colors"
                      >
                        <span className="font-medium">{slot.time}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-700">
          {showCalendar ? (
            <span className="text-sm text-neutral-400">
              Select a date to view availability
            </span>
          ) : (
            <span className="text-sm text-neutral-400">
              {selectedDateData.timeSlots.length} slot{selectedDateData.timeSlots.length !== 1 ? 's' : ''} available
            </span>
          )}
          <button
            onClick={showCalendar ? onBack : handleBackToCalendar}
            className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300  font-medium hover:bg-neutral-800 transition-colors"
          >
            {showCalendar ? 'Back' : 'Change Date'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAvailabilitySidebar;