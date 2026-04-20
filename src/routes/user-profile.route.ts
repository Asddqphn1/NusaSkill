import { Hono } from 'hono'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'
import {
  UserProfileError,
  createProfile,
  deleteProfile,
  getUserProfile,
  listUserProfiles,
  updateProfile,
} from '../services/user-profile.service'
import { createUserProfileSchema, updateUserProfileSchema } from '../validator/user-profile.validator'

export const userProfileRoutes = new Hono<{ Variables: AuthVariables }>()

userProfileRoutes.use('*', requireAuth)

function parseProfileId(rawId: string) {
  const profileId = Number(rawId)
  if (!Number.isInteger(profileId) || profileId <= 0) {
    return null
  }
  return profileId
}

userProfileRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const profiles = await listUserProfiles(userId)
    return c.json({ profiles })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

userProfileRoutes.get('/:id', async (c) => {
  try {
    const profileId = parseProfileId(c.req.param('id'))
    if (!profileId) {
      return c.json({ message: 'Invalid profile id' }, 400)
    }

    const userId = c.get('userId')
    const result = await getUserProfile(userId, profileId)
    return c.json(result)
  } catch (error) {
    if (error instanceof UserProfileError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

userProfileRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = createUserProfileSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ message: 'Invalid request body' }, 400)
    }

    const userId = c.get('userId')
    const result = await createProfile(userId, parsed.data)
    return c.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

userProfileRoutes.put('/:id', async (c) => {
  try {
    const profileId = parseProfileId(c.req.param('id'))
    if (!profileId) {
      return c.json({ message: 'Invalid profile id' }, 400)
    }

    const body = await c.req.json()
    const parsed = updateUserProfileSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ message: 'Invalid request body' }, 400)
    }

    const userId = c.get('userId')
    const result = await updateProfile(userId, profileId, parsed.data)
    return c.json(result)
  } catch (error) {
    if (error instanceof UserProfileError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

userProfileRoutes.delete('/:id', async (c) => {
  try {
    const profileId = parseProfileId(c.req.param('id'))
    if (!profileId) {
      return c.json({ message: 'Invalid profile id' }, 400)
    }

    const userId = c.get('userId')
    const result = await deleteProfile(userId, profileId)
    return c.json(result)
  } catch (error) {
    if (error instanceof UserProfileError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})
