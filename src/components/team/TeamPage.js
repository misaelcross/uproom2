import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Users,
  Check,
  Edit,
  Shield,
  Download,
  X,
  ChevronDown
} from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { usersData } from '../../data/usersData';
import Sidebar from '../shared/Sidebar';
// import TopTabs from '../dashboard/TopTabs'; // Hidden for now, can be restored in the future
import LiveNotifications from '../shared/LiveNotifications';
import ActionBar from '../dashboard/ActionBar';
import UserDetails from './UserDetails';
import TeamEmptyState from './TeamEmptyState';

const TeamPage = ({ onNavigate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Tabs para gestão de usuários - Hidden for now, can be restored in the future
  // const validStatuses = ['active', 'inactive', 'pending'];
  // const validUsers = usersData.filter(u => validStatuses.includes(u.status));
  
  // const tabs = [
  //   { id: 'all', label: 'All Users', count: validUsers.length },
  //   { id: 'active', label: 'Active', count: validUsers.filter(u => u.status === 'active').length },
  //   { id: 'inactive', label: 'Inactive', count: validUsers.filter(u => u.status === 'inactive').length },
  //   { id: 'pending', label: 'Pending', count: validUsers.filter(u => u.status === 'pending').length }
  // ];

  // const [activeTab, setActiveTab] = useState('all');

  // Filtrar usuários baseado nos filtros selecionados
  const filteredUsers = usersData.filter(user => {
    // Apenas usuários com status válidos para sistema (account status)
    const validStatuses = ['active', 'inactive', 'pending'];
    const hasValidStatus = validStatuses.includes(user.status);
    
    // Filtro por role
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    
    // Filtro por account status
    const accountMatch = accountFilter === 'all' || user.status === accountFilter;
    
    return hasValidStatus && roleMatch && accountMatch;
  });

  // Ordenar usuários por nome
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return a.name.localeCompare(b.name);
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



  const getAccountColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400';
      case 'inactive':
        return 'bg-red-500/10 text-red-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getRoleColor = (role) => {
    // All role badges use the same gray styling as offline status
    return 'bg-gray-500/10 text-gray-400';
  };

  // Helper function to capitalize first letter
  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Action handlers
  const handleBulkEdit = () => {
    console.log('Bulk edit users:', selectedUsers);
    // Implement bulk edit logic
  };

  const handleBulkDelete = () => {
    console.log('Delete users:', selectedUsers);
    // Implement delete logic
    setSelectedUsers([]);
  };

  const handleChangeRole = () => {
    console.log('Change role for users:', selectedUsers);
    // Implement role change logic
  };

  const handleExportUsers = () => {
    console.log('Export users:', selectedUsers);
    // Implement export logic
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  // Filter handlers
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setShowRoleDropdown(false);
  };

  const handleAccountFilter = (status) => {
    setAccountFilter(status);
    setShowAccountDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowRoleDropdown(false);
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen bg-neutral-900 pr-6 overflow-hidden">
      <div className="flex gap-4 h-screen">
        {/* Primeira coluna: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="team" onNavigate={onNavigate} />
        </div>

        {/* Segunda coluna: flex-1 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Primeira linha: 2 divs retangulares */}
          <div className="flex w-full items-start gap-2 min-w-0">
            {/* TopTabs - Hidden for now, can be restored in the future */}
            {/* <TopTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            /> */}
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
            <div className="flex-1 flex flex-col min-h-0">
              {/* Action Bar - appears when users are selected */}
              {selectedUsers.length > 0 && (
                <div className="border border-neutral-700 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearSelection}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-white font-medium">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkEdit}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={handleChangeRole}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Change Role
                    </button>

                    <button
                      onClick={handleExportUsers}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>

                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-white hover:bg-neutral-300 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="flex-1 border border-neutral-700 rounded-lg overflow-hidden">
                <SimpleBar className="h-full">
                  <table className="w-full">
                    <thead className="bg-neutral-800 sticky top-0">
                      <tr>
                        <th className="w-12 p-4">
                          <button
                            onClick={handleSelectAll}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${selectedUsers.length === sortedUsers.length && sortedUsers.length > 0
                              ? 'bg-white border-white'
                              : 'border-neutral-400 hover:border-white'
                              }`}
                          >
                            {selectedUsers.length === sortedUsers.length && sortedUsers.length > 0 && <Check className="w-2.5 h-2.5 text-black" />}
                          </button>
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-neutral-300">User</th>
                        <th className="text-left p-4 text-sm font-medium text-neutral-300 relative dropdown-container">
                          <button
                            onClick={() => {
                              setShowRoleDropdown(!showRoleDropdown);
                              setShowAccountDropdown(false);
                            }}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            Role
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {showRoleDropdown && (
                            <div className="absolute top-full left-4 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 min-w-[120px]">
                              <button
                                onClick={() => handleRoleFilter('all')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  roleFilter === 'all' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                All Roles
                              </button>
                              <button
                                onClick={() => handleRoleFilter('admin')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  roleFilter === 'admin' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                Admin
                              </button>
                              <button
                                onClick={() => handleRoleFilter('user')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  roleFilter === 'user' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                User
                              </button>
                            </div>
                          )}
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-neutral-300 relative dropdown-container">
                          <button
                            onClick={() => {
                              setShowAccountDropdown(!showAccountDropdown);
                              setShowRoleDropdown(false);
                            }}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            Account
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {showAccountDropdown && (
                            <div className="absolute top-full left-4 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 min-w-[120px]">
                              <button
                                onClick={() => handleAccountFilter('all')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  accountFilter === 'all' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                All Status
                              </button>
                              <button
                                onClick={() => handleAccountFilter('active')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  accountFilter === 'active' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                Active
                              </button>
                              <button
                                onClick={() => handleAccountFilter('inactive')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  accountFilter === 'inactive' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                Inactive
                              </button>
                              <button
                                onClick={() => handleAccountFilter('pending')}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                  accountFilter === 'pending' ? 'text-white bg-neutral-700' : 'text-neutral-300'
                                }`}
                              >
                                Pending
                              </button>
                            </div>
                          )}
                        </th>
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
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${selectedUsers.includes(user.id)
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
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                              {capitalizeFirst(user.role)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getAccountColor(user.status)}`}>
                              {capitalizeFirst(user.status)}
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
                        <p className="text-sm">Try selecting a different tab</p>
                      </div>
                    </div>
                  )}
                </SimpleBar>
              </div>
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
                <TeamEmptyState
                  onAddUser={() => console.log('Add new user')}
                  onImportUsers={() => console.log('Import users')}
                  onManageRoles={() => console.log('Manage roles')}
                  onBulkEdit={() => console.log('Bulk edit')}
                />
              )}
            </SimpleBar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;