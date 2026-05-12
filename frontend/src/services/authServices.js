import api from './api';

export const authService = {
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  loginWithGoogle: () => {
    window.location.href = 'http://localhost:5000/auth/google';
  },
};
