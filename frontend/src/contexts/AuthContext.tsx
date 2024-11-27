//frontend\src\contexts\AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token');

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await api.get('/auth/me');
          setUserState(response.data.user);
        } catch (error) {
          logout(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      Cookies.set('token', token);
      setUserState(user);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/dashboard');
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = (redirect: boolean = true) => {
    Cookies.remove('token');
    setUserState(null);
    if (redirect) {
      navigate('/login');
    }
  };

  const setUser = (user: User) => {
    setUserState(user);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
