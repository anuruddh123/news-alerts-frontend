import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Bell,
  Settings,
  LogOut,
  User,
  Sparkles,
  X,
  Check,
  Trash2,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const {
    user,
    logout,
    notifications,
    markNotificationsRead,
    markAllRead,
    deleteNotification,
    clearNotifications,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const unreadCount =
    notifications?.filter((item) => !item.read).length || 0;

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) markNotificationsRead();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300">
            <Sparkles size={22} className="text-slate-950" />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">News Alerts</h1>
            <p className="text-xs text-slate-500 uppercase tracking-[0.28em]">
              Live Headlines
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/settings"
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    location.pathname === '/settings'
                      ? 'bg-sky-500 text-black'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  Settings
                </Link>

                <button
                  onClick={logout}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-rose-500/10"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-sky-400 px-4 py-2 text-black"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* USER SECTION */}
          {user && (
            <div className="relative flex items-center gap-3" ref={dropdownRef}>

              {/* USER INFO (desktop only) */}
              <div className="hidden lg:flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                <User size={18} />
                <div>
                  <p className="text-sm text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500">Premium Member</p>
                </div>
              </div>

              {/* BELL */}
              <button
                onClick={handleBellClick}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 🔥 MOBILE SETTINGS FIX (ADDED ONLY THIS) */}
              <div className="flex md:hidden items-center gap-2">

                <Link
                  to="/settings"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
                >
                  <Settings size={18} />
                </Link>

                <button
                  onClick={logout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
                >
                  <LogOut size={18} />
                </button>

              </div>

              {/* NOTIFICATIONS DROPDOWN (unchanged) */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div className="absolute right-0 top-16 w-[380px] rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    Notifications...
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;