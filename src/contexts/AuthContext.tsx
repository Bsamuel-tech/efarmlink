import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'farmer' | 'buyer') => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    type: 'farmer' | 'buyer';
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setToken(token);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await apiClient.getProfile();
      setUser(userData);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, clear it
      localStorage.removeItem('authToken');
      apiClient.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    type: 'farmer' | 'buyer';
    password: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        password: userData.password,
        userType: userData.type,
      });

      if (response.token) {
        apiClient.setToken(response.token);
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: 'farmer' | 'buyer'): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.login(email, password, userType);

      if (response.token) {
        apiClient.setToken(response.token);
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      apiClient.setToken(null);
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};