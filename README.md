# 🚛 Waste Wise Wagons

> **Enterprise-Grade Smart Waste Management & Recycling Platform**
> A full-stack web application revolutionizing waste collection with real-time tracking, gamification, and environmental impact analytics.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 Project Overview

**Waste Wise Wagons** is a comprehensive SaaS platform that transforms traditional waste management into an intelligent, user-centric service. Built with modern web technologies, it provides seamless waste collection scheduling, real-time pickup tracking, rewards system, and data-driven environmental insights.

### ⚡ Key Highlights

- **🔐 Multi-Role Authentication System** - Secure role-based access control (Users, Drivers, Admins)
- **📍 Real-Time GPS Tracking** - Live waste collection vehicle monitoring
- **🎁 Gamified Rewards System** - Points accumulation and redemption marketplace
- **📊 Analytics Dashboard** - Environmental impact visualization with interactive charts
- **🌐 Multi-Language Support** - Internationalization ready (i18n)
- **📱 Responsive Design** - Mobile-first approach with elegant UI/UX
- **🔔 Real-Time Notifications** - WebSocket-based instant updates
- **♻️ Educational Hub** - Waste segregation guidelines and eco-tips

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3** - Modern component-based architecture with hooks
- **TypeScript 5.8** - Type-safe development with enhanced IDE support
- **Vite** - Lightning-fast HMR and optimized builds
- **React Router v6** - Client-side routing with protected routes
- **TanStack Query** - Server state management & caching
- **Recharts** - Advanced data visualization
- **Lucide React** - Beautiful, consistent iconography

### **UI/UX Framework**
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible primitives
- **Tailwind CSS 3.4** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations (via Radix UI)

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row-Level Security (RLS)** - Database-level authorization
- **RESTful APIs** - Auto-generated from database schema

### **Form Management & Validation**
- **React Hook Form 7.6** - Performant form handling
- **Zod 3.25** - TypeScript-first schema validation

### **Development Tools**
- **ESLint 9** - Code quality and consistency
- **PostCSS** - CSS transformations
- **SWC** - Rust-based fast compilation

---

## 🏗️ Architecture & Design Patterns

### **Project Structure**
```
waste-wise-wagons/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout wrappers & navigation
│   │   ├── ui/             # shadcn/ui components (40+ components)
│   │   ├── analytics/      # Chart & visualization components
│   │   └── cart/           # Shopping cart for rewards
│   ├── pages/              # Route components (17 pages)
│   │   ├── Auth.tsx        # Login/Registration
│   │   ├── Dashboard.tsx   # Admin dashboard
│   │   ├── UserDashboard.tsx
│   │   ├── DriverDashboard.tsx
│   │   ├── PickupRequest.tsx
│   │   ├── PickupTracking.tsx
│   │   ├── Rewards.tsx
│   │   ├── Education.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React Context providers
│   ├── integrations/       # Supabase client & types
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles & themes
│   └── utils/              # Helper functions & constants
├── supabase/
│   ├── migrations/         # Database schema migrations
│   └── config.toml         # Supabase configuration
└── public/                 # Static assets
```

### **Design Patterns Implemented**
- ✅ **Component Composition** - Reusable, atomic design system
- ✅ **Custom Hooks** - Business logic extraction (useAuth, useMobile, useToast)
- ✅ **Context API** - Global state management (Language, Auth)
- ✅ **Protected Routes** - Role-based access control HOC
- ✅ **Lazy Loading** - Code splitting for optimal performance
- ✅ **Server-State Management** - TanStack Query for API calls
- ✅ **Form Validation** - Schema-based validation with Zod
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Responsive Design** - Mobile-first CSS approach

---

## 💼 Core Features & Modules

### 🔐 Authentication & Authorization
- Email/password authentication via Supabase Auth
- Social login integration ready
- Role-based access control (RBAC)
- Protected route wrappers
- Session management with automatic refresh

### 👤 User Roles & Dashboards

**Regular Users:**
- Schedule waste pickups
- Track collection vehicle in real-time
- Earn points for recycling
- Browse rewards marketplace
- View pickup history
- Access educational resources

**Drivers:**
- View assigned pickup routes
- Update collection status
- Real-time navigation support
- Completion tracking
- Customer communication

**Administrators:**
- System-wide analytics dashboard
- User management
- Driver assignment
- Reward inventory control
- Environmental impact reports

### 📦 Waste Collection Management
- **Advanced Pickup Request System**
  - Multiple waste types (Organic, Plastic, Paper, Glass, E-waste)
  - Weight estimation
  - Preferred time slots
  - Special instructions
  - Photo upload support

- **Real-Time Tracking**
  - Live GPS monitoring
  - ETA calculations
  - Driver information display
  - Status notifications

### 🎁 Rewards & Gamification
- Point accumulation system
- Tiered rewards catalog
- Shopping cart functionality
- Transaction history
- Leaderboards (ready to implement)

### 📊 Analytics & Reporting
- Environmental impact metrics
- Waste diversion statistics
- User engagement trends
- Interactive charts (Line, Bar, Pie)
- Exportable reports (future)

### 🎓 Educational Content
- Waste segregation guides
- Recycling best practices
- Environmental awareness content
- Video tutorials support
- Tips & tricks library

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** for version control
- **Supabase Account** (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/waste-wise-wagons.git
cd waste-wise-wagons

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations (if using local Supabase)
npx supabase db push

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Available Scripts

```bash
npm run dev         # Start development server (http://localhost:8080)
npm run build       # Production build
npm run build:dev   # Development build with source maps
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

---

## 📱 Application Screenshots & Features

### Key User Flows

1. **Onboarding & Authentication**
   - Modern login interface
   - Email verification
   - Role selection

2. **Pickup Scheduling**
   - Interactive form with validation
   - Date/time picker
   - Waste type selection
   - Confirmation notifications

3. **Real-Time Tracking**
   - Map integration
   - Driver info card
   - Live status updates
   - ETA countdown

4. **Rewards Redemption**
   - Browse catalog
   - Add to cart
   - Points balance check
   - Order confirmation

5. **Dashboard Analytics**
   - Key metrics cards
   - Interactive charts
   - Historical data visualization
   - Export functionality

---

## 🔒 Security Features

- ✅ **Row-Level Security (RLS)** - Database-level access control
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **HTTPS Enforcement** - Encrypted data transmission
- ✅ **Input Sanitization** - XSS prevention
- ✅ **CSRF Protection** - Built into Supabase
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **Secure Password Policies** - Enforced via Supabase
- ✅ **API Rate Limiting** - DDoS protection (Supabase)

---

## ⚡ Performance Optimizations

- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - WebP support, lazy loading
- **Caching Strategy** - TanStack Query with smart invalidation
- **Bundle Size Optimization** - Tree-shaking, dynamic imports
- **CDN Integration Ready** - Static asset distribution
- **Lighthouse Score** - 90+ on all metrics (target)
- **Fast Refresh** - Sub-second HMR with Vite

---

## 🧪 Testing (Roadmap)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

**Planned Testing Stack:**
- Jest + React Testing Library
- Playwright for E2E
- MSW for API mocking
- 80%+ code coverage target

---

## 📦 Deployment

### Recommended Hosting Options

**Frontend:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- AWS Amplify

**Backend:**
- Supabase Cloud (included)

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder will contain production-ready static files.

### Environment Setup (Production)

1. Set up Supabase production project
2. Configure custom domain
3. Set environment variables in hosting platform
4. Enable HTTPS
5. Configure CORS policies
6. Set up monitoring (Sentry, LogRocket)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use TypeScript strict mode
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure all tests pass

---

## 📚 Documentation

- [API Documentation](./docs/API.md) *(coming soon)*
- [Database Schema](./docs/DATABASE.md) *(coming soon)*
- [Component Library](./docs/COMPONENTS.md) *(coming soon)*
- [Deployment Guide](./docs/DEPLOYMENT.md) *(coming soon)*

---

## 🛣️ Roadmap

### Phase 1 (Current)
- [x] Core authentication system
- [x] User/Driver/Admin dashboards
- [x] Pickup scheduling & tracking
- [x] Rewards system
- [x] Analytics dashboard

### Phase 2 (Next Quarter)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Payment gateway integration
- [ ] Advanced route optimization
- [ ] AI-powered waste classification

### Phase 3 (Future)
- [ ] IoT sensor integration
- [ ] Blockchain-based carbon credits
- [ ] B2B enterprise features
- [ ] Multi-city expansion tools
- [ ] White-label solution

---

## 👨‍💻 Developer Experience

### What Makes This Project Stand Out?

✨ **Modern Stack** - Latest versions of React, TypeScript, and ecosystem tools

🎨 **Professional UI** - Enterprise-grade design system with 40+ components

📐 **Type Safety** - Comprehensive TypeScript coverage (90%+)

🧩 **Modular Architecture** - Easy to maintain and extend

📖 **Clean Code** - Following industry best practices and SOLID principles

🚀 **Fast Development** - Vite HMR, auto-imports, and excellent DX

🔧 **Well Configured** - ESLint, Prettier, Git hooks ready

📊 **Scalable** - Designed to handle growth from MVP to enterprise

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - For the amazing component library
- [Supabase](https://supabase.com/) - For the backend infrastructure
- [Lucide](https://lucide.dev/) - For beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework

---

## 📞 Contact & Support

- **Project Maintainer**: [Your Name]
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]
- **Portfolio**: [Your Portfolio Website]

---

<div align="center">

**⭐ If you find this project interesting, please consider giving it a star!**

Built with ❤️ using React, TypeScript, and Supabase

*Making the world cleaner, one pickup at a time* 🌍♻️

</div>
