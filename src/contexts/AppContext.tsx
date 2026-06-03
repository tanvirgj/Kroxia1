import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface Staff {
  id: string;
  user_id: string;
  org_id: string;
  role_id: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  branding: any;
}

interface AppContextType {
  org: Organization | null;
  staff: Staff | null;
  loading: boolean;
  setOrg: (org: Organization | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        const { data: staffData } = await supabase
          .from('staff')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (staffData) {
          setStaff(staffData);

          const { data: orgData } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', staffData.org_id)
            .single();

          if (orgData) {
            setOrg(orgData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, authLoading]);

  return (
    <AppContext.Provider value={{ org, staff, loading, setOrg }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
