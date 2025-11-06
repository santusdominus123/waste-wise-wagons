import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { 
  ArrowRightLeft, 
  Star, 
  Gift, 
  ShoppingBag, 
  Smartphone, 
  Coffee, 
  Shirt, 
  Package, 
  CheckCircle,
  AlertCircle,
  Zap,
  Crown,
  Leaf
} from 'lucide-react';

interface ExchangeItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'voucher' | 'electronics' | 'lifestyle' | 'eco-products';
  icon: string;
  image?: string;
  stock: number;
  popularity: number;
  isNew?: boolean;
  isHot?: boolean;
}

interface ExchangeHistory {
  id: string;
  itemName: string;
  pointsUsed: number;
  exchangeDate: string;
  status: 'pending' | 'processed' | 'delivered';
  trackingCode?: string;
}

const PointExchange = () => {
  const { user, userData } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ExchangeItem | null>(null);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeHistory[]>([]);
  const [userPoints, setUserPoints] = useState(0);

  // Calculate user points from localStorage
  useEffect(() => {
    const calculateUserPoints = () => {
      const pointsData = JSON.parse(localStorage.getItem('local-user-points') || '[]');
      const exchangeData = JSON.parse(localStorage.getItem('local-point-exchanges') || '[]');
      
      // Calculate total earned points for current user
      const earnedPoints = pointsData
        .filter((point: any) => point.user_id === user?.id)
        .reduce((total: number, point: any) => total + point.points_earned, 0);
      
      // Calculate total spent points
      const spentPoints = exchangeData
        .filter((exchange: any) => exchange.user_id === user?.id)
        .reduce((total: number, exchange: any) => total + exchange.pointsUsed, 0);
      
      return earnedPoints - spentPoints;
    };

    if (user?.id) {
      const points = calculateUserPoints();
      setUserPoints(Math.max(0, points)); // Ensure points never go negative
    }
  }, [user?.id]);

  // Load exchange history from localStorage
  useEffect(() => {
    if (user?.id) {
      const exchanges = JSON.parse(localStorage.getItem('local-point-exchanges') || '[]');
      const userExchanges = exchanges
        .filter((exchange: any) => exchange.user_id === user?.id)
        .sort((a: any, b: any) => new Date(b.exchangeDate).getTime() - new Date(a.exchangeDate).getTime());
      
      setExchangeHistory(userExchanges);
    }
  }, [user?.id]);

  const exchangeItems: ExchangeItem[] = [
    {
      id: '1',
      name: 'Voucher Shopee Rp 50.000',
      description: 'Belanja lebih hemat dengan voucher Shopee',
      pointsCost: 150,
      category: 'voucher',
      icon: '🛒',
      stock: 25,
      popularity: 95,
      isHot: true,
    },
    {
      id: '2',
      name: 'Eco Tumbler Stainless',
      description: 'Tumbler ramah lingkungan 500ml',
      pointsCost: 120,
      category: 'eco-products',
      icon: '🥤',
      stock: 15,
      popularity: 88,
      isNew: true,
    },
    {
      id: '3',
      name: 'Voucher Grab Food Rp 25.000',
      description: 'Nikmati makanan favorit dengan diskon',
      pointsCost: 80,
      category: 'voucher',
      icon: '🍕',
      stock: 50,
      popularity: 92,
    },
    {
      id: '4',
      name: 'Power Bank 10.000mAh',
      description: 'Power bank portable untuk gadget Anda',
      pointsCost: 200,
      category: 'electronics',
      icon: '🔋',
      stock: 8,
      popularity: 85,
    },
    {
      id: '5',
      name: 'Kaos Eco-Friendly',
      description: 'Kaos dari bahan daur ulang yang nyaman',
      pointsCost: 100,
      category: 'lifestyle',
      icon: '👕',
      stock: 20,
      popularity: 78,
      isNew: true,
    },
    {
      id: '6',
      name: 'Voucher Starbucks Rp 30.000',
      description: 'Nikmati kopi premium dengan voucher ini',
      pointsCost: 90,
      category: 'voucher',
      icon: '☕',
      stock: 30,
      popularity: 90,
    },
    {
      id: '7',
      name: 'Tas Belanja Eco Bag',
      description: 'Tas belanja ramah lingkungan yang kuat',
      pointsCost: 60,
      category: 'eco-products',
      icon: '🛍️',
      stock: 40,
      popularity: 82,
    },
    {
      id: '8',
      name: 'Earphone Wireless',
      description: 'Earphone nirkabel dengan kualitas suara jernih',
      pointsCost: 180,
      category: 'electronics',
      icon: '🎧',
      stock: 12,
      popularity: 87,
      isHot: true,
    },
  ];

  const categories = [
    { id: 'all', name: 'Semua', icon: Package },
    { id: 'voucher', name: 'Voucher', icon: Gift },
    { id: 'electronics', name: 'Elektronik', icon: Smartphone },
    { id: 'lifestyle', name: 'Lifestyle', icon: Shirt },
    { id: 'eco-products', name: 'Eco Products', icon: Leaf },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? exchangeItems 
    : exchangeItems.filter(item => item.category === selectedCategory);

  const sortedItems = filteredItems.sort((a, b) => b.popularity - a.popularity);

  const handleExchange = async (item: ExchangeItem) => {
    if (userPoints < item.pointsCost) {
      toast({
        title: "Poin Tidak Cukup! 😅",
        description: `Anda membutuhkan ${item.pointsCost} poin, tapi hanya memiliki ${userPoints} poin`,
        variant: "destructive",
      });
      return;
    }

    if (item.stock <= 0) {
      toast({
        title: "Stok Habis! 😔",
        description: "Item ini sedang kosong, coba lagi nanti",
        variant: "destructive",
      });
      return;
    }

    // Save exchange to localStorage
    const newExchange = {
      id: Date.now().toString(),
      user_id: user?.id,
      itemName: item.name,
      pointsUsed: item.pointsCost,
      exchangeDate: new Date().toISOString(),
      status: 'pending',
      trackingCode: `EX${Date.now().toString().slice(-6)}`,
    };

    // Save to localStorage
    const existingExchanges = JSON.parse(localStorage.getItem('local-point-exchanges') || '[]');
    localStorage.setItem('local-point-exchanges', JSON.stringify([newExchange, ...existingExchanges]));

    // Update local state
    setExchangeHistory(prev => [newExchange, ...prev]);
    setIsExchangeDialogOpen(false);
    
    // Recalculate user points
    const pointsData = JSON.parse(localStorage.getItem('local-user-points') || '[]');
    const exchangeData = JSON.parse(localStorage.getItem('local-point-exchanges') || '[]');
    
    const earnedPoints = pointsData
      .filter((point: any) => point.user_id === user?.id)
      .reduce((total: number, point: any) => total + point.points_earned, 0);
    
    const spentPoints = exchangeData
      .filter((exchange: any) => exchange.user_id === user?.id)
      .reduce((total: number, exchange: any) => total + exchange.pointsUsed, 0);
    
    setUserPoints(Math.max(0, earnedPoints - spentPoints));
    
    toast({
      title: "Penukaran Berhasil! 🎉",
      description: `${item.name} berhasil ditukar dengan ${item.pointsCost} poin`,
    });
  };

  const getStatusInfo = (status: ExchangeHistory['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'processed':
        return { label: 'Diproses', color: 'bg-blue-100 text-blue-800', icon: Package };
      case 'delivered':
        return { label: 'Dikirim', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

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
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl">
          {/* Beautiful Header with Glass Effect */}
          <div className="mb-6 md:mb-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg md:shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center mb-4 lg:mb-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                    <ArrowRightLeft className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
                      🎁 Tukar Poin
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg">
                      Tukarkan poin Anda dengan hadiah menarik
                    </p>
                  </div>
                </div>
                
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-300 mr-2" />
                      <span className="text-white/70 text-sm">Poin Anda</span>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white">{userPoints}</div>
                    <div className="text-white/60 text-xs">poin tersedia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 md:mb-8">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
              <div className="flex flex-wrap gap-2 md:gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      rounded-xl transition-all duration-300 text-sm md:text-base
                      ${selectedCategory === category.id
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                      }
                    `}
                    variant="ghost"
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Exchange Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative">
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {item.isNew && (
                      <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30 text-xs">
                        NEW
                      </Badge>
                    )}
                    {item.isHot && (
                      <Badge className="bg-red-500/30 text-red-200 border-red-400/30 text-xs">
                        HOT
                      </Badge>
                    )}
                  </div>

                  {/* Item Icon */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-white text-sm md:text-base">{item.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{item.description}</p>
                  </div>

                  {/* Item Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-300 mr-1" />
                        <span className="text-lg font-bold text-white">{item.pointsCost}</span>
                        <span className="text-white/60 text-sm ml-1">poin</span>
                      </div>
                      <div className="text-white/60 text-xs">
                        Stok: {item.stock}
                      </div>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full"
                        style={{ width: `${item.popularity}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-white/60 text-xs">
                      Popularitas {item.popularity}%
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsExchangeDialogOpen(true);
                      }}
                      disabled={userPoints < item.pointsCost || item.stock <= 0}
                      className={`
                        w-full rounded-xl transition-all duration-300
                        ${userPoints >= item.pointsCost && item.stock > 0
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white'
                          : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {userPoints < item.pointsCost ? 'Poin Kurang' : item.stock <= 0 ? 'Stok Habis' : 'Tukar Sekarang'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Exchange History */}
          {exchangeHistory.length > 0 && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl">
              <div className="mb-4 md:mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                    <Package className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Riwayat Penukaran</h3>
                </div>
              </div>

              <div className="space-y-3">
                {exchangeHistory.slice(0, 5).map((exchange) => {
                  const statusInfo = getStatusInfo(exchange.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={exchange.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className="h-4 w-4 text-white/70" />
                          <div>
                            <p className="font-medium text-white text-sm">{exchange.itemName}</p>
                            <p className="text-white/60 text-xs">
                              {new Date(exchange.exchangeDate).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${statusInfo.color} text-xs mb-1`}>
                            {statusInfo.label}
                          </Badge>
                          <p className="text-white/70 text-xs">-{exchange.pointsUsed} poin</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exchange Confirmation Dialog */}
          <Dialog open={isExchangeDialogOpen} onOpenChange={setIsExchangeDialogOpen}>
            <DialogContent className="backdrop-blur-xl bg-black/90 border border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-emerald-400" />
                  Konfirmasi Penukaran
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  Pastikan detail penukaran sudah benar sebelum melanjutkan
                </DialogDescription>
              </DialogHeader>
              
              {selectedItem && (
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{selectedItem.icon}</div>
                      <div>
                        <h4 className="font-bold text-white">{selectedItem.name}</h4>
                        <p className="text-white/70 text-sm">{selectedItem.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80">Harga:</span>
                    <span className="font-bold text-emerald-300">{selectedItem.pointsCost} poin</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80">Poin Anda:</span>
                    <span className="font-bold text-white">{userPoints} poin</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-white/20">
                    <span className="text-white/80">Sisa Poin:</span>
                    <span className="font-bold text-white">{userPoints - selectedItem.pointsCost} poin</span>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExchangeDialogOpen(false)}>
                  Batal
                </Button>
                <Button
                  onClick={() => selectedItem && handleExchange(selectedItem)}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400"
                >
                  Konfirmasi Tukar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </MainLayout>
    </div>
  );
};

export default PointExchange;