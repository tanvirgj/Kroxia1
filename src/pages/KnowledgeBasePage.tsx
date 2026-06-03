import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { Plus, Search, BookOpen, Eye } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  views: number;
  helpful_count: number;
  published_at: string;
}

interface Category {
  id: string;
  name: string;
}

export function KnowledgeBasePage() {
  const { org } = useApp();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
  });

  useEffect(() => {
    if (!org) return;
    loadArticles();
    loadCategories();
  }, [org]);

  const loadArticles = async () => {
    try {
      const { data } = await supabase
        .from('kb_articles')
        .select('*')
        .eq('org_id', org?.id)
        .order('published_at', { ascending: false });
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('kb_categories')
        .select('*')
        .eq('org_id', org?.id);
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddArticle = async () => {
    if (!org || !formData.title || !formData.category_id) return;

    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
      const { error } = await supabase.from('kb_articles').insert([
        {
          org_id: org.id,
          category_id: formData.category_id,
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          content: formData.content,
          status: formData.status,
          published_at: formData.status === 'published' ? new Date() : null,
        },
      ]);

      if (!error) {
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category_id: '',
          status: 'draft',
        });
        setShowModal(false);
        loadArticles();
      }
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: { [key: string]: string } = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-1">Create and manage help articles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Article
        </button>
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
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Excerpt (short summary)"
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

      <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-600">Loading...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">No articles found</div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : 'Unpublished'}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    statusColors[article.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {article.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>

              <div className="flex items-center justify-between pt-4 border-t text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    👍 {article.helpful_count} helpful
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
