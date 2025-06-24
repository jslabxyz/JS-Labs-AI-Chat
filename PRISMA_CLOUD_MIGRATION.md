# Prisma Cloud Migration Guide

This guide will help you migrate from local SQLite to Prisma Cloud for your JS Labs AI Chat application.

## Current Setup (SQLite)
- ✅ Already configured and working
- ✅ Local development database
- ✅ All models defined and functional

## Migration Timeline

### Phase 1: Preparation (Now - Before Business Plan)
- [x] Environment variables configured
- [x] Schema prepared for PostgreSQL compatibility
- [ ] Create Prisma Cloud account
- [ ] Set up development environment on Starter Plan

### Phase 2: Business Plan Upgrade (Day 20+)
- [ ] Upgrade to Prisma Cloud Business Plan
- [ ] Create production database
- [ ] Migrate data from SQLite to PostgreSQL
- [ ] Update production environment

## Step-by-Step Migration

### 1. Create Prisma Cloud Account (Now)

1. Go to [Prisma Cloud](https://cloud.prisma.io/)
2. Sign up with your GitHub account
3. Create a new project: "JS Labs AI Chat"

### 2. Set Up Development Environment (Starter Plan)

1. **Create a new environment** in Prisma Cloud:
   ```
   Environment: Development
   Database: PostgreSQL (free tier)
   ```

2. **Get your connection string** from Prisma Cloud dashboard

3. **Update your `.env` file**:
   ```env
   # Comment out SQLite
   # DATABASE_URL=file:dev.sqlite
   
   # Add Prisma Cloud connection
   DATABASE_URL=prisma://your-prisma-cloud-connection-string
   PRISMA_GENERATE_DATAPROXY=true
   ```

4. **Update `prisma/schema.prisma`**:
   ```prisma
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["dataProxy"]
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### 3. Install Prisma CLI (if not already installed)

```bash
npm install -g prisma
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Deploy Schema to Prisma Cloud

```bash
npx prisma db push
```

### 6. Test the Migration

```bash
npm run dev
```

## Business Plan Upgrade (Day 20+)

### Benefits of Business Plan:
- **Production-ready databases**
- **Enhanced performance** 
- **Advanced monitoring**
- **Backup and restore**
- **Multiple environments**
- **Collaboration features**

### Migration Steps:

1. **Upgrade to Business Plan** in Prisma Cloud

2. **Create Production Environment**:
   ```
   Environment: Production
   Database: PostgreSQL (production tier)
   ```

3. **Data Migration** (if you have existing data):
   ```bash
   # Export data from SQLite
   npx prisma db seed
   
   # Or use migration scripts we'll create
   node scripts/migrate-to-prisma-cloud.js
   ```

4. **Update Production Environment Variables**:
   ```env
   DATABASE_URL=prisma://your-production-connection-string
   PRISMA_GENERATE_DATAPROXY=true
   NODE_ENV=production
   ```

5. **Deploy to Production**:
   ```bash
   npm run build
   npm start
   ```

## Database Schema Optimization for PostgreSQL

Our current schema works well with PostgreSQL, but here are some optimizations:

### Indexes for Performance
```prisma
model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String       // "user" or "assistant"
  content        String
  createdAt      DateTime     @default(now())

  @@index([conversationId])
  @@index([createdAt]) // New index for better query performance
}

model Session {
  id            String    @id
  shop          String
  state         String
  isOnline      Boolean   @default(false)
  scope         String?
  expires       DateTime?
  accessToken   String
  userId        BigInt?
  firstName     String?
  lastName      String?
  email         String?
  accountOwner  Boolean   @default(false)
  locale        String?
  collaborator  Boolean?  @default(false)
  emailVerified Boolean?  @default(false)
  
  @@index([shop]) // New index for better shop queries
}
```

## Environment Management

### Development Environment
```env
DATABASE_URL=prisma://dev-connection-string
PRISMA_GENERATE_DATAPROXY=true
NODE_ENV=development
```

### Production Environment
```env
DATABASE_URL=prisma://prod-connection-string
PRISMA_GENERATE_DATAPROXY=true
NODE_ENV=production
```

## Monitoring and Maintenance

### Prisma Cloud Dashboard Features:
- **Query Performance Monitoring**
- **Connection Pool Management**
- **Real-time Metrics**
- **Error Tracking**
- **Automated Backups**

### Best Practices:
1. **Regular Schema Migrations**: Use `prisma migrate` for schema changes
2. **Connection Pooling**: Leverage Prisma Cloud's built-in pooling
3. **Query Optimization**: Monitor slow queries in dashboard
4. **Backup Strategy**: Set up automated backups in Business Plan

## Troubleshooting

### Common Issues:

1. **Data Proxy Connection Errors**:
   ```bash
   # Regenerate client
   npx prisma generate
   ```

2. **Migration Failures**:
   ```bash
   # Reset database (development only)
   npx prisma db push --force-reset
   ```

3. **Performance Issues**:
   - Check query patterns in Prisma Cloud dashboard
   - Optimize indexes
   - Use query optimization features

## Cost Estimation

### Starter Plan (Current): 
- **Free tier database**
- **Basic features**
- **Limited queries/month**

### Business Plan (Upgrade):
- **Production-grade database**
- **Unlimited queries**
- **Advanced features**
- **Support included**
- **Estimated cost**: $29-99/month depending on usage

## Next Steps

1. **Create Prisma Cloud account** (can be done now)
2. **Set up development environment** on Starter Plan
3. **Test migration** with development data
4. **Plan Business Plan upgrade** for Day 20
5. **Prepare production deployment** strategy

## Support Resources

- [Prisma Cloud Documentation](https://www.prisma.io/docs/platform)
- [Migration Guide](https://www.prisma.io/docs/guides/migrate-to-prisma)
- [PostgreSQL Best Practices](https://www.prisma.io/docs/guides/database/postgresql)

---

**Note**: This migration can be done gradually. Start with development environment now, then upgrade to Business Plan when ready for production scaling.