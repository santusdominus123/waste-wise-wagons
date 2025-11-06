# 🚛 Waste Wise Wagons

**Enterprise-Grade Smart Waste Management Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)

A production-ready full-stack SaaS application with real-time features, RESTful API integration, and enterprise database architecture.

---

## 💼 Full-Stack Development Expertise

### Frontend Development
- **HTML5, CSS3, JavaScript (ES6+)** - Modern web standards implementation
- **React 18.3** - Component-based architecture with hooks and context
- **TypeScript 5.8** - Strict type safety with advanced generics
- **Tailwind CSS 3.4** - Utility-first responsive design system
- **shadcn/ui** - Accessible component library (40+ components)
- **React Router v6** - Client-side routing with code splitting
- **Vite** - Next-generation build tool with HMR

### Backend Development
- **Node.js/TypeScript** - Server-side JavaScript runtime
- **Supabase (PostgreSQL)** - Relational database with real-time capabilities
- **RESTful API Integration** - Type-safe API client with auto-generated types
- **Authentication & Authorization** - JWT-based auth with RBAC
- **Real-time Subscriptions** - WebSocket integration for live updates

### Database & ORM
- **PostgreSQL 15** - Advanced relational database features
- **Type-safe Database Client** - Generated TypeScript types from schema
- **Row-Level Security (RLS)** - Database-level access control
- **Database Functions** - Custom PostgreSQL functions for business logic
- **Migration Management** - Version-controlled schema changes

### API Integration
- **Supabase REST API** - Full CRUD operations with TypeScript SDK
- **TanStack Query** - Server state management with caching
- **Real-time WebSocket** - Live data synchronization
- **Type-safe API Calls** - End-to-end type safety

### Additional Technical Skills
- **React Hook Form + Zod** - Type-safe form validation
- **Context API** - Global state management
- **Custom Hooks** - Reusable business logic
- **ESLint** - Code quality enforcement
- **Git** - Version control with feature branching

---

## 🏗️ Technical Architecture

### Frontend Stack
```typescript
React 18.3          // Modern component architecture
TypeScript 5.8      // Static type checking
Vite               // Build tool & dev server
React Router v6    // Client-side routing
TanStack Query     // Server state & caching
Tailwind CSS       // Utility-first styling
shadcn/ui          // Component library
Recharts           // Data visualization
```

### Backend Infrastructure
```typescript
Node.js 18+        // JavaScript runtime
Supabase           // Backend-as-a-Service
PostgreSQL 15      // Relational database
REST API           // HTTP-based services
JWT Auth           // Stateless authentication
WebSocket          // Real-time communication
```

---

## 📊 Database Schema Design

**8 PostgreSQL Tables:**
- `profiles` - User management with role-based access
- `pickup_requests` - Waste collection scheduling
- `pickup_reviews` - Driver rating system
- `driver_performance` - Analytics & KPIs
- `notifications` - Real-time user notifications
- `rewards` - Gamification marketplace
- `reward_redemptions` - Transaction management
- `user_points` - Points tracking system
- `waste_rates` - Dynamic pricing engine

**Advanced Features:**
- Foreign key relationships
- Composite types & enums
- Custom database functions
- Row-level security policies
- Automatic timestamp triggers

---

## 🔐 Security Implementation

- **JWT Authentication** - Secure token-based auth
- **Row-Level Security** - Database-level authorization
- **Role-Based Access Control** - User/Driver/Admin roles
- **Input Validation** - Zod schema validation
- **XSS/CSRF Protection** - Security best practices
- **Environment Variables** - Secure credential management
- **HTTPS Enforcement** - Encrypted communication

---

## ⚡ Key Features Implemented

### Multi-Role System
- User dashboard with pickup scheduling
- Driver dashboard with route management
- Admin panel with analytics & controls
- Role-based route protection

### Real-Time Features
- Live pickup tracking with GPS
- WebSocket notifications
- Real-time dashboard updates
- Auto-refresh data synchronization

### API Integration Examples
- Supabase REST API integration
- Type-safe database operations
- Real-time subscriptions
- File upload handling
- Authentication flows

### Data Visualization
- Interactive charts (Recharts)
- Environmental impact metrics
- Performance analytics
- Driver KPI dashboards

---

## 🚀 Installation & Setup

```bash
# Clone repository
git clone https://github.com/santusdominus123/waste-wise-wagons.git
cd waste-wise-wagons

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Database setup
# Supabase migrations included in /supabase/migrations

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication logic
│   ├── layout/         # Layout components
│   ├── ui/             # 40+ reusable components
│   ├── analytics/      # Data visualization
│   └── cart/           # Shopping cart
├── pages/              # 17 route pages
├── hooks/              # Custom React hooks
├── contexts/           # Global state providers
├── integrations/
│   └── supabase/
│       ├── client.ts   # Supabase client setup
│       └── types.ts    # Auto-generated DB types
└── utils/              # Helper functions
```

---

## 🛠️ Development Workflow

```bash
npm run dev         # Start dev server (localhost:8080)
npm run build       # Production build
npm run preview     # Preview build
npm run lint        # Code quality check
```

---

## 📈 Technical Highlights

✅ **Type Safety** - 100% TypeScript with strict mode

✅ **Database Design** - Normalized schema with 8 tables

✅ **API Integration** - RESTful API with type-safe client

✅ **Real-Time** - WebSocket subscriptions for live data

✅ **Authentication** - JWT with role-based authorization

✅ **Form Handling** - React Hook Form + Zod validation

✅ **State Management** - Context API + TanStack Query

✅ **Responsive Design** - Mobile-first Tailwind CSS

✅ **Component Library** - 40+ accessible UI components

✅ **Code Quality** - ESLint configuration

---

## 🎯 Full-Stack Capabilities Demonstrated

### Frontend
- [x] HTML5, CSS3, JavaScript (ES6+)
- [x] React component architecture
- [x] TypeScript strict mode
- [x] Tailwind CSS responsive design
- [x] Form validation & error handling

### Backend
- [x] Node.js/TypeScript development
- [x] PostgreSQL database design
- [x] RESTful API integration
- [x] Authentication & authorization
- [x] Real-time WebSocket implementation

### Database
- [x] Schema design & migrations
- [x] Type-safe database operations
- [x] Foreign key relationships
- [x] Custom functions & triggers
- [x] Row-level security policies

### DevOps
- [x] Environment configuration
- [x] Build optimization
- [x] Version control (Git)
- [x] Deployment ready (Vercel/Netlify)

---

## 📞 Contact

**Developer:** santusdominus123@gmail.com

**GitHub:** [github.com/santusdominus123/waste-wise-wagons](https://github.com/santusdominus123/waste-wise-wagons)


---

<div align="center">

**Full-Stack Developer | React + TypeScript + Node.js + PostgreSQL**

*2+ years equivalent experience in modern web development*

</div>
