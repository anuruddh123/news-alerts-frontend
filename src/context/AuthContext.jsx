import { createContext, useContext, useEffect, useState, useMemo } from 'react';
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

  // ✅ BACKEND URL
  const backendBaseUrl = useMemo(() => {
    return (
      import.meta.env.VITE_API_URL ||
      'https://news-alerts-backend.onrender.com'
    ).replace(/\/+$/, '');
  }, []);

  // ✅ SINGLE AXIOS INSTANCE
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `${backendBaseUrl}/api`,
    });

    // ✅ TOKEN INTERCEPTOR
    instance.interceptors.request.use((config) => {
      const savedToken = localStorage.getItem('news_token');

      if (savedToken) {
        config.headers.Authorization = `Bearer ${savedToken}`;
      }

      return config;
    });

    return instance;
  }, [backendBaseUrl]);

  // ---------------- LOAD USER ----------------
  const loadUser = async () => {
    if (!token) return;

    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.log('Session expired');
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      loadUser();
    }
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
      auth: {
        token: localStorage.getItem('news_token'),
      },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    newSocket.on('newsUpdate', (articles) => {
      window.dispatchEvent(
        new CustomEvent('newsUpdate', {
          detail: articles,
        })
      );
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

      setNotifications((prev) => [
        newNotification,
        ...prev,
      ].slice(0, 20));

      window.dispatchEvent(
        new CustomEvent('newsAlert', {
          detail: newNotification,
        })
      );
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    setSocket(newSocket);
  };

  // ---------------- NOTIFICATIONS ----------------
  const markNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        api,
        login,
        register,
        logout,
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