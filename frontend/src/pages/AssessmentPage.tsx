import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from '../components/ui/ThemeToggle';
import { CheckCircle, ChevronRight, Sparkles, Brain } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'onboarding';
  const profile = useAuthStore((s) => s.profile);

  // Assessment state / State asesmen
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /** Generate assessment questions from API / Buat soal asesmen dari API */
  useEffect(() => {
    const generateTest = async () => {
      if (!profile?.id) return;
      try {
        setLoading(true);
        const { data } = await api.post('/assessments/generate', { profileId: profile.id });
        setAssessmentId(data.assessmentId);
        setQuestions(data.questions || []);
      } catch (error) {
        toast.error('Gagal men-generate soal asesmen');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    generateTest();
  }, [profile?.id]);

  /** Record an answer / Catat jawaban */
  const handleAnswer = (questionIndex: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  /** Submit all answers / Kirim semua jawaban */
  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Harap jawab semua pertanyaan terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      const answerArray = questions.map((_, i) => answers[i] ?? 0);
      await api.post(`/assessments/${assessmentId}/submit`, { answers: answerArray });
      toast.success('Penyusunan Roadmap berhasil! 🎉');
      navigate('/roadmap');
    } catch {
      toast.error('Gagal mengirimkan asesmen');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate progress / Hitung progres
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const isComplete = answeredCount >= totalCount;

  /* ─── Loading State / State Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 page-enter px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full" style={{ border: '3px solid var(--border-muted)' }} />
          <div className="absolute inset-0 w-16 h-16 rounded-full animate-spin" style={{ border: '3px solid transparent', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }} />
          <Brain size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: 'var(--accent-primary-light)' }} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Menyiapkan Soal Asesmen</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI sedang menganalisis profil Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden page-enter" style={{ background: 'var(--bg-primary)', fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Glow / Cahaya Latar */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[400px] h-[400px] rounded-full animate-pulse-glow" style={{ background: 'var(--accent-primary)', opacity: 0.04, filter: 'blur(120px)', top: '5%', right: '10%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full animate-pulse-glow" style={{ background: 'var(--accent-secondary)', opacity: 0.03, filter: 'blur(100px)', bottom: '10%', left: '5%', animationDelay: '2s' }} />
      </div>

      {/* ═══ Sticky Header Bar / Bilah Header Sticky ═══ */}
      <div className="sticky top-0 z-50" style={{ background: 'var(--bg-primary)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-muted)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: 'var(--accent-primary-light)' }} />
              <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {mode === 'onboarding' ? 'Pre-Test Assessment' : 'Evaluasi Roadmap Baru'}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <span className="badge badge-blue text-[10px] sm:text-[11px]">{answeredCount}/{totalCount}</span>
            </div>
          </div>
          {/* Progress Bar / Bilah Progres */}
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, background: 'var(--gradient-button)' }} />
          </div>
        </div>
      </div>

      {/* ═══ Questions / Pertanyaan ═══ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <div className="mb-8 sm:mb-10 text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
            Umpan Balik Kemampuan
          </h2>
          <p className="text-sm sm:text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Beritahu kami sejauh mana tingkat kepercayaan diri Anda terhadap topik-topik berikut.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 stagger-children">
          {questions.map((q, index) => {
            const isAnswered = answers[index] !== undefined;
            return (
              <div
                key={index}
                className="glass-card p-4 sm:p-6 transition-all duration-300"
                style={{
                  borderColor: isAnswered ? 'var(--border-active)' : undefined,
                  boxShadow: isAnswered ? 'var(--shadow-glow)' : undefined,
                }}
                id={`question-${index}`}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div
                    className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                    style={{
                      background: isAnswered ? 'var(--glow-primary)' : 'var(--bg-input)',
                      color: isAnswered ? 'var(--accent-primary-light)' : 'var(--text-secondary)',
                    }}
                  >
                    {isAnswered ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold leading-relaxed pt-1" style={{ color: 'var(--text-primary)' }}>
                    {q.question}
                  </h3>
                </div>

                <div className="pl-11 sm:pl-[52px] space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answers[index] === optIndex;
                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(index, optIndex)}
                        className="w-full text-left py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer"
                        style={{
                          background: isSelected ? 'var(--glow-primary)' : 'var(--bg-input)',
                          border: `1px solid ${isSelected ? 'var(--border-active)' : 'var(--border-muted)'}`,
                          color: isSelected ? 'var(--accent-primary-light)' : 'var(--text-secondary)',
                          boxShadow: isSelected ? 'inset 0 0 20px var(--glow-primary)' : 'none',
                        }}
                        id={`question-${index}-option-${optIndex}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                            style={{
                              border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                              background: isSelected ? 'var(--accent-primary)' : 'transparent',
                            }}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'white' }} />}
                          </div>
                          {opt}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ Submit Area / Area Submit ═══ */}
        <div className="mt-8 sm:mt-10 glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Terjawab: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{answeredCount}</span> / {totalCount}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting || !isComplete}
            id="assessment-submit-button"
            className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl font-bold shadow-lg transition-all group w-full sm:w-auto justify-center ${
              submitting || !isComplete ? 'cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
            style={{
              background: submitting || !isComplete ? 'var(--bg-elevated)' : 'var(--gradient-button)',
              color: submitting || !isComplete ? 'var(--text-muted)' : 'white',
              boxShadow: submitting || !isComplete ? 'none' : 'var(--shadow-button)',
              border: submitting || !isComplete ? '1px solid var(--border-muted)' : 'none',
            }}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                Memproses...
              </>
            ) : (
              <>
                Selesaikan & Buat Roadmap
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}