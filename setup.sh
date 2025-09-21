#!/bin/bash

# CoinAds MVP Setup Script
# This script sets up the CoinAds platform for development

set -e

echo "🚀 Setting up CoinAds MVP Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ PostgreSQL is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your database and API keys"
    echo "   Required: DATABASE_URL, NEXTAUTH_SECRET"
    echo "   Optional: EMAIL_*, STRIPE_*"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database is accessible
echo "🗄️  Checking database connection..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your DATABASE_URL in .env.local"
    exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed the database (optional)
echo "🌱 Seeding database..."
npm run db:seed || echo "⚠️  Database seeding failed (optional)"

# Build the application
echo "🏗️  Building application..."
npm run build

echo ""
echo "🎉 CoinAds MVP setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see the application"
echo ""
echo "Default accounts (for testing):"
echo "- Advertiser: advertiser@example.com / password123"
echo "- Publisher: publisher@example.com / password123"
echo "- Admin: admin@example.com / password123"
echo ""
echo "📚 Documentation: See README.md for detailed information"
echo "🐛 Issues: Create an issue in the repository"
echo ""
echo "Happy coding! 🚀"