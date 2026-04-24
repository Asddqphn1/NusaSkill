import { prisma } from "../db";
import type {
  CreateCareerInput,
  UpdateCareerInput,
} from "../validator/career.validator";

const careerSelect = {
  id: true,
  name: true,
  description: true,
  competencies: {
    select: {
      competencyId: true,
      competency: {
        select: {
          id: true,
          kodeUnit: true,
          judulKopetensi: true,
        },
      },
    },
    orderBy: { competencyId: "asc" },
  },
} as const;

function buildCompetencyCreates(competencyIds: number[] | undefined) {
  if (!competencyIds || competencyIds.length === 0) {
    return undefined;
  }

  return competencyIds.map((competencyId) => ({
    competency: {
      connect: { id: competencyId },
    },
  }));
}

export function findAllCareers() {
  return prisma.career.findMany({
    select: careerSelect,
    orderBy: { name: "asc" },
  });
}

export function findCareerById(id: string) {
  return prisma.career.findUnique({
    where: { id },
    select: careerSelect,
  });
}

export function findCareerByNameInsensitive(name: string) {
  return prisma.career.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export function createCareer(data: CreateCareerInput) {
  const competencyCreates = buildCompetencyCreates(data.competencyIds);

  return prisma.career.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      ...(competencyCreates
        ? { competencies: { create: competencyCreates } }
        : {}),
    },
    select: careerSelect,
  });
}

export function updateCareerById(id: string, data: UpdateCareerInput) {
  const competencyCreates = buildCompetencyCreates(data.competencyIds);

  return prisma.career.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.competencyIds !== undefined
        ? {
            competencies: {
              deleteMany: {},
              ...(competencyCreates ? { create: competencyCreates } : {}),
            },
          }
        : {}),
    },
    select: careerSelect,
  });
}

export function deleteCareerById(id: string) {
  return prisma.career.delete({
    where: { id },
    select: careerSelect,
  });
}
