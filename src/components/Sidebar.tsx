import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  DollarSign,
  TicketIcon,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  BookOpen,
  BarChart3,
  TrendingDown,
  Newspaper,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { org } = useApp();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { section: 'CRM' },
    { icon: Users, label: 'CRM', href: '/crm' },
    { icon: Users, label: 'Contacts', href: '/contacts' },
    { icon: Briefcase, label: 'Deals', href: '/deals' },
    { section: 'Operations' },
    { icon: Briefcase, label: 'Projects', href: '/projects' },
    { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
    { section: 'Finance' },
    { icon: DollarSign, label: 'Invoices', href: '/invoices' },
    { icon: FileText, label: 'Quotations', href: '/quotations' },
    { icon: TrendingDown, label: 'Expenses', href: '/expenses' },
    { section: 'Support & Content' },
    { icon: TicketIcon, label: 'Support', href: '/tickets' },
    { icon: BookOpen, label: 'Knowledge Base', href: '/knowledge-base' },
    { icon: Newspaper, label: 'Blog', href: '/blog' },
    { section: 'Marketplace' },
    { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">KROXIA</h1>
        <p className="text-xs text-gray-600 mt-1">{org?.name || 'Organization'}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={`${item.section}-${idx}`} className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full left-0 top-0">
        <SidebarContent />
      </aside>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:hidden top-0 left-0 z-30 w-64 h-full bg-white transform transition ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
