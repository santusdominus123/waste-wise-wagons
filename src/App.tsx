import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./styles/professional.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import RoleBasedRoute from "@/components/layout/RoleBasedRoute";
import { initializeSampleData } from "@/utils/sampleData";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import PickupRequest from "./pages/PickupRequest";
import AdvancedPickupRequest from "./pages/AdvancedPickupRequest";
import PickupHistory from "./pages/PickupHistory";
import PickupTracking from "./pages/PickupTracking";
import Cart from "./pages/Cart";
import DriverDashboard from "./pages/DriverDashboard";
import PointExchange from "./pages/PointExchange";
import UserDashboard from "./pages/UserDashboard";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ModernLogin from "./pages/ModernLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize sample data on app start
initializeSampleData();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/user-dashboard" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/pickup" element={
                <ProtectedRoute>
                  <PickupRequest />
                </ProtectedRoute>
              } />
              <Route path="/pickup/advanced" element={
                <ProtectedRoute>
                  <AdvancedPickupRequest />
                </ProtectedRoute>
              } />
              <Route path="/pickup-history" element={
                <ProtectedRoute>
                  <PickupHistory />
                </ProtectedRoute>
              } />
              <Route path="/pickup-tracking/:id" element={
                <ProtectedRoute>
                  <PickupTracking />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/driver-dashboard" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['driver']}>
                    <DriverDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/point-exchange" element={
                <ProtectedRoute>
                  <PointExchange />
                </ProtectedRoute>
              } />
              <Route path="/education" element={
                <ProtectedRoute>
                  <Education />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/modern-login" element={<ModernLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
