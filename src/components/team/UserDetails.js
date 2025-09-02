import React, { useState } from 'react';
import {
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check
} from 'lucide-react';
import useEscapeKey from '../../hooks/useEscapeKey';

const UserDetails = ({ user, onClose, onEdit, onDelete }) => {
  // Handle Escape key to close the component view
  useEscapeKey(onClose);

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'permissions', label: 'Permissions', icon: Shield }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
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

  const mockPermissions = [
    { module: 'Dashboard', read: true, write: true, delete: false },
    { module: 'Users', read: true, write: false, delete: false },
    { module: 'Nudges', read: true, write: true, delete: true },
    { module: 'Schedule', read: true, write: true, delete: false },
    { module: 'Reports', read: true, write: false, delete: false }
  ];

  const mockActivity = [
    { action: 'Logged in', timestamp: '2024-01-20 09:30:00', ip: '192.168.1.100' },
    { action: 'Updated profile', timestamp: '2024-01-19 14:22:00', ip: '192.168.1.100' },
    { action: 'Created nudge', timestamp: '2024-01-19 11:15:00', ip: '192.168.1.100' },
    { action: 'Logged out', timestamp: '2024-01-18 18:45:00', ip: '192.168.1.100' },
    { action: 'Logged in', timestamp: '2024-01-18 08:30:00', ip: '192.168.1.100' }
  ];

  return (
    <div className="bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
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
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-900 ${user.status === 'active' ? 'bg-green-500' :
              user.status === 'inactive' ? 'bg-red-500' :
                user.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">{user.name}</h2>
            <p className="text-neutral-400 text-sm">{user.title} • {user.department}</p>
          </div>
        </div>

        {/* Status and Role Badges */}
        <div className="flex items-center space-x-2 mt-4">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getAccountColor(user.status)}`}>
            {capitalizeFirst(user.status)}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
            {capitalizeFirst(user.role)}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 border-b border-neutral-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-transparent hover:bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit user</span>
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex items-center justify-center px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex space-x-1 rounded-lg bg-neutral-800 p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full rounded-md text-xs font-medium leading-5 h-7 flex items-center justify-center focus:outline-none transition-colors ${activeTab === tab.id
                ? 'bg-neutral-700 text-white shadow'
                : 'text-neutral-400 hover:bg-neutral-700/50 hover:text-white'
                }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panels */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="border border-neutral-700 rounded-lg p-4">
              <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-white">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-white">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-white">{user.location || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="border border-neutral-700 rounded-lg p-4">
              <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">Account Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <div>
                    <span className="text-sm text-neutral-400">Joined: </span>
                    <span className="text-sm text-white">{user.joinDate || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <div>
                    <span className="text-sm text-neutral-400">Last Active: </span>
                    <span className="text-sm text-white">
                      {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
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
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-4">
            <div className="border border-neutral-700 rounded-lg p-4">
              <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">Module Permissions</h4>
              <div className="space-y-3">
                {mockPermissions.map((permission, index) => (
                  <div key={index} className="bg-neutral-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{permission.module}</span>
                    </div>
                    <div className="flex space-x-4 text-xs">
                      <label className="flex items-center space-x-1">
                        <button
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${permission.read
                            ? 'bg-white border-white'
                            : 'border-neutral-400'
                            }`}
                          disabled
                        >
                          {permission.read && <Check className="w-2.5 h-2.5 text-black" />}
                        </button>
                        <span className="text-neutral-300">Read</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <button
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${permission.write
                            ? 'bg-white border-white'
                            : 'border-neutral-400'
                            }`}
                          disabled
                        >
                          {permission.write && <Check className="w-2.5 h-2.5 text-black" />}
                        </button>
                        <span className="text-neutral-300">Write</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <button
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${permission.delete
                            ? 'bg-white border-white'
                            : 'border-neutral-400'
                            }`}
                          disabled
                        >
                          {permission.delete && <Check className="w-2.5 h-2.5 text-black" />}
                        </button>
                        <span className="text-neutral-300">Delete</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}



        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="border border-neutral-700 rounded-lg p-4">
              <h4 className="text-neutral-400 text-sm font-medium pb-3 mb-3 border-b border-neutral-700">User Settings</h4>
              <div className="space-y-3">
                <div className="bg-neutral-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">Email notifications</span>
                    <button
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${true
                        ? 'bg-white border-white'
                        : 'border-neutral-400 hover:border-white'
                        }`}
                    >
                      {true && <Check className="w-2.5 h-2.5 text-black" />}
                    </button>
                  </div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">Two-Factor Authentication</span>
                    <button
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${false
                        ? 'bg-white border-white'
                        : 'border-neutral-400 hover:border-white'
                        }`}
                    >
                      {false && <Check className="w-2.5 h-2.5 text-black" />}
                    </button>
                  </div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">API access</span>
                    <button
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${true
                        ? 'bg-white border-white'
                        : 'border-neutral-400 hover:border-white'
                        }`}
                    >
                      {true && <Check className="w-2.5 h-2.5 text-black" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;