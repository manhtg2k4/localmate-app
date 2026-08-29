# LocalMate - Travel Guide Marketplace

A complete full-stack travel guide marketplace application with Backend (Node.js/Express/MongoDB), Mobile App (React Native/Expo), and Admin Portal (React/Ant Design).

## Project Structure

```
localmate-app/
├── localmate-backend/     # Node.js + Express + MongoDB API
├── localmate-mobile/     # React Native + Expo Mobile App
└── localmate-admin/      # React + Ant Design Admin Portal
```

## Quick Start

### 1. Start Backend

```bash
cd localmate-backend

# Install dependencies
npm install

# Start Docker (MongoDB + Redis)
docker-compose up -d

# Seed database with sample data
node src/seed.js

# Start development server
npm run dev

# Server runs at: http://localhost:8080
# API Docs: http://localhost:8080/api-docs
```

### 2. Start Mobile App

```bash
cd localmate-mobile

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

### 3. Start Admin Portal

```bash
cd localmate-admin

# Install dependencies
npm install

# Start dev server
npm run dev

# Admin panel: http://localhost:5173
```

## Test Accounts

| Role    | Email                 | Password    |
|---------|----------------------|-------------|
| Admin   | admin@localmate.com  | admin123    |
| Tourist | tourist@test.com     | password123 |
| Guide   | guide@test.com       | password123 |

## Features

### Backend (Node.js/Express/MongoDB)
- ✅ JWT Authentication with refresh tokens
- ✅ 12 Mongoose models (User, Guide, Location, Booking, Payment, Review, etc.)
- ✅ 13 API Controllers with full business logic
- ✅ Socket.IO for real-time chat
- ✅ Firebase Cloud Messaging for push notifications
- ✅ Stripe payment integration with escrow
- ✅ Claude AI recommendations
- ✅ Cron jobs for auto-reject expired bookings
- ✅ Swagger API documentation
- ✅ Rate limiting & security middleware

### Mobile App (React Native/Expo)
- ✅ Auth screens (Splash, Onboarding, Login, Register)
- ✅ Tourist screens (Home, AI Recommend, Search Guides, Book, Chat, History, Profile)
- ✅ Guide screens (Dashboard, Bookings, Schedule, Wallet, Profile)
- ✅ Real-time chat with Socket.IO
- ✅ Stripe payment integration
- ✅ Context providers (Auth, Socket, Notifications)

### Admin Portal (React/Ant Design)
- ✅ Dashboard with charts
- ✅ Guide approval system
- ✅ User management (block/unblock)
- ✅ Booking management
- ✅ Location CRUD
- ✅ Financial reports with CSV export

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | User login |
| GET | /api/v1/guides | List approved guides |
| POST | /api/v1/bookings | Create booking |
| POST | /api/v1/payments/checkout | Create Stripe checkout |
| POST | /api/v1/ai/recommend | AI recommendations |
| GET | /api/v1/chat/:bookingId/messages | Get chat messages |

## Environment Variables

Create a `.env` file in `localmate-backend/` with:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/localmate
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CLOUDINARY_CLOUD_NAME=xxx
ANTHROPIC_API_KEY=sk-ant-xxx
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, MongoDB, Socket.IO |
| Mobile | React Native, Expo, TypeScript |
| Admin | React, Ant Design, Recharts |
| Auth | JWT, bcrypt |
| Payments | Stripe |
| Push | Firebase Cloud Messaging |
| AI | Claude API |
| Storage | Cloudinary |
| Email | Nodemailer |
