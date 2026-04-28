import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Lock,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Layers,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

/* ═══ Type Definitions / Definisi Tipe ═══ */

interface Subtask {
  subtaskId: number;
  title: string;
  description: string;
  resourceType: string;
  estimatedMinutes: number;
}

interface Module {
  moduleId: number;
  title: string;
  kodeUnit?: string;
  kukReference?: string;
  subtasks?: Subtask[];
}

interface Phase {
  title: string;
  description?: string;
  modules?: Module[];
}

interface RoadmapData {
  phases: Phase[];
}

interface RoadmapTreeProps {
  roadmapData: RoadmapData;
  userLevel?: string;
}

type NodeStatus = 'completed' | 'in-progress' | 'locked';

/* ═══ Utility Functions / Fungsi Utilitas ═══ */

/** Determine node status based on position / Tentukan status node berdasarkan posisi */
function getNodeStatus(phaseIdx: number, moduleIdx: number): NodeStatus {
  if (phaseIdx === 0 && moduleIdx === 0) return 'in-progress';
  return 'locked';
}

/** Status configuration map / Peta konfigurasi status */
const STATUS_CONFIG = {
  completed: {
    bg: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.4)',
    glow: 'rgba(52, 211, 153, 0.15)',
    text: 'var(--accent-green)',
    icon: CheckCircle2,
    label: 'Selesai',
  },
  'in-progress': {
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.4)',
    glow: 'rgba(99, 102, 241, 0.2)',
    text: 'var(--accent-primary-light)',
    icon: Play,
    label: 'Sedang Dipelajari',
  },
  locked: {
    bg: 'rgba(100, 116, 139, 0.08)',
    border: 'rgba(100, 116, 139, 0.2)',
    glow: 'transparent',
    text: 'var(--text-muted)',
    icon: Lock,
    label: 'Terkunci',
  },
} as const;

/* ═══ Main Component / Komponen Utama ═══ */

export default function RoadmapTree({ roadmapData, userLevel = 'Pemula' }: RoadmapTreeProps) {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<{ phase: number; module: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPan = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const phases = roadmapData.phases || [];

  /* ─── Mouse Drag/Pan handlers (Desktop) ─── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tree-node-card')) return;
    setIsPanning(true);
    lastPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - lastPan.current.x, y: e.clientY - lastPan.current.y });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  /* ─── Touch handlers (Mobile) / Penangan sentuh (Mobile) ─── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.tree-node-card')) return;

    if (e.touches.length === 1) {
      // Single touch = pan / Sentuh tunggal = geser
      setIsPanning(true);
      lastPan.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    } else if (e.touches.length === 2) {
      // Two-finger = pinch zoom / Dua jari = zoom cubit
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, [pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      // Pan with single touch / Geser dengan satu sentuhan
      setPan({ x: e.touches[0].clientX - lastPan.current.x, y: e.touches[0].clientY - lastPan.current.y });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      // Pinch-to-zoom / Cubit untuk zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / lastTouchDist.current;
      setZoom((z) => Math.min(2, Math.max(0.4, z * scale)));
      lastTouchDist.current = dist;
    }
  }, [isPanning]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    lastTouchDist.current = null;
  }, []);

  /* ─── Wheel zoom (Desktop) — attached as non-passive to allow preventDefault ─── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(2, Math.max(0.4, z - e.deltaY * 0.001)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  /* ─── View controls / Kontrol tampilan ─── */
  const zoomIn = () => setZoom((z) => Math.min(2, z + 0.15));
  const zoomOut = () => setZoom((z) => Math.max(0.4, z - 0.15));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const toggleExpand = (key: string) => setExpandedNode(expandedNode === key ? null : key);

  return (
    <div className="relative w-full" style={{ minHeight: '500px' }}>
      {/* ═══ Zoom Controls / Kontrol Zoom ═══ */}
      <div className="absolute top-3 right-3 z-30 flex gap-1.5 sm:flex-col sm:gap-2">
        {[
          { onClick: zoomIn, icon: ZoomIn, title: 'Perbesar' },
          { onClick: zoomOut, icon: ZoomOut, title: 'Perkecil' },
          { onClick: resetView, icon: Maximize2, title: 'Reset' },
        ].map(({ onClick, icon: Icon, title }) => (
          <button
            key={title}
            onClick={onClick}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
            style={{
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
            }}
            title={title}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>

      {/* ═══ Tree Canvas / Kanvas Pohon ═══ */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-2xl touch-none"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-muted)',
          cursor: isPanning ? 'grabbing' : 'grab',
          minHeight: '500px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}

        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            padding: '40px 16px',
          }}
        >
          {/* ─── ROOT NODE / Node Akar ─── */}
          <div className="flex flex-col items-center">
            <div
              className="relative px-6 sm:px-8 py-4 sm:py-5 rounded-2xl text-center"
              style={{
                background: 'var(--gradient-button)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.3), var(--shadow-card)',
                animation: 'node-appear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                minWidth: '180px',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap size={16} color="white" />
                <span className="text-white font-bold text-sm sm:text-base">Level Awal</span>
              </div>
              <span className="text-white/80 text-xs sm:text-sm">{userLevel}</span>
              {/* Breathing glow / Efek cahaya bernapas */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'var(--gradient-button)',
                  filter: 'blur(20px)',
                  opacity: 0.3,
                  animation: 'breathe 3s ease-in-out infinite',
                  zIndex: -1,
                }}
              />
            </div>

            {/* Main trunk connector / Konektor batang utama */}
            <div
              className="w-0.5 relative"
              style={{
                height: '40px',
                background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-primary-light))',
                opacity: 0.5,
                animation: 'grow-branch 0.6s ease forwards',
                transformOrigin: 'top',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-primary-light))',
                  filter: 'blur(4px)',
                  opacity: 0.5,
                  animation: 'glow-line 2s ease-in-out infinite',
                }}
              />
            </div>

            {/* ─── PHASE BRANCHES / Cabang Fase ─── */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12 px-2 sm:px-4">
              {phases.map((phase, pIdx) => (
                <div
                  key={pIdx}
                  className="flex flex-col items-center w-full sm:w-auto"
                  style={{
                    animation: `node-appear 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + pIdx * 0.15}s forwards`,
                    opacity: 0,
                    minWidth: '260px',
                    maxWidth: '360px',
                  }}
                >
                  {/* Phase Node / Node Fase */}
                  <div
                    className="tree-node-card glass-card px-5 sm:px-6 py-3 sm:py-4 text-center cursor-pointer w-full transition-all duration-300 hover:scale-[1.03]"
                    onClick={() => toggleExpand(`phase-${pIdx}`)}
                    style={{
                      borderColor: 'var(--accent-primary)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Layers size={14} style={{ color: 'var(--accent-primary-light)' }} />
                      <span className="font-bold text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>
                        {phase.title}
                      </span>
                    </div>
                    {phase.description && (
                      <p className="text-[11px] sm:text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {phase.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="badge badge-blue text-[9px]">
                        {phase.modules?.length || 0} modul
                      </span>
                      {expandedNode === `phase-${pIdx}` ? (
                        <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                  </div>

                  {/* Branch connector / Konektor cabang */}
                  <div
                    className="w-0.5 relative"
                    style={{
                      height: expandedNode === `phase-${pIdx}` ? '24px' : '0px',
                      background: 'var(--accent-primary)',
                      opacity: 0.3,
                      transition: 'height 0.3s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: 'var(--accent-primary)', filter: 'blur(3px)', opacity: 0.4 }} />
                  </div>

                  {/* ─── MODULE LEAF NODES / Node Daun Modul ─── */}
                  {expandedNode === `phase-${pIdx}` && phase.modules && (
                    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full" style={{ animation: 'fadeInUp 0.3s ease forwards' }}>
                      {phase.modules.map((mod, mIdx) => {
                        const status = getNodeStatus(pIdx, mIdx);
                        const config = STATUS_CONFIG[status];
                        const StatusIcon = config.icon;

                        return (
                          <div key={mod.moduleId || mIdx} className="w-full flex flex-col items-center">
                            {/* Inter-module connector */}
                            {mIdx > 0 && (
                              <div className="w-0.5" style={{ height: '16px', background: config.border, opacity: 0.4 }} />
                            )}

                            {/* Module Node / Node Modul */}
                            <div
                              className="tree-node-card tree-node w-full rounded-xl p-3 sm:p-4 cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); setSelectedMaterial({ phase: pIdx, module: mIdx }); }}
                              style={{
                                background: config.bg,
                                border: `1px solid ${config.border}`,
                                boxShadow: `0 0 20px ${config.glow}`,
                                animation: `node-appear 0.3s ease ${mIdx * 0.08}s forwards`,
                                opacity: 0,
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                  style={{ background: config.bg, border: `1px solid ${config.border}` }}
                                >
                                  <StatusIcon size={13} style={{ color: config.text }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="badge badge-blue text-[9px]">{mod.kodeUnit || `M.${mod.moduleId}`}</span>
                                    <span
                                      className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                                      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}` }}
                                    >
                                      {config.label}
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-xs sm:text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                                    {mod.title}
                                  </h4>
                                  {mod.kukReference && (
                                    <p className="text-[10px] sm:text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                      Target KUK: {mod.kukReference}
                                    </p>
                                  )}
                                  {mod.subtasks && mod.subtasks.length > 0 && (
                                    <p className="text-[10px] sm:text-[11px] mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                      <BookOpen size={10} />
                                      {mod.subtasks.length} materi
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MATERIAL VIEW PANEL (Slide-in) / Panel Detail Materi ═══ */}
      {selectedMaterial && (() => {
        const phase = phases[selectedMaterial.phase];
        const mod = phase?.modules?.[selectedMaterial.module];
        if (!mod) return null;
        const status = getNodeStatus(selectedMaterial.phase, selectedMaterial.module);
        const config = STATUS_CONFIG[status];

        return (
          <div
            className="fixed inset-0 z-[100] flex items-stretch justify-end"
            onClick={() => setSelectedMaterial(null)}
          >
            {/* Backdrop / Latar belakang */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease forwards' }}
            />

            {/* Panel — Full width on mobile, max-w-lg on desktop */}
            {/* Panel — Lebar penuh di mobile, max-w-lg di desktop */}
            <div
              className="relative w-full sm:max-w-lg h-full overflow-y-auto"
              style={{
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border-muted)',
                boxShadow: 'var(--shadow-elevated)',
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header / Header Panel */}
              <div
                className="sticky top-0 z-10 px-4 sm:px-6 py-4 flex items-center justify-between"
                style={{
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-muted)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg, border: `1px solid ${config.border}` }}
                  >
                    <BookOpen size={14} style={{ color: config.text }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
                      Detail Modul
                    </h3>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{phase.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 flex-shrink-0"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-muted)', color: 'var(--text-secondary)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Panel Content / Konten Panel */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Module Info / Info Modul */}
                <div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="badge badge-blue">{mod.kodeUnit || `M.${mod.moduleId}`}</span>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}` }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {mod.title}
                  </h2>
                  {mod.kukReference && (
                    <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      Target KUK: {mod.kukReference}
                    </p>
                  )}
                </div>

                {/* Subtasks / Materi Pembelajaran */}
                {mod.subtasks && mod.subtasks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <BookOpen size={14} style={{ color: 'var(--accent-primary-light)' }} />
                      Materi Pembelajaran ({mod.subtasks.length})
                    </h4>
                    <div className="space-y-3 stagger-children">
                      {mod.subtasks.map((task, subIdx) => (
                        <div
                          key={subIdx}
                          className="p-3 sm:p-4 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: 'var(--glow-primary)', color: 'var(--accent-primary-light)', fontSize: '11px', fontWeight: 700 }}
                            >
                              {task.subtaskId}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{task.title}</h5>
                              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{task.description}</p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="badge badge-blue text-[9px] py-0">{task.resourceType}</span>
                                <span className="badge badge-amber text-[9px] py-0 flex items-center gap-1">
                                  <Clock size={9} />
                                  {task.estimatedMinutes} menit
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
