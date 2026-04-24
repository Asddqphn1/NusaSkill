import { GeminiService } from "./gemini.service";
import { createRoadmap } from "../repositories/roadmap.repository";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FailedKUK {
  kukReference: string;
  reasoning: string;
}

interface ProfileContext {
  pendidikan: string;
  levelKemampuan: string;
  careerName: string;
  waktuBelajarJam: number | null;
}

// ─── Prompt Builder ──────────────────────────────────────────────────────────

function buildRoadmapSystemPrompt(): string {
  return `
Persona
Anda adalah seorang Career Learning Architect & Instructional Designer Senior. Anda ahli dalam merancang jalur pembelajaran terstruktur berbasis Competency-Based Training (CBT) yang merujuk pada standar SKKNI Indonesia. Anda memahami prinsip scaffolding, chunking, dan spaced repetition.

Tugas
1. Analisis daftar Kriteria Unjuk Kerja (KUK) yang GAGAL dikuasai user dari hasil Pre-Test.
2. Rancang sebuah Learning Roadmap terstruktur dalam format JSON yang terbagi menjadi Phases → Modules → Subtasks.
3. Setiap Module WAJIB mereferensikan kode_unit dari SKKNI 103/2026 atau SKKNI 282/2016 yang relevan.
4. Setiap Subtask harus actionable, spesifik, dan memiliki estimasi waktu realistis.
5. Urutkan phases dari fondasi ke tingkat lanjut (scaffolding approach).

Konteks
- Platform ini ditujukan untuk masyarakat Indonesia, termasuk daerah 3T (Terdepan, Terluar, Tertinggal).
- Konten harus padat makna, praktis, dan bisa dipelajari secara mandiri.
- Sesuaikan kompleksitas dan jumlah subtask berdasarkan level kemampuan user dan waktu belajar yang tersedia.

Format
Anda HANYA diizinkan merespon dengan format JSON murni tanpa markdown formatting (\`\`\`json). DILARANG menggunakan Mermaid syntax. Skema JSON harus PERSIS seperti ini:
{
  "roadmapTitle": "[String] Learning Roadmap: [Nama Karir]",
  "summary": "[String] Ringkasan analisis gap dan strategi pembelajaran 1-2 paragraf",
  "phases": [
    {
      "phaseId": [Number] Urutan dimulai dari 1,
      "title": "[String] Judul phase, contoh: 'Phase 1: Fondasi Web Development'",
      "description": "[String] Deskripsi tujuan phase ini",
      "modules": [
        {
          "moduleId": [Number] Urutan dimulai dari 1,
          "title": "[String] Judul modul pembelajaran",
          "kodeUnit": "[String] Kode unit SKKNI yang direferensikan, contoh: 'J.620100.001.02'",
          "kukReference": "[String] KUK spesifik yang ditargetkan",
          "subtasks": [
            {
              "subtaskId": [Number] Urutan dimulai dari 1,
              "title": "[String] Judul tugas/aktivitas belajar",
              "description": "[String] Deskripsi detail apa yang harus dipelajari/dikerjakan",
              "resourceType": "[String] Salah satu dari: 'video', 'article', 'exercise', 'project', 'quiz'",
              "estimatedMinutes": [Number] Estimasi waktu dalam menit
            }
          ]
        }
      ]
    }
  ]
}
  `;
}

function buildRoadmapUserPrompt(
  failedKUKs: FailedKUK[],
  context: ProfileContext,
): string {
  return `
Konteks Profil User:
- Pendidikan: ${context.pendidikan}
- Level Kemampuan Saat Ini: ${context.levelKemampuan}
- Target Karir: ${context.careerName}
- Waktu Belajar Tersedia: ${context.waktuBelajarJam ? `${context.waktuBelajarJam} jam/minggu` : "Tidak ditentukan"}

Daftar KUK yang GAGAL (Gap Analysis dari Pre-Test):
${JSON.stringify(failedKUKs, null, 2)}

Berdasarkan gap di atas, rancang Learning Roadmap yang menargetkan kompetensi-kompetensi yang belum dikuasai. Jalankan tugas sekarang.
  `;
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

/**
 * Counts total subtask nodes across all phases and modules.
 */
function countTotalNodes(roadmapData: any): number {
  let total = 0;
  if (Array.isArray(roadmapData.phases)) {
    for (const phase of roadmapData.phases) {
      if (Array.isArray(phase.modules)) {
        for (const mod of phase.modules) {
          if (Array.isArray(mod.subtasks)) {
            total += mod.subtasks.length;
          }
        }
      }
    }
  }
  return total;
}

export async function generateRoadmap(
  assessmentId: number,
  profileId: number,
  failedKUKs: FailedKUK[],
  profileContext: ProfileContext,
) {
  const systemPrompt = buildRoadmapSystemPrompt();
  const userPrompt = buildRoadmapUserPrompt(failedKUKs, profileContext);

  const roadmapData = await GeminiService.generateStructuredContent(
    userPrompt,
    systemPrompt,
  );

  const totalNodes = countTotalNodes(roadmapData);

  const roadmap = await createRoadmap({
    profileId,
    assessmentId,
    roadmapData,
    totalNodes,
  });

  return roadmap;
}
