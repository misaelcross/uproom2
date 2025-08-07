import React, { useState, useEffect, useRef } from 'react';
import { Tab } from '@headlessui/react';
import { ArrowLeft, Send, Users, Eye, MoreVertical, ChevronDown, Paperclip, Link } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const UserDetails = ({ user, onBack }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const tabs = ['Activity', 'Schedule', 'Info'];

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [message]);

  const handleSendNudge = () => {
    if (message.trim()) {
      console.log(`Sending nudge to ${user.name}: ${message}`);
      setMessage('');
    }
  };

  // Função para gerar schedule personalizado baseado no usuário
  const generateUserSchedule = (user) => {
    const scheduleTemplates = [
      {
        day: '02',
        dayName: 'Monday',
        events: [
          {
            id: 1,
            title: `${user.department} Team Meeting`,
            time: '09:30am - 10:30am',
            avatar: user.avatar,
            additionalPeople: '+4',
            isCurrent: user.availability === 'In meeting'
          },
          {
            id: 2,
            title: 'Lunch break',
            time: '12:00pm - 1:00pm',
            isCurrent: false
          },
          {
            id: 3,
            title: `${user.skills && user.skills[0] ? user.skills[0] : 'Project'} Review`,
            time: '2:00pm - 3:30pm',
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
            title: 'Daily Standup',
            time: '09:00am - 09:30am',
            avatar: user.avatar,
            isCurrent: false
          },
          {
            id: 5,
            title: `${user.title} Focus Time`,
            time: '10:00am - 12:00pm',
            isCurrent: user.availability === 'Focus'
          },
          {
            id: 6,
            title: 'Client Meeting',
            time: '2:00pm - 3:00pm',
            avatar: user.avatar,
            additionalPeople: '+2',
            isCurrent: false
          },
          {
            id: 7,
            title: '1:1 with Manager',
            time: '4:00pm - 4:30pm',
            isCurrent: false
          }
        ]
      },
      {
        day: '04',
        dayName: 'Wednesday',
        events: [
          {
            id: 8,
            title: `${user.skills && user.skills.length > 0 ? (user.skills[1] || user.skills[0]) : 'General'} Workshop`,
            time: '10:00am - 12:00pm',
            avatar: user.avatar,
            additionalPeople: '+6',
            isCurrent: false
          },
          {
            id: 9,
            title: 'Lunch break',
            time: '12:00pm - 1:00pm',
            isCurrent: false
          }
        ]
      }
    ];

    return scheduleTemplates;
  };

  if (!user) {
    return (
      <div className="bg-transparent border border-neutral-700 rounded-lg p-6">
        <div className="text-neutral-400 text-center py-8">
          Select a user to view details
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white text-lg font-semibold">User Details</h2>
        </div>

        {/* User Avatar and Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900 ${
              user.status === 'online' ? 'bg-green-500' : 
              user.status === 'away' ? 'bg-yellow-500' : 
              user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">{user.name}</h2>
            <p className="text-neutral-400 text-sm">{user.title}{user.department}</p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 mt-4">
          {user.randomIcons && user.randomIcons.map((iconUrl, index) => (
            <img 
              key={index}
              src={iconUrl} 
              alt="App icon" 
              className="w-5 h-5" 
            />
          ))}
        </div>
      </div>

      {/* Quick Nudge */}
      <div className="px-6 py-3 border-b border-neutral-700">
        <h3 className="text-md mb-3 text-white">Quick Nudge</h3>
        
        {/* Message Input */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 resize-none focus:outline-none focus:border-neutral-500 transition-colors min-h-[44px] overflow-hidden"
              rows="1"
              style={{ height: 'auto' }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                <Link size={20} />
              </button>
            </div>
            
            <button
              onClick={handleSendNudge}
              disabled={!message.trim()}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-700 disabled:text-neutral-400 text-white border border-neutral-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send size={16} />
              <span>Send Nudge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-lg bg-neutral-900 p-1 mb-6">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg text-sm font-medium leading-5 h-7 flex items-center justify-center',
                    'focus:outline-none',
                    selected
                      ? 'bg-neutral-800 text-white shadow'
                      : 'text-neutral-400 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="space-y-4">
            {/* Activity Content */}
            <div className="space-y-4">
              <div className="bg-neutral-900 rounded-lg p-4">
                {/* Primeira linha: Ícone, Título e Duração */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-neutral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Working on {user.skills && user.skills[0] ? user.skills[0] : 'current'} project</h4>
                    <p className="text-neutral-400 text-sm">2:30 PM - 5:00 PM</p>
                  </div>
                </div>
                {/* Segunda linha: Descrição, Timestamp e Status alinhados ao ícone */}
                <div className="ml-13">
                  <p className="text-neutral-400 text-sm mb-2">
                    Currently focused on {user.bio}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>Started 30m</span>
                    <span>•</span>
                    <span className="text-neutral-400">In Progress</span>
                  </div>
                </div>
              </div>

              <div className="bg-transparent border border-neutral-700 rounded-lg p-4">
                {/* Primeira linha: Ícone, Título e Duração */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Team Meeting - {user.department}</h4>
                    <p className="text-neutral-400 text-sm">10:00 AM - 11:00 AM</p>
                  </div>
                </div>
                {/* Segunda linha: Descrição, Timestamp e Status alinhados ao ícone */}
                <div className="ml-13">
                  <p className="text-neutral-400 text-sm mb-2">
                    Weekly sync with the {user.department} team to discuss ongoing projects and priorities.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>3h</span>
                    <span>•</span>
                    <span className="text-neutral-400">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">{user.name.split(' ')[0]}'s Schedule</h4>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-sm">Jul 2025</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Schedule Content */}
              <div className="space-y-1">
                {generateUserSchedule(user).map((dayData) => (
                  <div key={dayData.day} className="flex gap-4 py-3 border-b border-neutral-700">
                    {/* Day Column */}
                    <div className="flex flex-col items-center w-[40px]">
                      <div className="text-white text-xl font-semibold">{dayData.day}</div>
                      <div className="text-neutral-400 text-xs">{dayData.dayName}</div>
                    </div>

                    {/* Events Column */}
                    <div className="flex-1 space-y-2">
                      {dayData.events.map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-lg p-3 ${
                            event.isCurrent
                              ? 'bg-gray-600'
                              : 'border border-neutral-700 bg-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={`text-sm font-medium ${
                                event.isCurrent ? 'text-gray-200' : 'text-neutral-500'
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
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              {event.additionalPeople && (
                                <span className={`text-xs ${
                                  event.isCurrent ? 'text-gray-200' : 'text-neutral-500'
                                }`}>
                                  {event.additionalPeople}
                                </span>
                              )}
                              <MoreVertical className={`w-4 h-4 ${
                                event.isCurrent ? 'text-gray-200' : 'text-neutral-500'
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
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-6">
              {/* Contact Section */}
              <div className="border border-neutral-700 rounded-lg p-4">
                <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">Contact</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-white text-sm mb-1">{user.email}</div>
                    <div className="text-neutral-400 text-xs">Email</div>
                  </div>
                  <div>
                    <div className="text-white text-sm mb-1">{user.phone}</div>
                    <div className="text-neutral-400 text-xs">Mobile</div>
                  </div>
                  <div>
                    <div className="text-white text-sm mb-1">{user.location}</div>
                    <div className="text-neutral-400 text-xs">Location</div>
                  </div>
                </div>
              </div>

              {/* Work Section */}
              <div className="border border-neutral-700 rounded-lg p-4">
                <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">Work</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-white text-sm mb-1">9:00 AM - 6:00 PM</div>
                    <div className="text-neutral-400 text-xs">Work Hours</div>
                  </div>
                  <div>
                    <div className="text-white text-sm mb-1">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                    <div className="text-neutral-400 text-xs">Local time</div>
                  </div>
                  <div>
                    <div className="text-white text-sm mb-1">{user.availability}</div>
                    <div className="text-neutral-400 text-xs">Status</div>
                  </div>
                  <div>
                    <div className="text-white text-sm mb-1">{user.department}</div>
                    <div className="text-neutral-400 text-xs">Department</div>
                  </div>
                  <div>
                    <div className="text-white text-sm mb-1">{new Date(user.joinDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-neutral-400 text-xs">Join Date</div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="border border-neutral-700 rounded-lg p-4">
                <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? user.skills.map((skill, index) => (
                    <span key={index} className="bg-neutral-700 text-white text-sm px-3 py-1 rounded">
                      {skill}
                    </span>
                  )) : (
                    <span className="text-neutral-400 text-sm">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default UserDetails;