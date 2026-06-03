import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { SignInPage } from '@/pages/SignInPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CRMPage } from '@/pages/CRMPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { DealsPage } from '@/pages/DealsPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { TasksPage } from '@/pages/TasksPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { TicketsPage } from '@/pages/TicketsPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { QuotationsPage } from '@/pages/QuotationsPage';
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { BlogPage } from '@/pages/BlogPage';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route
        path="/*"
        element={
          user ? (
            <div className="flex">
              <Sidebar />
              <div className="flex-1 lg:ml-64">
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/crm" element={<CRMPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/quotations" element={<QuotationsPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/tickets" element={<TicketsPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
