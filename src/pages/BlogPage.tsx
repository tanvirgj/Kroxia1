import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, Eye, Pen } from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  published_at: string;
  created_at: string;
}

export function BlogPage() {
  const { org } = useApp();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
  });

  useEffect(() => {
    if (!org) return;
    loadArticles();
  }, [org]);

  const loadArticles = async () => {
    try {
      const { data } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('org_id', org?.id)
        .order('created_at', { ascending: false });
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = async () => {
    if (!org || !formData.title) return;

    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
      const { error } = await supabase.from('blog_articles').insert([
        {
          org_id: org.id,
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          content: formData.content,
          status: formData.status,
          published_at: formData.status === 'published' ? new Date() : null,
        },
      ]);

      if (!error) {
        setFormData({ title: '', excerpt: '', content: '', status: 'draft' });
        setShowModal(false);
        loadArticles();
      }
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  const statusColors: { [key: string]: string } = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">Manage blog articles and content</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Articles</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{articles.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Published</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{publishedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Views</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Article</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Article Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Excerpt (preview text)"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
              />
              <textarea
                placeholder="Article Content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
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
                onClick={handleAddArticle}
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                    No articles yet
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[article.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="p-1 hover:bg-gray-100 rounded transition">
                        <Pen className="w-4 h-4 text-gray-600" />
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
