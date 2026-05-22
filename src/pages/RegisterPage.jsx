import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h1 className="mb-4 text-3xl font-semibold text-white">Create your account</h1>
      <p className="mb-6 text-slate-400">Sign up to receive real-time news alerts, category subscriptions, and personalized notification settings.</p>
      {error && <p className="mb-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm text-slate-300">
          Full Name
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <label className="block text-sm text-slate-300">
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <button type="submit" className="w-full rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">Register</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="text-sky-400 hover:text-sky-300">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
