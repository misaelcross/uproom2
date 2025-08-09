import React, { useState } from 'react';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';
import Sidebar from '../shared/Sidebar';
import TopTabs from '../dashboard/TopTabs';
import LiveNotifications from '../shared/LiveNotifications';
import ActionBar from '../dashboard/ActionBar';
import { usersData } from '../../data/usersData';

const PulsePage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Tabs para pulse analytics
  const tabs = [
    { id: 'overview', label: 'Overview', count: 4 },
    { id: 'activity', label: 'Activity', count: 12 },
    { id: 'performance', label: 'Performance', count: 8 },
    { id: 'insights', label: 'Insights', count: 3 }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 pr-6">
      <div className="flex gap-4 h-screen">
        {/* Primeira coluna: 300px - Sidebar */}
        <div className="h-full" style={{ width: '300px' }}>
          <Sidebar currentPage="pulse" onNavigate={onNavigate} />
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
              onUserClick={(user) => console.log('User clicked:', user)}
            />
            <ActionBar 
              selectedCount={0}
              onAction={(action) => console.log('Action:', action)}
              actions={[
                { id: 'export', label: 'Export Data', icon: Activity },
                { id: 'refresh', label: 'Refresh Analytics', icon: TrendingUp }
              ]}
            />
          </div>

          {/* Segunda linha: Conteúdo principal */}
          <div className="flex gap-6 flex-1 min-h-0">
            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">Pulse Analytics</h1>
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
                  <h2 className="text-xl font-semibold text-white mb-2">Advanced Analytics Coming Soon</h2>
                  <p className="text-neutral-400 max-w-md mx-auto">
                    Get detailed insights into your team's productivity, engagement patterns, and performance metrics with interactive charts and reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;