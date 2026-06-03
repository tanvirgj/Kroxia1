import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Download, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  rating: number;
  review_count: number;
  download_count: number;
}

export function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    try {
      let query = supabase.from('products').select('*').eq('status', 'published');

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data } = await query.order('download_count', { ascending: false });
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">KROXIA Marketplace</h1>
        <p className="text-gray-600 mt-1">Discover themes, plugins, and templates</p>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setFilter('theme')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'theme'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Themes
        </button>
        <button
          onClick={() => setFilter('plugin')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'plugin'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Plugins
        </button>
        <button
          onClick={() => setFilter('template')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'template'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Templates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-600">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-600">No products found</div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-white opacity-50" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {product.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-600">({product.review_count})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {product.download_count.toLocaleString()} downloads
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
