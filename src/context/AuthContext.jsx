import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('news_token') || '');
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://news-alerts-backend.onrender.com/api' });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const loadUser = async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (token) loadUser();
  }, [token]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('news_token', data.token);
    setToken(data.token);
    setUser(data.user);
    navigate('/');
  };

  const register = async (credentials) => {
    const { data } = await api.post('/auth/register', credentials);
    localStorage.setItem('news_token', data.token);
    setToken(data.token);
    setUser(data.user);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('news_token');
    setToken('');
    setUser(null);
    setNotifications([]);
    if (socket) socket.disconnect();
    navigate('/login');
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const initializeSocket = () => {
    if (socket || !token) return;
    const newSocket = io(import.meta.env.VITE_API_URL || 'https://news-alerts-backend.onrender.com', {
      auth: { token },
    });
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });
    newSocket.on('newsUpdate', (articles) => {
      const event = new CustomEvent('newsUpdate', { detail: articles });
      window.dispatchEvent(event);
    });
    newSocket.on('newsAlert', (alert) => {
      const newNotification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: alert.title || alert.message || 'Breaking News Alert',
        description: alert.description || alert.summary || alert.text || '',
        url: alert.url || alert.link || '#',
        time: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
      const event = new CustomEvent('newsAlert', { detail: newNotification });
      window.dispatchEvent(event);
    });
    setSocket(newSocket);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        api,
        initializeSocket,
        notifications,
        markNotificationsRead,
        markAllRead,
        deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
