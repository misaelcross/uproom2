import React, { useState, useEffect } from 'react';

const ActivityProgressBar = ({ user, isVisible }) => {
  const [progressData, setProgressData] = useState(null);

  // Generate realistic activity progress based on user status
  const generateActivityProgress = (user) => {
    const now = new Date();
    const statusConfig = {
      'In meeting': {
        totalDuration: 60, // 60 minutes
        startOffset: 15, // started 15 minutes ago
        color: 'bg-blue-500',
        bgColor: 'bg-blue-500/20',
        activity: 'Team Meeting'
      },
      'Focus': {
        totalDuration: 120, // 2 hours
        startOffset: 45, // started 45 minutes ago
        color: 'bg-purple-500',
        bgColor: 'bg-purple-500/20',
        activity: 'Deep Work Session'
      },
      'Break': {
        totalDuration: 30, // 30 minutes
        startOffset: 10, // started 10 minutes ago
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-500/20',
        activity: 'Coffee Break'
      },
      'Away': {
        totalDuration: 90, // 1.5 hours
        startOffset: 30, // started 30 minutes ago
        color: 'bg-orange-500',
        bgColor: 'bg-orange-500/20',
        activity: 'Out of Office'
      },
      'Emergency': {
        totalDuration: 45, // 45 minutes
        startOffset: 20, // started 20 minutes ago
        color: 'bg-red-500',
        bgColor: 'bg-red-500/20',
        activity: 'Urgent Issue'
      },
      'Available': {
        totalDuration: 0, // No specific activity
        startOffset: 0,
        color: 'bg-green-500',
        bgColor: 'bg-green-500/20',
        activity: 'Available'
      },
      'Offline': {
        totalDuration: 0, // No activity
        startOffset: 0,
        color: 'bg-gray-500',
        bgColor: 'bg-gray-500/20',
        activity: 'Offline'
      }
    };

    const config = statusConfig[user.availability] || statusConfig['Available'];
    
    // Don't show progress for Available or Offline users
    if (user.availability === 'Available' || user.availability === 'Offline') {
      return null;
    }

    const elapsedMinutes = config.startOffset;
    const totalMinutes = config.totalDuration;
    const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);
    const progressPercentage = Math.min(100, (elapsedMinutes / totalMinutes) * 100);

    return {
      activity: config.activity,
      elapsedMinutes,
      remainingMinutes,
      totalMinutes,
      progressPercentage,
      color: config.color,
      bgColor: config.bgColor,
      isActive: remainingMinutes > 0
    };
  };

  // Update progress data when user changes or component becomes visible
  useEffect(() => {
    if (isVisible && user) {
      const data = generateActivityProgress(user);
      setProgressData(data);
    }
  }, [isVisible, user]);

  // Format time display
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Don't render if not visible or no progress data
  if (!isVisible || !progressData || !progressData.isActive) {
    return null;
  }

  return (
    <div className="mt-2 animate-in slide-in-from-bottom-2 duration-200">
      {/* Progress Bar */}
      <div className="relative">
        <div className={`w-full h-1.5 rounded-full ${progressData.bgColor}`}>
          <div 
            className={`h-full rounded-full transition-all duration-300 ${progressData.color}`}
            style={{ width: `${progressData.progressPercentage}%` }}
          />
        </div>
        
        {/* Time Labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500 mr-4">
            {formatTime(progressData.elapsedMinutes)} elapsed
          </span>
          <span className="text-xs text-neutral-500">
            {formatTime(progressData.totalMinutes)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityProgressBar;