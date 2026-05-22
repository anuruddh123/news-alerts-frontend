import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Check, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlertsPage = () => {
  const { notifications, markAllRead, deleteNotification, clearNotifications } = useAuth();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Notifications</p>
          <h1 className="mt-2 text-3xl font-bold">All Alerts</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markAllRead()}
            className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          >
            <Check size={16} />
            Mark all read
          </button>

          <button
            onClick={() => clearNotifications()}
            className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-4 py-2 text-sm text-white hover:bg-rose-600"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        </div>
      </div>

      {(!notifications || notifications.length === 0) ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <Bell size={40} className="mx-auto text-slate-600" />
          <p className="mt-4 text-sm text-slate-400">No alerts yet.</p>
          <div className="mt-4">
            <Link to="/" className="text-sky-400 underline">Go Home</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start justify-between gap-4 rounded-2xl border p-4 ${n.read ? 'border-slate-800 bg-slate-900/60' : 'border-sky-500/30 bg-slate-900/80'}`}>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{n.title}</p>
                <p className="mt-2 text-sm text-slate-400">{n.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{new Date(n.time).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
