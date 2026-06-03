import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, TrendingDown } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
}

export function ExpensesPage() {
  const { org } = useApp();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (!org) return;
    loadExpenses();
  }, [org]);

  const loadExpenses = async () => {
    try {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('org_id', org?.id)
        .order('created_at', { ascending: false });
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!org || !formData.category || !formData.amount) return;

    try {
      const { error } = await supabase.from('expenses').insert([
        {
          org_id: org.id,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
        },
      ]);

      if (!error) {
        setFormData({ category: '', amount: '', description: '' });
        setShowModal(false);
        loadExpenses();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + (exp.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track business expenses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Log Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-100 bg-red-50 p-2 rounded-lg" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Expense Entries</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{expenses.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Avg. Expense</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${expenses.length > 0 ? Math.round(totalExpenses / expenses.length).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Log Expense</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category (e.g., Software, Travel)"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
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
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
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
                onClick={handleAddExpense}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Log
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Expenses</h2>
          <div className="divide-y">
            {loading ? (
              <div className="py-8 text-center text-gray-600">Loading...</div>
            ) : expenses.length === 0 ? (
              <div className="py-8 text-center text-gray-600">No expenses logged</div>
            ) : (
              expenses.slice(0, 10).map((expense) => (
                <div key={expense.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{expense.category}</p>
                    <p className="text-xs text-gray-600">{expense.description}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${expense.amount?.toLocaleString() || 0}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">By Category</h2>
          <div className="space-y-2">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([category, total]) => (
                <div key={category} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-semibold text-gray-900">
                    ${total.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
