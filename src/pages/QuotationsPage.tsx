import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, TrendingUp, DollarSign } from 'lucide-react';

interface Quotation {
  id: string;
  quote_number: string;
  title: string;
  amount: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export function QuotationsPage() {
  const { org } = useApp();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    validity_days: '30',
  });

  useEffect(() => {
    if (!org) return;
    loadQuotations();
  }, [org]);

  const loadQuotations = async () => {
    try {
      const { data } = await supabase
        .from('quotations')
        .select('*')
        .eq('org_id', org?.id)
        .order('created_at', { ascending: false });
      setQuotations(data || []);
    } catch (error) {
      console.error('Error loading quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuotation = async () => {
    if (!org || !formData.title || !formData.amount) return;

    try {
      const quoteNumber = `QT-${Date.now()}`;
      const { error } = await supabase.from('quotations').insert([
        {
          org_id: org.id,
          quote_number: quoteNumber,
          title: formData.title,
          amount: parseFloat(formData.amount),
          total_amount: parseFloat(formData.amount),
          validity_days: parseInt(formData.validity_days),
          status: 'draft',
        },
      ]);

      if (!error) {
        setFormData({ title: '', amount: '', validity_days: '30' });
        setShowModal(false);
        loadQuotations();
      }
    } catch (error) {
      console.error('Error adding quotation:', error);
    }
  };

  const totalQuotationValue = quotations.reduce((sum, q) => sum + (q.total_amount || 0), 0);
  const approvedCount = quotations.filter(q => q.status === 'accepted').length;

  const statusColors: { [key: string]: string } = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-600 mt-1">Create and manage quotes for clients</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Quotation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${totalQuotationValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-100 bg-blue-50 p-2 rounded-lg" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Quotations</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{quotations.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Accepted</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Quotation</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Quotation Title"
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
              <input
                type="number"
                placeholder="Validity (days)"
                value={formData.validity_days}
                onChange={(e) =>
                  setFormData({ ...formData, validity_days: e.target.value })
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
                onClick={handleAddQuotation}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quote #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                    No quotations yet
                  </td>
                </tr>
              ) : (
                quotations.map((quote) => (
                  <tr key={quote.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {quote.quote_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{quote.title}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${quote.total_amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[quote.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(quote.created_at).toLocaleDateString()}
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
