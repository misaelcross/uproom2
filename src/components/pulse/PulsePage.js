import React from 'react';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';

const PulsePage = ({ onNavigate }) => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Pulse</h1>
          <p className="text-neutral-400">Real-time insights and analytics for your organization</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-400">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">1,234</h3>
            <p className="text-neutral-400 text-sm">Total Activities</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-400">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">89</h3>
            <p className="text-neutral-400 text-sm">Active Users</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-400">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">67%</h3>
            <p className="text-neutral-400 text-sm">Engagement Rate</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-red-400">-3%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">2.4h</h3>
            <p className="text-neutral-400 text-sm">Avg. Session Time</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-neutral-800 rounded-lg p-12 border border-neutral-700 text-center">
          <Activity className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Pulse Analytics Coming Soon</h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            Get real-time insights into your team's productivity, engagement, and performance metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;