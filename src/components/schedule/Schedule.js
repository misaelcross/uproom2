import React from 'react';
import { ChevronDown, MoreVertical } from 'lucide-react';

const Schedule = () => {
  const scheduleData = [
    {
      day: '02',
      dayName: 'Monday',
      events: [
        {
          id: 1,
          title: 'Team Meeting',
          time: '11:30am - 12:00pm',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: true
        },
        {
          id: 2,
          title: 'Lunch break',
          time: '12:00am - 1:00pm',
          isCurrent: false
        },
        {
          id: 3,
          title: 'Product Review',
          time: '13:00pm - 4:30pm',
          isCurrent: false
        }
      ]
    },
    {
      day: '03',
      dayName: 'Tuesday',
      events: [
        {
          id: 4,
          title: 'Daily Meeting',
          time: '09:30am - 10:00am',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          isCurrent: false
        },
        {
          id: 5,
          title: 'Clients Meeting',
          time: '10:15am - 12:00pm',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          isCurrent: false
        },
        {
          id: 6,
          title: 'Lunch break',
          time: '12:00am - 1:00pm',
          isCurrent: false
        },
        {
          id: 7,
          title: 'Free for talk',
          time: '13:00pm - 2:00pm',
          isCurrent: false
        },
        {
          id: 8,
          title: 'Product Review',
          time: '13:00pm - 4:30pm',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: false
        }
      ]
    },
    {
      day: '04',
      dayName: 'Wednesday',
      events: [
        {
          id: 9,
          title: 'Team Meeting',
          time: '11:30am - 12:00am',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
          additionalPeople: '+3',
          isCurrent: false
        },
        {
          id: 10,
          title: 'Lunch break',
          time: '12:00am - 1:00pm',
          isCurrent: false
        }
      ]
    }
  ];

  return (
    <div className="border border-neutral-700 rounded-lg max-w-md h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
        <h2 className="text-white text-xl font-semibold">My Schedule</h2>
        <div className="flex items-center gap-2 text-white">
          <span className="text-lg">Jul 2025</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-1">
          {scheduleData.map((dayData) => (
            <div key={dayData.day} className="flex gap-4 py-4 border-b border-neutral-700">
              {/* Day Column */}
              <div className="flex flex-col items-center w-[50px]">
                <div className="text-white text-2xl font-semibold">{dayData.day}</div>
                <div className="text-neutral-400 text-xs">{dayData.dayName}</div>
              </div>

              {/* Events Column */}
              <div className="flex-1 space-y-3">
                {dayData.events.map((event) => (
                  <div
                    key={event.id}
                    className={`rounded-lg p-3 ${
                      event.isCurrent
                        ? 'bg-cyan-600'
                        : 'border border-neutral-700 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          event.isCurrent ? 'text-cyan-200' : 'text-neutral-500'
                        }`}>
                          {event.title}
                        </div>
                        <div className="text-white text-xs">{event.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.avatar && (
                          <img 
                            src={event.avatar} 
                            alt="Avatar" 
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        )}
                        {event.additionalPeople && (
                          <span className={`text-sm ${
                            event.isCurrent ? 'text-cyan-200' : 'text-neutral-500'
                          }`}>
                            {event.additionalPeople}
                          </span>
                        )}
                        <MoreVertical className={`w-5 h-5 ${
                          event.isCurrent ? 'text-cyan-200' : 'text-neutral-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;