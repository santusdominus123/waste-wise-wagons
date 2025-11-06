# 🚛 Waste Wise Wagons

**Enterprise-Grade Smart Waste Management Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)

A production-ready full-stack SaaS application transforming waste management through real-time tracking, gamification, and data-driven insights.

---

## 🎯 Overview

Waste Wise Wagons is a comprehensive waste management platform built with modern enterprise architecture patterns. The system provides intelligent waste collection scheduling, real-time GPS tracking, rewards marketplace, and environmental impact analytics.

### Core Capabilities

- **Multi-Role Authentication** - Secure RBAC for Users, Drivers, and Administrators
- **Real-Time Tracking** - Live GPS monitoring with WebSocket integration
- **Rewards Engine** - Gamified points system with redemption marketplace
- **Analytics Dashboard** - Environmental metrics with interactive visualizations
- **Responsive Design** - Mobile-first architecture with progressive enhancement

---

## 🏗️ Technical Architecture

### Frontend Stack

```typescript
React 18.3          // Component-based UI architecture
TypeScript 5.8      // Type-safe development
Vite               // Next-generation build tool
React Router v6    // Client-side routing with code splitting
TanStack Query     // Server state management & caching
shadcn/ui          // Accessible component primitives
Tailwind CSS       // Utility-first styling framework
Recharts           // Composable charting library
```

### Backend Infrastructure

```typescript
Supabase           // PostgreSQL with real-time subscriptions
Row-Level Security // Database-level authorization
RESTful APIs       // Auto-generated from schema
JWT Auth           // Secure token-based authentication
```

### Development Tools

- **ESLint** - Code quality enforcement
- **React Hook Form + Zod** - Type-safe form validation
- **Context API** - Lightweight state management
- **SWC Compiler** - Rust-based fast compilation

---

## 📐 Architecture Patterns

**Component Composition** - Atomic design methodology with reusable primitives

**Custom Hooks** - Business logic extraction for enhanced testability

**Protected Routes** - HOC pattern for role-based access control

**Server State Management** - Optimistic updates with automatic cache invalidation

**Error Boundaries** - Graceful failure handling with fallback UI

---

## 💼 Key Features

### Authentication System
- Email/password authentication via Supabase Auth
- Role-based access control (Users, Drivers, Admins)
- Protected route wrappers with redirect logic
- Session persistence with automatic token refresh

### User Dashboard
- Pickup scheduling with multi-waste type support
- Real-time collection tracking with ETA calculations
- Points accumulation and rewards redemption
- Historical data and analytics
- Educational resources hub

### Driver Dashboard
- Route optimization and assignment management
- Real-time status updates
- Collection completion tracking
- Customer communication interface

### Admin Dashboard
- System-wide analytics and reporting
- User and driver management
- Rewards inventory control
- Environmental impact metrics

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm 9+ or yarn 1.22+
Supabase account
```

### Installation

```bash
# Clone repository
git clone https://github.com/santusdominus123/waste-wise-wagons.git
cd waste-wise-wagons

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Supabase credentials

# Start development server
npm run dev
```

### Environment Configuration

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📦 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout wrappers & navigation
│   ├── ui/             # 40+ shadcn/ui components
│   ├── analytics/      # Data visualization
│   └── cart/           # Shopping cart logic
├── pages/              # 17 route components
├── hooks/              # Custom React hooks
├── contexts/           # Global state providers
├── integrations/       # Supabase client & types
└── utils/              # Helper functions
```

---

## 🔒 Security Implementation

- **Row-Level Security (RLS)** - Postgres-level access control
- **JWT Authentication** - Stateless token validation
- **HTTPS Enforcement** - Encrypted data transmission
- **Input Sanitization** - XSS/CSRF prevention
- **Environment Variables** - Secure credential management
- **API Rate Limiting** - DDoS protection

---

## ⚡ Performance Optimization

- **Code Splitting** - Route-based lazy loading
- **Tree Shaking** - Dead code elimination
- **Caching Strategy** - Smart invalidation with TanStack Query
- **Image Optimization** - WebP with lazy loading
- **Bundle Analysis** - Sub-200KB initial load target

---

## 🛠️ Available Scripts

```bash
npm run dev         # Development server (localhost:8080)
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # ESLint validation
```

---

## 📊 Technical Highlights

**Type Safety** - 100% TypeScript coverage with strict mode

**Component Library** - 40+ reusable, accessible UI components

**Real-Time Features** - WebSocket integration for live updates

**Form Validation** - Schema-based validation with Zod

**State Management** - Context API + TanStack Query hybrid approach

**Responsive Design** - Mobile-first with breakpoint utilities

---

## 🚀 Deployment

**Recommended Stack:**
- Frontend: Vercel / Netlify
- Backend: Supabase Cloud
- CDN: Cloudflare

```bash
npm run build
# Deploy dist/ folder to hosting platform
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 📧 Contact

**Developer:** santusdominus123@gmail.com

**Repository:** [github.com/santusdominus123/waste-wise-wagons](https://github.com/santusdominus123/waste-wise-wagons)

---

<div align="center">

Built with React, TypeScript, and Supabase

*Making the world cleaner, one pickup at a time* 🌍

</div>
