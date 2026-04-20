import 'dotenv/config'
import { Hono } from 'hono'
import { Pool } from 'pg'
import { authRoutes } from './routes/auth.route'
import { userProfileRoutes } from './routes/user-profile.route'

const app = new Hono()

const pool = new Pool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'postgres',
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/health/db', async (c) => {
  try {
    const result = await pool.query('SELECT NOW() AS now')
    return c.json({
      ok: true,
      now: result.rows[0]?.now,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    return c.json(
      {
        ok: false,
        error: message,
      },
      500,
    )
  }
})

app.route('/auth', authRoutes)
app.route('/user-profiles', userProfileRoutes)

export default app
