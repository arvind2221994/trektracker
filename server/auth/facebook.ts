import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { storage } from '../storage';

export function setupFacebookAuth() {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with Facebook ID
      let user = await storage.getUserByFacebookId(profile.id);
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          // Link Facebook account to existing user
          user = await storage.updateUser(existingUser.id, {
            facebookId: profile.id,
            profileImageUrl: profile.photos?.[0]?.value || existingUser.profileImageUrl
          });
          return done(null, user);
        }
      }
      
      // Create new user
      user = await storage.createUser({
        facebookId: profile.id,
        email: email || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || '',
        provider: 'facebook'
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}