import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Recycle, 
  TrendingUp, 
  Award, 
  Package,
  Plus,
  BarChart3,
  Gift,
  History,
  Bell,
  Target,
  Zap,
  Users,
  Globe,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import MainLayout from '@/components/layout/MainLayout';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/styles/horizontal-scroll.css';

const UserDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock data for user dashboard
  const userStats = {
    totalPickups: 12,
    totalWaste: 45.6, // kg
    pointsEarned: 230,
    co2Saved: 12.3, // kg
    currentStreak: 5,
    nextPickup: "Tomorrow, 2:00 PM",
    recentPickups: [
      { id: 1, date: "2024-01-15", weight: 3.2, status: "completed", points: 32, type: "Plastik" },
      { id: 2, date: "2024-01-12", weight: 5.1, status: "completed", points: 51, type: "Kertas" },
      { id: 3, date: "2024-01-08", weight: 2.8, status: "pending", points: 0, type: "Organik" },
      { id: 4, date: "2024-01-05", weight: 4.2, status: "rejected", points: 0, type: "Logam" },
    ],
    monthlyProgress: {
      thisMonth: 15.8,
      target: 50,
      plasticRecycled: 8.2,
      organicComposted: 5.6,
      paperRecycled: 2.0
    }
  };

  const achievements = [
    { title: "First Pickup", icon: "🎯", earned: true },
    { title: "Eco Warrior", icon: "🌱", earned: true },
    { title: "Week Streak", icon: "🔥", earned: false },
    { title: "100kg Milestone", icon: "🏆", earned: false },
    { title: "Carbon Saver", icon: "💨", earned: false },
    { title: "Recycling Pro", icon: "♻️", earned: false },
    { title: "Green Hero", icon: "🦸", earned: false },
  ];

  const notifications = [
    { id: 1, type: "pickup", message: "Pickup dijadwalkan besok pukul 14:00", time: "2 jam lalu", priority: "high" },
    { id: 2, type: "reward", message: "Reward baru tersedia: Eco Tumbler!", time: "1 hari lalu", priority: "medium" },
    { id: 3, type: "system", message: "Pickup tanggal 15 Jan berhasil! +32 poin", time: "2 hari lalu", priority: "low" },
  ];

  const quickStats = [
    { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "blue" },
    { title: "CO₂ Saved", value: "1,240 kg", change: "+8%", icon: Globe, color: "green" },
    { title: "Energy Generated", value: "850 kWh", change: "+15%", icon: Zap, color: "yellow" },
    { title: "Success Rate", value: "94.2%", change: "+2%", icon: Target, color: "purple" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
          filter: 'blur(3px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-green-900/50 to-teal-900/60" />

      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-lime-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <MainLayout>
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-7xl">
          {/* Beautiful Header with Glass Effect */}
          <div className="mb-6 md:mb-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg md:shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                      <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                        Selamat datang kembali, {userData?.fullName?.split(' ')[0] || 'User'}! 👋
                      </h1>
                      <p className="text-white/80 text-sm md:text-lg">Siap membuat perubahan hari ini?</p>
                    </div>
                  </div>
                  
                  {/* Next Pickup Info */}
                  <div className="flex items-center bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-emerald-300 mr-2 md:mr-3" />
                    <div>
                      <p className="text-white/90 font-medium text-sm md:text-base">Penjemputan Berikutnya</p>
                      <p className="text-emerald-300 text-xs md:text-sm">Besok, 14:00</p>
                    </div>
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white/60 ml-auto" />
                  </div>
                </div>
                
                {/* Quick Action Buttons with Glass Effect */}
                <div className="mt-6 lg:mt-0">
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => navigate('/pickup')} 
                      className="
                        w-full lg:w-auto
                        h-14 px-8
                        bg-gradient-to-r from-emerald-500 to-green-500
                        hover:from-emerald-400 hover:to-green-400
                        text-white font-bold text-lg
                        rounded-2xl
                        shadow-lg hover:shadow-xl
                        transform hover:scale-[1.02]
                        transition-all duration-300
                        border-0
                      "
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Jadwalkan Penjemputan
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => navigate('/pickup-history')} 
                        className="
                          flex-1 lg:flex-none
                          h-12 px-6
                          bg-white/10 backdrop-blur-sm
                          border border-white/30 
                          rounded-2xl
                          text-white hover:text-white
                          hover:bg-white/20
                          transition-all duration-300
                        "
                        variant="ghost"
                      >
                        <History className="h-4 w-4 mr-2" />
                        Riwayat
                      </Button>
                      <Button 
                        onClick={() => navigate('/rewards')} 
                        className="
                          flex-1 lg:flex-none
                          h-12 px-6
                          bg-white/10 backdrop-blur-sm
                          border border-white/30 
                          rounded-2xl
                          text-white hover:text-white
                          hover:bg-white/20
                          transition-all duration-300
                        "
                        variant="ghost"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Hadiah
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Stats with Horizontal Scroll */}
          <div className="mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-6 text-center">Dampak Lingkungan Anda</h2>
            
            {/* Mobile: Horizontal Scroll, Desktop: Grid */}
            <div className="md:hidden">
              <div className="overflow-x-auto pb-3 scroll-hidden smooth-scroll">
                <div className="flex gap-3 min-w-max px-1">
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 shadow-lg w-72 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
                        <Recycle className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-emerald-500/30 text-emerald-200 text-xs px-2 py-1">
                        Bulan Ini
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{userStats.monthlyProgress.thisMonth} kg</div>
                    <p className="text-white/70 text-sm mb-2">Sampah Terkumpul</p>
                    <div className="bg-white/20 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-green-500 h-1.5 rounded-full transition-all duration-500"
                        style={{width: `${(userStats.monthlyProgress.thisMonth / userStats.monthlyProgress.target) * 100}%`}}
                      />
                    </div>
                    <p className="text-emerald-300 text-xs">{Math.round((userStats.monthlyProgress.thisMonth / userStats.monthlyProgress.target) * 100)}% dari target {userStats.monthlyProgress.target} kg</p>
                  </div>

                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 shadow-lg w-60 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-blue-500/30 text-blue-200 text-xs px-2 py-1">
                        Total
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{userStats.totalPickups}</div>
                    <p className="text-white/70 text-sm mb-2">Penjemputan Selesai</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <p className="text-green-300 text-xs">+2 bulan ini</p>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 shadow-lg w-60 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-purple-500/30 text-purple-200 text-xs px-2 py-1">
                        Level 3
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{userStats.pointsEarned}</div>
                    <p className="text-white/70 text-sm mb-2">Poin Terkumpul</p>
                    <div className="flex items-center">
                      <Sparkles className="h-3 w-3 text-purple-300 mr-2" />
                      <p className="text-purple-300 text-xs">Kontributor Lingkungan</p>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 shadow-lg w-64 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-orange-500/30 text-orange-200 text-xs px-2 py-1">
                        Dampak CO₂
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{userStats.co2Saved} kg</div>
                    <p className="text-white/70 text-sm mb-2">Karbon Tersimpan</p>
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 text-orange-300 mr-2" />
                      <p className="text-orange-300 text-xs">Setara 25 botol</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
                    <Recycle className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-300/30 text-xs">
                    Bulan Ini
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{userStats.monthlyProgress.thisMonth} kg</div>
                <p className="text-white/70 text-sm mb-3">Sampah Terkumpul</p>
                <div className="bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{width: `${(userStats.monthlyProgress.thisMonth / userStats.monthlyProgress.target) * 100}%`}}
                  />
                </div>
                <p className="text-emerald-300 text-xs">{Math.round((userStats.monthlyProgress.thisMonth / userStats.monthlyProgress.target) * 100)}% dari target {userStats.monthlyProgress.target} kg</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-300/30 text-xs">
                    Total
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{userStats.totalPickups}</div>
                <p className="text-white/70 text-sm mb-3">Penjemputan Selesai</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-green-300 text-xs">+2 bulan ini</p>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-300/30 text-xs">
                    Level 3
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{userStats.pointsEarned}</div>
                <p className="text-white/70 text-sm mb-3">Poin Terkumpul</p>
                <div className="flex items-center">
                  <Sparkles className="h-3 w-3 text-purple-300 mr-2" />
                  <p className="text-purple-300 text-xs">Kontributor Lingkungan</p>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-200 border-orange-300/30 text-xs">
                    CO₂ Impact
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{userStats.co2Saved} kg</div>
                <p className="text-white/70 text-sm mb-3">Karbon Tersimpan</p>
                <div className="flex items-center">
                  <Globe className="h-3 w-3 text-orange-300 mr-2" />
                  <p className="text-orange-300 text-xs">Setara 25 botol</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Impact with Horizontal Scroll */}
          <div className="mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-6 text-center">Dampak Komunitas</h2>
            
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden">
              <div className="overflow-x-auto pb-3 scroll-hidden smooth-scroll">
                <div className="flex gap-3 min-w-max px-1">
                  {quickStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    const gradientColors = {
                      blue: 'from-blue-400 to-cyan-500',
                      green: 'from-green-400 to-emerald-500',
                      yellow: 'from-yellow-400 to-orange-500',
                      purple: 'from-purple-400 to-pink-500'
                    }[stat.color] || 'from-gray-400 to-gray-500';
                    
                    return (
                      <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-3 shadow-lg w-36 flex-shrink-0">
                        <div className="flex items-center justify-center mb-2">
                          <div className={`w-8 h-8 bg-gradient-to-br ${gradientColors} rounded-xl flex items-center justify-center`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                          <p className="text-white/70 text-xs mb-2 leading-tight">{stat.title}</p>
                          <Badge className="bg-green-500/30 text-green-200 text-xs px-2 py-0.5">
                            {stat.change}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const gradientColors = {
                  blue: 'from-blue-400 to-cyan-500',
                  green: 'from-green-400 to-emerald-500',
                  yellow: 'from-yellow-400 to-orange-500',
                  purple: 'from-purple-400 to-pink-500'
                }[stat.color] || 'from-gray-400 to-gray-500';
                
                return (
                  <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${gradientColors} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl lg:text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <p className="text-white/70 text-xs lg:text-sm mb-2">{stat.title}</p>
                      <Badge className="bg-green-500/20 text-green-200 border-green-300/30 text-xs">
                        {stat.change} vs bulan lalu
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements & Notifications - Mobile Friendly */}
          <div className="space-y-4 mb-6">
            {/* Achievements */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg md:shadow-2xl">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                  <Award className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Pencapaian Anda</h3>
                  <p className="text-white/70 text-xs md:text-sm">
                    {achievements.filter(a => a.earned).length} dari {achievements.length} terbuka
                  </p>
                </div>
              </div>
              
              {/* Mobile: Horizontal Scroll for Achievements */}
              <div className="md:hidden">
                <div className="overflow-x-auto pb-2 scroll-hidden smooth-scroll">
                  <div className="flex gap-2 min-w-max">
                    {achievements.map((achievement, index) => (
                      <div key={index} className={`relative p-2 rounded-xl text-center transition-all duration-300 w-16 flex-shrink-0 ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30 shadow-md' 
                          : 'bg-white/5 opacity-50'
                      }`}>
                        <div className="text-lg mb-1">{achievement.icon}</div>
                        <p className="text-xs font-medium text-white/80 leading-tight">{achievement.title.split(' ')[0]}</p>
                        {achievement.earned && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden md:grid md:grid-cols-4 gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`relative p-3 rounded-2xl text-center transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-300/30 shadow-lg hover:scale-105' 
                      : 'bg-white/5 border border-white/10 opacity-50'
                  }`}>
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <p className="text-xs font-medium text-white/80">{achievement.title.split(' ')[0]}</p>
                    {achievement.earned && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notifications */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg md:shadow-2xl">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                  <Bell className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Update Terbaru</h3>
                  <p className="text-white/70 text-xs md:text-sm">Tetap terinformasi tentang aktivitas Anda</p>
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                {notifications.map((notif) => {
                  const priorityColors = {
                    high: 'border-l-red-400 bg-red-500/10',
                    medium: 'border-l-yellow-400 bg-yellow-500/10',
                    low: 'border-l-green-400 bg-green-500/10'
                  };
                  const textColors = {
                    high: 'text-red-200',
                    medium: 'text-yellow-200',
                    low: 'text-green-200'
                  };
                  return (
                    <div key={notif.id} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-l-4 ${priorityColors[notif.priority as keyof typeof priorityColors]} backdrop-blur-sm`}>
                      <p className="text-xs md:text-sm font-medium text-white mb-1">{notif.message}</p>
                      <p className={`text-xs ${textColors[notif.priority as keyof typeof textColors]}`}>{notif.time}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Analytics Dashboard - Direct Integration */}
          <div>
            <div className="flex items-center mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-white">Analitik Terperinci</h3>
                <p className="text-white/70 text-xs md:text-sm">Lacak dampak lingkungan Anda dari waktu ke waktu</p>
              </div>
            </div>
            <AnalyticsDashboard />
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default UserDashboard;