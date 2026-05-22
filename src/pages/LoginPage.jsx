import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h1 className="mb-4 text-3xl font-semibold text-white">Welcome back</h1>
      <p className="mb-6 text-slate-400">Sign in to access personalized news alerts and dashboard analytics.</p>
      {error && <p className="mb-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm text-slate-300">
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <button type="submit" className="w-full rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">Login</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">New here? <Link to="/register" className="text-sky-400 hover:text-sky-300">Create an account</Link></p>
    </div>
  );
};

export default LoginPage;
