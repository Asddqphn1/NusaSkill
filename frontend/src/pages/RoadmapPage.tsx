import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomDropdown from '../components/ui/CustomDropdown';
import RoadmapTree from '../components/roadmap/RoadmapTree';
import { RoadmapSkeleton } from '../components/ui/SkeletonLoader';
import { Plus, ChevronRight, X, BookOpen, Clock } from 'lucide-react';

/* ─── Dropdown option constants / Konstanta opsi dropdown ─── */
const LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Pemula (Beginner)' },
  { value: 'Intermediate', label: 'Menengah (Intermediate)' },
  { value: 'Advanced', label: 'Mahir (Advanced)' },
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

export default function RoadmapPage() {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);

  // Roadmap data state / State data roadmap
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState<{ id: string; name: string }[]>([]);

  // New roadmap modal state / State modal roadmap baru
  const [showModal, setShowModal] = useState(false);
  const [modalCareer, setModalCareer] = useState('');
  const [modalLevel, setModalLevel] = useState('Beginner');
  const [modalWaktu, setModalWaktu] = useState('5');

  const profileId = profile?.id;

  const fetchRoadmaps = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/roadmaps/profile/${profileId}`);
      setRoadmaps(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error('Gagal memuat Roadmap');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  /** Fetch careers list for dropdown / Ambil daftar karir untuk dropdown */
  const fetchCareers = useCallback(async () => {
    try {
      const { data } = await api.get('/careers');
      setCareers(data.careers || []);
    } catch (err) {
      console.error('Failed to fetch careers:', err);
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
    fetchCareers();
  }, [fetchRoadmaps, fetchCareers]);

  /** Handle new roadmap creation / Menangani pembuatan roadmap baru */
  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Validate required fields / Validasi field yang diperlukan
    if (!modalCareer) {
      toast.error('Pilih target karir terlebih dahulu.');
      return;
    }

    try {
      // Update profile with roadmap-specific data
      // Perbarui profil dengan data khusus roadmap
      await api.put(`/user-profiles/${profile.id}`, {
        targetCareerId: modalCareer,
        levelKemampuan: modalLevel,
        waktuBelajarJam: Number(modalWaktu),
      });
      await useAuthStore.getState().checkOnboarding();
      setShowModal(false);
      toast.success('Melanjutkan ke Asesmen...');
      navigate('/assessment?mode=new_roadmap');
    } catch {
      toast.error('Gagal menyiapkan roadmap. Coba lagi.');
    }
  };

  // Map careers to dropdown options / Petakan karir ke opsi dropdown
  const careerOptions = careers.map((c) => ({ value: c.id, label: c.name }));

  // Check if we have a valid roadmap / Cek apakah ada roadmap yang valid
  const hasRoadmap = roadmaps.length > 0 && roadmaps[0]?.roadmapData?.phases;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
        <div className="animate-fade-in space-y-6 sm:space-y-8">
          {/* ═══ Page Header / Header Halaman ═══ */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Roadmap Saya 🗺️
              </h1>
              <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                Jalur pembelajaran personal untuk meraih karir impian.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap self-start sm:self-auto"
              style={{ borderRadius: 'var(--radius-full)' }}
              id="new-roadmap-button"
            >
              <Plus size={16} />
              Buat Roadmap Baru
            </button>
          </header>

          {/* ═══ Roadmap Content / Konten Roadmap ═══ */}
          {loading ? (
            <RoadmapSkeleton />
          ) : hasRoadmap ? (
            <RoadmapTree
              roadmapData={roadmaps[0].roadmapData}
              userLevel={profile?.levelKemampuan || 'Pemula'}
            />
          ) : (
            /* Empty state / State kosong */
            <div className="glass-card p-6 sm:p-10">
              <div className="text-center py-12 sm:py-20">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <BookOpen size={28} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Belum ada Roadmap.
                </p>
                <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-muted)' }}>
                  Klik "Buat Roadmap Baru" untuk memulai perjalanan belajar Anda.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary text-sm px-6 py-2.5"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Plus size={16} />
                  Buat Roadmap Pertama
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          NEW ROADMAP MODAL / Modal Roadmap Baru
          Collects: Career Target, Skill Level, Study Time
          Mengumpulkan: Target Karir, Level Kemampuan, Waktu Belajar
         ═══════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-card p-6 sm:p-8 max-w-md w-full animate-zoom-in"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header / Header Modal */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Buat Roadmap Baru
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Tentukan target belajar Anda. AI akan menyusun roadmap yang dipersonalisasi.
            </p>

            <form onSubmit={handleCreateRoadmap} className="space-y-5">
              {/* Career Target / Target Karir */}
              <CustomDropdown
                label="Target Karir"
                options={careerOptions}
                value={modalCareer}
                onChange={setModalCareer}
                placeholder="Pilih Karir Impian..."
                id="modal-career"
              />

              {/* Skill Level / Level Kemampuan */}
              <CustomDropdown
                label="Level Kemampuan Saat Ini"
                options={LEVEL_OPTIONS}
                value={modalLevel}
                onChange={setModalLevel}
                id="modal-level"
              />

              {/* Study Time / Waktu Belajar */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-sm flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Clock size={14} style={{ color: 'var(--accent-primary-light)' }} />
                  Waktu Belajar (Jam/Hari)
                </label>
                <input
                  type="number"
                  value={modalWaktu}
                  onChange={(e) => setModalWaktu(e.target.value)}
                  min="1"
                  required
                  className="focus:outline-none"
                  style={INPUT_STYLE}
                  id="modal-waktu"
                />
              </div>

              {/* Submit Buttons / Tombol Submit */}
              <div className="pt-4 flex gap-3" style={{ borderTop: '1px solid var(--border-muted)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-3 cursor-pointer"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-[2] py-3 group cursor-pointer"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Lanjut ke Asesmen
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
