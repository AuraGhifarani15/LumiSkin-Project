import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Registrasi berhasil! Cek email kamu untuk verifikasi.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 flex flex-col gap-6">
        {/* Header */}
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
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors duration-200"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Daftar dengan Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors duration-200"
          >
            <img src="https://github.com/favicon.ico" alt="GitHub" className="w-4 h-4" />
            Daftar dengan GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
