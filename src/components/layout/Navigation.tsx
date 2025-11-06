import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Recycle, LogOut, User, Truck, Gift, Calendar, Home, History, ShoppingCart, ShieldCheck, BookOpen, Settings, UserCircle, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import '@/styles/elegant-theme.css';

const Navigation = () => {
  const { signOut, user, userData, isAdmin, isDriver } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { path: '/', label: t('nav.home'), icon: Home },
      { path: '/dashboard', label: t('nav.dashboard'), icon: User },
    ];

    if (isDriver) {
      return [
        ...baseItems,
        { path: '/driver-dashboard', label: t('nav.driver_hub'), icon: Truck },
        { path: '/point-exchange', label: 'Tukar Poin', icon: ArrowRightLeft },
        { path: '/pickup-history', label: t('nav.pickup_history'), icon: History },
      ];
    }

    // Regular user menu - Home and User Dashboard combined
    return [
      { path: '/', label: t('nav.home'), icon: Home },
      { path: '/pickup', label: t('nav.request_pickup'), icon: Calendar },
      { path: '/pickup-history', label: t('nav.pickup_history'), icon: History },
      { path: '/point-exchange', label: 'Tukar Poin', icon: ArrowRightLeft },
      { path: '/cart', label: t('nav.cart_calculator'), icon: ShoppingCart },
      { path: '/education', label: 'Edukasi', icon: BookOpen },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden lg:flex elegant-nav w-64 fixed left-0 top-0 h-full backdrop-blur-xl bg-white/70 border-r border-white/30 z-50 shadow-2xl">
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="p-6 border-b border-white/30">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">{t('nav.app_name')}</span>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="space-y-2 px-4">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={`w-full justify-start rounded-xl transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'bg-emerald-500/20 text-emerald-700 border-r-2 border-emerald-500 backdrop-blur-sm' 
                      : 'hover:bg-white/20 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/30 space-y-3">
            <div className="w-full">
              <LanguageSwitcher />
            </div>
            
            {/* Profile Section with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(userData?.fullName || user?.user_metadata?.full_name || 'User')
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left text-sm elegant-text-muted">
                      <div className="font-medium truncate">{userData?.fullName || user?.user_metadata?.full_name || 'User'}</div>
                      {userData?.role && (
                        <div className="text-xs text-primary font-medium capitalize">
                          {userData.role}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl rounded-2xl">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-white/20 rounded-xl m-1">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-white/20 rounded-xl m-1">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/30" />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-500/20 rounded-xl m-1 text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.sign_out')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Enhanced Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/70 border-t border-white/30 z-50 shadow-2xl">
        <div className="grid grid-cols-5 items-center py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-3 min-w-0 rounded-xl transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'text-emerald-600 bg-emerald-500/20 backdrop-blur-sm' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-white/20'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full leading-tight">
                {item.label.length > 5 ? item.label.slice(0, 5) : item.label}
              </span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 backdrop-blur-xl bg-white/70 border-b border-white/30 z-40 shadow-2xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">{t('nav.app_name')}</span>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            
            {/* Mobile Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {(userData?.fullName || user?.user_metadata?.full_name || 'User')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl rounded-2xl">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {userData?.fullName || user?.user_metadata?.full_name || 'User'}
                  {userData?.role && (
                    <div className="text-xs text-primary capitalize">
                      {userData.role}
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-white/30" />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-white/20 rounded-xl m-1">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-white/20 rounded-xl m-1">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/30" />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-500/20 rounded-xl m-1 text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.sign_out')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;