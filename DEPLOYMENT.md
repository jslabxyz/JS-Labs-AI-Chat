# 🚢 Deployment Guide

## Production Deployment Options

### Option 1: Railway (Recommended)

Railway offers easy deployment with automatic SSL and custom domains.

#### Setup:
1. Create account at https://railway.app
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically on git push

#### Environment Variables for Railway:
```bash
CLAUDE_API_KEY=your_claude_key
SHOPIFY_API_KEY=your_shopify_key
SHOPIFY_API_SECRET=your_shopify_secret
DATABASE_URL=postgresql://[railway_provided_url]
SHOPIFY_APP_URL=https://your-app.railway.app
HOST=https://your-app.railway.app
NODE_ENV=production
```

### Option 2: Heroku

#### Setup:
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set CLAUDE_API_KEY=your_key
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
heroku config:set SHOPIFY_APP_URL=https://your-app-name.herokuapp.com
heroku config:set HOST=https://your-app-name.herokuapp.com
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Option 3: Vercel

#### Setup:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables via Vercel dashboard
```

## Database Migration for Production

### For PostgreSQL (Railway/Heroku):

1. Update your `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

2. Generate new migration:
```bash
npx prisma migrate dev --name init_postgresql
```

3. Deploy migration:
```bash
npx prisma migrate deploy
```

## Update Shopify App Configuration

After deployment:

1. **Go to Partner Dashboard** → Your App → App setup
2. **Update URLs:**
   - App URL: `https://your-production-domain.com`
   - Allowed redirection URLs: `https://your-production-domain.com/auth/callback`
3. **App distribution:** Change to "Public" when ready

## SSL Certificate

Most platforms (Railway, Heroku, Vercel) provide automatic SSL. Ensure:
- Your app URL uses `https://`
- Certificate is valid
- Redirects work properly

## Domain Setup (Optional)

### Custom Domain:
1. Purchase domain from registrar
2. Add CNAME record pointing to your platform
3. Configure custom domain in platform dashboard
4. Update Shopify app URLs to use custom domain

## Environment Security

### Production Checklist:
- ✅ All API keys are production keys
- ✅ Database URL points to production database
- ✅ `NODE_ENV=production`
- ✅ SSL certificate is active
- ✅ Domain is secured
- ✅ Rate limiting is enabled

## Monitoring & Logs

### Railway:
- View logs in Railway dashboard
- Set up alerts for errors

### Heroku:
```bash
# View logs
heroku logs --tail

# Add monitoring
heroku addons:create papertrail
```

## Performance Optimization

### Database:
- Enable connection pooling
- Add database indexes
- Monitor query performance

### Caching:
- Enable Redis for session storage (optional)
- Add CDN for static assets

### Scaling:
- Monitor response times
- Scale dynos/instances as needed
- Set up auto-scaling

## Backup Strategy

### Database Backups:
- Railway: Automatic backups included
- Heroku: `heroku pg:backups:schedule DATABASE_URL --at '04:00 UTC'`
- Set up regular backup verification

### Code Backups:
- Use Git repository as source of truth
- Tag releases for easy rollback
- Maintain staging environment

## Health Checks

Add health check endpoint in your app:

```javascript
// In your Remix app
export async function loader() {
  // Check database connection
  // Check Claude API
  // Return status
  return json({ status: 'healthy', timestamp: new Date().toISOString() });
}
```

## Rollback Plan

If deployment fails:

1. **Immediate rollback:**
   ```bash
   # Heroku
   heroku rollback
   
   # Railway - redeploy previous commit
   git reset --hard HEAD~1
   git push --force
   ```

2. **Database rollback:**
   ```bash
   # Restore from backup
   npx prisma migrate reset
   ```

## Testing in Production

### Smoke Tests:
1. App installation works
2. Chat bubble appears
3. Basic chat functionality
4. Product search works
5. Cart operations work
6. Authentication flow works

### Load Testing:
- Use tools like Artillery or k6
- Test concurrent chat sessions
- Monitor database performance

## Support & Monitoring

### Error Tracking:
Consider adding services like:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for performance monitoring

### User Analytics:
- Track chat engagement
- Monitor conversion rates
- Analyze user queries