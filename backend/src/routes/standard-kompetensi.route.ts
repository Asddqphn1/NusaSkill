import { Hono } from 'hono'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'
import {
  StandardKompetensiError,
  createStandarKompetensi,
  deleteStandarKompetensi,
  getStandardKompetensi,
  listStandardKompetensi,
  updateStandarKompetensi,
} from '../services/standard-kompetensi.service'
import {
  createStandardKompetensiSchema,
  updateStandardKompetensiSchema,
} from '../validator/standard-kompetensi.validator'

export const standardKompetensiRoutes = new Hono<{ Variables: AuthVariables }>()

standardKompetensiRoutes.use('*', requireAuth)

function parseStandardKompetensiId(rawId: string) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    return null
  }
  return id
}

standardKompetensiRoutes.get('/', async (c) => {
  try {
    const standarKompetensi = await listStandardKompetensi()
    return c.json({ standarKompetensi })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

standardKompetensiRoutes.get('/:id', async (c) => {
  try {
    const id = parseStandardKompetensiId(c.req.param('id'))
    if (!id) {
      return c.json({ message: 'Invalid standar kompetensi id' }, 400)
    }

    const result = await getStandardKompetensi(id)
    return c.json(result)
  } catch (error) {
    if (error instanceof StandardKompetensiError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

standardKompetensiRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = createStandardKompetensiSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ message: 'Invalid request body' }, 400)
    }

    const result = await createStandarKompetensi(parsed.data)
    return c.json(result)
  } catch (error) {
    if (error instanceof StandardKompetensiError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

standardKompetensiRoutes.put('/:id', async (c) => {
  try {
    const id = parseStandardKompetensiId(c.req.param('id'))
    if (!id) {
      return c.json({ message: 'Invalid standar kompetensi id' }, 400)
    }

    const body = await c.req.json()
    const parsed = updateStandardKompetensiSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ message: 'Invalid request body' }, 400)
    }

    const result = await updateStandarKompetensi(id, parsed.data)
    return c.json(result)
  } catch (error) {
    if (error instanceof StandardKompetensiError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

standardKompetensiRoutes.delete('/:id', async (c) => {
  try {
    const id = parseStandardKompetensiId(c.req.param('id'))
    if (!id) {
      return c.json({ message: 'Invalid standar kompetensi id' }, 400)
    }

    const result = await deleteStandarKompetensi(id)
    return c.json(result)
  } catch (error) {
    if (error instanceof StandardKompetensiError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})