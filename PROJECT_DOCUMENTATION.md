# FundiGuard.ke - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API Routes & Controllers](#api-routes--controllers)
8. [Frontend Components](#frontend-components)
9. [Authentication & Security](#authentication--security)
10. [Development Guide](#development-guide)
11. [Deployment & DevOps](#deployment--devops)

---

## Project Overview

**FundiGuard.ke** is a comprehensive digital marketplace platform that connects clients with skilled professionals ("fundis") in Kenya for a wide variety of job services.

### Mission
To provide a safe, transparent, and trustworthy platform where:
- **Clients** can post jobs and hire verified professionals
- **Professionals** can bid on jobs and build their careers
- **Transactions** are secure with escrow payments
- **Disputes** are resolved fairly with evidence-based reviews

### Type
Full-stack web application with:
- **Frontend**: Next.js 16 (modern React UI)
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage (S3-compatible)
- **Mobile-First**: PWA support for offline functionality

---

## Key Features

### 1. **Marketplace Core**
- **Job Posting**: Clients create jobs with title, description, budget, urgency, location, and up to 5 photos
- **Job Browsing**: Professionals browse available jobs with advanced filtering (category, location, budget)
- **Geo-Location Mapping**: Interactive map view with Leaflet/Mapbox for discovering nearby jobs
- **Smart Bidding**: Professionals submit custom bids with proposed price, timeline, and personal message
- **Job Lifecycle**: Open → In Progress → Completed or Disputed

### 2. **Professional Profiles**
- **Verified Profiles**: Full professional profiles with:
  - Skill categories (Plumbing, Electrical, Carpentry, Painting, etc.)
  - Years of experience
  - Hourly/job rates
  - Portfolio links
  - Profile photo/avatar
- **Rating System**: 5-star ratings with category breakdowns (communication, quality, punctuality)
- **Subscription Tiers**: Free, Premium, Elite (different visibility/features)
- **Availability Status**: Online/offline toggle and job availability
- **Career Metrics**: Total jobs completed, total earnings, average rating

### 3. **Secure Payments (Escrow)**
- **M-Pesa Integration**: Payment processing via Safaricom M-Pesa
- **Escrow Mechanism**: 
  - Platform holds payment until job completion
  - Client releases payment only after verifying completion photos
  - 10% platform fee from each transaction
  - Funds go to: Pro (85%), Platform (10%), Taxes (5%)
- **Payment Tracking**: Detailed ledger of all earnings, refunds, bonuses
- **Instant Payouts**: Once released, funds transfer to pro's M-Pesa account

### 4. **Dispute Resolution**
- **Evidence-Based**: Each dispute includes:
  - Text description of the issue
  - Up to 10 evidence photos/documents
  - Initiator and respondent descriptions
- **Admin Review**: FundiGuard admin reviews disputes and decides:
  - Who's at fault
  - Amount to refund/pay
  - Detailed resolution notes
- **Status Tracking**: Open → Under Review → Resolved → Appealed

### 5. **Insurance Coverage**
- **Optional Job Protection**:
  - **Basic**: 50,000 KSh coverage, 99 KSh premium
  - **Standard**: 100,000 KSh coverage, 199 KSh premium
  - **Premium**: 250,000 KSh coverage, 299 KSh premium
- **30-Day Coverage**: Automatic expiration
- **Claim Process**: Customer claims, admin approves/denies

### 6. **Image Uploads (4 Critical Features)**
- **Job Photos**: Client uploads up to 5 photos when posting job
- **Completion Photos**: Professional uploads proof photos when marking job complete
- **Dispute Evidence**: Both parties upload evidence during disputes (up to 10 files)
- **Profile Photos**: Avatar for user profiles with client-side preview

All images use Supabase Storage with security rules and validation.

### 7. **Security & Verification**
- **OTP Authentication**: Phone-based login via SMS (Twilio)
- **Verification Levels**:
  - ✓ Phone verified (OTP)
  - ✓ Email verified (link)
  - ✓ ID verified (National ID upload)
  - ✓ DCI verified (Police background check)
- **JWT Tokens**: Stateless session management with token rotation
- **Password Security**: bcryptjs hashing with salt rounds

### 8. **Communication & Notifications**
- **In-App Messaging**: Real-time chat between clients and professionals
- **Push Notifications**: Desktop/mobile notifications for:
  - New bids on job
  - Booking accepted/rejected
  - Payment released
  - Dispute status updates
  - Rating received

### 9. **Additional Features**
- **Service Categories**: 12 major categories with subcategories
- **Responsive Design**: Mobile-first with Tailwind CSS
- **PWA Support**: Offline-first with service workers
- **Dark Mode**: Theme customization (if implemented)

---

## Tech Stack

### Frontend
```
Framework:    Next.js 16.1.6 (App Router)
Language:     TypeScript 5
UI Library:   React 19.2.3
Styling:      Tailwind CSS 4 + PostCSS
Maps:         Leaflet.js 1.9.4 + Mapbox GL 3.18.1 + Geocoder
Icons:        Lucide React 0.575.0
PWA:          next-pwa 5.6.0
Package Mgr:  npm
Build Tool:   Turbopack
```

### Backend
```
Framework:    Express.js 4.18.2
Language:     TypeScript 5.3.3
Runtime:      Node.js 18+
Database:     PostgreSQL 14+ (Supabase)
Storage:      Supabase Storage (S3-compatible)
File Upload:  Multer 1.4.4
Auth:         JWT 9.0.0
OTP:          Twilio 4.0.0
Hash:         bcryptjs 2.4.3
HTTP Client:  Axios 1.6.0
CORS:         cors 2.8.5
Env:          dotenv 16.3.1
```

### Infrastructure
```
Frontend Hosting:   Vercel
Backend Hosting:    Node.js (VPS/Cloud)
Database:           Supabase PostgreSQL
File Storage:       Supabase Storage
SMS Provider:       Twilio
Payment Gateway:    Safaricom M-Pesa
Version Control:    Git/GitHub
```

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                       │
│              (Next.js 16 React App)                     │
│  - Job Listing/Browsing                                │
│  - Professional Discovery                              │
│  - Bidding Interface                                   │
│  - Payment/Escrow Management                           │
│  - Dispute Filing                                      │
│  - Rating & Reviews                                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS API Calls
                       │ JSON/REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│          EXPRESS.JS BACKEND (Node.js)                  │
│              (REST API + Middleware)                    │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Routes:                                         │  │
│  │  - /api/auth (Login, OTP, Registration)        │  │
│  │  - /api/jobs (CRUD jobs)                       │  │
│  │  - /api/bids (Bidding)                         │  │
│  │  - /api/bookings (Bookings)                    │  │
│  │  - /api/payments (Payment tracking)            │  │
│  │  - /api/professionals (Pro profiles)           │  │
│  │  - /api/users (User management)                │  │
│  │  - /api/upload (Image uploads)                 │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Controllers & Middleware:                       │  │
│  │  - Auth (JWT, OTP validation)                  │  │
│  │  - Job (CRUD, filtering, search)               │  │
│  │  - Bid (Submit, accept, reject)                │  │
│  │  - Payment (Escrow, M-Pesa)                    │  │
│  │  - Professional (Profile, rating)              │  │
│  │  - Multer (File upload handling)               │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ Queries/Mutations
                       │ Transactions
                       ▼
┌─────────────────────────────────────────────────────────┐
│          SUPABASE ECOSYSTEM                            │
│  ┌──────────────────────────────────────────────────┐ │
│  │ PostgreSQL Database (16 tables)                 │ │
│  │  - users, professionals, jobs, bids             │ │
│  │  - bookings, escrow_transactions, ratings       │ │
│  │  - disputes, insurance_policies, payments       │ │
│  │  - messages, notifications, admin_logs          │ │
│  └──────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Supabase Storage (S3-compatible)                │ │
│  │  - Job photos                                   │ │
│  │  - Completion photos                            │ │
│  │  - Dispute evidence                             │ │
│  │  - Profile avatars                              │ │
│  └──────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Authentication (JWT tokens)                     │ │
│  │  - User registration/login                      │ │
│  │  - Session management                           │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   [Twilio]      [M-Pesa]    [External APIs]
   OTP SMS       Payments     (if needed)
```

### Data Flow Example: Job Posting & Bidding

```
1. CLIENT POSTS JOB
   Client → UI Form → API POST /api/jobs
   ↓
   Backend Validation (title, budget, location)
   ↓
   Database INSERT → jobs table
   ↓
   If images: Multer → Supabase Storage → JSON array in DB
   ↓
   Notification: Trigger broadcast to matching professionals

2. PROFESSIONAL BIDS
   Professional → UI (Browse Jobs) → API POST /api/bids
   ↓
   Backend Validation (valid job, not duplicate)
   ↓
   Database INSERT → bids table
   ↓
   Notification: Client notified of new bid

3. CLIENT ACCEPTS BID
   Client → UI (Accept) → API POST /api/bookings
   ↓
   Backend: Create booking, update job status → in_progress
   ↓
   Database: INSERT bookings, POST escrow_transactions (held)
   ↓
   Notification: Professional notified, payment held in escrow

4. PROFESSIONAL COMPLETES JOB
   Professional → UI (Mark Complete) → POST completion photos
   ↓
   Multer → Supabase Storage → JSON array → DB update
   ↓
   Database UPDATE bookings (status=completed, photos stored)
   ↓
   Notification: Client prompted to verify & release payment

5. CLIENT VERIFIES & RELEASES PAYMENT
   Client → UI (View Photos) → "Release Payment" → API
   ↓
   Backend: Call M-Pesa API → Transfer funds
   ↓
   Database UPDATE escrow_transactions (status=released)
   ↓
   Database INSERT payments (for professional's ledger)
   ↓
   Notification: Professional receives payment confirmation
```

---

## Project Structure

### Root-Level Files
```
fundiguard.ke/
├── package.json              # Frontend dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
├── next.config.ts           # Next.js config (PWA, build settings)
├── postcss.config.mjs       # PostCSS plugins
├── eslint.config.mjs        # ESLint rules
├── vercel.json              # Vercel deployment config
├── next-env.d.ts            # Next.js type definitions
├── README.md                # Project intro
├── SECURITY_AUDIT_CHECKLIST.md  # Security guidelines
└── PROJECT_DOCUMENTATION.md # This file
```

### Frontend Directory (`app/`)
```
app/
├── globals.css              # Global styles
├── layout.tsx               # Root layout
├── page.tsx                 # Home page (/)
├── auth/page.tsx            # Login/Register (/auth)
├── browse-jobs/page.tsx     # Job listing (/browse-jobs)
├── dashboard/page.tsx       # Client dashboard (/dashboard)
├── debug-map/page.tsx       # Map debugging (/debug-map)
├── dispute/page.tsx         # Dispute filing (/dispute)
├── for-pros/page.tsx        # Pro features page (/for-pros)
├── insurance/page.tsx       # Insurance plans (/insurance)
├── my-bids/page.tsx         # Professional bids (/my-bids)
├── post-job/page.tsx        # Job posting form (/post-job)
├── pro/[id]/page.tsx        # Professional profile (/pro/[id])
├── pro-dashboard/page.tsx   # Pro dashboard (/pro-dashboard)
├── profile/page.tsx         # User profile (/profile)
├── profile/edit/page.tsx    # Edit profile (/profile/edit)
│
├── components/              # Reusable React components
│   ├── BidForm.tsx         # Bid submission form
│   ├── BidsList.tsx        # Display multiple bids
│   ├── CompletionModal.tsx # Job completion dialog
│   ├── Footer.tsx          # Footer component
│   ├── Header.tsx          # Navigation header
│   ├── JobMap.tsx          # Map display for jobs
│   ├── LocationPicker.tsx  # Location selection UI
│   ├── PhotoUploader.tsx   # Image upload component
│   │
│   └── ui/                 # UI component library
│       ├── Button.tsx      # Reusable button
│       ├── FundiCard.tsx   # Professional card
│       ├── Modal.tsx       # Dialog/modal
│       ├── RatingStars.tsx # Star rating display
│       ├── ServiceCategoryCard.tsx  # Service category UI
│       ├── StatusPill.tsx  # Status badge/chip
│       └── TrustBar.tsx    # Trust score bar
│
├── hooks/                   # Custom React hooks (if any)
│
├── lib/                     # Utilities & libraries
│   ├── api.ts              # API client / fetch wrapper
│   ├── supabase.ts         # Supabase client initialization
│   ├── maps.ts             # Map utilities
│   ├── mpesa.ts            # M-Pesa payment logic
│   ├── mapDebug.ts         # Debugging map issues
│   ├── mapDebugRuntime.ts  # Runtime map debugging
│   └── IMAGE_UPLOAD_DEBUG.ts      # Image upload debugging
│   └── LOGIN_FLOW_DEBUG.ts        # Login flow debugging
```

### Backend Directory (`backend/`)
```
backend/
├── package.json             # Backend dependencies
├── tsconfig.json           # TypeScript config
├── seed.ts                 # Database seed/sample data
│
└── src/
    ├── index.ts            # Express app initialization
    │
    ├── config/
    │   └── supabase.ts     # Supabase client setup
    │
    ├── controllers/        # Business logic handlers
    │   ├── authController.ts         # Login, register, OTP
    │   ├── jobController.ts          # Job CRUD
    │   ├── bidController.ts          # Bid management
    │   ├── bookingController.ts      # Booking handling
    │   ├── paymentController.ts      # Payment processing
    │   ├── professionalController.ts # Pro profile management
    │   └── userController.ts         # User management
    │
    ├── routes/             # Express route handlers
    │   ├── auth.ts         # Auth endpoints
    │   ├── jobs.ts         # Job endpoints
    │   ├── bidRoutes.ts    # Bid endpoints
    │   ├── bookings.ts     # Booking endpoints
    │   ├── payments.ts     # Payment endpoints
    │   ├── professionals.ts # Professional endpoints
    │   ├── users.ts        # User endpoints
    │   └── upload.ts       # File upload endpoints
    │
    ├── middleware/
    │   └── auth.ts         # JWT verification, error handling
    │
    ├── services/           # Database & API services
    │   ├── authService.ts          # Auth business logic
    │   ├── jobService.ts           # Job queries/mutations
    │   ├── bidService.ts           # Bid business logic
    │   ├── bookingService.ts       # Booking operations
    │   ├── paymentService.ts       # Payment logic
    │   └── professionalService.ts  # Professional queries
    │   └── Code Citations.md       # Reference documentation
    │
    ├── types/
    │   └── index.ts        # TypeScript interfaces
    │
    └── utils/
        ├── jwt.ts          # JWT token generation/verification
        ├── otp.ts          # OTP generation/validation
        └── validation.ts   # Input validation helpers
```

### Database Directory (`database/`)
```
database/
├── schema.sql              # Complete PostgreSQL schema (16 tables)
├── SCHEMA_DOCUMENTATION.md # Detailed table & column documentation
└── migration_add_photo_columns.sql  # Database migration
```

### Public & Types
```
public/
├── manifest.json           # PWA manifest
└── sw.js                   # Service worker for offline

types/
└── next-pwa.d.ts          # PWA type definitions
```

---

## Database Schema

### Overview
16 PostgreSQL tables designed for a complete job marketplace with secure payments, disputes, and verification.

### Core Tables

#### 1. **users** (Core Account)
Stores all user data - clients, professionals, admins
```sql
- id: UUID (PK)
- phone_number: VARCHAR (unique, login identifier)
- email: VARCHAR (optional)
- password_hash: VARCHAR (bcrypt)
- full_name: VARCHAR
- profile_photo_url: TEXT
- role: VARCHAR ('client', 'pro', 'admin')
- bio: TEXT (for professionals)
- location: VARCHAR
- latitude, longitude: DECIMAL (geolocation)
- verified: BOOLEAN (email/phone verified)
- id_verified: BOOLEAN (National ID)
- dci_verified: BOOLEAN (Police background check)
- created_at: TIMESTAMP
```

#### 2. **professionals** (Extended Pro Profile)
Extended data for professionals with skills and metrics
```sql
- id: UUID (PK)
- user_id: UUID (FK → users, one-to-one)
- skill_category: VARCHAR ("Plumbing", "Electrical", etc.)
- skill_description: TEXT
- hourly_rate: DECIMAL
- portfolio_url: TEXT
- years_experience: INT
- response_time_minutes: INT
- is_available: BOOLEAN
- online_status: BOOLEAN
- subscription_type: VARCHAR ('free', 'premium', 'elite')
- total_jobs_completed: INT
- total_earnings: DECIMAL
- average_rating: DECIMAL (1-5)
- rating_count: INT
```

#### 3. **jobs** (Job Postings)
Client-posted jobs waiting for bids
```sql
- id: UUID (PK)
- client_id: UUID (FK → users)
- title: VARCHAR
- category: VARCHAR
- description: TEXT
- budget: DECIMAL
- urgency: VARCHAR ('normal', 'urgent')
- location: VARCHAR
- latitude, longitude: DECIMAL
- status: VARCHAR ('open', 'in_progress', 'completed', 'disputed')
- photos: JSONB (array of photo URLs)
- proposed_job_date: DATE
- created_at: TIMESTAMP
```

#### 4. **bids** (Professional Bids)
Bids submitted by professionals on jobs
```sql
- id: UUID (PK)
- job_id: UUID (FK → jobs)
- professional_id: UUID (FK → users)
- proposed_price: DECIMAL
- estimated_duration_hours: INT
- bid_message: TEXT
- status: VARCHAR ('pending', 'accepted', 'rejected', 'withdrawn')
- created_at: TIMESTAMP
- accepted_at: TIMESTAMP
```

#### 5. **bookings** (Accepted Bids → Contract)
Final contract between client and professional
```sql
- id: UUID (PK)
- job_id: UUID (FK → jobs)
- client_id: UUID (FK → users)
- professional_id: UUID (FK → users)
- bid_id: UUID (FK → bids)
- final_price: DECIMAL
- status: VARCHAR ('scheduled', 'in_progress', 'completed', 'cancelled')
- scheduled_date: DATE
- scheduled_time: TIME
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- completion_photos: JSONB (proof photos)
- pro_notes: TEXT
```

#### 6. **escrow_transactions** (Payment Holding)
M-Pesa payments held in escrow until completion
```sql
- id: UUID (PK)
- booking_id: UUID (FK → bookings)
- amount: DECIMAL (total)
- platform_fee: DECIMAL (10% commission)
- pro_receives: DECIMAL (after fees)
- status: VARCHAR ('held', 'released', 'refunded', 'disputed')
- mpesa_reference: VARCHAR (M-Pesa transaction ID)
- initiated_at: TIMESTAMP
- released_at: TIMESTAMP
- refunded_at: TIMESTAMP
```

#### 7. **ratings** (Reviews)
Client and pro rate each other after booking
```sql
- id: UUID (PK)
- booking_id: UUID (FK → bookings)
- reviewer_id: UUID (FK → users)
- recipient_id: UUID (FK → users)
- rating: INT (1-5 stars)
- review_text: TEXT
- categories: JSONB ({"communication": 5, "quality": 5, "punctuality": 4})
- created_at: TIMESTAMP
```

#### 8. **disputes** (Payment Disputes)
Client and pro disagree about quality/payment
```sql
- id: UUID (PK)
- booking_id: UUID (FK → bookings)
- initiator_id: UUID (FK → users)
- respondent_id: UUID (FK → users)
- reason: TEXT
- evidence_files: JSONB (photo URLs, up to 10)
- status: VARCHAR ('open', 'under_review', 'resolved', 'appealed')
- resolution_notes: TEXT
- resolution_amount: DECIMAL (refund amount)
- resolved_at: TIMESTAMP
- resolved_by_admin: UUID (FK → users)
```

#### 9. **insurance_policies** (Job Insurance)
Optional job protection plans
```sql
- id: UUID (PK)
- booking_id: UUID (FK → bookings)
- plan_type: VARCHAR ('basic', 'standard', 'premium')
- coverage_amount: DECIMAL (50k-250k KSh)
- premium_amount: DECIMAL (99-299 KSh)
- status: VARCHAR ('active', 'claimed', 'expired')
- purchased_at: TIMESTAMP
- expires_at: TIMESTAMP (30 days)
- claim_amount: DECIMAL
- claim_status: VARCHAR ('pending', 'approved', 'denied')
```

#### 10. **payments** (Earnings Ledger)
Track all money movements for professionals
```sql
- id: UUID (PK)
- user_id: UUID (FK → users)
- amount: DECIMAL
- payment_type: VARCHAR ('earning', 'refund', 'bonus', 'deduction')
- reference_id: UUID (booking_id or dispute_id)
- status: VARCHAR ('pending', 'completed', 'failed')
- mpesa_phone_number: VARCHAR
- mpesa_transaction_id: VARCHAR
- created_at: TIMESTAMP
- processed_at: TIMESTAMP
```

#### 11. **messages** (Chat)
Client/Pro real-time communication
```sql
- id: UUID (PK)
- booking_id: UUID (FK → bookings, optional)
- sender_id: UUID (FK → users)
- recipient_id: UUID (FK → users)
- message_text: TEXT
- attachment_url: TEXT
- is_read: BOOLEAN
- created_at: TIMESTAMP
```

#### 12. **notifications** (Alerts)
Push/in-app notifications
```sql
- id: UUID (PK)
- user_id: UUID (FK → users)
- type: VARCHAR (new_bid, booking_completed, payment_received)
- title: VARCHAR
- message: TEXT
- related_id: UUID (booking_id or job_id)
- is_read: BOOLEAN
- created_at: TIMESTAMP
```

### Additional Tables
- **admin_logs**: Track admin actions
- **system_settings**: Configuration settings
- **categories**: Service categories
- **verification**: Identity & DCI verification records

---

## API Routes & Controllers

### Authentication Routes (`/api/auth`)
```
POST /api/auth/register
- Register new user (phone, password, role)
- Returns: user object, JWT token

POST /api/auth/login
- Login with phone & password
- Returns: JWT token, user object

POST /api/auth/otp/send
- Send OTP via Twilio SMS
- Body: { phone_number }

POST /api/auth/otp/verify
- Verify OTP and login
- Returns: JWT token

POST /api/auth/refresh
- Refresh JWT token
- Returns: New JWT token

POST /api/auth/logout
- Invalidate session

GET /api/auth/verify
- Verify JWT token validity
```

### Jobs Routes (`/api/jobs`)
```
GET /api/jobs
- List all jobs (with filtering: category, location, budget, status)
- Query: ?category=plumbing&location=nairobi&minBudget=1000

POST /api/jobs
- Create new job (auth required)
- Body: { title, category, description, budget, location, photos[] }

GET /api/jobs/:id
- Get job details

PUT /api/jobs/:id
- Update job (client only)

PATCH /api/jobs/:id/status
- Update job status (open → in_progress → completed)

DELETE /api/jobs/:id
- Cancel/delete job (client only, if no accepted bids)

GET /api/jobs/map/nearby
- Get nearby jobs for map view (uses geolocation)
```

### Bids Routes (`/api/bids`)
```
GET /api/bids/job/:jobId
- Get all bids for a specific job

POST /api/bids
- Submit a bid (pro only)
- Body: { job_id, proposed_price, estimated_duration_hours, bid_message }

PATCH /api/bids/:id/accept
- Accept bid & create booking (client only)

PATCH /api/bids/:id/reject
- Reject bid

PATCH /api/bids/:id/withdraw
- Withdraw bid (pro only)

GET /api/bids/professional/:proId
- Get all bids from a professional
```

### Bookings Routes (`/api/bookings`)
```
GET /api/bookings
- List user's bookings (client or pro)
- Query: ?status=in_progress

GET /api/bookings/:id
- Get booking details

PATCH /api/bookings/:id/start
- Mark booking as in_progress (pro)

PATCH /api/bookings/:id/complete
- Mark job complete + upload photos (pro)

PATCH /api/bookings/:id/cancel
- Cancel booking

POST /api/bookings/:id/release-payment
- Release escrow payment to pro (client)

POST /api/bookings/:id/rate
- Submit rating & review (both client & pro)
```

### Payments Routes (`/api/payments`)
```
GET /api/payments
- Get payment history (pro)
- Returns: Ledger of earnings, refunds, bonuses

GET /api/payments/earnings
- Get total earnings details

POST /api/payments/mpesa/callback
- M-Pesa callback handler (webhook from Safaricom)

POST /api/payments/payout
- Request payout to M-Pesa account (pro)

GET /api/payments/:id
- Get specific payment details
```

### Disputes Routes (embedded in bookings or separate)
```
POST /api/disputes
- File dispute (client or pro)
- Body: { booking_id, reason, evidence_files[] }

GET /api/disputes/:id
- Get dispute details

PATCH /api/disputes/:id/resolve
- Resolve dispute (admin only)
- Body: { resolution_notes, resolution_amount }

PATCH /api/disputes/:id/appeal
- Appeal resolved dispute
```

### Professional Routes (`/api/professionals`)
```
GET /api/professionals
- Search professionals (with filters)
- Query: ?category=plumbing&minRating=4&location=nairobi

GET /api/professionals/:id
- Get professional profile

PATCH /api/professionals/:id
- Update professional profile
- Body: { skill_category, hourly_rate, bio, years_experience, etc. }

PATCH /api/professionals/:id/availability
- Toggle availability status

GET /api/professionals/:id/jobs
- Get professional's completed jobs

GET /api/professionals/:id/ratings
- Get professional's ratings & reviews
```

### Users Routes (`/api/users`)
```
GET /api/users/me
- Get current user profile (auth required)

PATCH /api/users/me
- Update current user profile
- Body: { full_name, bio, location, email, etc. }

PATCH /api/users/me/photo
- Update profile photo

POST /api/users/verify/id
- Upload National ID for verification
- Body: FormData with ID photo

POST /api/users/verify/dci
- Upload DCI certificate
- Body: FormData with DCI file
```

### File Upload Routes (`/api/upload`)
```
POST /api/upload/job-photos
- Upload job photos (client)
- Returns: Photo URLs for job posting

POST /api/upload/completion-photos
- Upload completion proof photos (pro)

POST /api/upload/dispute-evidence
- Upload dispute evidence (both parties)

POST /api/upload/profile-photo
- Upload profile avatar

All endpoints:
- Accept multipart/form-data
- Validate file type & size
- Store in Supabase Storage
- Return signed URLs
```

---

## Frontend Components

### Page Components (Routes)

#### Home Page (`/`)
- Hero section with value proposition
- Service categories showcase (12 categories)
- Live jobs feed (recent postings)
- How it works section
- Testimonials carousel
- Trust/security highlights

#### Authentication (`/auth`)
- Login form (phone + password)
- OTP verification
- Registration form (role selection)
- Password reset

#### Browse Jobs (`/browse-jobs`)
- Jobs list with filters
- Map view of nearby jobs
- Category filtering
- Budget range slider
- Urgency filter
- Infinite scroll or pagination

#### Dashboard (`/dashboard`) - Client
- Active jobs overview
- Bids received
- Upcoming bookings
- Payment history
- Dispute tracking

#### Pro Dashboard (`/pro-dashboard`)
- Available jobs feed
- Active bids
- Current bookings
- Earnings summary
- Rating & reviews

#### Job Details (`/job/[id]`) [implied]
- Full job details
- Client info & rating
- Bid submission form
- Map of job location

#### Professional Profile (`/pro/[id]`)
- Professional details
- Skills & experience
- Ratings & reviews
- Portfolio/completed jobs
- "Hire" or "Message" buttons

#### Post Job (`/post-job`)
- Multi-step job posting form
- Title, description, budget
- Category selection
- Location picker
- Photo uploads (up to 5)
- Urgency toggle
- Proposed date

#### Profile (`/profile`)
- User profile view
- Edit profile link
- Verification status
- Performance metrics

#### Edit Profile (`/profile/edit`)
- Form to update user info
- Photo upload
- Location update

### Reusable Components

#### `BidForm.tsx`
- Form for submitting bids
- Price input
- Duration picker
- Message textarea
- Submit button with validation

#### `BidsList.tsx`
- Display list of bids for a job
- Card for each bid showing professional info
- Accept/reject buttons (for client)
- Sorting & filtering

#### `CompletionModal.tsx`
- Modal for marking job complete
- Photo upload interface
- Notes textarea
- Submit button

#### `JobMap.tsx`
- Leaflet/Mapbox GL map
- Display jobs as pins
- Geolocation tracking
- Click to view job details

#### `LocationPicker.tsx`
- Location input with autocomplete
- Geocoding to get coordinates
- Recent locations dropdown

#### `PhotoUploader.tsx`
- Drag & drop or click to upload
- Multiple file selection
- Preview with delete option
- Upload progress bar
- File size/type validation

#### Footer
- Links (About, Terms, Privacy)
- Contact info
- Social media links

#### Header
- Logo/brand
- Navigation menu
- User profile dropdown
- Notification bell
- Search bar

#### UI Components Library

##### `Button.tsx`
- Reusable button component
- Props: variant, size, disabled, loading
- Variants: primary, secondary, danger, ghost

##### `FundiCard.tsx`
- Card displaying professional info
- Photo, name, rating, category
- Call-to-action button

##### `Modal.tsx`
- Generic modal component
- Title, content, footer with actions
- Close button
- Backdrop click to close

##### `RatingStars.tsx`
- 5-star rating display
- Clicked/unclicked state
- Interactive for ratings

##### `ServiceCategoryCard.tsx`
- Category display with icon
- Job count
- Click to filter

##### `StatusPill.tsx`
- Status badge component
- Colors for different statuses (open, in_progress, completed, disputed)

##### `TrustBar.tsx`
- Trust score visualization
- Shows verification badges
- Rating display

---

## Authentication & Security

### Authentication Flow

#### OTP Login (Primary)
```
1. User enters phone number
   ↓
2. POST /api/auth/otp/send
   - Twilio sends SMS with 6-digit OTP
   ↓
3. User enters OTP from SMS
   ↓
4. POST /api/auth/otp/verify
   - Verify OTP validity
   - Check user exists
   - Generate JWT token
   - Return user + token
   ↓
5. Frontend stores JWT (localStorage or httpOnly cookie)
6. All subsequent requests include Authorization header
```

#### Password Login
```
1. User enters phone + password
   ↓
2. POST /api/auth/login
   - Look up user by phone
   - Compare password (bcryptjs)
   - Generate JWT token
   - Return user + token
```

#### Registration
```
1. User provides phone, password, role (client/pro)
2. POST /api/auth/register
   - Check phone not already registered
   - Hash password with bcryptjs
   - Create user in database
   - Return JWT token
```

### JWT Token Management
- **Token Format**: JWT with payload { userId, role, phone }
- **Token Expiry**: Typically 24 hours
- **Refresh**: POST /api/auth/refresh with current token
- **Storage**: Frontend stores in localStorage or httpOnly cookie
- **Usage**: Authorization header: `Authorization: Bearer <token>`

### Verification Levels

#### 1. Phone Verified ✓
- Verified via OTP during login
- Indicates user can receive SMS
- Required for all users

#### 2. Email Verified ✓
- Optional verification link sent to email
- Not currently used extensively

#### 3. Identity Verified ✓
- National ID uploaded & reviewed
- User submits ID photo
- Manual or automated verification
- Required for professionals in some cases

#### 4. DCI Verified ✓
- Police background clearance
- Criminal record check
- Validates professional trustworthiness
- Recommended for professionals handling high-value jobs

### Security Features

#### Password Security
- Bcryptjs hashing (salt rounds: 10)
- Never stored in plain text
- Salted before storage

#### API Security
- **CORS**: Whitelist allowed origins (development: localhost, production: domain.com)
- **Rate Limiting**: (if implemented) Prevent brute force
- **Input Validation**: All inputs validated server-side
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Prevention**: Sanitize user input, React escapes by default

#### Storage Security
- **Supabase RLS**: Row-level security policies on database
  - Users can only view their own data (with exceptions)
  - Professionals can't view client data
- **Storage Permissions**: Supabase Storage bucket policies
  - Users can only upload to their folder
  - Public read access for photos (after approval)
- **File Validation**: Check file type & size before upload

#### Sensitive Data Protection
- **Phone Numbers**: Stored securely, not logged
- **Passwords**: Never logged or sent in responses
- **M-Pesa Data**: M-Pesa phone numbers encrypted if needed
- **PII**: No personal identifiable info in logs

### Security Best Practices Implemented
- ✓ HTTPS enforced (Vercel for frontend)
- ✓ Environment variables for secrets (.env files)
- ✓ No sensitive data in frontend code
- ✓ JWT tokens for stateless authentication
- ✓ Bcryptjs for password hashing
- ✓ CORS configuration
- ✓ Input validation on both frontend & backend
- ✓ Error messages don't leak system info

---

## Development Guide

### Prerequisites
- Node.js 18+ (LTS)
- npm 9+
- Git
- Supabase account (free tier available)
- Twilio account (for SMS)

### Local Setup

#### 1. Clone Repository
```bash
git clone https://github.com/mosee-r/fundiguard.git
cd fundiguard.ke
```

#### 2. Frontend Installation
```bash
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
EOF

# Start development server
npm run dev
# Frontend runs at http://localhost:3000
```

#### 3. Backend Installation
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/fundiguard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
SUPABASE_STORAGE_BUCKET=job-photos
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
NODE_ENV=development
EOF

# Start backend
npm run dev
# Backend runs at http://localhost:3001
```

#### 4. Database Setup
```bash
# Option 1: Using Supabase Dashboard
# - Go to https://supabase.com
# - Create new project
# - Go to SQL Editor
# - Copy & paste database/schema.sql
# - Run

# Option 2: Command line
psql -U postgres -d fundiguard -f database/schema.sql

# Option 3: Seed data
cd backend
npm run seed
```

### Running Locally

#### Terminal 1: Frontend
```bash
npm run dev
# http://localhost:3000
```

#### Terminal 2: Backend
```bash
cd backend
npm run dev
# http://localhost:3001
```

#### Test endpoints
```bash
# Test backend health
curl http://localhost:3001/api/auth/health

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345678",
    "password": "securepassword",
    "role": "client"
  }'
```

### Development Workflow

#### Making Changes

1. **Feature Branch**
```bash
git checkout -b feature/job-posting
```

2. **Make Changes**
   - Edit files in `app/` (frontend) or `backend/src/` (backend)
   - Keep changes focused & atomic

3. **Test Locally**
   - Frontend: http://localhost:3000 with hot reload
   - Backend: http://localhost:3001 with nodemon auto-restart

4. **Commit & Push**
```bash
git add .
git commit -m "feat: add job posting form"
git push origin feature/job-posting
```

5. **Create Pull Request**
   - GitHub: Open PR, describe changes
   - Code review & tests
   - Merge to main

#### File Structure Best Practices
- **One component per file** (in `components/`)
- **Related logic in services** (in `backend/src/services/`)
- **Constants in separate files** (not hardcoded)
- **Keep route handlers thin** (move logic to controllers/services)

### Common Development Tasks

#### Add New API Endpoint
1. Create route handler in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add service in `backend/src/services/`
4. Add types in `backend/src/types/`
5. Export & use in route

#### Add New Frontend Page
1. Create folder in `app/pagename/`
2. Create `page.tsx` in that folder
3. Add navigation link in `Header.tsx`
4. Add styling with Tailwind CSS

#### Add Database Migration
1. Create `.sql` file in `database/migrations/`
2. Run migration: `psql -U postgres -d fundiguard -f migration.sql`
3. Update `SCHEMA_DOCUMENTATION.md`

#### Debug Issues
- **Frontend**: Chrome DevTools, React DevTools, check console
- **Backend**: Check terminal logs, add `console.log()` or use debugger
- **Database**: Supabase SQL Editor, run queries directly
- **Network**: Use Postman/curl to test API endpoints

### Code Quality

#### Linting
```bash
# Frontend
npm run lint

# Backend
cd backend && npm run lint
```

#### TypeScript Checking
```bash
# Should compile without errors
npm run build
```

#### Testing (if set up)
```bash
# Frontend
npm test

# Backend
cd backend && npm test
```

---

## Deployment & DevOps

### Frontend Deployment (Vercel)

#### Automatic Deployment
1. Push to `main` branch on GitHub
2. Vercel automatically builds & deploys
3. Preview deployments for PRs

#### Manual Deployment
```bash
npm run build
vercel deploy --prod
```

#### Configuration
File: `vercel.json`
```json
{
  "buildCommand": "next build",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

#### Environment Variables
In Vercel Dashboard:
```
NEXT_PUBLIC_API_URL=https://api.fundiguard.ke
NEXT_PUBLIC_MAPBOX_TOKEN=your_token
```

### Backend Deployment

#### Option 1: Cloud Platform (Heroku, Railway, Render)
```bash
# Build Docker image
docker build -t fundiguard-backend .

# Push to registry
docker push yourregistry/fundiguard-backend

# Deploy to platform
# (Follow platform-specific instructions)
```

#### Option 2: Traditional VPS
```bash
# SSH into server
ssh user@server.ip

# Clone repo
git clone repository

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name fundiguard-api
```

#### Environment Variables (Production)
```
PORT=3001
DATABASE_URL=postgresql://prod_user:prod_pass@db.server:5432/fundiguard
SUPABASE_URL=https://prod.supabase.co
SUPABASE_KEY=prod_key
JWT_SECRET=very_long_random_secret
TWILIO_ACCOUNT_SID=prod_twilio_sid
TWILIO_AUTH_TOKEN=prod_twilio_token
MPESA_CONSUMER_KEY=prod_mpesa_key
MPESA_CONSUMER_SECRET=prod_mpesa_secret
NODE_ENV=production
FRONTEND_URL=https://fundiguard.ke
```

### Database (Supabase)

#### Backups
- Supabase automatically backs up daily
- Access via Supabase Dashboard → Database → Backups
- Point-in-time recovery available

#### Scaling
- Supabase manages PostgreSQL scaling
- Monitor usage in Dashboard → Billing
- Upgrade tier if needed

### Monitoring & Logs

#### Frontend (Vercel)
- Vercel Dashboard → Analytics
- View build logs, deployment history
- Monitor performance metrics

#### Backend
- Application logs in platform dashboard
- Custom logging with Winston/Pino (if configured)
- Monitor error rates & response times

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        run: vercel --prod
```

---

## Project Statistics

### File Count
- **Frontend**: ~25 pages/components
- **Backend**: ~30 routes/controllers/services
- **Database**: 16 tables with 150+ columns
- **Total**: ~100+ TypeScript files

### Code Metrics
- **Frontend**: ~2000+ lines (React components)
- **Backend**: ~3000+ lines (Express & services)
- **Database**: ~1000+ lines (SQL schema)
- **Total**: ~6000+ lines of production code

### Database Metrics
- **Tables**: 16
- **Relationships**: 30+ foreign keys
- **Indexes**: 20+ performance indexes
- **Estimated Capacity**: 10,000+ users, 100,000+ jobs/bids

---

## Next Steps & Roadmap

### Near Term
- ✓ Complete account setup (users table)
- ✓ Job posting & browsing
- ✓ Bidding system
- ⏳ Booking management
- ⏳ Escrow payments

### Medium Term
- ⏳ Dispute resolution
- ⏳ Rating & review system
- ⏳ Professional verification
- ⏳ Insurance integration

### Long Term
- ⏳ Mobile app (React Native)
- ⏳ Advanced search & AI recommendations
- ⏳ Live chat/video calls
- ⏳ Analytics dashboard
- ⏳ International expansion

---

## Support & Contributions

For issues or contributions:
1. Open GitHub issue with detailed description
2. Fork repo & create feature branch
3. Submit pull request with description
4. Code review & approval before merge

---

## License & Legal

- **License**: (Specify: MIT, Apache, Proprietary, etc.)
- **Terms of Service**: `/terms`
- **Privacy Policy**: `/privacy`
- **Security Contact**: security@fundiguard.ke

---

## Contact & Resources

- **GitHub**: https://github.com/mosee-r/fundiguard
- **Website**: https://fundiguard.ke
- **Documentation**: See this file + SCHEMA_DOCUMENTATION.md
- **Email**: dev@fundiguard.ke

---

**Last Updated**: February 24, 2026
**Maintainers**: FundiGuard.ke Development Team
