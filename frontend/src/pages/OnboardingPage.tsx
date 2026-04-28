import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import CustomDropdown from '../components/ui/CustomDropdown';
import ThemeToggle from '../components/ui/ThemeToggle';
import { ArrowRight, User, MapPin, Sparkles } from 'lucide-react';

/* ─── Validation schema / Skema validasi ─── */
const onboardingSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter'),
  pendidikanTerakhir: z.string().min(2, 'Pendidikan tidak boleh kosong'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

/* ─── Education options / Pilihan pendidikan ─── */
const PENDIDIKAN_OPTIONS = [
  { value: 'SMA/SMK', label: 'SMA / SMK' },
  { value: 'D3', label: 'Diploma 3 (D3)' },
  { value: 'S1', label: 'Sarjana (S1)' },
  { value: 'S2', label: 'Magister (S2)' },
  { value: 'Lainnya', label: 'Lainnya' },
];

/* ─── Reusable input style / Gaya input yang dapat digunakan ulang ─── */
const INPUT_STYLE: React.CSSProperties = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  width: '100%',
  padding: '12px 16px',
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const setProfile = useAuthStore((s) => s.setProfile);
  const profile = useAuthStore((s) => s.profile);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  // Redirect if already onboarded / Redirect jika sudah onboarding
  useEffect(() => {
    if (profile) navigate('/profile');
  }, [profile, navigate]);

  /** Submit handler — creates user profile with basic info only */
  const onSubmit = async (formData: OnboardingFormData) => {
    setLoading(true);
    try {
      const response = await api.post('/user-profiles', formData);
      setProfile(response.data.profile);
      toast.success('Profil berhasil dibuat! 🎉');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative w-full page-enter px-4"
      style={{
        background: 'var(--bg-primary)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background decorations / Dekorasi latar belakang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '400px',
            height: '400px',
            background: 'var(--accent-primary)',
            opacity: 0.05,
            filter: 'blur(100px)',
            top: '10%',
            left: '10%',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '300px',
            height: '300px',
            background: 'var(--accent-secondary)',
            opacity: 0.04,
            filter: 'blur(80px)',
            bottom: '15%',
            right: '10%',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Theme toggle / Tombol tema */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center max-w-5xl w-full py-12 md:py-16 gap-10 lg:gap-16 relative z-10">
        {/* ─── Left Side: Context / Sisi kiri: Konteks ─── */}
        <div className="flex flex-col flex-1 items-start justify-center max-w-md animate-fade-in">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'var(--gradient-button)',
                boxShadow: 'var(--shadow-button)',
              }}
            >
              <Sparkles size={14} color="white" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              NusaSkill<span style={{ color: 'var(--accent-primary-light)' }}> AI</span>
            </span>
          </Link>

          {/* Badge */}
          <div
            className="flex items-center px-4 py-2 rounded-full mb-6"
            style={{
              background: 'var(--glow-primary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              className="font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--accent-amber)' }}
            >
              Personalisasi AI
            </span>
          </div>

          {/* Title / Judul */}
          <h1
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Kenalkan{' '}
            <span
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dirimu.
            </span>
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed max-w-sm mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Isi informasi dasar Anda agar kami dapat membuat pengalaman belajar yang lebih personal.
          </p>
        </div>

        {/* ─── Right Side: Form / Sisi kanan: Formulir ─── */}
        <div className="flex-1 w-full max-w-lg relative">
          {/* Glow behind card / Cahaya di belakang kartu */}
          <div
            className="absolute rounded-full -z-10"
            style={{
              inset: '10%',
              background: 'var(--accent-primary)',
              opacity: 0.06,
              filter: 'blur(80px)',
            }}
          />

          <div className="glass-card p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                Informasi Pribadi
              </h2>

              {/* Full Name / Nama Lengkap */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-sm flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <User size={14} style={{ color: 'var(--accent-primary-light)' }} />
                  Nama Lengkap
                </label>
                <input
                  {...register('nama')}
                  type="text"
                  placeholder="Budi Santoso"
                  className="focus:outline-none"
                  style={INPUT_STYLE}
                  id="onboarding-nama"
                />
                {errors.nama && (
                  <p className="text-xs" style={{ color: 'var(--accent-rose)' }}>
                    {errors.nama.message}
                  </p>
                )}
              </div>

              {/* Location / Lokasi */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-sm flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <MapPin size={14} style={{ color: 'var(--accent-primary-light)' }} />
                  Lokasi / Kota
                </label>
                <input
                  {...register('lokasi')}
                  type="text"
                  placeholder="Jakarta"
                  className="focus:outline-none"
                  style={INPUT_STYLE}
                  id="onboarding-lokasi"
                />
                {errors.lokasi && (
                  <p className="text-xs" style={{ color: 'var(--accent-rose)' }}>
                    {errors.lokasi.message}
                  </p>
                )}
              </div>

              {/* Last Education / Pendidikan Terakhir */}
              <Controller
                name="pendidikanTerakhir"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    label="Pendidikan Terakhir"
                    options={PENDIDIKAN_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih Pendidikan..."
                    error={errors.pendidikanTerakhir?.message}
                    id="onboarding-pendidikan"
                  />
                )}
              />

              {/* Submit Button / Tombol Kirim */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 mt-2 group"
                style={{ borderRadius: 'var(--radius-md)' }}
                id="onboarding-submit"
              >
                <span className="font-semibold">
                  {loading ? 'Menyimpan...' : 'Lanjutkan'}
                </span>
                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}