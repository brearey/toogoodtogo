const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await pool.query('SELECT id, email, full_name FROM users WHERE id = $1', [jwt_payload.userId]);
    if (user.rows[0]) {
      return done(null, user.rows[0]);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));