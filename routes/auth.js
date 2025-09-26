const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/database');
const router = express.Router();
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Проверяем, есть ли пользователь в БД
      const result = await pool.query(
        'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
        ['google', profile.id]
      );
      
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      }

      // 2. Если нет, создаем нового
      const newUser = await pool.query(
        `INSERT INTO users (email, full_name, avatar_url, provider, provider_id) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [profile.emails[0].value, profile.displayName, profile.photos[0].value, 'google', profile.id]
      );

      done(null, newUser.rows[0]);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  // Генерируем JWT токен и передаем его клиенту
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  done(null, { token, user: { id: user.id, email: user.email, name: user.full_name } });
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Запуск аутентификации через Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback от Google
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // После успешной аутентификации отправляем токен клиенту
    res.json({
      success: true,
      token: req.user.token,
      user: req.user.user
    });
  }
);

// Получение данных текущего пользователя (защищенный роут)
router.get('/me', 
  passport.authenticate('jwt', { session: false }), // middleware для проверки JWT
  (req, res) => {
    res.json(req.user);
  }
);

// Выход (на клиенте просто удалите токен)
router.post('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

module.exports = router

/*
Открыл в браузере /auth/google
вошел через свой google аккаунт
призошел редирект в http://localhost:3000/auth/google/callback?code=4%2F0AVGzR1BN1CYXmllU5BDRLI6BqkH82e21GAarE-KS6I7C5wKGQxBBjxiQH1GkYCgoknNU_w&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
и ошибка в белом экране браузера и в консоли сервера
Error: connect ENETUNREACH 2406:da18:243:741c:b223:92b7:56dc:c6ba:5432 - Local (:::0)
    at /home/lorriant/node_pro/toogoodtogo/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async Strategy._verify (/home/lorriant/node_pro/toogoodtogo/routes/auth.js:16:22)


смотрю код в файле auth.js в строке 16:
const result = await pool.query(
	'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
	['google', profile.id]
);
*/