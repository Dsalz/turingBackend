import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  profileFields: ['id', 'displayName', 'email']
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

export default passport;
