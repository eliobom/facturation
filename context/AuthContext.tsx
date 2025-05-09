import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getUserFromStorage, saveUserToStorage, removeUserFromStorage } from '@/services/storageService';
import { loginUser, registerUser, fetchUserData } from '@/services/authService';

// Define user type
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'coach';
};

// Define context type
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'coach') => Promise<void>;
};

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and provides the auth context value
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check if user is logged in when the app loads
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const storedUser = await getUserFromStorage();
        if (storedUser && mounted && isMounted.current) {
          // Optionally refresh user data from API
          const refreshedUser = await fetchUserData(storedUser.id);
          if (mounted && isMounted.current) {
            setUser(refreshedUser || storedUser);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        if (mounted && isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      
      const userData = await loginUser(email, password);
      if (isMounted.current) {
        setUser(userData);
        await saveUserToStorage(userData);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Sign in error:', error);
        throw error;
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      
      await removeUserFromStorage();
      if (isMounted.current) {
        setUser(null);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Sign out error:', error);
        throw error;
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: 'student' | 'coach') => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      
      const userData = await registerUser(name, email, password, role);
      if (isMounted.current) {
        setUser(userData);
        await saveUserToStorage(userData);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Registration error:', error);
        throw error;
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // The value that will be provided to consumers of this context
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}