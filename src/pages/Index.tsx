import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Recycle, Zap, Users, TrendingUp, Leaf, ArrowRight, Globe, Award, BarChart3,
  Building, Factory, ShoppingBag, Play, CheckCircle, Target, Lightbulb, 
  TreePine, Shield, Truck, ChevronRight, ExternalLink, Gift, ShoppingCart
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import UserDashboard from './UserDashboard';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/styles/elegant-theme.css';

const Index = () => {
  const { user, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // If user is logged in as a regular user (not admin or driver), show UserDashboard
  if (user && !isAdmin && !isDriver) {
    return <UserDashboard />;
  }

  // Live Impact Counter Data
  const impactStats = [
    { labelKey: "home.stats.waste_processed", value: "2,847", unit: "Tons", icon: Recycle },
    { labelKey: "home.stats.energy_generated", value: "1,250", unit: "kWh", icon: Zap },
    { labelKey: "home.stats.co2_prevented", value: "3,920", unit: "kg", icon: TreePine },
    { labelKey: "home.stats.products_sold", value: "15,300", unit: "pcs", icon: ShoppingBag }
  ];

  // Key Services
  const keyServices = [
    {
      icon: Building,
      titleKey: "home.services.cities.title",
      descriptionKey: "home.services.cities.description",
      color: "from-emerald-400 to-cyan-400"
    },
    {
      icon: Zap,
      titleKey: "home.services.energy.title",
      descriptionKey: "home.services.energy.description",
      color: "from-blue-400 to-purple-400"
    },
    {
      icon: ShoppingBag,
      titleKey: "home.services.marketplace.title",
      descriptionKey: "home.services.marketplace.description",
      color: "from-green-400 to-teal-400"
    }
  ];

  // How It Works Steps
  const workflowSteps = [
    { icon: Truck, title: "Collection", description: "Smart waste collection from cities and communities" },
    { icon: Target, title: "Sorting", description: "AI-powered optical sorting and categorization" },
    { icon: Factory, title: "Processing", description: "Recycling, upcycling & energy conversion" },
    { icon: Zap, title: "Energy", description: "Renewable energy generation from organic waste" },
    { icon: ShoppingBag, title: "Market", description: "Sustainable products marketplace" }
  ];

  // Partnership Logos (placeholder data)
  const partners = [
    { name: "Smart City Initiative", logo: "🏙️" },
    { name: "Green NGO Alliance", logo: "🌱" },
    { name: "EcoTech Industries", logo: "🏭" },
    { name: "University Research", logo: "🎓" },
    { name: "Climate Action", logo: "🌍" },
    { name: "Sustainable Future", logo: "♻️" }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Modern Hero Section with Glassmorphism */}
        <section className="relative h-[100vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
              filter: 'blur(2px)',
              transform: 'scale(1.05)',
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-green-900/50 to-blue-900/60" />
          
          {/* Hero Content */}
          <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 leading-tight tracking-tight">
              RE-GEN TECH
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-4 md:mb-6 font-light">
              Transforming Waste into Resources
            </p>
            <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto text-white/90">
              Revolutionizing waste management through advanced technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button 
                onClick={() => {
                  if (user) {
                    if (isAdmin) navigate('/admin-dashboard');
                    else if (isDriver) navigate('/driver-dashboard');
                    else navigate('/');
                  } else {
                    navigate('/auth');
                  }
                }}
                size="lg"
                className="bg-white text-green-800 hover:bg-gray-100 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold h-12 md:h-auto"
              >
                {user ? 'Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => {
                  if (user) {
                    navigate('/pickup');
                  } else {
                    navigate('/auth');
                  }
                }}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-800 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold h-12 md:h-auto"
              >
                Request Pickup
                <Truck className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Access Dashboard */}
        <section className="py-8 md:py-16 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-800">
              Quick Access
            </h2>
            
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto pb-4">
              <div className="flex gap-4 px-2" style={{width: 'max-content'}}>
                <Card 
                  className="w-48 p-4 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl flex-shrink-0"
                  onClick={() => user ? navigate('/pickup') : navigate('/auth')}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 text-sm">Request Pickup</h3>
                    <p className="text-xs text-gray-600">Schedule collection</p>
                  </div>
                </Card>

                <Card 
                  className="w-48 p-4 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl flex-shrink-0"
                  onClick={() => user ? navigate('/pickup-history') : navigate('/auth')}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 text-sm">Track Progress</h3>
                    <p className="text-xs text-gray-600">Monitor impact</p>
                  </div>
                </Card>

                <Card 
                  className="w-48 p-4 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl flex-shrink-0"
                  onClick={() => user ? navigate('/rewards') : navigate('/auth')}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 text-sm">Rewards</h3>
                    <p className="text-xs text-gray-600">Earn eco-points</p>
                  </div>
                </Card>

                <Card 
                  className="w-48 p-4 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl flex-shrink-0"
                  onClick={() => user ? navigate('/cart') : navigate('/auth')}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 text-sm">Calculator</h3>
                    <p className="text-xs text-gray-600">Estimate value</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card 
                className="p-6 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl"
                onClick={() => user ? navigate('/pickup') : navigate('/auth')}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Request Pickup</h3>
                  <p className="text-sm text-gray-600">Schedule waste collection</p>
                </div>
              </Card>

              <Card 
                className="p-6 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl"
                onClick={() => user ? navigate('/pickup-history') : navigate('/auth')}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">Monitor your impact</p>
                </div>
              </Card>

              <Card 
                className="p-6 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl"
                onClick={() => user ? navigate('/rewards') : navigate('/auth')}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Rewards</h3>
                  <p className="text-sm text-gray-600">Earn eco-points</p>
                </div>
              </Card>

              <Card 
                className="p-6 backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl"
                onClick={() => user ? navigate('/cart') : navigate('/auth')}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Calculator</h3>
                  <p className="text-sm text-gray-600">Estimate waste value</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Impact Counter */}
        <section className="py-8 md:py-16 bg-gradient-to-br from-emerald-50 via-green-50/50 to-blue-50/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-gray-800">
                Real-Time Impact
              </h2>
              <p className="text-sm md:text-lg text-gray-600">
                See our live environmental impact data
              </p>
            </div>
            
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto pb-4">
              <div className="flex gap-4 px-2" style={{width: 'max-content'}}>
                {impactStats.map((stat, index) => (
                  <Card key={index} className="w-40 text-center p-4 backdrop-blur-sm bg-white/50 border border-white/40 hover:bg-white/70 hover:shadow-2xl transition-all duration-300 rounded-2xl flex-shrink-0">
                    <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-lg md:text-2xl font-bold mb-1 text-green-600">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {stat.unit}
                    </div>
                    <div className="text-xs font-semibold text-gray-800">
                      {t(stat.labelKey)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <Card key={index} className="text-center p-6 backdrop-blur-sm bg-white/50 border border-white/40 hover:bg-white/70 hover:shadow-2xl transition-all duration-300 rounded-2xl">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1 text-green-600">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {stat.unit}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-gray-800">
                    {t(stat.labelKey)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Compact Visual Flow */}
        <section className="py-8 md:py-16 bg-gradient-to-br from-white via-blue-50/20 to-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-gray-800">
                How It Works
              </h2>
              <p className="text-sm md:text-lg text-gray-600">
                Our comprehensive circular economy process
              </p>
            </div>
            
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto pb-4">
              <div className="flex gap-6 px-2" style={{width: 'max-content'}}>
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center w-32 flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold mb-2 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600 text-xs leading-tight">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Services Section - Compact */}
        <section className="py-16 bg-gradient-to-br from-blue-50/30 via-gray-50 to-green-50/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Our Key Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive solutions for sustainable waste management
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {keyServices.map((service, index) => (
                <Card key={index} className="p-6 backdrop-blur-sm bg-white/50 border border-white/40 hover:bg-white/70 hover:shadow-2xl transition-all duration-300 group cursor-pointer rounded-2xl">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{t(service.titleKey)}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{t(service.descriptionKey)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Logos - Compact */}
        <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-green-50/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                Trusted Partners
              </h2>
              <p className="text-base text-gray-600">
                Working together for a sustainable future
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center">
              {partners.map((partner, index) => (
                <div key={index} className="text-center p-4 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl hover:bg-white/70 hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl mb-2">{partner.logo}</div>
                  <p className="text-xs font-medium text-gray-700">{partner.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action - Compact */}
        <section className="relative py-16 overflow-hidden">
          {/* Background Image with Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
              filter: 'blur(2px)',
              transform: 'scale(1.05)',
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-blue-900/60 to-emerald-900/70" />
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Build a Cleaner Future?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Join RE-GEN TECH's mission to transform waste into resources and create a sustainable circular economy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  if (user) {
                    navigate('/pickup');
                  } else {
                    navigate('/auth');
                  }
                }}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 text-base font-semibold"
              >
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => {
                  if (user) {
                    if (isAdmin) navigate('/admin-dashboard');
                    else if (isDriver) navigate('/driver-dashboard');
                    else navigate('/');
                  } else {
                    navigate('/auth');
                  }
                }}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 text-base font-semibold"
              >
                View Dashboard
                <BarChart3 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
