import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function setupGoogleAuth() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with Google ID
      let user = await storage.getUserByGoogleId(profile.id);
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          // Link Google account to existing user
          user = await storage.updateUser(existingUser.id, {
            googleId: profile.id,
            profileImageUrl: profile.photos?.[0]?.value || existingUser.profileImageUrl
          });
          return done(null, user);
        }
      }
      
      // Create new user
      user = await storage.createUser({
        googleId: profile.id,
        email: email || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || '',
        provider: 'google'
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}