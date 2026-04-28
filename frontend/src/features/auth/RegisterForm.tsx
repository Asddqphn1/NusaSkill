import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await api.post('/auth/register', { email: data.email, password: data.password });
      const { token, user } = res.data;
      setAuth(user, token);
      navigate('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
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
          id="register-email"
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
          id="register-password"
        />
        {errors.password && (
          <p className="text-xs mt-1" style={{ color: 'var(--accent-rose)' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative w-full">
        <div
          className="absolute left-4 top-3.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <ShieldCheck size={16} />
        </div>
        <input
          {...register('confirmPassword')}
          type="password"
          className="w-full pl-11 pr-4 py-3 focus:outline-none"
          style={inputStyle}
          placeholder="Konfirmasi Kata Sandi"
          id="register-confirm-password"
        />
        {errors.confirmPassword && (
          <p className="text-xs mt-1" style={{ color: 'var(--accent-rose)' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3.5 mt-1 group"
        style={{ borderRadius: 'var(--radius-md)' }}
        id="register-submit"
      >
        <span className="font-semibold">
          {isLoading ? 'Memproses...' : 'Daftar'}
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
        <span style={{ color: 'var(--text-secondary)' }}>Sudah punya akun?</span>
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: 'var(--accent-primary-light)' }}
        >
          Masuk disini
        </button>
      </div>
    </form>
  );
}
