import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, Search, AlertCircle } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

export function TicketsPage() {
  const { org } = useApp();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('open');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (!org) return;
    loadTickets();
  }, [org, filter]);

  const loadTickets = async () => {
    try {
      let query = supabase.from('tickets').select('*').eq('org_id', org?.id);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data } = await query.order('created_at', { ascending: false });
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTicket = async () => {
    if (!org || !formData.subject) return;

    try {
      const { error } = await supabase.from('tickets').insert([
        {
          org_id: org.id,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          status: 'open',
        },
      ]);

      if (!error) {
        setFormData({ subject: '', description: '', priority: 'medium' });
        setShowModal(false);
        loadTickets();
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const statusColors = {
    open: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-gray-100 text-gray-700',
    closed: 'bg-gray-200 text-gray-700',
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-600 mt-1">Manage customer support tickets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Support Ticket</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              />
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTicket}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No tickets found</div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50 transition flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        priorityColors[ticket.priority as keyof typeof priorityColors] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        statusColors[ticket.status as keyof typeof statusColors] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-xs text-gray-600">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
