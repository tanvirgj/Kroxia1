import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { TrendingUp, Users, Briefcase, CheckSquare } from 'lucide-react';

interface DashboardStats {
  leads: number;
  projects: number;
  tasks: number;
  revenue: number;
}

export function DashboardPage() {
  const { org } = useApp();
  const [stats, setStats] = useState<DashboardStats>({
    leads: 0,
    projects: 0,
    tasks: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!org) return;

    const loadStats = async () => {
      try {
        const [leadsRes, projectsRes, tasksRes, invoicesRes] = await Promise.all([
          supabase.from('leads').select('id').eq('org_id', org.id),
          supabase.from('projects').select('id').eq('org_id', org.id),
          supabase.from('tasks').select('id').eq('org_id', org.id),
          supabase.from('invoices').select('total_amount').eq('org_id', org.id).eq('status', 'paid'),
        ]);

        let revenue = 0;
        if (invoicesRes.data) {
          revenue = invoicesRes.data.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
        }

        setStats({
          leads: leadsRes.data?.length || 0,
          projects: projectsRes.data?.length || 0,
          tasks: tasksRes.data?.length || 0,
          revenue,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [org]);

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
      <p className="text-green-600 text-sm mt-3 flex items-center gap-1">
        <TrendingUp className="w-4 h-4" /> {change}
      </p>
    </div>
  );

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to your agency hub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Active Leads" value={stats.leads} change="+12% this month" />
        <StatCard
          icon={Briefcase}
          title="Active Projects"
          value={stats.projects}
          change="+5% this month"
        />
        <StatCard icon={CheckSquare} title="Open Tasks" value={stats.tasks} change="-3% this month" />
        <StatCard
          icon={TrendingUp}
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change="+8% this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-gray-700">New project from Acme Corp</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-gray-700">Invoice #1234 paid</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Team member joined</span>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              New Lead
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
              New Project
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
              New Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
