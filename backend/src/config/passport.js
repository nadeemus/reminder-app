const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, authProvider: 'google' },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Update provider info if user exists with different auth method
        if (user.authProvider !== 'google') {
          user.authProvider = 'google';
          user.providerId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        authProvider: 'google',
        providerId: profile.id
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

// Apple OAuth Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/apple/callback',
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION || './AuthKey.p8',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple returns user info only on first sign-in
      const email = profile.email || (req.body.user ? JSON.parse(req.body.user).email : null);
      const name = profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : 
                   (req.body.user ? JSON.parse(req.body.user).name.firstName + ' ' + JSON.parse(req.body.user).name.lastName : 'Apple User');

      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.sub, authProvider: 'apple' },
          { email: email }
        ]
      });

      if (user) {
        // Update provider info if user exists with different auth method
        if (user.authProvider !== 'apple') {
          user.authProvider = 'apple';
          user.providerId = profile.sub;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        name: name,
        email: email,
        authProvider: 'apple',
        providerId: profile.sub
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

module.exports = passport;
