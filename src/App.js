import React, { useState, useEffect } from 'react';
import UserCard from './components/UserCard';
import UserDetails from './components/UserDetails';
import Schedule from './components/Schedule';
import StatusGroupView from './components/StatusGroupView';
import StatusGroupDetails from './components/StatusGroupDetails';
import RoleGroupView from './components/RoleGroupView';
import RoleGroupDetails from './components/RoleGroupDetails';
import UserGroupsView from './components/UserGroupsView';
import UserGroupDetails from './components/UserGroupDetails';
import AnimatedBottomSheet from './components/AnimatedBottomSheet';
import Sidebar from './components/Sidebar';
import FirstColumn from './components/FirstColumn';
import TopTabs from './components/TopTabs';
import LiveNotifications from './components/LiveNotifications';
import ActionBar from './components/ActionBar';
import { usersData } from './data/usersData';

function App() {
  const [rightPanelContent, setRightPanelContent] = useState('schedule');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedRoleGroup, setSelectedRoleGroup] = useState(null);
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);
  const [previousContext, setPreviousContext] = useState(null); // Para rastrear contexto anterior
  const [usersWithIcons, setUsersWithIcons] = useState([]);
  const [sortBy, setSortBy] = useState('Recent Activity');
  const [topTabActive, setTopTabActive] = useState('overview');
  
  // Estados para o Bottom Sheet
  const [activeTab, setActiveTab] = useState('send');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');

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
    
    // Randomizar quantidade de ícones (0 a 5)
    const iconCount = Math.floor(Math.random() * 6);
    
    if (iconCount === 0) {
      return [];
    }
    
    // Embaralhar e pegar a quantidade desejada
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

  const showUserDetails = (user) => {
    // Salvar contexto anterior antes de mostrar detalhes do usuário
    if (rightPanelContent === 'group' && selectedGroup) {
      setPreviousContext({ type: 'group', data: selectedGroup });
    } else if (rightPanelContent === 'roleGroup' && selectedRoleGroup) {
      setPreviousContext({ type: 'roleGroup', data: selectedRoleGroup });
    } else if (rightPanelContent === 'userGroup' && selectedUserGroup) {
      setPreviousContext({ type: 'userGroup', data: selectedUserGroup });
    } else {
      setPreviousContext({ type: 'schedule', data: null });
    }
    
    setSelectedUser(user);
    setRightPanelContent('userDetails');
  };

  const showSchedule = () => {
    setSelectedUser(null);
    setRightPanelContent('schedule');
  };

  // Nova função para voltar dos detalhes do usuário
  const goBackFromUserDetails = () => {
    setSelectedUser(null);
    
    if (previousContext) {
      if (previousContext.type === 'group') {
        setSelectedGroup(previousContext.data);
        setRightPanelContent('group');
      } else if (previousContext.type === 'roleGroup') {
        setSelectedRoleGroup(previousContext.data);
        setRightPanelContent('roleGroup');
      } else if (previousContext.type === 'userGroup') {
        setSelectedUserGroup(previousContext.data);
        setRightPanelContent('userGroup');
      } else {
        setRightPanelContent('schedule');
      }
      setPreviousContext(null);
    } else {
      setRightPanelContent('schedule');
    }
  };

  // Função para selecionar usuário da busca
  const handleUserSelect = (user) => {
    // Encontrar o usuário completo com ícones
    const userWithIcons = usersWithIcons.find(u => u.id === user.id);
    if (userWithIcons) {
      showUserDetails(userWithIcons);
    }
  };

  // Função para lidar com mudança de ordenação
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Função para ordenar usuários
  const getSortedUsers = () => {
    let sortedUsers = [...usersWithIcons];
    
    switch (sortBy) {
      case 'Name (A–Z)':
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name (Z–A)':
        sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Date Created (Newest)':
        sortedUsers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
      case 'Date Created (Oldest)':
        sortedUsers.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
        break;
      default:
        // Para 'Recent Activity', 'Status', 'Role' mantém ordem original
        break;
    }
    
    return sortedUsers;
  };

  // Função para mostrar detalhes do grupo
  const showGroupDetails = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    setSelectedRoleGroup(null);
    setRightPanelContent('group');
  };

  // Função para fechar detalhes do grupo
  const closeGroupDetails = () => {
    setSelectedGroup(null);
    setRightPanelContent('schedule');
  };

  // Função para mostrar detalhes do grupo de cargos
  const showRoleGroupDetails = (roleGroup) => {
    setSelectedRoleGroup(roleGroup);
    setSelectedUser(null);
    setSelectedGroup(null);
    setRightPanelContent('roleGroup');
  };

  // Função para fechar detalhes do grupo de cargos
  const closeRoleGroupDetails = () => {
    setSelectedRoleGroup(null);
    setRightPanelContent('schedule');
  };

  // Função para mostrar detalhes do grupo de usuários
  const showUserGroupDetails = (userGroup) => {
    setSelectedUserGroup(userGroup);
    setSelectedUser(null);
    setSelectedGroup(null);
    setSelectedRoleGroup(null);
    setRightPanelContent('userGroup');
  };

  // Função para fechar detalhes do grupo de usuários
  const closeUserGroupDetails = () => {
    setSelectedUserGroup(null);
    setRightPanelContent('schedule');
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="min-h-screen bg-neutral-800">
      <div className="flex gap-4 h-screen">
        {/* Primeira coluna: 60px */}
        <div className="h-full" style={{ width: '60px' }}>
          <FirstColumn />
        </div>

        {/* Segunda coluna: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar />
        </div>

        {/* Terceira coluna: flex-1 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Primeira linha: 3 divs retangulares */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabs activeTab={topTabActive} setActiveTab={setTopTabActive} />
            <LiveNotifications 
              usersData={usersWithIcons}
              onUserClick={showUserDetails}
            />
            <ActionBar onUserSelect={handleUserSelect} onSortChange={handleSortChange} />
          </div>

          {/* Segunda linha: Grid e coluna direita */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Grid de cards ou visualização por status/cargo */}
            <div className="flex-1 overflow-y-auto">
              {topTabActive === 'groups' ? (
                <UserGroupsView 
                  users={usersWithIcons} 
                  onUserClick={showUserDetails}
                  onGroupClick={showUserGroupDetails}
                />
              ) : sortBy === 'Status' ? (
                 <StatusGroupView 
                   users={usersWithIcons} 
                   onUserClick={showUserDetails}
                   onGroupClick={showGroupDetails}
                 />
               ) : sortBy === 'Role' ? (
                 <RoleGroupView 
                   users={usersWithIcons} 
                   onUserClick={showUserDetails}
                   onGroupClick={showRoleGroupDetails}
                 />
               ) : (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  {getSortedUsers().map((user) => (
                    <UserCard 
                      key={user.id} 
                      user={user}
                      onClick={() => showUserDetails(user)} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Coluna direita */}
            <div className="overflow-y-auto" style={{ width: '350px' }}>
              {rightPanelContent === 'schedule' && <Schedule />}
              {rightPanelContent === 'userDetails' && selectedUser && (
                <UserDetails user={selectedUser} onBack={goBackFromUserDetails} />
              )}
              {rightPanelContent === 'group' && selectedGroup && (
                <StatusGroupDetails 
                  group={selectedGroup} 
                  onUserClick={showUserDetails}
                  onClose={closeGroupDetails}
                />
              )}
              {rightPanelContent === 'roleGroup' && selectedRoleGroup && (
                <RoleGroupDetails 
                  group={selectedRoleGroup} 
                  onUserClick={showUserDetails}
                  onClose={closeRoleGroupDetails}
                />
              )}
              {rightPanelContent === 'userGroup' && selectedUserGroup && (
                <UserGroupDetails 
                  group={selectedUserGroup} 
                  onUserClick={showUserDetails}
                  onClose={closeUserGroupDetails}
                  allUsers={usersWithIcons}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Bottom Sheet */}
      <AnimatedBottomSheet
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        message={message}
        setMessage={setMessage}
        toggleUserSelection={toggleUserSelection}
        removeSelectedUser={removeSelectedUser}
      />
    </div>
  );
}

export default App;