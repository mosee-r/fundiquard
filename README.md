# FundiGuard.ke - Professional Services Marketplace

A comprehensive Next.js + Express.js platform connecting clients with skilled professionals (fundis) in Kenya for job services, bidding, escrow payments, and dispute resolution.

## 🎯 Features

### Core Marketplace
- **Job Posting & Browsing** - Clients post jobs with photos, professionals browse and bid
- **Smart Bidding System** - Professionals submit bids with custom pricing and timelines
- **Geo-Location Mapping** - Map-based job discovery with location filtering
- **Professional Profiles** - Verified professional profiles with ratings, years of experience, and portfolio

### Financial & Trust
- **Escrow Payments** - Secure transactions held until job completion via M-Pesa
- **Dispute Resolution** - Built-in dispute system with evidence uploads and admin review
- **Insurance Options** - Coverage plans for job protection (basic, standard, premium)
- **Rating & Review System** - 5-star ratings with detailed feedback categories

### Image Uploads (All 4 Features)
- **Job Photos** - Upload up to 5 photos when posting a job
- **Completion Photos** - Fundis upload proof photos when marking jobs complete
- **Dispute Evidence** - Upload up to 10 evidence photos in disputes
- **Profile Photos** - User profile avatars with preview

### Security & Verification
- **OTP Authentication** - Phone-based login via SMS (Twilio)
- **Identity Verification** - National ID verification
- **DCI Background Checks** - Police clearance verification for professionals
- **JWT Token Management** - Secure session handling with token rotation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (with Turbopack)
- **Language**: TypeScript
- **UI**: React 19.2.3, Tailwind CSS 4
- **Maps**: Leaflet + Mapbox GL with geocoding
- **PWA**: next-pwa for offline support
- **Package Manager**: npm

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Supabase)
- **File Storage**: Supabase Storage (S3-compatible)
- **Authentication**: JWT + OTP (Twilio)
- **File Upload**: Multer with validation
- **Payments**: M-Pesa integration

### DevOps
- **Hosting**: Vercel (frontend), Node.js (backend)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Git**: GitHub

## 📦 Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- PostgreSQL 14+ (via Supabase)
- Git

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/mosee-r/fundiguard.git
cd fundiguard.ke
```

2. **Frontend Setup**
```bash
npm install
```

3. **Backend Setup**
```bash
cd backend
npm install
cd ..
```

4. **Environment Configuration**

Create `.env.local` in root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

Create `backend/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/fundiguard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
SUPABASE_STORAGE_BUCKET=job-photos
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+254xxx
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
NODE_ENV=development
```

5. **Database Setup**

Apply migrations in Supabase SQL Editor:
```bash
# Run database/migration_add_photo_columns.sql
# This adds photo columns for all 4 upload features
```

## 🚀 Running the Project

### Development Mode

**Terminal 1 - Frontend (Port 3000)**
```bash
npm run dev
```

**Terminal 2 - Backend (Port 3001)**
```bash
cd backend
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:3001/api`

### Production Build

**Frontend**
```bash
npm run build
npm start
```

**Backend**
```bash
cd backend
npm run build
npm start
```

## 📁 Project Structure

```
fundiguard.ke/
├── app/                              # Next.js frontend
│   ├── components/
│   │   ├── PhotoUploader.tsx        # Reusable photo upload component
│   │   ├── CompletionModal.tsx      # Job completion modal with photos
│   │   ├── BidForm.tsx              # Bidding form component
│   │   ├── JobMap.tsx               # Map display for jobs
│   │   └── ui/                      # Reusable UI components
│   ├── lib/
│   │   ├── api.ts                   # API client with upload methods
│   │   ├── maps.ts                  # Map utilities and geocoding
│   │   └── mpesa.ts                 # M-Pesa integration
│   ├── hooks/                       # Custom React hooks
│   ├── post-job/                    # Create job page
│   ├── browse-jobs/                 # Browse jobs page
│   ├── my-bids/                     # My bids page
│   ├── dispute/                     # Dispute filing page
│   ├── profile/                     # User profile pages
│   └── auth/                        # Authentication pages
│
├── backend/                          # Express.js backend
│   └── src/
│       ├── routes/
│       │   ├── upload.ts            # File upload endpoints
│       │   ├── auth.ts              # Auth endpoints
│       │   ├── jobs.ts              # Job endpoints
│       │   ├── bids.ts              # Bidding endpoints
│       │   ├── bookings.ts          # Booking/contract endpoints
│       │   ├── payments.ts          # Payment endpoints
│       │   ├── disputes.ts          # Dispute endpoints
│       │   └── users.ts             # User endpoints
│       ├── controllers/             # Route handlers
│       ├── services/                # Business logic
│       ├── middleware/              # Express middleware
│       ├── types/                   # TypeScript types
│       ├── utils/                   # Utility functions
│       └── config/
│           └── supabase.ts          # Supabase client setup
│
├── database/
│   ├── schema.sql                   # Complete database schema
│   ├── SCHEMA_DOCUMENTATION.md      # Schema documentation
│   └── migration_add_photo_columns.sql  # Photo columns migration
│
├── package.json                      # Frontend dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
└── README.md                         # This file
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login with phone & password
GET    /api/auth/profile          # Get authenticated user profile
```

### Jobs
```
POST   /api/jobs                  # Create new job
GET    /api/jobs                  # List jobs (with filters)
GET    /api/jobs/:id              # Get job details
PATCH  /api/jobs/:id              # Update job
DELETE /api/jobs/:id              # Delete job
```

### Bids
```
POST   /api/bids                  # Submit bid on job
GET    /api/bids/:jobId           # Get all bids for job
PATCH  /api/bids/:id              # Accept/reject bid
DELETE /api/bids/:id              # Withdraw bid
```

### Bookings & Completion
```
GET    /api/bookings              # Get user's bookings
GET    /api/bookings/:id          # Get booking details
POST   /api/bookings/:id/complete # Mark job as complete with photos
```

### File Upload
```
POST   /api/upload                # Upload single image
POST   /api/upload/batch          # Upload multiple images (max 5)
DELETE /api/upload                # Delete uploaded image by path
```

### Users
```
GET    /api/users/profile         # Get user profile
PATCH  /api/users/profile         # Update profile with photo
GET    /api/users/:id             # Get public user profile
```

### Disputes
```
POST   /api/disputes              # File new dispute with evidence
GET    /api/disputes/:id          # Get dispute details
PATCH  /api/disputes/:id          # Add evidence or resolve
```

## 📊 Image Upload Features

### 1. Job Photos
- **Where**: Post job page
- **Limit**: 5 photos max, 10MB each
- **Storage**: `jobs.photos` JSONB array
- **Path**: `/job-photos/userId/timestamp-random.jpg`

### 2. Completion Photos
- **Where**: My bids page (mark complete button)
- **Limit**: 5 photos max, 10MB each
- **Storage**: `bookings.completion_photos` JSONB array
- **Path**: `/job-photos/userId/timestamp-random.jpg`

### 3. Dispute Evidence
- **Where**: Dispute filing page
- **Limit**: 10 photos max, 10MB each
- **Storage**: `disputes.evidence_files` JSONB array
- **Path**: `/job-photos/userId/timestamp-random.jpg`

### 4. Profile Photos
- **Where**: Profile edit page
- **Limit**: 1 photo, 10MB max
- **Storage**: `users.profile_photo_url` TEXT field
- **Path**: `/job-photos/userId/timestamp-random.jpg`

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ OTP verification for login
- ✅ Password hashing with bcryptjs
- ✅ Multer file validation (images only)
- ✅ Supabase RLS (Row Level Security) policies
- ✅ User-isolated file storage paths
- ✅ CORS configuration
- ✅ Rate limiting on auth endpoints
- ✅ Database query parameterization (prevents SQL injection)

## 🧪 Testing

### Build Validation
```bash
# Frontend build
npm run build

# Backend build
cd backend
npm run build
```

### Current Status
- ✅ Frontend: All 16 routes compile successfully
- ✅ Backend: All TypeScript compilation successful
- ✅ Image uploads: All 4 features implemented and wired
- ✅ Database: Photo columns ready (migration provided)
- ✅ npm audit: 0 vulnerabilities, all dependencies updated

## 📋 Database Migration

Run this in Supabase SQL Editor to add photo columns:

```sql
-- Add image upload support columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS photos JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completion_photos JSONB;
ALTER TABLE disputes ADD COLUMN IF NOT EXISTS evidence_files JSONB;
```

Or use the provided migration file:
```bash
# Copy contents of database/migration_add_photo_columns.sql
# Paste into Supabase SQL Editor and run
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Connected to GitHub - automatic deployment on push to master
# Environment variables set in Vercel dashboard
```

### Backend (Node.js Server)
```bash
cd backend
npm run build
npm start
```

### Database (Supabase)
- PostgreSQL is automatically managed
- Backups and replication handled by Supabase

## 📝 Development Roadmap

### Current Phase (Complete ✅)
- ✅ Complete image upload system (all 4 features)
- ✅ Job posting and bidding
- ✅ Escrow payment system
- ✅ Dispute resolution
- ✅ Professional verification

### Next Phase
- 🔄 Implement real-time notifications (WebSocket)
- 🔄 Add advanced search filters
- 🔄 Implement professional subscriptions
- 🔄 Add analytics dashboard
- 🔄 Mobile app version

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Commit changes: `git commit -am 'feat: description'`
3. Push to branch: `git push origin feature/description`
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contact & Support

- **Email**: support@fundiguard.ke
- **GitHub**: https://github.com/mosee-r/fundiguard
- **Issues**: Report bugs on GitHub Issues

## 🙏 Acknowledgments

- Supabase for database and storage
- Vercel for frontend hosting
- Mapbox for mapping services
- Twilio for SMS/OTP services
- M-Pesa for payment processing

---

**Last Updated**: February 24, 2026  
**Version**: 1.0.0 - Image Upload System Complete
