import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, Calendar, User, MoreVertical } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  deadline: string;
  created_at: string;
}

export function ProjectsPage() {
  const { org } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    deadline: '',
  });

  useEffect(() => {
    if (!org) return;
    loadProjects();
  }, [org]);

  const loadProjects = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('org_id', org?.id)
        .order('created_at', { ascending: false });
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!org || !formData.name) return;

    try {
      const { error } = await supabase.from('projects').insert([
        {
          org_id: org.id,
          name: formData.name,
          description: formData.description,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          deadline: formData.deadline || null,
          status: 'active',
        },
      ]);

      if (!error) {
        setFormData({ name: '', description: '', budget: '', deadline: '' });
        setShowModal(false);
        loadProjects();
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    on_hold: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage all your projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Project</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
              <input
                type="number"
                placeholder="Budget"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
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
                onClick={handleAddProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-600">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">No projects yet</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      statusColors[project.status as keyof typeof statusColors] ||
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                {project.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold text-gray-900">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {project.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
