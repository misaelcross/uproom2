import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Users,
  Check
} from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { usersData } from '../../data/usersData';
import Sidebar from '../shared/Sidebar';
import TopTabs from '../dashboard/TopTabs';
import LiveNotifications from '../shared/LiveNotifications';
import ActionBar from '../dashboard/ActionBar';
import UserDetails from './UserDetails';

const TeamPage = ({ onNavigate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Tabs para gestão de usuários
  const tabs = [
    { id: 'all', label: 'All Users', count: usersData.length },
    { id: 'active', label: 'Active', count: usersData.filter(u => u.status === 'active').length },
    { id: 'inactive', label: 'Inactive', count: usersData.filter(u => u.status === 'inactive').length },
    { id: 'pending', label: 'Pending', count: usersData.filter(u => u.status === 'pending').length }
  ];

  const [activeTab, setActiveTab] = useState('all');

  // Filtrar usuários baseado na busca, filtros e tab ativa
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesTab = activeTab === 'all' || user.status === activeTab;

    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  // Ordenar usuários
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'role':
        return a.role.localeCompare(b.role);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === sortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sortedUsers.map(user => user.id));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'manager':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'user':
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="h-screen bg-neutral-900 pr-6 overflow-hidden">
      <div className="flex gap-4 h-screen">
        {/* Primeira coluna: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="team" onNavigate={onNavigate} />
        </div>

        {/* Segunda coluna: flex-1 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Primeira linha: 3 divs retangulares */}
          <div className="flex w-full items-start gap-2 min-w-0">
            <TopTabs 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <LiveNotifications 
              usersData={usersData} 
              onUserClick={handleUserClick}
            />
            <ActionBar 
              selectedCount={selectedUsers.length}
              onAction={(action) => console.log('Action:', action)}
              actions={[
                { id: 'activate', label: 'Activate Users', icon: CheckCircle },
                { id: 'deactivate', label: 'Deactivate Users', icon: XCircle },
                { id: 'delete', label: 'Delete Users', icon: Trash2, destructive: true }
              ]}
            />
          </div>

          {/* Segunda linha: Conteúdo principal e coluna direita */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search and Filters */}
              <div className="p-4 border-b border-neutral-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white hover:bg-neutral-700 transition-colors"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                    </button>
                    
                    {showFilters && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50">
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Role</label>
                            <select
                              value={filterRole}
                              onChange={(e) => setFilterRole(e.target.value)}
                              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="all">All Roles</option>
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="user">User</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Status</label>
                            <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="all">All Status</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="name">Name</option>
                              <option value="role">Role</option>
                              <option value="status">Status</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-neutral-100 rounded-lg text-black transition-colors">
                    <UserPlus className="h-4 w-4" />
                    <span>Add User</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <SimpleBar className="flex-1">
                <table className="w-full">
                  <thead className="bg-neutral-800 sticky top-0">
                    <tr>
                      <th className="w-12 p-4">
                        <button
                          onClick={handleSelectAll}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                            selectedUsers.length === sortedUsers.length && sortedUsers.length > 0
                              ? 'bg-white border-white' 
                              : 'border-neutral-400 hover:border-white'
                          }`}
                        >
                          {selectedUsers.length === sortedUsers.length && sortedUsers.length > 0 && <Check className="w-2.5 h-2.5 text-black" />}
                        </button>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-neutral-300">User</th>
                      <th className="text-left p-4 text-sm font-medium text-neutral-300">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-neutral-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user) => (
                      <tr 
                        key={user.id}
                        className="border-b border-neutral-700 hover:bg-neutral-800/50 cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectUser(user.id);
                            }}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                              selectedUsers.includes(user.id)
                                ? 'bg-white border-white' 
                                : 'border-neutral-400 hover:border-white'
                            }`}
                          >
                            {selectedUsers.includes(user.id) && <Check className="w-2.5 h-2.5 text-black" />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-sm text-neutral-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {sortedUsers.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-neutral-400 text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No users found</h3>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </div>
                )}
              </SimpleBar>
            </div>

            {/* Coluna direita - Detalhes do usuário */}
            <SimpleBar className="pb-12" style={{ width: '350px' }}>
              {selectedUser ? (
                <UserDetails 
                  user={selectedUser}
                  onClose={() => setSelectedUser(null)}
                  onEdit={(user) => console.log('Edit user:', user)}
                  onDelete={(user) => console.log('Delete user:', user)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                  <Users className="h-16 w-16 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Select a user</h3>
                  <p className="text-sm text-center">Click on a user from the table to view their details</p>
                </div>
              )}
            </SimpleBar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;