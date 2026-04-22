import { prisma } from "../db";
import type { Prisma } from "../../generated/prisma/client";

const assessmentSelect = {
  id: true,
  profileId: true,
  questionsJson: true,
  userAnswersJson: true,
  gapAnalysisResult: true,
  scoreSummary: true,
  createdAt: true,
} as const;

export function createAssessment(data: {
  profileId: number;
  questionsJson: Prisma.InputJsonValue;
  gapAnalysisResult?: string;
}) {
  return prisma.assessment.create({
    data,
    select: assessmentSelect,
  });
}

export function findAssessmentById(id: number) {
  return prisma.assessment.findUnique({
    where: { id },
    select: assessmentSelect,
  });
}

export function updateAssessmentScore(
  id: number,
  userAnswersJson: Prisma.InputJsonValue,
  scoreSummary: number,
) {
  return prisma.assessment.update({
    where: { id },
    data: {
      userAnswersJson,
      scoreSummary,
    },
    select: assessmentSelect,
  });
}
