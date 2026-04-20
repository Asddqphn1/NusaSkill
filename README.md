To install dependencies:
```sh
bun install
```

Setup env:
```sh
cp .env.example .env
```

Important env:
- DB_SCHEMA=joko
- DATABASE_URL harus mengarah ke `nusaskill?schema=joko`

Apply Prisma migration to PostgreSQL:
```sh
npm run prisma:migrate:deploy
```

Generate Prisma client:
```sh
npm run prisma:generate
```

Smoke test insert data to database:
```sh
npm run db:smoke
```

Authentication endpoints:

Register:
```sh
curl -X POST http://localhost:3000/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"joko@example.com","password":"123456"}'
```

Login:
```sh
curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"joko@example.com","password":"123456"}'
```

Get profile (replace TOKEN):
```sh
curl http://localhost:3000/auth/me \
	-H "Authorization: Bearer TOKEN"
```

To run:
```sh
bun run dev
```

open http://localhost:3000

Check database connection:
```sh
curl http://localhost:3000/health/db
```
