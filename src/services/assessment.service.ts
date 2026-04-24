import { findUserProfileById } from "../repositories/user-profile.repository";
import { prisma } from "../db";
import {
  createAssessment,
  findAssessmentById,
  updateAssessmentScore,
} from "../repositories/assessment.repository";
import { GeminiService } from "./gemini.service";

type AssessmentStatusCode = 400 | 401 | 404;

export class AssessmentError extends Error {
  status: AssessmentStatusCode;
  constructor(message: string, status: AssessmentStatusCode) {
    super(message);
    this.status = status;
  }
}
export async function generatePreTest(userId: number, profileId: number) {
  const profile = await findUserProfileById(profileId);
  if (!profile || profile.userId !== userId)
    throw new AssessmentError("Unauthorized", 404);
  if (!profile.targetCareerId)
    throw new AssessmentError("Target career required", 400);

  const career = await prisma.career.findUnique({
    where: { id: profile.targetCareerId },
    include: {
      competencies: {
        include: {
          competency: true,
        },
      },
    },
  });

  if (!career) throw new AssessmentError("Career not found", 404);

  const relevantSkkni = career.competencies.map((item) => item.competency);

  if (relevantSkkni.length === 0)
    throw new AssessmentError("SKKNI tidak ditemukan", 404);

  const skkniContext = relevantSkkni.map((sk) => ({
    kode: sk.kodeUnit,
    judul: sk.judulKopetensi,
    kuk: sk.kriteriaUnjukKerja,
  }));

  // Menggunakan Prompt Design yang terstruktur (Persona, Tugas, Konteks, Format)
  const systemPrompt = buildSystemPrompt();
  const userPrompt = `
    Konteks Profil User:
    - Pendidikan: ${profile.pendidikanTerakhir || "Tidak diketahui"}
    - Level Kemampuan Saat Ini: ${profile.levelKemampuan || "Pemula"}
    - Target Karir: ${career.name}
    
    Data SKKNI (Kriteria Unjuk Kerja):
    ${JSON.stringify(skkniContext)}
    
    Jalankan Tugas sekarang.
  `;

  const aiResponse = await GeminiService.generateStructuredContent(
    userPrompt,
    systemPrompt,
  );

  const assessment = await createAssessment({
    profileId: profile.id,
    questionsJson: aiResponse.questions,
    gapAnalysisResult: aiResponse.gapAnalysis,
  });

  return {
    message: "Pre-Test berhasil di-generate",
    assessmentId: assessment.id,
    title: aiResponse.title,
    questions: aiResponse.questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    })),
  };
}

export async function submitPreTest(
  userId: number,
  assessmentId: number,
  userAnswers: number[],
) {
  // ... (Logika submitPreTest tetap sama seperti sebelumnya) ...
  const assessment = await findAssessmentById(assessmentId);
  if (!assessment) throw new AssessmentError("Assessment not found", 404);

  const questions = assessment.questionsJson as Array<any>;
  let passedKUK = 0;
  const totalKUK = questions.length;

  const detailedResults = questions.map((q, index) => {
    const isCorrect = q.correctIndex === userAnswers[index];
    if (isCorrect) passedKUK++;
    return {
      questionId: q.id,
      kukReference: q.kukReference,
      isCorrect,
      reasoning: q.reasoning,
    };
  });

  const jrsScore = (passedKUK / totalKUK) * 100;
  await updateAssessmentScore(assessmentId, detailedResults, jrsScore);

  return {
    message: "Success",
    jobReadinessScore: jrsScore,
    passedKUK,
    totalKUK,
    results: detailedResults,
  };
}

/**
 * GUARDRAILED PROMPT DESIGN
 * Menggunakan struktur ketat: Persona, Tugas, Konteks, Format
 */
function buildSystemPrompt() {
  return `
Persona
Anda adalah seorang Senior Asesor Kompetensi yang ditugaskan untuk mengaudit standar Keputusan Menteri Ketenagakerjaan No. 103 Tahun 2026. Anda sangat objektif, faktual, dan tidak pernah menggunakan terminologi di luar dokumen SKKNI. Bahasa Anda profesional namun mudah dipahami oleh masyarakat umum.

Tugas
1. Analisis kesenjangan (Gap Analysis) antara "Konteks Profil User" dengan "Data SKKNI".
2. Buat tepat 10 soal pilihan ganda (Pre-Test) yang HANYA menguji Kriteria Unjuk Kerja (KUK) yang diprediksi belum dikuasai oleh user berdasarkan level kemampuan saat ini.
3. Berikan penjelasan logis (reasoning) untuk setiap jawaban benar yang merujuk langsung ke teks KUK SKKNI.

Konteks
- Platform ini digunakan oleh masyarakat daerah 3T dengan infrastruktur internet terbatas (Inclusion-First Interface).
- Pertanyaan harus dirancang ringkas, tidak bertele-tele, dan menghindari kalimat ambigu agar mudah dimuat di perangkat dengan bandwidth rendah.
- Tingkat kesulitan soal harus disesuaikan secara dinamis dengan "Pendidikan" dan "Level Kemampuan Saat Ini" dari user.

Format
Anda HANYA diizinkan merespon dengan format JSON murni tanpa markdown formatting (\`\`\`json). Skema JSON harus seperti ini:
{
  "title": "[String] Pre-Test SKKNI: Target Karir",
  "gapAnalysis": "[String] Analisis kesenjangan 1 paragraf ringkas",
  "questions": [
    {
      "id": [Number] Urutan 1-10,
      "question": "[String] Pertanyaan ringkas",
      "options": ["[String] Opsi A", "[String] Opsi B", "[String] Opsi C", "[String] Opsi D"],
      "correctIndex": [Number] Index jawaban benar (0-3),
      "kukReference": "[String] Teks atau Kode KUK SKKNI yang diuji",
      "reasoning": "[String] Alasan jawaban benar"
    }
  ]
}
  `;
}
