import { findUserProfileById } from "../repositories/user-profile.repository";
import { prisma } from "../db";
import {
  createAssessment,
  findAssessmentById,
  updateAssessmentScore,
} from "../repositories/assessment.repository";
import { createProgressJRS } from "../repositories/user-progress-jrs.repository";
import { generateRoadmap } from "./roadmap.service";
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
  // ── 1. Validate assessment exists ──────────────────────────────────────
  const assessment = await findAssessmentById(assessmentId);
  if (!assessment) throw new AssessmentError("Assessment not found", 404);

  // ── 2. Validate ownership via profile ──────────────────────────────────
  const profile = await findUserProfileById(assessment.profileId);
  if (!profile || profile.userId !== userId)
    throw new AssessmentError("Unauthorized", 401);

  // ── 3. Grade answers — map userAnswerIndex to correctIndex ─────────────
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

  // ── 4. Calculate JRS: (Passed KUK / Total KUK) * 100 ──────────────────
  const jrsScore = (passedKUK / totalKUK) * 100;

  // ── 5. Save score to Assessment table (score_summary + user_answers_json)
  await updateAssessmentScore(assessmentId, detailedResults, jrsScore);

  // ── 6. TICKET 01: Save JRS snapshot to UserProgressJRS for Impact Projection graph
  const careerName = profile.targetCareer?.name ?? "Unknown Career";
  await createProgressJRS({
    profileId: assessment.profileId,
    assessmentId,
    jrsScore,
    passedKUK,
    totalKUK,
    careerName,
  });

  // ── 7. TICKET 02: Generate AI Roadmap from failed KUKs ────────────────
  const failedKUKs = detailedResults
    .filter((r) => !r.isCorrect)
    .map((r) => ({
      kukReference: r.kukReference,
      reasoning: r.reasoning,
    }));

  let roadmap = null;
  if (failedKUKs.length > 0) {
    try {
      roadmap = await generateRoadmap(
        assessmentId,
        assessment.profileId,
        failedKUKs,
        {
          pendidikan: profile.pendidikanTerakhir || "Tidak diketahui",
          levelKemampuan: profile.levelKemampuan || "Pemula",
          careerName,
          waktuBelajarJam: profile.waktuBelajarJam,
        },
      );
    } catch (error) {
      // Roadmap generation is non-blocking — log error but don't fail the submission
      console.error("Roadmap generation failed:", error);
    }
  }

  return {
    message: "Success",
    jobReadinessScore: jrsScore,
    passedKUK,
    totalKUK,
    results: detailedResults,
    roadmap: roadmap
      ? {
          roadmapId: roadmap.id,
          totalNodes: roadmap.totalNodes,
          data: roadmap.roadmapData,
        }
      : null,
  };
}

/**
 * GUARDRAILED PROMPT DESIGN
 * Menggunakan struktur ketat: Persona, Tugas, Konteks, Format
 */
function buildSystemPrompt() {
  return `
Persona
Anda adalah seorang Asesor Kompetensi Senior dan Ahli Psikometri. Anda menyusun instrumen evaluasi berdasarkan pendekatan Competency-Based Assessment (CBA). Anda objektif, faktual, dan selalu merujuk teguh pada standar SKKNI. Bahasa Anda profesional, terstruktur, namun mudah dipahami.

Tugas
1. Lakukan Diagnostic Assessment (Gap Analysis) antara "Konteks Profil User" dengan tuntutan "Data SKKNI".
2. Buat tepat 10 soal pilihan ganda (Multiple Choice Questions) berbasis Situational Judgment Test (SJT).
3. Soal TIDAK BOLEH berupa hafalan teori (Level Kognitif C1/C2 Taxonomy Bloom). Setiap soal HARUS berupa studi kasus teknis atau skenario masalah dunia nyata yang memaksa user melakukan penerapan atau analisis (Level C3/C4 Taxonomy Bloom) terhadap Kriteria Unjuk Kerja (KUK) SKKNI yang diprediksi belum dikuasai user.
4. Rancang 1 opsi jawaban yang paling optimal (kunci jawaban) dan 3 distraktor (opsi salah) yang plausible/masuk akal. Distraktor harus merepresentasikan kesalahan umum (common pitfalls) atau miskonsepsi di industri untuk memastikan daya beda soal yang tinggi.
5. Susun penjelasan logis (reasoning) untuk jawaban benar yang merujuk langsung ke teks atau esensi KUK SKKNI terkait.

Konteks
- Mengacu pada Cognitive Load Theory, kurangi extraneous cognitive load dengan merancang pertanyaan dan opsi jawaban yang ringkas, jelas, dan menghindari kalimat ambigu.
- Platform ini mengadopsi Inclusion-First Interface untuk masyarakat daerah 3T dengan bandwidth rendah, sehingga teks harus padat makna.
- Tingkat kesulitan soal disesuaikan secara dinamis (mengadaptasi prinsip dasar Item Response Theory) berdasarkan atribut "Pendidikan" dan "Level Kemampuan Saat Ini" dari profil user.

Format
Anda HANYA diizinkan merespon dengan format JSON murni tanpa markdown formatting (\`\`\`json). Skema JSON harus seperti ini:
{
  "title": "[String] Pre-Test SKKNI: Target Karir",
  "gapAnalysis": "[String] Analisis kesenjangan 1 paragraf ringkas berdasar level kompetensi",
  "questions": [
    {
      "id": [Number] Urutan 1-10,
      "question": "[String] Skenario/Pertanyaan ringkas",
      "options": ["[String] Opsi A", "[String] Opsi B", "[String] Opsi C", "[String] Opsi D"],
      "correctIndex": [Number] Index jawaban benar (0-3),
      "kukReference": "[String] Teks atau Kode KUK SKKNI yang diuji",
      "reasoning": "[String] Alasan jawaban benar secara teoretis dan praktis"
    }
  ]
}
  `;
}
