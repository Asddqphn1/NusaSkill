import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomDropdown from '../components/ui/CustomDropdown';
import {
  MapPin,
  GraduationCap,
  Calendar,
  Mail,
  Pencil,
  X,
  ArrowRight,
} from 'lucide-react';

/* ─── Education options (shared constant) / Pilihan pendidikan ─── */
const PENDIDIKAN_OPTIONS = [
  { value: 'SMA/SMK', label: 'SMA / SMK' },
  { value: 'D3', label: 'Diploma 3 (D3)' },
  { value: 'S1', label: 'Sarjana (S1)' },
  { value: 'S2', label: 'Magister (S2)' },
  { value: 'Lainnya', label: 'Lainnya' },
];

/* ─── Reusable input style / Gaya input reusable ─── */
const INPUT_STYLE: React.CSSProperties = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  padding: '12px 16px',
  width: '100%',
};

export default function ProfilePage() {
  const { user, profile } = useAuthStore();

  // Edit profile modal state / State modal edit profil
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editNama, setEditNama] = useState(profile?.nama || '');
  const [editLokasi, setEditLokasi] = useState(profile?.lokasi || '');
  const [editPendidikan, setEditPendidikan] = useState(profile?.pendidikanTerakhir || '');

  /** Open edit modal with current values / Buka modal edit dengan nilai saat ini */
  const openEditModal = () => {
    setEditNama(profile?.nama || '');
    setEditLokasi(profile?.lokasi || '');
    setEditPendidikan(profile?.pendidikanTerakhir || '');
    setShowEditModal(true);
  };

  /** Handle profile update / Menangani pembaruan profil */
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setEditLoading(true);
    try {
      await api.put(`/user-profiles/${profile.id}`, {
        nama: editNama,
        lokasi: editLokasi,
        pendidikanTerakhir: editPendidikan,
      });
      // Refresh profile from server / Refresh profil dari server
      await useAuthStore.getState().checkOnboarding();
      setShowEditModal(false);
      toast.success('Profil berhasil diperbarui!');
    } catch {
      toast.error('Gagal memperbarui profil. Coba lagi.');
    } finally {
      setEditLoading(false);
    }
  };

  /** Profile info cards data / Data kartu informasi profil */
  const infoCards = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: MapPin, label: 'Lokasi', value: profile?.lokasi },
    { icon: GraduationCap, label: 'Pendidikan', value: profile?.pendidikanTerakhir },
    { icon: Calendar, label: 'Terdaftar Sejak', value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric',
          })
        : '-'
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10">
        <div className="animate-fade-in space-y-6 sm:space-y-8">
          {/* ═══ Page Header / Header Halaman ═══ */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Halo, {profile?.nama}! 👋
              </h1>
              <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                Kelola informasi akun Anda di sini.
              </p>
            </div>
            <button
              onClick={openEditModal}
              className="btn-secondary text-sm px-5 py-2.5 whitespace-nowrap self-start sm:self-auto"
              style={{ borderRadius: 'var(--radius-full)' }}
              id="edit-profile-button"
            >
              <Pencil size={14} />
              Edit Profil
            </button>
          </header>

          {/* ═══ Profile Card / Kartu Profil Utama ═══ */}
          <div className="glass-card p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* Avatar */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0"
              style={{
                background: 'var(--gradient-button)',
                color: 'white',
                boxShadow: 'var(--shadow-button)',
              }}
            >
              {profile?.nama?.charAt(0).toUpperCase() || '?'}
            </div>

            <div className="text-center sm:text-left min-w-0">
              <h2
                className="text-lg sm:text-xl font-bold truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {profile?.nama}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {user?.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <span className="badge badge-blue">{profile?.pendidikanTerakhir || '-'}</span>
                <span className="badge badge-green">{profile?.lokasi || '-'}</span>
              </div>
            </div>
          </div>

          {/* ═══ Detail Info Grid / Grid Informasi Detail ═══ */}
          <div className="glass-card p-5 sm:p-7">
            <h3
              className="text-lg font-bold mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Informasi Detail
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoCards.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'var(--glow-primary)',
                      color: 'var(--accent-primary-light)',
                    }}
                  >
                    <item.icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="block text-[11px] font-medium uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="block text-sm font-semibold mt-0.5 truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.value || '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Quick Actions / Aksi Cepat ═══ */}
          <div className="glass-card p-5 sm:p-7">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Aksi Cepat
            </h3>
            <a
              href="/roadmap"
              className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 group"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--glow-primary)', color: 'var(--accent-primary-light)' }}
                >
                  📚
                </div>
                <div>
                  <span className="font-semibold text-sm block" style={{ color: 'var(--text-primary)' }}>
                    Lihat Roadmap Saya
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Buka jalur pembelajaran personal Anda
                  </span>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                style={{ color: 'var(--text-muted)' }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          EDIT PROFILE MODAL / Modal Edit Profil
         ═══════════════════════════════════════════════ */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="glass-card p-6 sm:p-8 max-w-md w-full animate-zoom-in"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header / Header Modal */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Edit Profil
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Name / Nama */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Nama Lengkap
                </label>
                <input
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  required
                  className="focus:outline-none"
                  style={INPUT_STYLE}
                  id="edit-nama"
                />
              </div>

              {/* Location / Lokasi */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Lokasi / Kota
                </label>
                <input
                  value={editLokasi}
                  onChange={(e) => setEditLokasi(e.target.value)}
                  required
                  className="focus:outline-none"
                  style={INPUT_STYLE}
                  id="edit-lokasi"
                />
              </div>

              {/* Education / Pendidikan */}
              <CustomDropdown
                label="Pendidikan Terakhir"
                options={PENDIDIKAN_OPTIONS}
                value={editPendidikan}
                onChange={setEditPendidikan}
                id="edit-pendidikan"
              />

              {/* Buttons / Tombol */}
              <div className="pt-4 flex gap-3" style={{ borderTop: '1px solid var(--border-muted)' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1 py-3 cursor-pointer"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn-primary flex-[2] py-3 cursor-pointer"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}