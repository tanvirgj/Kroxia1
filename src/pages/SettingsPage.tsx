import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Bell, Lock, Users, Zap, Save } from 'lucide-react';

export function SettingsPage() {
  const { org } = useApp();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your organization settings</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Organization</h3>
              <p className="text-gray-600 text-sm mt-1">
                Name: {org?.name}
              </p>
              <p className="text-gray-600 text-sm">
                Plan: {org?.plan}
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <p className="text-gray-600 text-sm mt-1">
                Manage passwords, 2FA, and API keys
              </p>
              <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-gray-600 text-sm mt-1">
                Control email and push notifications
              </p>
              <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
              <p className="text-gray-600 text-sm mt-1">
                Connect third-party tools and services
              </p>
              <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
              <p className="text-gray-600 text-sm mt-1">Manage your subscription and billing</p>
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium flex items-center gap-2">
              <Save className="w-4 h-4" />
              View Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
