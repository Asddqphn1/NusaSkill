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

Seed standard kompetensi from static seed data (no PDF needed):
```sh
npm run db:seed:standar-kompetensi
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

User profile CRUD endpoints (replace TOKEN):

Create user profile:
```sh
curl -X POST http://localhost:3000/user-profiles \
	-H "Authorization: Bearer TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"nama":"Joko","lokasi":"Bandung","pendidikanTerakhir":"S1","waktuBelajarJam":2,"levelKemampuan":"Beginner","targetCareer":"Backend Developer"}'
```

List user profiles:
```sh
curl http://localhost:3000/user-profiles \
	-H "Authorization: Bearer TOKEN"
```

Get profile by id:
```sh
curl http://localhost:3000/user-profiles/1 \
	-H "Authorization: Bearer TOKEN"
```

Update profile by id:
```sh
curl -X PUT http://localhost:3000/user-profiles/1 \
	-H "Authorization: Bearer TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"targetCareer":"Fullstack Developer"}'
```

Delete profile by id:
```sh
curl -X DELETE http://localhost:3000/user-profiles/1 \
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
