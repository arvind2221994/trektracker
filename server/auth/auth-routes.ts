import type { Express } from "express";
import passport from 'passport';
import session from 'express-session';
import { setupGoogleAuth } from './google';
import { setupFacebookAuth } from './facebook';

export function setupAuthentication(app: Express) {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup authentication strategies only if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    setupGoogleAuth();
    console.log('✅ Google authentication enabled');
  } else {
    console.log('ℹ️  Google authentication disabled (missing credentials)');
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    setupFacebookAuth();
    console.log('✅ Facebook authentication enabled');
  } else {
    console.log('ℹ️  Facebook authentication disabled (missing credentials)');
  }

  // Serialize/deserialize user for session management
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const { storage } = await import('../storage');
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth routes (only if Google auth is configured)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/auth/google',
      passport.authenticate('google', { 
        scope: ['profile', 'email'] 
      })
    );

    app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
      (req, res) => {
        // Successful authentication
        res.redirect('/?login=success');
      }
    );
  } else {
    app.get('/auth/google', (req, res) => {
      res.status(503).json({ message: 'Google authentication not configured' });
    });
  }

  // Facebook OAuth routes (only if Facebook auth is configured)
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    app.get('/auth/facebook',
      passport.authenticate('facebook', { 
        scope: ['email'] 
      })
    );

    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login?error=facebook_failed' }),
      (req, res) => {
        // Successful authentication
        res.redirect('/?login=success');
      }
    );
  } else {
    app.get('/auth/facebook', (req, res) => {
      res.status(503).json({ message: 'Facebook authentication not configured' });
    });
  }

  // Logout route
  app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get current user
  app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Middleware to check if user is authenticated
  app.use('/api', (req, res, next) => {
    // For now, we'll skip authentication check for demo purposes
    // In a real app, you'd check req.isAuthenticated()
    next();
  });
}