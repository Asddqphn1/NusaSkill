To install dependencies:
```sh
bun install
```

Setup environment:
```sh
cp .env.example .env
```

Default DB values in `.env.example`:
- DB_USER=joko
- DB_PASSWORD=123
- DB_NAME=nusaskill
- DB_HOST=127.0.0.1
- DB_PORT=5432

To run:
```sh
bun run dev
```

open http://localhost:3000

Check database connection:
```sh
curl http://localhost:3000/health/db
```
