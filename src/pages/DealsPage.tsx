import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, TrendingUp, MoreVertical } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  created_at: string;
}

export function DealsPage() {
  const { org } = useApp();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    stage: 'New',
    probability: '50',
    expected_close_date: '',
  });

  useEffect(() => {
    if (!org) return;
    loadDeals();
  }, [org]);

  const loadDeals = async () => {
    try {
      const { data } = await supabase
        .from('deals')
        .select('*')
        .eq('org_id', org?.id)
        .order('created_at', { ascending: false });
      setDeals(data || []);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async () => {
    if (!org || !formData.title || !formData.amount) return;

    try {
      const { error } = await supabase.from('deals').insert([
        {
          org_id: org.id,
          title: formData.title,
          amount: parseFloat(formData.amount),
          stage: formData.stage,
          probability: parseInt(formData.probability),
          expected_close_date: formData.expected_close_date || null,
          status: 'open',
        },
      ]);

      if (!error) {
        setFormData({
          title: '',
          amount: '',
          stage: 'New',
          probability: '50',
          expected_close_date: '',
        });
        setShowModal(false);
        loadDeals();
      }
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const stageColors: { [key: string]: string } = {
    New: 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Proposal: 'bg-yellow-100 text-yellow-700',
    Negotiation: 'bg-orange-100 text-orange-700',
    Won: 'bg-green-100 text-green-700',
    Lost: 'bg-red-100 text-red-700',
  };

  const totalValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Track your sales pipeline</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Deal
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Deal</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Deal Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>New</option>
                <option>In Progress</option>
                <option>Proposal</option>
                <option>Negotiation</option>
                <option>Won</option>
              </select>
              <input
                type="number"
                placeholder="Probability (%)"
                value={formData.probability}
                onChange={(e) =>
                  setFormData({ ...formData, probability: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
              <input
                type="date"
                value={formData.expected_close_date}
                onChange={(e) =>
                  setFormData({ ...formData, expected_close_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDeal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Deal Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-100 bg-green-50 p-2 rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Deals</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{deals.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Probability
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Expected Close
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    No deals yet
                  </td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{deal.title}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${deal.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          stageColors[deal.stage] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{deal.probability}%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {deal.expected_close_date
                        ? new Date(deal.expected_close_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="p-1 hover:bg-gray-100 rounded transition">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
