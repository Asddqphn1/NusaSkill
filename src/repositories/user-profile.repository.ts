import { prisma } from "../db";
import type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
} from "../validator/user-profile.validator";

const profileSelect = {
  id: true,
  userId: true,
  nama: true,
  lokasi: true,
  pendidikanTerakhir: true,
  waktuBelajarJam: true,
  levelKemampuan: true,
  targetCareerId: true,
  targetCareer: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
} as const;

export function createUserProfile(
  userId: number,
  data: CreateUserProfileInput,
) {
  return prisma.userProfile.create({
    data: {
      userId,
      ...data,
    },
    select: profileSelect,
  });
}

export function findUserProfileById(id: number) {
  return prisma.userProfile.findUnique({
    where: { id },
    select: profileSelect,
  });
}

export function findUserProfilesByUserId(userId: number) {
  return prisma.userProfile.findMany({
    where: { userId },
    select: profileSelect,
    orderBy: { id: "desc" },
  });
}

export function updateUserProfileById(
  id: number,
  data: UpdateUserProfileInput,
) {
  return prisma.userProfile.update({
    where: { id },
    data,
    select: profileSelect,
  });
}

export function deleteUserProfileById(id: number) {
  return prisma.userProfile.delete({
    where: { id },
    select: profileSelect,
  });
}
