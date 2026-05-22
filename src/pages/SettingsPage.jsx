import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = ['Politics', 'Sports', 'Technology', 'Business', 'Entertainment', 'Health', 'Science'];
const notificationTypes = ['email', 'push', 'both'];
const frequencies = ['immediate', 'hourly', 'daily'];

const SettingsPage = () => {
  const { api, user } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({ categories: [], notificationType: 'email', frequency: 'immediate', breakingOnly: true });
  const [message, setMessage] = useState('');
  const [testStatus, setTestStatus] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get('/news/preferences').then((res) => setPreferences(res.data)).catch(() => {});
  }, [user]);

  const toggleCategory = (category) => {
    setPreferences((prev) => ({
      ...prev,
      categories: prev.categories.includes(category) ? prev.categories.filter((item) => item !== category) : [...prev.categories, category],
    }));
  };

  const savePreferences = async () => {
    try {
      await api.put('/subscribe/preferences', { preferences });
      setMessage('Preferences saved successfully.');
      setTestStatus('');
    } catch {
      setMessage('Unable to save settings.');
    }
  };

  const sendTestEmail = async () => {
    try {
      setTestStatus('Sending test email...');
      const { data } = await api.post('/subscribe/send-test-email');
      setTestStatus(data.message || 'Test email sent. Check your inbox.');
    } catch (error) {
      setTestStatus(error.response?.data?.message || 'Test email failed. Check backend logs and SMTP credentials.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Notification Settings</h2>
          <p className="mt-2 text-slate-400">Customize categories, alert frequency, and notification channels.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/')} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white">
            Back to Dashboard
          </button>
          <Link to="/" className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Go Home
          </Link>
        </div>
      </div>
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 p-6 shadow-xl shadow-slate-950/30">
            <h3 className="mb-4 text-lg font-semibold text-white">Categories</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <button key={category} onClick={() => toggleCategory(category)} className={`rounded-2xl px-4 py-3 text-sm transition ${preferences.categories.includes(category) ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'border border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 p-6 shadow-xl shadow-slate-950/30">
            <h3 className="mb-4 text-lg font-semibold text-white">Delivery</h3>
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">Notification Type</label>
              <select value={preferences.notificationType} onChange={(e) => setPreferences({ ...preferences, notificationType: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100">
                {notificationTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <label className="block text-sm text-slate-300">Alert Frequency</label>
              <select value={preferences.frequency} onChange={(e) => setPreferences({ ...preferences, frequency: e.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100">
                {frequencies.map((frequency) => <option key={frequency} value={frequency}>{frequency}</option>)}
              </select>
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" checked={preferences.breakingOnly} onChange={(e) => setPreferences({ ...preferences, breakingOnly: e.target.checked })} className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-sky-500" />
                Breaking news only alerts
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <button onClick={savePreferences} className="rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">Save Settings</button>
            <button onClick={sendTestEmail} className="rounded-2xl border border-slate-700 bg-slate-950 px-6 py-3 text-slate-200 transition hover:border-sky-400 hover:text-white">Send test email</button>
          </div>
          <div className="space-y-1 text-right">
            {message && <p className="text-sm text-slate-300">{message}</p>}
            {testStatus && <p className="text-sm text-slate-300">{testStatus}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
