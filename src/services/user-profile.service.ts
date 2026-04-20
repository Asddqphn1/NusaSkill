import {
  createUserProfile,
  deleteUserProfileById,
  findUserProfileById,
  findUserProfilesByUserId,
  updateUserProfileById,
} from '../repositories/user-profile.repository'
import type { CreateUserProfileInput, UpdateUserProfileInput } from '../validator/user-profile.validator'

type UserProfileStatusCode = 404

export class UserProfileError extends Error {
  status: UserProfileStatusCode

  constructor(message: string, status: UserProfileStatusCode) {
    super(message)
    this.status = status
  }
}

async function getOwnedProfileOrThrow(userId: number, profileId: number) {
  const profile = await findUserProfileById(profileId)
  if (!profile || profile.userId !== userId) {
    throw new UserProfileError('User profile not found', 404)
  }
  return profile
}

export function listUserProfiles(userId: number) {
  return findUserProfilesByUserId(userId)
}

export async function getUserProfile(userId: number, profileId: number) {
  const profile = await getOwnedProfileOrThrow(userId, profileId)
  return { profile }
}

export async function createProfile(userId: number, data: CreateUserProfileInput) {
  const profile = await createUserProfile(userId, data)
  return {
    message: 'User profile created',
    profile,
  }
}

export async function updateProfile(userId: number, profileId: number, data: UpdateUserProfileInput) {
  await getOwnedProfileOrThrow(userId, profileId)
  const profile = await updateUserProfileById(profileId, data)
  return {
    message: 'User profile updated',
    profile,
  }
}

export async function deleteProfile(userId: number, profileId: number) {
  await getOwnedProfileOrThrow(userId, profileId)
  const profile = await deleteUserProfileById(profileId)
  return {
    message: 'User profile deleted',
    profile,
  }
}
