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

// Dados fake dos nudges
const nudgesData = [
  {
    id: 1,
    sender: {
      name: "Brent Short",
      title: "Product Manager",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "online"
    },
    message: "I need you to help with me with a series of quick frontend fixes on our live web platform. These tasks are mostly UI/UX-related — things like layout adjustments, component bugs, and minor styling inconsistencies.",
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
  },
  {
    id: 5,
    sender: {
      name: "Alex Rodriguez",
      title: "Backend Developer",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "online"
    },
    message: "Database migration is scheduled for tonight. Need your approval on the rollback plan.",
    fullMessage: "Database migration is scheduled for tonight. Need your approval on the rollback plan. I've prepared all the necessary scripts and tested them in staging environment.",
    timestamp: "2h",
    isRead: false,
    priority: "high",
    attachments: ["migration-plan.pdf"]
  },
  {
    id: 6,
    sender: {
      name: "Emma Wilson",
      title: "UX Designer",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      status: "away"
    },
    message: "User testing results are ready for review. Some interesting insights!",
    fullMessage: "User testing results are ready for review. Some interesting insights! The new navigation pattern is performing much better than expected, but we found some issues with the mobile experience.",
    timestamp: "4h",
    isRead: false,
    priority: "normal",
    attachments: ["user-testing-results.pdf", "mobile-issues.png"]
  }
];

function NudgePage({ onNavigate }) {
  const [selectedNudge, setSelectedNudge] = useState(null);
  const [nudges, setNudges] = useState(nudgesData);
  const [usersWithIcons, setUsersWithIcons] = useState([]);
  const [sortBy, setSortBy] = useState('Recent');
  const [topTabActive, setTopTabActive] = useState('received');
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
    
    // Selecionar o primeiro nudge por padrão
    if (nudgesData.length > 0) {
      setSelectedNudge(nudgesData[0]);
      // Marcar como lido
      setNudges(prev => prev.map(nudge => 
        nudge.id === nudgesData[0].id ? { ...nudge, isRead: true } : nudge
      ));
    }
  }, []);

  // Função para selecionar nudge
  const handleNudgeSelect = (nudge) => {
    setSelectedNudge(nudge);
    // Marcar como lido
    setNudges(prev => prev.map(n => 
      n.id === nudge.id ? { ...n, isRead: true } : n
    ));
  };

  // Função para lidar com mudança de ordenação
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Função para selecionar usuário da busca
  const handleUserSelect = (user) => {
    console.log('User selected:', user);
  };

  // Função para iniciar criação de nudge
  const handleCreateNudge = () => {
    setIsCreatingNudge(true);
    setSelectedNudge(null); // Limpar seleção de nudge
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
      selectedNudge
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
      setSelectedNudge(previousView.selectedNudge);
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

  // Função para ordenar nudges
  const getSortedNudges = () => {
    let sortedNudges = [...nudges];
    
    switch (sortBy) {
      case 'Priority':
        sortedNudges.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case 'Alphabetical (A-Z)':
        sortedNudges.sort((a, b) => a.sender.name.localeCompare(b.sender.name));
        break;
      case 'Alphabetical (Z-A)':
        sortedNudges.sort((a, b) => b.sender.name.localeCompare(a.sender.name));
        break;
      default:
        // Para 'Recent' mantém ordem original (mais recentes primeiro)
        break;
    }
    
    return sortedNudges;
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
            {/* Grid de nudges ou grupos */}
            <div className="flex-1 overflow-y-auto">
              {topTabActive === 'groups' ? (
                <GroupNudgesView 
                  users={usersWithIcons}
                  onCreateGroupNudge={handleCreateGroupNudge}
                />
              ) : (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                  {getSortedNudges().map((nudge) => (
                    <NudgeCard 
                      key={nudge.id} 
                      nudge={nudge}
                      isSelected={selectedNudge?.id === nudge.id}
                      onClick={() => handleNudgeSelect(nudge)} 
                    />
                  ))}
                </div>
              )}
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
              ) : selectedNudge && topTabActive !== 'groups' ? (
                <NudgeDetails 
                  nudge={selectedNudge}
                  onUserClick={handleUserClick}
                  onUpdate={(updatedNudge) => {
                    setNudges(prev => prev.map(n => 
                      n.id === updatedNudge.id ? updatedNudge : n
                    ));
                    setSelectedNudge(updatedNudge);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {topTabActive === 'groups' 
                    ? 'Select a group to send a nudge' 
                    : 'Selecione um nudge para ver os detalhes'
                  }
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