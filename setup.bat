@echo off
REM CoinAds MVP Setup Script for Windows
REM This script sets up the CoinAds platform for development

echo 🚀 Setting up CoinAds MVP Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL first.
    pause
    exit /b 1
)

echo ✅ PostgreSQL is installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating environment file...
    copy env.example .env.local
    echo ⚠️  Please edit .env.local with your database and API keys
    echo    Required: DATABASE_URL, NEXTAUTH_SECRET
    echo    Optional: EMAIL_*, STRIPE_*
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Check if database is accessible
echo 🗄️  Checking database connection...
npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo ❌ Database connection failed. Please check your DATABASE_URL in .env.local
    pause
    exit /b 1
)

echo ✅ Database connection successful

REM Run database migrations
echo 🔄 Running database migrations...
npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ Failed to run migrations
    pause
    exit /b 1
)

REM Seed the database (optional)
echo 🌱 Seeding database...
npm run db:seed
if %errorlevel% neq 0 (
    echo ⚠️  Database seeding failed (optional)
)

REM Build the application
echo 🏗️  Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build application
    pause
    exit /b 1
)

echo.
echo 🎉 CoinAds MVP setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your configuration
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000 to see the application
echo.
echo Default accounts (for testing):
echo - Advertiser: advertiser@example.com / password123
echo - Publisher: publisher@example.com / password123
echo - Admin: admin@example.com / password123
echo.
echo 📚 Documentation: See README.md for detailed information
echo 🐛 Issues: Create an issue in the repository
echo.
echo Happy coding! 🚀
pause