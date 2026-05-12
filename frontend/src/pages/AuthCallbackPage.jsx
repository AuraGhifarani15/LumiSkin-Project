import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const avatar = searchParams.get('avatar');

    if (token) {
      login({ name, email, avatar }, token);
      navigate('/analyze');
    } else {
      navigate('/login?error=google_failed');
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <p className="text-neutral-400 text-sm">Memproses login...</p>
    </div>
  );
}

export default AuthCallbackPage;
