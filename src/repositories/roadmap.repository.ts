import { prisma } from "../db";
import type { Prisma } from "../../generated/prisma/client";

const roadmapSelect = {
  id: true,
  profileId: true,
  assessmentId: true,
  roadmapData: true,
  totalNodes: true,
  completedNodes: true,
  status: true,
  createdAt: true,
} as const;

export function createRoadmap(data: {
  profileId: number;
  assessmentId: number;
  roadmapData: Prisma.InputJsonValue;
  totalNodes: number;
}) {
  return prisma.learningRoadmap.create({
    data,
    select: roadmapSelect,
  });
}

export function findRoadmapById(id: number) {
  return prisma.learningRoadmap.findUnique({
    where: { id },
    select: roadmapSelect,
  });
}

export function findRoadmapsByProfileId(profileId: number) {
  return prisma.learningRoadmap.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    select: roadmapSelect,
  });
}
