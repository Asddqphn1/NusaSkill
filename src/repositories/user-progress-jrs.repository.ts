import { prisma } from "../db";

export function createProgressJRS(data: {
  profileId: number;
  assessmentId: number;
  jrsScore: number;
  passedKUK: number;
  totalKUK: number;
  careerName: string;
}) {
  return prisma.userProgressJRS.create({
    data,
  });
}

export function findProgressByProfileId(profileId: number) {
  return prisma.userProgressJRS.findMany({
    where: { profileId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      assessmentId: true,
      jrsScore: true,
      passedKUK: true,
      totalKUK: true,
      careerName: true,
      createdAt: true,
    },
  });
}
