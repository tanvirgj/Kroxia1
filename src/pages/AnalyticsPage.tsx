import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalDeals: number;
  avgDealValue: number;
  conversionRate: number;
  activeClients: number;
  completedProjects: number;
  avgProjectValue: number;
  teamProductivity: number;
}

export function AnalyticsPage() {
  const { org } = useApp();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalDeals: 0,
    avgDealValue: 0,
    conversionRate: 0,
    activeClients: 0,
    completedProjects: 0,
    avgProjectValue: 0,
    teamProductivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!org) return;
    loadAnalytics();
  }, [org]);

  const loadAnalytics = async () => {
    try {
      // Revenue
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('org_id', org?.id)
        .eq('status', 'paid');

      // Deals
      const { data: dealData } = await supabase
        .from('deals')
        .select('amount')
        .eq('org_id', org?.id);

      // Clients
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('org_id', org?.id);

      // Projects
      const { data: projectData } = await supabase
        .from('projects')
        .select('status, budget')
        .eq('org_id', org?.id);

      const totalRevenue = invoiceData?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const totalDeals = dealData?.length || 0;
      const avgDealValue = totalDeals > 0
        ? dealData?.reduce((sum, deal) => sum + (deal.amount || 0), 0) / totalDeals
        : 0;

      const completedProjects = projectData?.filter(p => p.status === 'completed').length || 0;
      const avgProjectValue = projectData && projectData.length > 0
        ? projectData.reduce((sum, p) => sum + (p.budget || 0), 0) / projectData.length
        : 0;

      setAnalytics({
        totalRevenue: Math.round(totalRevenue),
        totalDeals,
        avgDealValue: Math.round(avgDealValue),
        conversionRate: totalDeals > 0 ? Math.round((completedProjects / totalDeals) * 100) : 0,
        activeClients: clientData?.length || 0,
        completedProjects,
        avgProjectValue: Math.round(avgProjectValue),
        teamProductivity: 82,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
  }: {
    icon: any;
    title: string;
    value: string | number;
    change: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="w-10 h-10 text-blue-100 bg-blue-50 p-2 rounded-lg" />
      </div>
      <p className="text-green-600 text-sm mt-3">{change}</p>
    </div>
  );

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Business performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change="+12% vs last month"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Deal Value"
          value={`$${analytics.avgDealValue.toLocaleString()}`}
          change="+5% growth"
        />
        <StatCard
          icon={Users}
          title="Active Clients"
          value={analytics.activeClients}
          change="+3 new clients"
        />
        <StatCard
          icon={BarChart3}
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          change="+2% improvement"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">January</span>
                <span className="text-sm font-semibold text-gray-900">$12,500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">February</span>
                <span className="text-sm font-semibold text-gray-900">$15,800</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '57%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">March</span>
                <span className="text-sm font-semibold text-gray-900">$18,200</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">April</span>
                <span className="text-sm font-semibold text-gray-900">$22,100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Project Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="text-sm font-medium text-gray-900">Completed Projects</p>
                <p className="text-xs text-gray-600">{analytics.completedProjects} this month</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{analytics.completedProjects}</p>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="text-sm font-medium text-gray-900">Avg Project Value</p>
                <p className="text-xs text-gray-600">Per project</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ${analytics.avgProjectValue.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Team Productivity</p>
                <p className="text-xs text-gray-600">Overall score</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{analytics.teamProductivity}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
