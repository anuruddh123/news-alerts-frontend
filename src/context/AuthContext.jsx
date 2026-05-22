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

  // ✅ SAFE BASE URL (no trailing slash issues)
  const backendBaseUrl = (import.meta.env.VITE_API_URL || 'https://news-alerts-backend.onrender.com').replace(/\/+$/, '');

  // ✅ Axios instance (important fix: avoid multiple instances issue)
  const api = axios.create({
    baseURL: `${backendBaseUrl}/api`,
  });

  // ✅ attach token automatically
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // ---------------- LOAD USER ----------------
  const loadUser = async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.log('Auth expired, logging out');
      logout();
    }
  };

  useEffect(() => {
    if (token) loadUser();
  }, [token]);

  // ---------------- LOGIN ----------------
  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);

    localStorage.setItem('news_token', data.token);
    setToken(data.token);
    setUser(data.user);

    navigate('/');
  };

  // ---------------- REGISTER ----------------
  const register = async (credentials) => {
    const { data } = await api.post('/auth/register', credentials);

    localStorage.setItem('news_token', data.token);
    setToken(data.token);
    setUser(data.user);

    navigate('/');
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem('news_token');
    setToken('');
    setUser(null);
    setNotifications([]);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    navigate('/login');
  };

  // ---------------- SOCKET ----------------
  const initializeSocket = () => {
    if (socket || !token) return;

    const newSocket = io(backendBaseUrl, {
      auth: { token },
      transports: ['websocket'], // 🔥 improves stability on Render
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('newsUpdate', (articles) => {
      window.dispatchEvent(new CustomEvent('newsUpdate', { detail: articles }));
    });

    newSocket.on('newsAlert', (alert) => {
      const newNotification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: alert.title || 'Breaking News',
        description: alert.description || '',
        url: alert.url || '#',
        time: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 20));

      window.dispatchEvent(
        new CustomEvent('newsAlert', { detail: newNotification })
      );
    });

    setSocket(newSocket);
  };

  // ---------------- NOTIFICATIONS ----------------
  const markNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
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