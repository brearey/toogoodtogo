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
```# toogoodtogo
