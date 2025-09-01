import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Typography,
  Box,
  Button,
  Avatar
} from '@mui/material';
import SimpleBar from 'simplebar-react';
import {
  Bell,
  Users,
  Shield,
  Settings,
  Activity,
  Database,
  UserPlus,
  UserMinus,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

// Notification data with categories
const notificationData = [
  // User and Access Management
  {
    id: 1,
    category: 'User Management',
    type: 'access_request',
    title: 'Access Request',
    message: 'John Smith requested access to the organization',
    timestamp: '2 minutes ago',
    isRead: false,
    priority: 'high',
    icon: UserPlus,
    actions: ['Approve', 'Deny']
  },
  {
    id: 2,
    category: 'User Management',
    type: 'role_change',
    title: 'Role Updated',
    message: 'Your role has been changed to Manager',
    timestamp: '1 hour ago',
    isRead: false,
    priority: 'medium',
    icon: Users,
    actions: ['View Details']
  },
  {
    id: 3,
    category: 'User Management',
    type: 'account_deactivated',
    title: 'Account Deactivated',
    message: 'Sarah Wilson\'s account has been deactivated',
    timestamp: '3 hours ago',
    isRead: true,
    priority: 'medium',
    icon: UserMinus,
    actions: ['View Details']
  },
  
  // Group and Team Notifications
  {
    id: 4,
    category: 'Groups',
    type: 'group_invitation',
    title: 'Group Invitation',
    message: 'You have been added to the "Marketing Team" group',
    timestamp: '30 minutes ago',
    isRead: false,
    priority: 'medium',
    icon: Users,
    actions: ['Accept', 'Decline']
  },
  {
    id: 5,
    category: 'Groups',
    type: 'group_role_change',
    title: 'Group Role Updated',
    message: 'You are now an admin of "Development Team"',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'medium',
    icon: Shield,
    actions: ['View Group']
  },
  {
    id: 6,
    category: 'Groups',
    type: 'group_member_left',
    title: 'Member Left Group',
    message: 'Mike Johnson left the "Design Team" group',
    timestamp: '4 hours ago',
    isRead: true,
    priority: 'low',
    icon: UserMinus,
    actions: ['View Group']
  },
  
  // Administrative Notifications
  {
    id: 7,
    category: 'Administrative',
    type: 'system_maintenance',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2 AM',
    timestamp: '1 hour ago',
    isRead: false,
    priority: 'high',
    icon: Settings,
    actions: ['View Details']
  },
  {
    id: 8,
    category: 'Administrative',
    type: 'policy_update',
    title: 'Policy Updated',
    message: 'Privacy policy has been updated',
    timestamp: '1 day ago',
    isRead: true,
    priority: 'medium',
    icon: Settings,
    actions: ['Read Policy']
  },
  
  // Activity and Process Notifications
  {
    id: 9,
    category: 'Activities',
    type: 'task_assigned',
    title: 'Task Assigned',
    message: 'New task "Review Q4 Reports" has been assigned to you',
    timestamp: '45 minutes ago',
    isRead: false,
    priority: 'medium',
    icon: Activity,
    actions: ['View Task', 'Accept']
  },
  {
    id: 10,
    category: 'Activities',
    type: 'deadline_reminder',
    title: 'Deadline Reminder',
    message: 'Project "Website Redesign" is due tomorrow',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'high',
    icon: Clock,
    actions: ['View Project']
  },
  {
    id: 11,
    category: 'Activities',
    type: 'approval_required',
    title: 'Approval Required',
    message: 'Budget request from Finance Team needs your approval',
    timestamp: '3 hours ago',
    isRead: false,
    priority: 'high',
    icon: CheckCircle,
    actions: ['Approve', 'Review']
  },
  
  // Resource and Tool Notifications
  {
    id: 12,
    category: 'Resources',
    type: 'storage_limit',
    title: 'Storage Limit',
    message: 'Your storage is 90% full. Consider upgrading your plan',
    timestamp: '6 hours ago',
    isRead: false,
    priority: 'medium',
    icon: Database,
    actions: ['Upgrade Plan', 'Manage Storage']
  },
  {
    id: 13,
    category: 'Resources',
    type: 'backup_completed',
    title: 'Backup Completed',
    message: 'Weekly data backup has been completed successfully',
    timestamp: '1 day ago',
    isRead: true,
    priority: 'low',
    icon: Database,
    actions: ['View Details']
  },
  
  // Security Notifications
  {
    id: 14,
    category: 'Security',
    type: 'password_changed',
    title: 'Password Changed',
    message: 'Your password was successfully updated',
    timestamp: '5 minutes ago',
    isRead: false,
    priority: 'medium',
    icon: Key,
    actions: ['View Security Settings']
  },
  {
    id: 15,
    category: 'Security',
    type: 'session_expired',
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again',
    timestamp: '10 minutes ago',
    isRead: false,
    priority: 'high',
    icon: AlertTriangle,
    actions: ['Login Again']
  },
  {
    id: 16,
    category: 'Security',
    type: 'suspicious_activity',
    title: 'Suspicious Activity',
    message: 'Unusual login attempt detected from new device',
    timestamp: '1 hour ago',
    isRead: false,
    priority: 'high',
    icon: Shield,
    actions: ['Review Activity', 'Secure Account']
  }
];

const NotificationModal = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(notificationData);
  const open = Boolean(anchorEl);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'; // red-500
      case 'medium': return '#f59e0b'; // amber-500
      case 'low': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  const getIconColor = (category) => {
    switch (category) {
      case 'User Management': return '#3b82f6'; // blue-500
      case 'Groups': return '#8b5cf6'; // violet-500
      case 'Administrative': return '#6b7280'; // gray-500
      case 'Activities': return '#10b981'; // emerald-500
      case 'Resources': return '#f59e0b'; // amber-500
      case 'Security': return '#ef4444'; // red-500
      default: return '#6b7280';
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: '#a3a3a3',
          '&:hover': {
            backgroundColor: '#262626',
            color: 'white'
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              minWidth: '16px',
              height: '16px',
              borderRadius: '4px'
            }
          }}
        >
          <Bell size={20} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 600,
            backgroundColor: '#262626',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #404040',
            borderRadius: '12px',
            mt: 1,
            padding: 0
          }
        }}
        MenuListProps={{
          sx: {
            paddingBottom: 0
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  sx={{
                    fontSize: '0.875rem',
                    color: '#a3a3a3',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'white'
                    }
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Notifications List */}
        <SimpleBar style={{ maxHeight: '480px' }}>
          <Box>
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <MenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    sx={{
                      p: 0,
                      backgroundColor: !notification.isRead ? 'rgba(64, 64, 64, 0.5)' : 'transparent',
                      '&:hover': { backgroundColor: '#404040' },
                      cursor: 'pointer'
                    }}
                  >
                  <Box sx={{ p: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Icon */}
                      <Avatar
                         sx={{
                           width: 32,
                           height: 32,
                           backgroundColor: '#404040',
                           color: '#d4d4d4'
                         }}
                       >
                         <IconComponent size={16} />
                       </Avatar>
                      
                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: notification.isRead ? 400 : 600,
                              color: notification.isRead ? '#a3a3a3' : 'white',
                              fontSize: '0.875rem'
                            }}
                          >
                            {notification.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#a3a3a3',
                                fontSize: '0.75rem'
                              }}
                            >
                              {notification.timestamp.replace(/\b(\d+)\s*(minute|hour|day)s?\s*ago\b/i, (match, num, unit) => {
                                const unitMap = { minute: 'm', hour: 'h', day: 'd' };
                                return `${num}${unitMap[unit.toLowerCase()]}`;
                              })}
                            </Typography>
                            
                            {!notification.isRead && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: '#ef4444'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#a3a3a3',
                            fontSize: '0.8125rem',
                            mb: 1,
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {notification.message}
                        </Typography>
                        

                        
                        {/* Actions */}
                        {notification.actions && notification.actions.length > 0 && (
                          <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {notification.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Action: ${action} for notification ${notification.id}`);
                                }}
                                sx={{
                                  fontSize: '0.75rem',
                                  textTransform: 'none',
                                  minWidth: 'auto',
                                  px: 2,
                                  py: 0.5,
                                  border: '1px solid #525252',
                                  borderRadius: '6px',
                                  backgroundColor: actionIndex === 0 ? '#404040' : 'transparent',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: '#525252',
                                    borderColor: '#737373',
                                  }
                                }}
                              >
                                {action}
                              </Button>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
          </Box>
        </SimpleBar>
        
        {notifications.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Bell size={48} style={{ color: '#525252', marginBottom: '16px' }} />
            <Typography variant="body1" sx={{ color: '#a3a3a3', mb: 1 }}>
              No notifications
            </Typography>
            <Typography variant="body2" sx={{ color: '#737373' }}>
              You're all caught up!
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationModal;