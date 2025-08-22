# Cloudflare Pages Deployment Guide

This guide will help you deploy the TrekTracker app to Cloudflare Pages with serverless functions.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already included in dependencies
3. **Node.js 18+**: Required for building and deploying

## Project Structure for Cloudflare Pages

The app has been restructured for Cloudflare Pages:

```
├── functions/              # Serverless functions (API routes)
│   ├── api/
│   │   ├── treks.ts
│   │   ├── recommendations.ts
│   │   ├── profile.ts
│   │   ├── search.ts
│   │   ├── wishlist.ts
│   │   ├── planning.ts
│   │   └── treks/[id].ts   # Dynamic route
│   ├── auth/
│   │   ├── google.ts
│   │   ├── facebook.ts
│   │   └── user.ts
│   └── _middleware.ts      # Global middleware
├── client/                 # React frontend
│   └── public/
│       ├── _redirects      # Client-side routing
│       └── _headers        # HTTP headers
├── dist/public/            # Built frontend (auto-generated)
├── server/                 # Original Express code (for reference)
├── shared/                 # Shared TypeScript types
├── wrangler.toml           # Cloudflare configuration
└── package.json
```

## Required Package.json Changes

Since package.json cannot be directly edited in this environment, you'll need to manually add these scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "build:functions": "esbuild functions/**/*.ts --platform=neutral --target=es2022 --format=esm --outdir=dist/functions --bundle --external:@cloudflare/*",
    "build:full": "npm run build && npm run build:functions",
    "preview": "wrangler pages dev dist/public --compatibility-date=2024-01-01",
    "deploy": "npm run build:full && wrangler pages deploy dist/public"
  }
}
```

## Deployment Steps

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
# or use the local version: npx wrangler
```

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Build the Application
```bash
npm run build:full
```

### 4. Deploy to Cloudflare Pages
```bash
wrangler pages deploy dist/public --project-name trektracker
```

## Environment Variables

Configure these in Cloudflare Pages dashboard:

### Required for Social Authentication (Optional)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret  
- `FACEBOOK_APP_ID`: Facebook app ID
- `FACEBOOK_APP_SECRET`: Facebook app secret
- `SESSION_SECRET`: Session encryption key

### Database (If using external database)
- `DATABASE_URL`: PostgreSQL connection string

## Configuration Files

### wrangler.toml
Contains Cloudflare Pages configuration including:
- Build output directory
- Compatibility settings
- Environment variable bindings
- KV namespace bindings (if needed)

### _redirects
Handles client-side routing for React Router:
- Redirects all unknown routes to `/index.html`
- Routes API calls to functions

### _headers
Sets security and caching headers:
- Cache static assets for 1 year
- Security headers for XSS protection
- Cache HTML files for 1 hour

## Features in Cloudflare Pages Version

✅ **Full Frontend**: React app with all original features
✅ **API Functions**: All original API routes as serverless functions
✅ **Data Sync**: Adventure company data integration
✅ **Social Auth Structure**: Ready for OAuth integration
✅ **Client-Side Routing**: SPA routing works correctly
✅ **Static Asset Optimization**: Optimized builds and caching

## Local Development

For local development with Cloudflare Pages environment:

```bash
# Build the project
npm run build:full

# Start local Pages development server
npm run preview
```

## Production Deployment Options

### Option 1: Cloudflare Pages Git Integration
1. Push code to GitHub/GitLab
2. Connect repository in Cloudflare Pages dashboard
3. Set build command: `npm run build:full`
4. Set build output directory: `dist/public`
5. Auto-deploy on git push

### Option 2: CLI Deployment
```bash
npm run deploy
```

## Monitoring and Analytics

Cloudflare Pages provides:
- **Real-time Analytics**: Traffic, performance metrics
- **Function Analytics**: API call statistics and performance
- **Error Tracking**: Function errors and debugging info
- **Custom Domains**: Connect your own domain
- **CDN**: Global edge caching automatically enabled

## Database Considerations

For production, consider:
- **Cloudflare D1**: Built-in SQLite database
- **External Database**: PostgreSQL via connection pooling
- **Cloudflare KV**: For simple key-value storage
- **Cloudflare R2**: For file storage

## Security Features

✅ **DDoS Protection**: Automatic
✅ **SSL/TLS**: Free certificates
✅ **WAF**: Web Application Firewall
✅ **Bot Management**: Available
✅ **Access Control**: IP/country restrictions

## Costs

- **Cloudflare Pages**: Free tier includes:
  - 1 build per minute
  - 100,000 requests/month to Functions
  - 500 builds/month
  - Unlimited bandwidth and requests to static assets

This deployment structure ensures your TrekTracker app will be fast, secure, and scalable on Cloudflare's global network.