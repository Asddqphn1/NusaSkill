import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data;
      setAuth(user, token);
      navigate('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || 'Login gagal. Silakan coba lagi.');
      } else {
        setErrorMsg('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-muted)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      {errorMsg && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{
            background: 'rgba(251, 113, 133, 0.08)',
            border: '1px solid rgba(251, 113, 133, 0.2)',
            color: 'var(--accent-rose)',
          }}
        >
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}

      {/* Email */}
      <div className="relative w-full">
        <div
          className="absolute left-4 top-3.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <Mail size={16} />
        </div>
        <input
          {...register('email')}
          type="email"
          className="w-full pl-11 pr-4 py-3 focus:outline-none"
          style={inputStyle}
          placeholder="Alamat Email"
          id="login-email"
        />
        {errors.email && (
          <p className="text-xs mt-1" style={{ color: 'var(--accent-rose)' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="relative w-full">
        <div
          className="absolute left-4 top-3.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <Lock size={16} />
        </div>
        <input
          {...register('password')}
          type="password"
          className="w-full pl-11 pr-4 py-3 focus:outline-none"
          style={inputStyle}
          placeholder="Kata Sandi"
          id="login-password"
        />
        {errors.password && (
          <p className="text-xs mt-1" style={{ color: 'var(--accent-rose)' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between w-full text-sm">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="appearance-none w-4 h-4 rounded cursor-pointer transition-colors"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-muted)',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>Ingat saya</span>
        </label>
        <button
          type="button"
          className="font-medium hover:underline cursor-pointer"
          style={{ color: 'var(--accent-primary-light)' }}
        >
          Lupa sandi?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3.5 mt-1 group"
        style={{ borderRadius: 'var(--radius-md)' }}
        id="login-submit"
      >
        <span className="font-semibold">
          {isLoading ? 'Memproses...' : 'Masuk'}
        </span>
        {!isLoading && (
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </button>

      {/* Switch */}
      <div className="flex justify-center items-center gap-1 mt-1 text-sm">
        <span style={{ color: 'var(--text-secondary)' }}>Belum punya akun?</span>
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: 'var(--accent-primary-light)' }}
        >
          Daftar sekarang
        </button>
      </div>
    </form>
  );
}
