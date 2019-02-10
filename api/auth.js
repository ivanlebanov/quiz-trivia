const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new GoogleStrategy({
      clientID: '732535154886-g4kobbpu4g4m339g4asqpcphb1h1tva2.apps.googleusercontent.com',
      clientSecret: 'aa0MtQZMA_MQhBEbsm2FJIcH',
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    (token, refreshToken, profile, done) => {
      return done(null, {
        profile: profile,
        token: token
      });
    }));
};