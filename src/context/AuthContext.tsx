import React, { createContext, useContext, useState, useEffect } from 'react';

export const ORGANIZER_PASSKEY = '2AB24CD028';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  loading: boolean;
  login: (passkey: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'arena_organizer_passkey_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    function checkSession() {
      try {
        const sessionData = localStorage.getItem(LOCAL_AUTH_KEY);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.token && parsed.role === 'organizer') {
            setIsAuthenticated(true);
            setUserEmail('ORGANIZER');
          }
        }
      } catch (err) {
        console.error('Auth session error:', err);
        localStorage.removeItem(LOCAL_AUTH_KEY);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (passkey: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanKey = passkey.trim().toUpperCase();

      if (cleanKey === ORGANIZER_PASSKEY) {
        const sessionPayload = {
          role: 'organizer',
          token: 'arena_passkey_auth_' + Date.now(),
          timestamp: Date.now(),
        };
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(sessionPayload));
        setIsAuthenticated(true);
        setUserEmail('ORGANIZER');
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Invalid passkey. Access denied.',
        };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during authentication.' };
    }
  };

  const logout = async (): Promise<void> => {
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
