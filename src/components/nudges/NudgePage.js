import React, { useState, useEffect } from 'react';
import NudgeCard from './NudgeCard';
import NudgeDetails from './NudgeDetails';
import CreateNudgeView from './CreateNudgeView';
import Sidebar from '../shared/Sidebar';
import FirstColumn from '../shared/FirstColumn';
import TopTabsNudges from './TopTabsNudges';
import LiveNotifications from '../shared/LiveNotifications';
import ActionBarNudges from './ActionBarNudges';
import UserDetails from '../dashboard/UserDetails';
import GroupNudgesView from './GroupNudgesView';
import { usersData } from '../../data/usersData';
import useNudgeStore from '../../store/nudgeStore';

// Dados fake dos nudges
const nudgesData = [
  {
    id: 'local-1',
    senderId: 'user-5',
    senderName: "Brent Short",
    senderTitle: "Product Manager",
    senderAvatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "I need you to help with me with a series of quick frontend fixes on our live web platform. These tasks are mostly UI/UX-related — things like layout adjustments, component bugs, and minor styling inconsistencies.",
    fullMessage: "I need you to help with me with a series of quick frontend fixes on our live web platform. These tasks are mostly UI/UX-related — things like layout adjustments, component bugs, and minor styling inconsistencies.\n\nWe are gonna be jumping into a codebase built with React + Next.js, styled with Tailwind CSS, and backed by a Node.js/Express API. The fixes are already documented with screenshots and steps attached.",
    timestamp: "1h",
    type: "message",
    isRead: false,
    priority: "high",
    isPinned: false,
    isHighPriority: false,
    attachments: [
      "DocumentationXPS.pdf",
      "PrintScreen1.png", 
      "PrintScreen2.png"
    ]
  },
  {
    id: 'local-2',
    senderId: 'user-6',
    senderName: "Lauren Potter",
    senderTitle: "Designer",
    senderAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "Great work on that presentation today! Could you share the final slides with the team?",
    fullMessage: "Great work on that presentation today! Could you share the final slides with the team? I think everyone would benefit from seeing the final version, especially the new design patterns we discussed.",
    timestamp: "1d",
    type: "message",
    isRead: true,
    priority: "normal",
    isPinned: false,
    isHighPriority: false,
    attachments: []
  },
  {
    id: 'local-3',
    senderId: 'user-7',
    senderName: "Marcus Chen",
    senderTitle: "Frontend Developer",
    senderAvatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "Quick question about the API integration - can we sync up tomorrow morning?",
    fullMessage: "Quick question about the API integration - can we sync up tomorrow morning? I'm running into some issues with the authentication flow and could use your expertise.",
    timestamp: "3d",
    type: "message",
    isRead: true,
    priority: "normal",
    isPinned: false,
    isHighPriority: false,
    attachments: []
  },
  {
    id: 'local-4',
    senderId: 'user-8',
    senderName: "Sarah Johnson",
    senderTitle: "Product Manager",
    senderAvatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "The client feedback is in! Let's review it together and plan next steps.",
    fullMessage: "The client feedback is in! Let's review it together and plan next steps. They have some great suggestions for improving the user experience.",
    timestamp: "5d",
    type: "message",
    isRead: true,
    priority: "high",
    isPinned: false,
    isHighPriority: false,
    attachments: []
  },
  {
    id: 'local-5',
    senderId: 'user-9',
    senderName: "Alex Rodriguez",
    senderTitle: "Backend Developer",
    senderAvatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "Database migration is scheduled for tonight. Need your approval on the rollback plan.",
    fullMessage: "Database migration is scheduled for tonight. Need your approval on the rollback plan. @Sarah Johnson, please review the migration steps. I've prepared all the necessary scripts and tested them in staging environment.",
    timestamp: "2h",
    type: "message",
    isRead: false,
    priority: "high",
    isPinned: false,
    isHighPriority: false,
    attachments: ["migration-plan.pdf"],
    todoLink: {
      title: "Approve database migration rollback plan",
      status: "Pending"
    }
  },
  {
    id: 'local-6',
    senderId: 'user-10',
    senderName: "Emma Wilson",
    senderTitle: "UX Designer",
    senderAvatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "User testing results are ready for review. Some interesting insights!",
    fullMessage: "User testing results are ready for review. Some interesting insights! @Sarah Johnson and @Mike Chen, please check the new navigation pattern results. The mobile experience needs attention from the dev team.",
    timestamp: "4h",
    type: "message",
    isRead: false,
    priority: "normal",
    isPinned: false,
    isHighPriority: false,
    attachments: ["user-testing-results.pdf", "mobile-issues.png"],
    todoLink: {
      title: "Review mobile UX improvements",
      status: "In Progress"
    }
  },
  {
    id: 'local-7',
    senderId: 'user-11',
    senderName: "David Kim",
    senderTitle: "Team Lead",
    senderAvatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "Poll: Which framework should we use for the new project?",
    fullMessage: "Poll: Which framework should we use for the new project? Please vote by end of week so we can start planning.",
    timestamp: "6h",
    type: "poll",
    isRead: false,
    priority: "normal",
    isPinned: false,
    isHighPriority: false,
    attachments: [],
    pollOptions: [
      { text: "React + Next.js", percentage: 45 },
      { text: "Vue.js + Nuxt", percentage: 25 },
      { text: "Angular", percentage: 15 },
      { text: "Svelte", percentage: 15 }
    ]
  },
  {
    id: 'local-8',
    senderId: 'user-12',
    senderName: "Jessica Brown",
    senderTitle: "HR Manager",
    senderAvatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    message: "Poll: Team lunch preferences for next Friday?",
    fullMessage: "Poll: Team lunch preferences for next Friday? Vote by Wednesday so I can make reservations!",
    timestamp: "1d",
    type: "poll",
    isRead: true,
    priority: "normal",
    isPinned: false,
    isHighPriority: false,
    attachments: [],
    pollOptions: [
      { text: "Italian Restaurant", percentage: 30 },
      { text: "Sushi Place", percentage: 25 },
      { text: "Mexican Food", percentage: 20 },
      { text: "Pizza", percentage: 15 },
      { text: "Healthy Salads", percentage: 10 }
    ]
  }
];

function NudgePage({ onNavigate }) {
  // Estado global dos nudges
  const { 
    nudges, 
    selectedNudgeId, 
    setSelectedNudge, 
    markAsRead,
    markAsUnread: storeMarkAsUnread,
    togglePin: storeTogglePin,
    markAsResolved: storeMarkAsResolved,
    togglePriority: storeTogglePriority
  } = useNudgeStore();
  
  // Estados locais
  const [localNudges, setLocalNudges] = useState(nudgesData);
  const [usersWithIcons, setUsersWithIcons] = useState([]);
  const [sortBy, setSortBy] = useState('Sender');
  const [topTabActive, setTopTabActive] = useState('all');
  const [isCreatingNudge, setIsCreatingNudge] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previousView, setPreviousView] = useState(null); // Para controlar o estado anterior

  // Função para gerar ícones aleatórios
  const generateRandomIcons = () => {
    const allIcons = [
      'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
      'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg',
      'https://cdn.worldvectorlogo.com/logos/jira-1.svg',
      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg',
      'https://www.svgrepo.com/show/353597/confluence.svg',
      'https://www.svgrepo.com/show/354463/trello.svg'
    ];
    
    const iconCount = Math.floor(Math.random() * 6);
    if (iconCount === 0) return [];
    
    const shuffled = [...allIcons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, iconCount);
  };

  // Gerar ícones uma única vez no carregamento
  useEffect(() => {
    const usersWithRandomIcons = usersData.map(user => ({
      ...user,
      randomIcons: generateRandomIcons()
    }));
    setUsersWithIcons(usersWithRandomIcons);
  }, []);

  // Função para selecionar nudge - agora usa o store global
  const handleNudgeSelect = (nudge) => {
    setSelectedNudge(nudge.id);
    
    // Marcar como lido apenas se não estiver lido
    if (!nudge.isRead) {
      // Check if it's a store nudge or local nudge
      const isStoreNudge = nudges.some(n => n.id === nudge.id);
      
      if (isStoreNudge) {
        markAsRead(nudge.id);
      } else {
        setLocalNudges(prev => prev.map(n => 
          n.id === nudge.id 
            ? { ...n, isRead: true }
            : n
        ));
      }
    }
  };

  // Obter o nudge selecionado do store global ou dos dados locais
  const selectedNudge = selectedNudgeId 
    ? [...nudges, ...localNudges].find(n => n.id === selectedNudgeId)
    : localNudges[0]; // Fallback para o primeiro nudge local

  // Função para lidar com mudança de ordenação
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Função para selecionar usuário da busca
  const handleUserSelect = (user) => {
    console.log('User selected:', user);
  };

  // Combinar nudges globais e locais
  const allNudges = [...nudges, ...localNudges];

  // Função para iniciar criação de nudge
  const handleCreateNudge = () => {
    setIsCreatingNudge(true);
  };

  // Função para cancelar criação de nudge
  const handleCancelCreateNudge = () => {
    setIsCreatingNudge(false);
  };

  // Função para navegar para UserDetails
  const handleUserClick = (user) => {
    // Salvar o estado atual antes de navegar
    setPreviousView({
      isCreatingNudge,
      selectedNudgeId
    });
    setSelectedUser(user);
    setIsCreatingNudge(false);
    setSelectedNudge(null);
  };

  // Função para voltar do UserDetails
  const handleBackFromUserDetails = () => {
    setSelectedUser(null);
    // Restaurar o estado anterior
    if (previousView) {
      setIsCreatingNudge(previousView.isCreatingNudge);
      setSelectedNudge(previousView.selectedNudgeId);
      setPreviousView(null);
    }
  };

  // Função para criar nudge para grupo
  const handleCreateGroupNudge = (group) => {
    console.log('Creating nudge for group:', group);
    setIsCreatingNudge(true);
    setSelectedNudge(null);
    // Aqui você pode adicionar lógica adicional para pré-preencher o formulário com o grupo selecionado
  };

  // Quick action: Create todo from nudge
  const handleCreateTodoFromNudge = (nudge) => {
    // Create a new todo based on the nudge
    const newTodo = {
      id: Date.now(),
      text: `Follow up: ${nudge.message.substring(0, 50)}...`,
      completed: false,
      starred: false,
      createdFrom: 'nudge',
      sourceNudgeId: nudge.id,
      assignedBy: nudge.senderName,
      priority: nudge.priority,
      createdAt: new Date().toISOString()
    };
    
    // Here you would typically add this to your todos state/context
    console.log('Creating todo from nudge:', newTodo);
    
    // Show success feedback
    alert(`Todo created: "${newTodo.text}"`);
  };

  // Quick action: Mark nudge as complete
  const handleMarkNudgeComplete = (nudge) => {
    setLocalNudges(prev => prev.map(n => 
      n.id === nudge.id 
        ? { ...n, isCompleted: true, completedAt: new Date().toISOString() }
        : n
    ));
    
    console.log('Marked nudge as complete:', nudge.id);
  };

  // Quick action: Reply to nudge
  const handleReplyToNudge = (nudge) => {
    // This would typically open a reply modal or navigate to a reply view
    console.log('Replying to nudge:', nudge.id);
    alert(`Opening reply to ${nudge.senderName}`);
  };

  // Quick action: Snooze nudge
  const handleSnoozeNudge = (nudge) => {
    const snoozeUntil = new Date();
    snoozeUntil.setHours(snoozeUntil.getHours() + 1); // Snooze for 1 hour
    
    setLocalNudges(prev => prev.map(n => 
      n.id === nudge.id 
        ? { ...n, isSnoozed: true, snoozeUntil: snoozeUntil.toISOString() }
        : n
    ));
    
    console.log('Snoozed nudge:', nudge.id);
    alert('Nudge snoozed for 1 hour');
  };

  // Quick action: Archive nudge
  const handleArchiveNudge = (nudge) => {
    setLocalNudges(prev => prev.map(n => 
      n.id === nudge.id 
        ? { ...n, isArchived: true, archivedAt: new Date().toISOString() }
        : n
    ));
    
    console.log('Archived nudge:', nudge.id);
  };

  // Dropdown actions: Mark as read
  const handleMarkRead = (nudgeId) => {
    // Check if it's a store nudge or local nudge
    const isStoreNudge = nudges.some(n => n.id === nudgeId);
    
    if (isStoreNudge) {
      markAsRead(nudgeId);
    } else {
      setLocalNudges(prev => prev.map(n => 
        n.id === nudgeId 
          ? { ...n, isRead: true }
          : n
      ));
    }
    console.log('Marked as read nudge:', nudgeId);
  };

  // Dropdown actions: Mark as unread
  const handleMarkAsUnread = (nudgeId) => {
    // Check if it's a store nudge or local nudge
    const isStoreNudge = nudges.some(n => n.id === nudgeId);
    
    if (isStoreNudge) {
      storeMarkAsUnread(nudgeId);
    } else {
      setLocalNudges(prev => prev.map(n => 
        n.id === nudgeId 
          ? { ...n, isRead: false }
          : n
      ));
    }
    console.log('Marked nudge as unread:', nudgeId);
  };

  // Dropdown actions: Pin/Unpin nudge
  const handlePinNudge = (nudgeId) => {
    // Check if it's a store nudge or local nudge
    const isStoreNudge = nudges.some(n => n.id === nudgeId);
    
    if (isStoreNudge) {
      storeTogglePin(nudgeId);
    } else {
      setLocalNudges(prev => prev.map(n => 
        n.id === nudgeId 
          ? { 
              ...n, 
              isPinned: !n.isPinned,
              pinnedAt: !n.isPinned ? new Date().toISOString() : null
            }
          : n
      ));
    }
    console.log('Toggled pin for nudge:', nudgeId);
  };

  // Dropdown actions: Mark as resolved (only for unread nudges)
  const handleMarkAsResolved = (nudgeId) => {
    // Check if it's a store nudge or local nudge
    const isStoreNudge = nudges.some(n => n.id === nudgeId);
    
    if (isStoreNudge) {
      storeMarkAsResolved(nudgeId);
    } else {
      setLocalNudges(prev => prev.map(n => 
        n.id === nudgeId 
          ? { ...n, isRead: true, isResolved: true, resolvedAt: new Date().toISOString() }
          : n
      ));
    }
    console.log('Marked nudge as resolved:', nudgeId);
  };

  // Dropdown actions: Mark as priority
  const handleMarkPriority = (nudgeId) => {
    // Check if it's a store nudge or local nudge
    const isStoreNudge = nudges.some(n => n.id === nudgeId);
    
    if (isStoreNudge) {
      storeTogglePriority(nudgeId);
    } else {
      setLocalNudges(prev => prev.map(n => 
        n.id === nudgeId 
          ? { ...n, isHighPriority: !n.isHighPriority }
          : n
      ));
    }
    console.log('Toggled priority for nudge:', nudgeId);
  };

  // Função para filtrar nudges por aba
  const getFilteredNudges = () => {
    switch (topTabActive) {
      case 'unread':
        return allNudges.filter(nudge => !nudge.isRead);
      case 'priority':
        return allNudges.filter(nudge => nudge.isHighPriority || nudge.priority === 'high');
      case 'polls':
        return allNudges.filter(nudge => nudge.type === 'poll');
      case 'all':
      default:
        return allNudges;
    }
  };

  // Função para ordenar nudges
  const getSortedNudges = () => {
    let sortedNudges = [...getFilteredNudges()];
    
    // Primeiro, aplicar a ordenação escolhida pelo usuário
    switch (sortBy) {
      case 'Sender':
        sortedNudges.sort((a, b) => a.senderName.localeCompare(b.senderName));
        break;
      case 'Type':
        sortedNudges.sort((a, b) => {
          const typeA = a.type || 'message';
          const typeB = b.type || 'message';
          return typeA.localeCompare(typeB);
        });
        break;
      case 'Priority':
        sortedNudges.sort((a, b) => {
          // Primeiro ordenar por isHighPriority, depois por priority
          if (a.isHighPriority && !b.isHighPriority) return -1;
          if (!a.isHighPriority && b.isHighPriority) return 1;
          
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          const priorityA = priorityOrder[a.priority] || 2;
          const priorityB = priorityOrder[b.priority] || 2;
          return priorityB - priorityA;
        });
        break;
      default:
        // Mantém ordem original
        break;
    }
    
    // Separar nudges pinned e não pinned
    const pinnedNudges = sortedNudges.filter(nudge => nudge.isPinned);
    const unpinnedNudges = sortedNudges.filter(nudge => !nudge.isPinned);
    
    // Ordenar pinned nudges para que o último pinned fique primeiro
    pinnedNudges.sort((a, b) => {
      if (a.pinnedAt && b.pinnedAt) {
        return new Date(b.pinnedAt) - new Date(a.pinnedAt);
      }
      return String(b.id).localeCompare(String(a.id));
    });
    
    // Retornar pinned primeiro, depois unpinned
    return [...pinnedNudges, ...unpinnedNudges];
  };

  return (
    <div className="min-h-screen bg-neutral-900 pr-6">
      <div className="flex gap-4 h-screen">
        {/* Primeira coluna: 60px */}
        <div className="h-full" style={{ width: '60px' }}>
          <FirstColumn />
        </div>

        {/* Segunda coluna: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="nudges" onNavigate={onNavigate} />
        </div>

        {/* Terceira coluna: flex-1 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Primeira linha: 3 divs retangulares */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabsNudges activeTab={topTabActive} setActiveTab={setTopTabActive} />
            <LiveNotifications 
              usersData={usersWithIcons}
              onUserClick={handleUserSelect}
            />
            <ActionBarNudges 
              onUserSelect={handleUserSelect} 
              onSortChange={handleSortChange}
              onCreateNudge={handleCreateNudge}
            />
          </div>

          {/* Segunda linha: Grid de nudges e coluna direita */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Grid de nudges */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                {getSortedNudges().map((nudge) => (
                  <NudgeCard 
                    key={nudge.id} 
                    nudge={nudge}
                    isSelected={selectedNudge?.id === nudge.id}
                    onClick={() => handleNudgeSelect(nudge)}
                    onCreateTodo={handleCreateTodoFromNudge}
                    onMarkComplete={handleMarkNudgeComplete}
                    onReply={handleReplyToNudge}
                    onSnooze={handleSnoozeNudge}
                    onArchive={handleArchiveNudge}
                    onMarkRead={handleMarkRead}
                    onMarkUnread={handleMarkAsUnread}
                    onPinNudge={handlePinNudge}
                    onMarkResolved={handleMarkAsResolved}
                    onMarkPriority={handleMarkPriority}
                  />
                ))}
              </div>
            </div>

            {/* Coluna direita - Detalhes do nudge, criação de nudge ou detalhes do usuário */}
            <div className="overflow-y-auto pb-12" style={{ width: '350px' }}>
              {selectedUser ? (
                <UserDetails 
                  user={selectedUser}
                  onBack={handleBackFromUserDetails}
                />
              ) : isCreatingNudge ? (
                <CreateNudgeView onCancel={handleCancelCreateNudge} />
              ) : selectedNudge ? (
                <NudgeDetails 
                  nudge={selectedNudge}
                  onUserClick={handleUserClick}
                  onUpdate={(updatedNudge) => {
                    setLocalNudges(prev => prev.map(n => 
                      n.id === updatedNudge.id ? updatedNudge : n
                    ));
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Selecione um nudge para ver os detalhes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NudgePage;