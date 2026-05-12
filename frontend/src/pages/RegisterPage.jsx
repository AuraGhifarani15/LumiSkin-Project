import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/register', form);
      login(data.data.user, data.data.token);
      navigate('/analyze');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-neutral-900">Buat Akun</h1>
          <p className="text-sm text-neutral-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nama Lengkap" name="name" placeholder="Masukkan nama lengkap" value={form.name} onChange={handleChange} />
          <FormField label="Email" name="email" type="email" placeholder="nama@email.com" value={form.email} onChange={handleChange} />
          <FormField label="Password" name="password" type="password" placeholder="Minimal 6 karakter" value={form.password} onChange={handleChange} />
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-400">atau daftar dengan</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors duration-200">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Daftar dengan Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
