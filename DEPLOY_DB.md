# Database Deployment Guide

## Overview

This guide covers database migration and deployment for the CoinAds MVP application using Prisma ORM with Neon PostgreSQL.

## Local Development

### Initial Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run initial migration (creates migration files)
npm run db:migrate:dev

# Seed the database with sample data
npm run db:seed
```

### Development Workflow
```bash
# For ongoing development, use the standard migrate command
npm run db:migrate

# View database in Prisma Studio
npm run db:studio
```

## Production Deployment (Vercel)

### Prerequisites
1. **Neon Database**: Set up a Neon PostgreSQL database
2. **Vercel Project**: Deploy your Next.js app to Vercel
3. **Environment Variables**: Configure required environment variables

### Environment Variables Setup

In Vercel → Project → Settings → Environment Variables, add:

```env
# Required
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"

# Optional
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### Build Process

Vercel will automatically run the following during deployment:

1. **Build Step**: `npm run build`
   - This triggers `prisma generate` to create the Prisma client
   - Next.js builds the application

2. **Migration Step**: `npm run db:migrate:deploy`
   - Applies all pending migrations to the production database
   - **Note**: This runs automatically during Vercel's build process

### Manual Migration (if needed)

If you need to run migrations manually in production:

```bash
# Connect to production environment
vercel env pull .env.production

# Run migrations
npm run db:migrate:deploy
```

## Migration Workflow

### Creating Schema Changes

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: 
   ```bash
   npm run db:migrate:dev --name "describe-your-change"
   ```
3. **Test Locally**: Verify the migration works
4. **Commit Changes**: Include both schema and migration files
5. **Deploy**: Push to main branch (Vercel auto-deploys)

### Example Migration

```bash
# Add a new field to User model
# Edit prisma/schema.prisma:
# model User {
#   id        Int      @id @default(autoincrement())
#   email     String   @unique
#   role      Role
#   name      String?
#   phone     String?  # <- New field
#   createdAt DateTime @default(now())
# }

# Create migration
npm run db:migrate:dev --name "add-phone-to-user"

# This creates:
# prisma/migrations/20240101120000_add_phone_to_user/migration.sql
```

## Important Notes

### ⚠️ Schema Changes Must Be Committed

**All schema changes must be committed as Prisma migrations:**

- ✅ **DO**: Use `npm run db:migrate:dev` to create migration files
- ✅ **DO**: Commit both `schema.prisma` and `migrations/` folder
- ❌ **DON'T**: Use `prisma db push` in production
- ❌ **DON'T**: Manually edit the database schema

### Migration Best Practices

1. **Always test migrations locally** before deploying
2. **Use descriptive migration names** (e.g., `add-user-phone-field`)
3. **Review generated SQL** in migration files
4. **Backup production database** before major migrations
5. **Deploy during low-traffic periods** for critical changes

### Rollback Strategy

If a migration fails in production:

1. **Fix the migration** in a new commit
2. **Redeploy** to apply the fix
3. **Manual rollback** if needed (contact database admin)

## Troubleshooting

### Common Issues

**Migration fails in production:**
```bash
# Check migration status
npx prisma migrate status

# Reset and reapply (DANGEROUS - data loss)
npx prisma migrate reset
```

**Environment variables not set:**
- Verify `DATABASE_URL` in Vercel environment variables
- Ensure `NEXTAUTH_SECRET` is set for production
- Check `NEXTAUTH_URL` matches your domain

**Build fails on Vercel:**
- Check build logs for Prisma errors
- Verify all dependencies are in `package.json`
- Ensure `prisma generate` runs during build

### Support

For database-related issues:
1. Check Vercel build logs
2. Review Neon database logs
3. Test migrations locally first
4. Contact the development team

## Security Considerations

- **Never commit** `.env` files with real credentials
- **Use strong secrets** for `NEXTAUTH_SECRET`
- **Enable SSL** for database connections (`sslmode=require`)
- **Limit database access** to necessary IP ranges
- **Regular backups** of production data

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Maintainer**: CoinAds Development Team
