import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'arena_organizer_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkSession() {
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            setIsAuthenticated(true);
            setUserEmail(data.session.user.email || 'organizer@arena.edu');
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session?.user) {
                setIsAuthenticated(true);
                setUserEmail(session.user.email || 'organizer@arena.edu');
              } else {
                setIsAuthenticated(false);
                setUserEmail(null);
              }
            }
          );
          return () => {
            authListener.subscription.unsubscribe();
          };
        } else {
          // Local fallback session
          const sessionData = localStorage.getItem(LOCAL_AUTH_KEY);
          if (sessionData) {
            try {
              const parsed = JSON.parse(sessionData);
              if (parsed.email && parsed.token) {
                setIsAuthenticated(true);
                setUserEmail(parsed.email);
              }
            } catch {
              localStorage.removeItem(LOCAL_AUTH_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || email);
          return { success: true };
        }
        return { success: false, error: 'Login failed. Please check credentials.' };
      }

      // Local Organizer Authentication
      // Authorized default organizer credentials or valid organizer email format
      const validEmail = email.trim().toLowerCase();
      // Default authorized organizer login
      if (
        (validEmail === 'organizer@arena.edu' || validEmail.includes('organizer') || validEmail.includes('admin') || validEmail === 'sports@college.edu') &&
        pass.length >= 6
      ) {
        const sessionPayload = {
          email: validEmail,
          token: 'arena_token_' + Math.random().toString(36).substring(2),
          timestamp: Date.now(),
        };
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(sessionPayload));
        setIsAuthenticated(true);
        setUserEmail(validEmail);
        return { success: true };
      } else {
        // Also allow custom valid organizer login if password matches default pattern
        if (validEmail.includes('@') && pass === 'Admin@123') {
          const sessionPayload = {
            email: validEmail,
            token: 'arena_token_' + Math.random().toString(36).substring(2),
            timestamp: Date.now(),
          };
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(sessionPayload));
          setIsAuthenticated(true);
          setUserEmail(validEmail);
          return { success: true };
        }
        return {
          success: false,
          error: 'Invalid organizer credentials. Try organizer@arena.edu / Admin@123',
        };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during login.' };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
