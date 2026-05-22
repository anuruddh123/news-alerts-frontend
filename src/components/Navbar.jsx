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

  const [showNotifications, setShowNotifications] =
    useState(false);

  const location = useLocation();

  const dropdownRef = useRef(null);

  const unreadCount =
    notifications?.filter(
      (item) => !item.read
    ).length || 0;

  const handleBellClick = () => {

    setShowNotifications(
      (prev) => !prev
    );

    if (unreadCount > 0) {
      markNotificationsRead();
    }
  };

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setShowNotifications(
          false
        );
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl">

      {/* TOP GRADIENT */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          className="group relative flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 shadow-lg shadow-sky-500/30">

            <Sparkles
              size={22}
              className="text-slate-950"
            />
          </div>

          <div>

            <h1 className="text-xl font-black tracking-tight text-white">
              News Alerts
            </h1>

            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Live Headlines
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* NAV LINKS */}
          <nav className="hidden items-center gap-3 md:flex">

            {user ? (
              <>
                <Link
                  to="/settings"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    location.pathname ===
                    '/settings'
                      ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Settings
                </Link>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-rose-500 hover:bg-rose-500/10 hover:text-white"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    location.pathname ===
                    '/login'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* USER + NOTIFICATION */}
          {user && (
            <div
              className="relative flex items-center gap-3"
              ref={dropdownRef}
            >

              {/* USER */}
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 lg:flex">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 text-sky-300">
                  <User size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {user?.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    Premium Member
                  </p>
                </div>
              </div>

              {/* BELL */}
              <button
                onClick={handleBellClick}
                className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-300 transition-all duration-300 hover:border-sky-500 hover:text-white"
              >

                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-cyan-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <Bell
                  size={20}
                  className="relative z-10"
                />

                {/* BADGE */}
                {unreadCount > 0 && (
                  <motion.span
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-rose-500/40"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              {/* DROPDOWN */}
              <AnimatePresence>

                {showNotifications && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="absolute right-0 top-16 z-50 w-[380px] overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 shadow-[0_25px_80px_rgba(2,6,23,0.85)] backdrop-blur-2xl"
                  >

                    {/* HEADER */}
                    <div className="relative overflow-hidden border-b border-slate-800 p-5">

                      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />

                      <div className="relative flex items-center justify-between">

                        <div>

                          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">
                            Notifications
                          </p>

                          <h2 className="mt-2 text-xl font-bold text-white">
                            Live Alerts
                          </h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => markAllRead()}
                            title="Mark all read"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-slate-500 hover:text-white"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            onClick={() => clearNotifications()}
                            title="Clear all"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-rose-500 hover:text-white"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            onClick={() => setShowNotifications(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-slate-500 hover:text-white"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="max-h-[450px] overflow-y-auto p-4">

                      {notifications?.length === 0 ? (

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center">

                          <Bell
                            size={34}
                            className="mx-auto text-slate-600"
                          />

                          <p className="mt-4 text-sm text-slate-400">
                            No live alerts available.
                          </p>
                        </div>

                      ) : (

                        <div className="space-y-3">

                          {notifications
                            .slice(0, 8)
                            .map(
                              (
                                notification,
                                index
                              ) => (

                                <motion.div
                                  key={
                                    notification.id ||
                                    index
                                  }
                                  initial={{
                                    opacity: 0,
                                    x: 20,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                  }}
                                  transition={{
                                    delay:
                                      index *
                                      0.05,
                                  }}
                                  className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-300 hover:border-sky-500/30 hover:bg-slate-900"
                                >

                                  <div className="flex items-start justify-between gap-3">

                                    <div className="flex-1">

                                      <p className="line-clamp-2 text-sm font-semibold leading-6 text-white">
                                        {
                                          notification.title
                                        }
                                      </p>

                                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                                        {notification.description ||
                                          'Breaking news alert received.'}
                                      </p>

                                      <div className="mt-3 flex items-center gap-2">

                                        <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-sky-300">
                                          Live
                                        </span>

                                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                          {new Date(
                                            notification.time
                                          ).toLocaleTimeString(
                                            [],
                                            {
                                              hour:
                                                '2-digit',
                                              minute:
                                                '2-digit',
                                            }
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-slate-800 text-slate-400 transition hover:border-rose-500 hover:text-white"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            )}
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    {notifications?.length > 0 && (
                      <div className="border-t border-slate-800 p-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to="/alerts"
                            onClick={() => setShowNotifications(false)}
                            className="flex-1 rounded-2xl bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 text-center hover:bg-slate-700"
                          >
                            View All Alerts
                          </Link>

                          <Link
                            to="/settings"
                            onClick={() => setShowNotifications(false)}
                            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                        </div>
                      </div>
                    )}
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