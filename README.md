# CoinAds Ad Platform MVP

A comprehensive advertising platform built with Next.js, TypeScript, and Prisma that connects advertisers with publishers in the cryptocurrency and blockchain space.

## 🚀 Features

### Authentication & User Management
- **User Registration**: Separate flows for Advertisers and Publishers
- **Email Verification**: Secure account verification system
- **Password Reset**: Forgot password functionality with secure tokens
- **Role-based Access**: Advertiser, Publisher, and Admin roles
- **Organization Support**: Multi-user organizations with team management

### Advertiser Portal
- **Campaign Management**: Create, edit, pause, and manage advertising campaigns
- **Campaign Creation Wizard**: Multi-step campaign setup with validation
- **Budget Management**: Set total and daily budgets with real-time tracking
- **Creative Upload**: Support for image, HTML5, and native ad formats
- **Targeting Options**: Geographic, device, and category targeting
- **Real-time Analytics**: Campaign performance metrics and reporting
- **Wallet System**: Add funds via credit card, crypto, or wire transfer
- **Billing Dashboard**: Transaction history and payment management

### Publisher Portal
- **Site Management**: Register and verify websites for ad serving
- **Site Verification**: Automated verification with meta tag validation
- **Ad Placement Management**: Create and manage ad placements/zones
- **Earnings Tracking**: Real-time earnings and performance metrics
- **Payout System**: Request payouts via USDT, SEPA, or SWIFT
- **Ad Tag Generator**: Generate integration code for websites
- **Performance Analytics**: Detailed reporting by site and placement

### Admin Dashboard
- **Campaign Approvals**: Review and approve advertiser campaigns
- **Site Approvals**: Verify and approve publisher websites
- **User Management**: Manage user accounts and permissions
- **System Monitoring**: Platform health and performance metrics
- **Fraud Detection**: Basic bot detection and traffic quality monitoring
- **Financial Oversight**: Transaction monitoring and payout management

### Ad Delivery System
- **Real-time Ad Serving**: High-performance ad delivery API
- **Impression Tracking**: Accurate impression counting with bot detection
- **Click Tracking**: Secure click tracking with fraud prevention
- **Conversion Tracking**: Pixel-based conversion tracking
- **Ad Selection**: Intelligent ad selection based on targeting criteria
- **Fallback Handling**: Graceful handling of no-ad scenarios

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials and email providers
- **Payments**: Stripe integration (ready for crypto payments)
- **Deployment**: Docker-ready with comprehensive configuration

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CoinAds
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp env.example .env.local
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coinads"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for MVP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@coinads.com"

# Stripe (optional for MVP)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
CoinAds/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── advertiser/           # Advertiser-specific APIs
│   │   ├── publisher/            # Publisher-specific APIs
│   │   ├── delivery/             # Ad delivery system
│   │   └── track/                # Tracking endpoints
│   ├── app/                      # Main application pages
│   │   ├── advertiser/           # Advertiser portal
│   │   ├── publisher/            # Publisher portal
│   │   └── admin/                # Admin dashboard
│   ├── auth/                     # Authentication pages
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   └── app/                      # App-specific components
├── contexts/                     # React contexts
├── lib/                          # Utility libraries
├── prisma/                       # Database schema and migrations
├── public/                       # Static assets
└── scripts/                      # Utility scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user

### Advertiser APIs
- `GET /api/advertiser/campaigns` - List campaigns
- `POST /api/advertiser/campaigns` - Create campaign
- `GET /api/advertiser/campaigns/[id]` - Get campaign details
- `PUT /api/advertiser/campaigns/[id]` - Update campaign
- `GET /api/advertiser/wallet` - Get wallet info
- `POST /api/advertiser/wallet` - Add funds

### Publisher APIs
- `GET /api/publisher/sites` - List sites
- `POST /api/publisher/sites` - Create site
- `GET /api/publisher/sites/[id]` - Get site details
- `POST /api/publisher/sites/[id]` - Verify site
- `GET /api/publisher/earnings` - Get earnings data

### Ad Delivery
- `GET /api/delivery` - Serve ads
- `GET /api/track/click` - Track clicks
- `POST /api/track/imp` - Track impressions
- `GET /api/track/conversion` - Track conversions

## 🎯 User Flows

### Advertiser Flow
1. **Registration**: Sign up as advertiser with organization details
2. **Wallet Setup**: Add funds via credit card, crypto, or wire
3. **Campaign Creation**: Use wizard to create campaigns with targeting
4. **Creative Upload**: Upload ad creatives in supported formats
5. **Campaign Launch**: Submit for approval and launch
6. **Performance Monitoring**: Track metrics and optimize campaigns

### Publisher Flow
1. **Registration**: Sign up as publisher with organization details
2. **Site Registration**: Add websites with verification tokens
3. **Site Verification**: Add meta tag and verify ownership
4. **Placement Creation**: Create ad placements for different sizes
5. **Ad Integration**: Generate and implement ad tags
6. **Earnings Tracking**: Monitor performance and request payouts

### Admin Flow
1. **Campaign Approval**: Review and approve advertiser campaigns
2. **Site Verification**: Verify publisher website ownership
3. **User Management**: Manage user accounts and permissions
4. **System Monitoring**: Monitor platform health and performance

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **CSRF Protection**: Built-in NextAuth protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **Bot Detection**: User agent and IP-based detection
- **Rate Limiting**: API endpoint protection

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following key entities:

- **Users**: Authentication and profile information
- **Organizations**: Multi-user company accounts
- **Campaigns**: Advertiser campaigns with budgets and targeting
- **Line Items**: Campaign components with specific targeting
- **Creatives**: Ad assets (images, HTML5, native)
- **Sites**: Publisher websites with verification status
- **Placements**: Ad zones on publisher sites
- **Impressions**: Ad view tracking with fraud detection
- **Clicks**: Click tracking with conversion attribution
- **Conversions**: Conversion tracking and attribution
- **Wallets**: Financial accounts for organizations
- **Transactions**: Payment and spending records
- **Payouts**: Publisher earnings and payments

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t coinads .

# Run with docker-compose
docker-compose up -d
```

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Run migrations: `npx prisma migrate deploy`
5. Start the application: `npm start`

## 🧪 Testing

The application includes comprehensive testing setup:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run type checking
npm run type-check
```

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis-ready for session and data caching
- **CDN Integration**: Static asset optimization
- **Ad Delivery**: High-performance ad serving with minimal latency
- **Fraud Prevention**: Efficient bot detection algorithms

## 🔮 Future Enhancements

- **Advanced Targeting**: Demographic and behavioral targeting
- **Real-time Bidding**: Programmatic ad buying
- **Machine Learning**: Fraud detection and optimization
- **Mobile SDK**: Native mobile app integration
- **Advanced Analytics**: Detailed reporting and insights
- **API Rate Limiting**: Comprehensive API protection
- **Multi-currency Support**: Cryptocurrency payments
- **White-label Solution**: Customizable branding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎉 Acknowledgments

- Next.js team for the excellent framework
- Prisma team for the powerful ORM
- Radix UI for accessible components
- Tailwind CSS for utility-first styling

---

**CoinAds MVP** - Connecting advertisers with publishers in the crypto space 🚀#   C o i n A d s  
 