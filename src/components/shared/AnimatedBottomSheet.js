import React, { useState, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { 
  Zap,
  ChevronUp,
  Search,
  Send,
  Save,
  Paperclip,
  Link,
  X,
  ArrowLeft,
  Check,
  ThumbsUp,
  FileText
} from 'lucide-react';
import useNudgeStore from '../../store/nudgeStore';

// Usuários fake para pesquisa
const searchableUsers = [
  { id: 101, name: "Ana Silva", title: "Designer", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 102, name: "Carlos Santos", title: "Developer", avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "away" },
  { id: 103, name: "Maria Costa", title: "Product Manager", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 104, name: "João Oliveira", title: "Backend Dev", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "offline" },
  { id: 105, name: "Fernanda Lima", title: "Data Scientist", avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 106, name: "Pedro Alves", title: "DevOps", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "away" },
  { id: 107, name: "Lucia Ferreira", title: "QA Engineer", avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 108, name: "Rafael Souza", title: "Security", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" }
];

// Nudges recebidos fake
const receivedNudges = [
  {
    id: 1,
    sender: {
      name: "Brent Short",
      title: "Product Manager",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "online"
    },
    message: "I need you to help with me with a series of quick frontend fixes on our live web platform. These tasks are mostly UI/UX-related — things like layout adjustments, component bugs, and minor styling inconsistencies.\n\nWe are gonna be jumping into a codebase built with React + Next.js, styled with Tailwind CSS, and backed by a Node.js/Express API. The fixes are already documented with screenshots and steps attached.",
    fullMessage: "I need you to help with me with a series of quick frontend fixes on our live web platform. These tasks are mostly UI/UX-related — things like layout adjustments, component bugs, and minor styling inconsistencies.\n\nWe are gonna be jumping into a codebase built with React + Next.js, styled with Tailwind CSS, and backed by a Node.js/Express API. The fixes are already documented with screenshots and steps attached.",
    timestamp: "1h",
    isRead: false,
    priority: "high",
    attachments: [
      "DocumentationXPS.pdf",
      "PrintScreen1.png", 
      "PrintScreen2.png"
    ]
  },
  {
    id: 2,
    sender: {
      name: "Lauren Potter",
      title: "Designer",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "online"
    },
    message: "Great work on that presentation today! Could you share the final slides with the team?",
    fullMessage: "Great work on that presentation today! Could you share the final slides with the team? I think everyone would benefit from seeing the final version, especially the new design patterns we discussed.",
    timestamp: "1d",
    isRead: true,
    priority: "normal",
    attachments: []
  },
  {
    id: 3,
    sender: {
      name: "Marcus Chen",
      title: "Frontend Developer",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "away"
    },
    message: "Quick question about the API integration - can we sync up tomorrow morning?",
    fullMessage: "Quick question about the API integration - can we sync up tomorrow morning? I'm running into some issues with the authentication flow and could use your expertise.",
    timestamp: "3d",
    isRead: true,
    priority: "normal",
    attachments: []
  },
  {
    id: 4,
    sender: {
      name: "Sarah Johnson",
      title: "Product Manager",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "online"
    },
    message: "The client feedback is in! Let's review it together and plan next steps.",
    fullMessage: "The client feedback is in! Let's review it together and plan next steps. They have some great suggestions for improving the user experience.",
    timestamp: "5d",
    isRead: true,
    priority: "high",
    attachments: []
  }
];

const AnimatedBottomSheet = ({
  activeTab,
  setActiveTab,
  selectedUsers,
  setSelectedUsers,
  message,
  setMessage,
  toggleUserSelection,
  removeSelectedUser
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [nudges, setNudges] = useState(receivedNudges);
  const [selectedNudge, setSelectedNudge] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'detail'
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replies, setReplies] = useState([
    {
      id: 1,
      message: "Sure, I can help with those frontend fixes! When do you need them completed?",
      timestamp: "2:30 PM",
      date: "Today",
      isFromMe: true
    },
    {
      id: 2,
      message: "Great! I'd like to have them done by end of week if possible. Let me know if you need any clarification on the requirements.",
      timestamp: "2:35 PM",
      date: "Today",
      isFromMe: false
    },
    {
      id: 3,
      message: "Perfect timing! I'll start working on them tomorrow morning and should have everything ready by Friday.",
      timestamp: "9:15 AM",
      date: "Yesterday",
      isFromMe: true
    }
  ]);

  // Função para enviar resposta
  const handleSendReply = () => {
    if (replyMessage.trim()) {
      const newReply = {
        id: replies.length + 1,
        message: replyMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        isFromMe: true
      };
      setReplies([...replies, newReply]);
      setReplyMessage('');
    }
  };

  // Função para "Won't be able"
  const handleWontBeAble = () => {
    setShowReschedule(true);
  };

  // Função para confirmar reagendamento
  const handleConfirmReschedule = () => {
    if (selectedDate && selectedTimeRange) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowReschedule(false);
        setSelectedDate('');
        setSelectedTimeRange('');
        setViewMode('list');
        setSelectedNudge(null);
      }, 2000);
    }
  };

  // Função para voltar do reagendamento
  const backFromReschedule = () => {
    setShowReschedule(false);
    setSelectedDate('');
    setSelectedTimeRange('');
  };

  // Função para marcar nudge como lido
  const markAsRead = (nudgeId) => {
    setNudges(prev => prev.map(nudge => 
      nudge.id === nudgeId ? { ...nudge, isRead: true } : nudge
    ));
  };

  // Store global
  const { 
    nudges: globalNudges, 
    setSelectedNudge: setGlobalSelectedNudge, 
    openLeftPanel,
    markAsRead: globalMarkAsRead
  } = useNudgeStore();

  // Função para abrir visualização do nudge
  const openNudgeDetail = (nudge) => {
    // Definir no store global e abrir painel secundário
    setGlobalSelectedNudge(nudge.id);
    openLeftPanel();
    globalMarkAsRead(nudge.id);
  };

  // Função para voltar à lista de nudges
  const backToNudgeList = () => {
    setViewMode('list');
    setSelectedNudge(null);
  };

  // Contar nudges não lidos
  const unreadCount = globalNudges.filter(nudge => !nudge.isRead).length;

  // Filtrar usuários baseado na pesquisa
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return searchableUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Função para adicionar usuário da pesquisa
  const addUserFromSearch = (user) => {
    const isAlreadySelected = selectedUsers.find(u => u.id === user.id);
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm(''); // Limpar pesquisa após adicionar
  };

  // Calcular altura dinâmica baseada no conteúdo
  const calculateDynamicHeight = () => {
    if (!isOpen) return 60;
    
    let baseHeight = 470; // altura mínima ajustada para 470px
    
    // Adicionar altura para usuários selecionados
    if (selectedUsers.length > 0) {
      const userRows = Math.ceil(selectedUsers.length / 3); // assumindo 3 por linha
      baseHeight += userRows * 40 + 16; // altura dos cards + espaçamento
    }
    
    // Limitar a altura máxima a 700px
    return Math.min(baseHeight, 700);
  };

  // Animação para o container principal
  const containerAnimation = useSpring({
    height: calculateDynamicHeight(),
    width: 350,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: isOpen ? 16 : 0,
    borderBottomRightRadius: isOpen ? 16 : 0,
    config: { tension: 300, friction: 30 }
  });

  // Animação para o conteúdo
  const contentAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    translateY: isOpen ? 0 : 20,
    config: { tension: 300, friction: 30 }
  });

  // Animação para o floating button
  const buttonAnimation = useSpring({
    opacity: isOpen ? 0 : 1,
    translateY: isOpen ? 20 : 0,
    config: { tension: 300, friction: 30 }
  });

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-0 right-6 z-40">
      <animated.div
        style={containerAnimation}
        className="bg-neutral-800 border border-neutral-700 shadow-2xl overflow-hidden"
      >
        {/* Floating Button Content */}
        <animated.div
          style={{
            ...buttonAnimation,
            transform: buttonAnimation.translateY.to(y => `translateY(${y}px)`)
          }}
          className={`${isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
        >
          <button
            onClick={toggleOpen}
            className="w-full h-full flex items-center hover:bg-neutral-700 text-white px-4 py-3 transition-all duration-200"
            aria-label="Abrir Nudges"
          >
            {/* Icon with Badge and Title grouped */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </div>
              </div>
              <span className="text-base font-medium text-white">Nudges</span>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="p-1.5 text-gray-300 hover:text-white transition-colors">
                <ChevronUp className="h-4 w-4" />
              </div>
            </div>
          </button>
        </animated.div>

        {/* Bottom Sheet Content */}
        <animated.div
          style={{
            ...contentAnimation,
            transform: contentAnimation.translateY.to(y => `translateY(${y}px)`)
          }}
          className={`absolute inset-0 p-4 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {activeTab === 'received' && viewMode === 'detail' && selectedNudge ? (
                <>
                  <button
                    onClick={backToNudgeList}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={selectedNudge.senderAvatar}
                      alt={selectedNudge.senderName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-800 bg-green-500`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedNudge.senderName}</h2>
                    <p className="text-neutral-400 text-sm">{selectedNudge.timestamp}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Nudges</h2>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {activeTab === 'received' && viewMode === 'detail' && (
                <button className="p-1 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              )}
              <button
                onClick={toggleOpen}
                className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 flex-1 overflow-visible" style={{ maxHeight: 'calc(100% - 80px)' }}>
            {/* Tabs - ocultas quando estiver na visualização detalhada */}
            {viewMode === 'list' && (
              <div className="flex space-x-2 bg-neutral-900 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('send')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'send'
                      ? 'bg-neutral-700 text-white'
                      : 'bg-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Send
                </button>
                <button
                  onClick={() => setActiveTab('received')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'received'
                      ? 'bg-neutral-700 text-white'
                      : 'bg-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span>Received</span>
                  {unreadCount > 0 && (
                    <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold leading-none">{unreadCount}</span>
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Conteúdo condicional baseado no modo de visualização */}
            {viewMode === 'detail' ? (
              /* Visualização detalhada do nudge */
              <div className="space-y-6 max-h-96 px-1" data-simplebar>
                {/* Original Message */}
                {!showReschedule && !showSuccess && (
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 mb-4">
                    <div className="text-white text-base leading-relaxed">
                      {selectedNudge?.fullMessage || selectedNudge?.message}
                    </div>
                    
                    {/* Attachments */}
                    {selectedNudge?.attachments && selectedNudge.attachments.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <h4 className="text-white text-sm font-medium">Attachments</h4>
                        <div className="space-y-2">
                          {selectedNudge.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-colors cursor-pointer"
                            >
                              <FileText className="h-5 w-5 text-neutral-400" />
                              <span className="text-white text-sm flex-1">{attachment.name || attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Replies Section */}
                {!showReschedule && !showSuccess && (
                  <div className="space-y-4">
                    <h4 className="text-white text-sm font-medium border-b border-neutral-700 pb-2">Replies</h4>
                    <div className="space-y-3 max-h-48" data-simplebar>
                      {replies.map((reply, index) => {
                        const showDate = index === 0 || replies[index - 1].date !== reply.date;
                        return (
                          <div key={reply.id}>
                            {showDate && (
                              <div className="text-center text-xs text-neutral-500 my-2">
                                {reply.date}
                              </div>
                            )}
                            <div className={`flex ${reply.isFromMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-3 py-2 border border-neutral-700 ${
                                reply.isFromMe 
                                  ? 'bg-neutral-800 rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                                  : 'bg-neutral-900 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                              }`}>
                                <p className="text-white text-sm">{reply.message}</p>
                                <p className="text-xs text-neutral-400 mt-1">{reply.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-neutral-700">
                      <button className="w-full flex items-center justify-center space-x-2 h-12 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors">
                        <ThumbsUp className="h-5 w-5 text-white" />
                        <span className="text-white font-medium">Add to my To-Do</span>
                      </button>
                    </div>
                    
                    {/* Reply Input */}
                    <div className="flex space-x-2 pt-3">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 bg-transparent border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim()}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          replyMessage.trim()
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600'
                            : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Reschedule and Success states remain the same */}
                {showSuccess && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Reschedule Request Sent!</h3>
                    <p className="text-neutral-400 text-sm">Your alternative time suggestion has been sent successfully.</p>
                  </div>
                )}

                {showReschedule && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <button
                        onClick={backFromReschedule}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h3 className="text-white text-lg font-medium">Suggest Alternative Time</h3>
                    </div>
                    
                    <div className="space-y-3 px-1">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Select Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-neutral-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Select Time Range</label>
                        <select
                          value={selectedTimeRange}
                          onChange={(e) => setSelectedTimeRange(e.target.value)}
                          className="w-full border border-neutral-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        >
                          <option value="">Choose a time range</option>
                          <option value="morning">Morning (9:00 - 12:00)</option>
                          <option value="afternoon">Afternoon (13:00 - 17:00)</option>
                          <option value="evening">Evening (18:00 - 21:00)</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleConfirmReschedule}
                        disabled={!selectedDate || !selectedTimeRange}
                        className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors ${
                          selectedDate && selectedTimeRange
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600'
                            : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="h-5 w-5" />
                        <span className="font-medium">Send Alternative Time</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Conteúdo das tabs quando no modo lista */
              activeTab === 'send' ? (
                <>
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for team member..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    
                    {/* Search Results */}
                    {filteredUsers.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 max-h-48" data-simplebar>
                        {filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => addUserFromSearch(user)}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-neutral-700 transition-colors text-left"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium">{user.name}</div>
                              <div className="text-neutral-400 text-xs">{user.title}</div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              user.status === 'online' ? 'bg-green-500' : 
                              user.status === 'away' ? 'bg-orange-500' : 'bg-gray-500'
                            }`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Users */}
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 bg-neutral-700 rounded-lg px-3 py-2"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-white text-sm">{user.name}</span>
                          <button
                            onClick={() => removeSelectedUser(user.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="space-y-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                      rows={4}
                    />

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button className="flex items-center justify-center space-x-2 w-1/2 h-9 bg-transparent border border-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent">
                        <Paperclip className="h-4 w-4 text-neutral-400" />
                        <span className="text-gray-300 text-sm">Attach files</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 w-1/2 h-9 bg-transparent border border-neutral-700 hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent">
                        <Link className="h-4 w-4 text-neutral-400" />
                        <span className="text-gray-300 text-sm">Add links</span>
                      </button>
                    </div>

                    {/* Save as Draft Button */}
                    <button
                      disabled={!message.trim() && selectedUsers.length === 0}
                      className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent ${
                        !message.trim() && selectedUsers.length === 0
                          ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                          : 'bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-neutral-500'
                      }`}
                    >
                      <Save className={`h-5 w-5 ${
                        !message.trim() && selectedUsers.length === 0 ? 'text-neutral-400' : 'text-neutral-300'
                      }`} />
                      <span className={`font-medium ${
                        !message.trim() && selectedUsers.length === 0 ? 'text-neutral-400' : 'text-neutral-300'
                      }`}>
                        Save as Draft
                      </span>
                    </button>

                    {/* Send Button */}
                    <button
                      disabled={!message.trim() || selectedUsers.length === 0}
                      className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
                        !message.trim() || selectedUsers.length === 0
                          ? 'bg-neutral-700 cursor-not-allowed'
                          : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-600'
                      }`}
                    >
                      <Send className={`h-5 w-5 ${
                        !message.trim() || selectedUsers.length === 0 ? 'text-neutral-400' : 'text-white'
                      }`} />
                      <span className={`font-medium ${
                        !message.trim() || selectedUsers.length === 0 ? 'text-neutral-400' : 'text-white'
                      }`}>Send Nudge</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Tab Received */
                <div className="space-y-3 max-h-96" data-simplebar>
                  {globalNudges.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-neutral-400 text-sm">No nudges received yet</div>
                    </div>
                  ) : (
                    globalNudges.map((nudge) => (
                      <div
                        key={nudge.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer hover:bg-neutral-700 ${
                          nudge.isRead 
                            ? 'bg-neutral-800 border-neutral-700' 
                            : 'bg-neutral-700 border-neutral-600 shadow-sm'
                        }`}
                        onClick={() => openNudgeDetail(nudge)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar com status indicator */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={nudge.senderAvatar}
                              alt={nudge.senderName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-800 bg-green-500" />
                          </div>

                          {/* Conteúdo da mensagem */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-medium ${
                                nudge.isRead ? 'text-neutral-300' : 'text-white'
                              }`}>
                                {nudge.senderName}
                              </h4>
                              <span className="text-xs text-neutral-400 flex-shrink-0">
                                {nudge.timestamp}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <p className={`text-sm ${
                                nudge.isRead ? 'text-neutral-400' : 'text-neutral-200'
                              } truncate flex-1`}>
                                {nudge.message}
                              </p>
                              {!nudge.isRead && (
                                <div className="ml-3 w-4 h-4 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold leading-none">1</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )
            )}
          </div>
        </animated.div>
      </animated.div>
    </div>
  );
};

export default AnimatedBottomSheet;