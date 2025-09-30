# Auth with Google is working

1. open in browser: http://localhost:3000/auth/google
2. login with Google account
3. success

# Create table `users` in supabase

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50) NOT NULL, -- 'google' или 'yandex'
  provider_id VARCHAR(255) NOT NULL, -- уникальный ID от провайдера
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_provider_provider_id ON users(provider, provider_id);
```

# Prisma

### Init log

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn Prisma would have added DATABASE_URL but it already exists in .env
warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Run prisma dev to start a local Prisma Postgres server.
2. Define models in the schema.prisma file.
3. Run prisma migrate dev to migrate your local Prisma Postgres database.
4. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and a managed serverless Postgres database. Read: https://pris.ly/cli/beyond-orm
