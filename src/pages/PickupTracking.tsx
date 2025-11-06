import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Navigation,
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
  Timer,
  Star,
  User,
  Route,
  Calendar,
  Weight,
  ArrowLeft,
  RefreshCw,
  Car,
  Flag,
  Eye
} from 'lucide-react';

interface TrackingData {
  id: string;
  status: 'scheduled' | 'driver_assigned' | 'on_the_way' | 'arrived' | 'in_progress' | 'completed';
  pickup_address: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_weight: number;
  waste_types: string[];
  driver?: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    rating: number;
    vehicle_number: string;
    vehicle_type: string;
  };
  current_location?: {
    lat: number;
    lng: number;
  };
  estimated_arrival?: string;
  status_updates: {
    status: string;
    timestamp: string;
    message: string;
  }[];
}

const PickupTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock tracking data untuk demo
  const mockTrackingData: TrackingData = {
    id: id || '1',
    status: 'on_the_way',
    pickup_address: 'Jl. Merdeka No. 123, RT 01/RW 02, dekat warung Pak Budi, Bandung',
    scheduled_date: '2024-01-15',
    scheduled_time: '10:00',
    estimated_weight: 5.5,
    waste_types: ['plastic', 'paper', 'metal'],
    driver: {
      id: 'driver-1',
      name: 'Budi Santoso',
      phone: '+62812345678',
      avatar: '',
      rating: 4.8,
      vehicle_number: 'B 1234 ABC',
      vehicle_type: 'Pickup Truck'
    },
    current_location: {
      lat: -6.9175,
      lng: 107.6191
    },
    estimated_arrival: '10:30',
    status_updates: [
      {
        status: 'scheduled',
        timestamp: '2024-01-14T20:00:00Z',
        message: 'Pickup request berhasil dijadwalkan'
      },
      {
        status: 'driver_assigned',
        timestamp: '2024-01-15T08:00:00Z',
        message: 'Driver telah ditugaskan untuk pickup Anda'
      },
      {
        status: 'on_the_way',
        timestamp: '2024-01-15T09:45:00Z',
        message: 'Driver sedang dalam perjalanan ke lokasi'
      }
    ]
  };

  useEffect(() => {
    fetchTrackingData();
    // Set up real-time updates with auto progression
    const interval = setInterval(() => {
      if (!refreshing && trackingData?.status !== 'completed') {
        updateTrackingData();
      }
    }, 15000); // Update every 15 seconds for demo

    return () => clearInterval(interval);
  }, [id, refreshing, trackingData?.status]);

  // Show notification when status changes
  useEffect(() => {
    if (trackingData && trackingData.status_updates.length > 0) {
      const latestUpdate = trackingData.status_updates[trackingData.status_updates.length - 1];
      const updateTime = new Date(latestUpdate.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - updateTime.getTime();
      
      // Show notification for updates within last 5 seconds (fresh updates)
      if (timeDiff < 5000) {
        const statusInfo = getStatusInfo(latestUpdate.status);
        toast({
          title: `🚛 ${statusInfo.label}`,
          description: latestUpdate.message,
          duration: 5000,
        });
        
        // Special celebration for completion
        if (latestUpdate.status === 'completed') {
          setTimeout(() => {
            toast({
              title: "🎉 Selamat!",
              description: "Anda telah berkontribusi untuk lingkungan yang lebih bersih!",
              duration: 8000,
            });
          }, 2000);
        }
      }
    }
  }, [trackingData?.status_updates]);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      setTimeout(() => {
        setTrackingData(mockTrackingData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data tracking",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateTrackingData = async () => {
    setRefreshing(true);
    try {
      // Simulate status progression with random chance
      const progressChance = Math.random();
      const currentStatusIndex = statusFlow.findIndex(s => s.status === trackingData?.status);
      
      if (trackingData && currentStatusIndex >= 0 && currentStatusIndex < statusFlow.length - 1) {
        // 30% chance to progress to next status
        if (progressChance < 0.3) {
          const nextStatus = statusFlow[currentStatusIndex + 1];
          const updatedData = {
            ...trackingData,
            status: nextStatus.status as any,
            status_updates: [
              ...trackingData.status_updates,
              {
                status: nextStatus.status,
                timestamp: new Date().toISOString(),
                message: nextStatus.message
              }
            ]
          };
          
          setTrackingData(updatedData);
          
          toast({
            title: "Status Update! 🚛",
            description: nextStatus.message,
          });
        }
      }
      
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      setRefreshing(false);
    }
  };

  // Status flow progression
  const statusFlow = [
    { status: 'scheduled', message: 'Pickup request berhasil dijadwalkan' },
    { status: 'driver_assigned', message: 'Driver telah ditugaskan untuk pickup Anda' },
    { status: 'on_the_way', message: 'Driver sedang dalam perjalanan ke lokasi' },
    { status: 'arrived', message: 'Driver telah sampai di lokasi pickup' },
    { status: 'in_progress', message: 'Sedang melakukan pengambilan sampah' },
    { status: 'completed', message: 'Pickup telah selesai! Terima kasih atas kontribusi Anda' }
  ];

  const simulateStatusChange = (targetStatus: string) => {
    if (!trackingData) return;
    
    const statusIndex = statusFlow.findIndex(s => s.status === targetStatus);
    if (statusIndex === -1) return;
    
    const targetStatusInfo = statusFlow[statusIndex];
    const updatedData = {
      ...trackingData,
      status: targetStatus as any,
      status_updates: [
        ...trackingData.status_updates,
        {
          status: targetStatus,
          timestamp: new Date().toISOString(),
          message: targetStatusInfo.message
        }
      ]
    };
    
    setTrackingData(updatedData);
    
    toast({
      title: "Status Changed! 📦",
      description: targetStatusInfo.message,
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { icon: Calendar, color: 'bg-blue-100 text-blue-800', label: 'Dijadwalkan', bgColor: 'from-blue-50 to-blue-100' };
      case 'driver_assigned':
        return { icon: User, color: 'bg-purple-100 text-purple-800', label: 'Driver Ditugaskan', bgColor: 'from-purple-50 to-purple-100' };
      case 'on_the_way':
        return { icon: Truck, color: 'bg-orange-100 text-orange-800', label: 'Dalam Perjalanan', bgColor: 'from-orange-50 to-orange-100' };
      case 'arrived':
        return { icon: MapPin, color: 'bg-yellow-100 text-yellow-800', label: 'Sudah Sampai', bgColor: 'from-yellow-50 to-yellow-100' };
      case 'in_progress':
        return { icon: Package, color: 'bg-indigo-100 text-indigo-800', label: 'Sedang Pickup', bgColor: 'from-indigo-50 to-indigo-100' };
      case 'completed':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Selesai', bgColor: 'from-green-50 to-green-100' };
      default:
        return { icon: AlertCircle, color: 'bg-gray-100 text-gray-800', label: 'Unknown', bgColor: 'from-gray-50 to-gray-100' };
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'scheduled': return 15;
      case 'driver_assigned': return 30;
      case 'on_the_way': return 50;
      case 'arrived': return 70;
      case 'in_progress': return 85;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          title: "Menunggu Driver",
          description: "Pickup Anda sedang dicarikan driver terbaik"
        };
      case 'driver_assigned':
        return {
          title: "Driver Siap!",
          description: "Driver telah ditugaskan dan akan segera berangkat"
        };
      case 'on_the_way':
        return {
          title: "Driver Dalam Perjalanan",
          description: "Driver sedang menuju lokasi pickup Anda"
        };
      case 'arrived':
        return {
          title: "Driver Sudah Sampai",
          description: "Driver sudah berada di lokasi, bersiaplah!"
        };
      case 'in_progress':
        return {
          title: "Sedang Pickup",
          description: "Driver sedang mengambil sampah Anda"
        };
      case 'completed':
        return {
          title: "Pickup Selesai!",
          description: "Terima kasih! Sampah Anda akan diproses dengan baik"
        };
      default:
        return {
          title: "Status Tidak Diketahui",
          description: "Silakan refresh halaman"
        };
    }
  };

  const getMapMessage = (status: string) => {
    switch (status) {
      case 'scheduled':
        return "Menunggu driver terbaik untuk Anda";
      case 'driver_assigned':
        return "Driver siap dan akan segera berangkat";
      case 'on_the_way':
        return "Driver sedang menuju lokasi Anda";
      case 'arrived':
        return "Driver sudah sampai di lokasi!";
      case 'in_progress':
        return "Sedang mengambil sampah Anda";
      case 'completed':
        return "Pickup telah selesai dengan sukses";
      default:
        return "Memuat informasi driver...";
    }
  };

  const getDistanceMessage = (status: string) => {
    switch (status) {
      case 'scheduled':
        return "Pencarian driver sedang berlangsung";
      case 'driver_assigned':
        return "Driver bersiap berangkat ke lokasi";
      case 'on_the_way':
        return "Jarak: ~2.3 km dari tujuan";
      case 'arrived':
        return "Driver berada di lokasi pickup";
      case 'in_progress':
        return "Proses pickup sedang berlangsung";
      case 'completed':
        return "Sampah berhasil diambil";
      default:
        return "Mempersiapkan informasi...";
    }
  };

  const wasteTypeLabels: { [key: string]: string } = {
    plastic: 'Plastik',
    paper: 'Kertas',
    metal: 'Logam',
    glass: 'Kaca',
    organic: 'Organik',
    electronic: 'Elektronik'
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-6"></div>
            <p className="text-gray-600">Memuat data tracking...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!trackingData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tracking Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Pickup request tidak dapat dilacak</p>
            <Button onClick={() => navigate('/pickup-history')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Riwayat
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusInfo = getStatusInfo(trackingData.status);
  const progress = getStatusProgress(trackingData.status);

  return (
    <MainLayout>
      <div className="container mx-auto px-3 py-4 max-w-6xl">
        {/* Mobile-First Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/pickup-history')}
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={updateTrackingData}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              🚛 Pickup #{trackingData.id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-600">
              Real-time tracking pickup sampah
            </p>
          </div>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-4">
          {/* Status Progress - Priority on mobile */}
          <Card className={`lg:hidden bg-gradient-to-br ${statusInfo.bgColor} border-0 shadow-lg`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">{getStatusMessage(trackingData.status).title}</CardTitle>
                <Badge className={`${statusInfo.color} text-xs shadow-sm`}>
                  <statusInfo.icon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{progress}%</div>
                  <div className="text-sm text-gray-600 font-medium">Selesai</div>
                </div>
                <Progress value={progress} className="h-3 bg-white/50" />
                <div className="text-center">
                  <p className="text-sm text-gray-700 mb-2">
                    {getStatusMessage(trackingData.status).description}
                  </p>
                  {trackingData.estimated_arrival && (
                    <div className="text-sm font-semibold text-gray-800 bg-white/60 rounded-lg px-3 py-1 inline-block">
                      ⏱️ ETA: {trackingData.estimated_arrival}
                    </div>
                  )}
                </div>
                
                {/* Quick Status Actions for Demo */}
                {trackingData.status !== 'completed' && (
                  <div className="pt-2 border-t border-white/30">
                    <p className="text-xs text-gray-600 mb-2 text-center">Demo: Simulasi status</p>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {statusFlow.map((status) => (
                        <Button
                          key={status.status}
                          onClick={() => simulateStatusChange(status.status)}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 bg-white/70 hover:bg-white"
                        >
                          {getStatusInfo(status.status).label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Map - Optimized for mobile */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Navigation className="h-5 w-5 mr-2 text-blue-600" />
                  Lokasi Real-Time
                </CardTitle>
                <Badge className={`${statusInfo.color} text-xs lg:hidden`}>
                  <statusInfo.icon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {/* Dynamic Map based on status */}
              <div className={`relative bg-gradient-to-br ${statusInfo.bgColor} rounded-xl h-64 md:h-80 overflow-hidden border-2 border-white/50`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-500/20 to-teal-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3 px-4">
                    <div className="relative">
                      <MapPin className="h-12 w-12 md:h-16 md:w-16 text-red-500 mx-auto animate-bounce" />
                      <div className={`absolute -top-1 -right-1 rounded-full p-1 ${
                        trackingData.status === 'completed' ? 'bg-green-600' : 
                        trackingData.status === 'in_progress' ? 'bg-indigo-600 animate-pulse' :
                        trackingData.status === 'arrived' ? 'bg-yellow-500 animate-bounce' :
                        'bg-green-500 animate-pulse'
                      }`}>
                        <statusInfo.icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-xs mx-auto border">
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        {getMapMessage(trackingData.status)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1">
                        📍 {getDistanceMessage(trackingData.status)}
                      </div>
                      {trackingData.estimated_arrival && trackingData.status !== 'completed' && (
                        <div className="text-xs md:text-sm text-gray-600">
                          ⏱️ ETA: {trackingData.estimated_arrival}
                        </div>
                      )}
                      {trackingData.status === 'completed' && (
                        <div className="text-xs md:text-sm text-green-600 font-semibold animate-pulse">
                          ✅ Pickup berhasil diselesaikan!
                        </div>
                      )}
                      
                      {/* Real-time indicator */}
                      <div className="flex items-center justify-center mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-500">Live tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Status-based overlay */}
                <div className="absolute top-3 right-3">
                  <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0 shadow-sm">
                    <Route className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Completion celebration */}
                {trackingData.status === 'completed' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-6xl animate-bounce">🎉</div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-center gap-6 text-xs md:text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  Tujuan
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Driver
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Driver Info - Mobile optimized */}
            <div className="lg:col-span-2">
              {trackingData.driver && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      Driver Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12 md:h-16 md:w-16">
                        <AvatarImage src={trackingData.driver.avatar} alt={trackingData.driver.name} />
                        <AvatarFallback className="text-sm md:text-lg font-semibold bg-green-100 text-green-800">
                          {trackingData.driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-base md:text-lg text-gray-900">{trackingData.driver.name}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {trackingData.driver.rating}
                          </div>
                          <div className="flex items-center">
                            <Car className="h-3 w-3 text-gray-500 mr-1" />
                            {trackingData.driver.vehicle_number}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {trackingData.driver.vehicle_type}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-green-600 hover:bg-green-700 h-10 text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Telepon
                      </Button>
                      <Button variant="outline" className="h-10 text-sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Details for desktop, moved to separate cards for mobile */}
            <div className="space-y-4">
              {/* Status Progress - Desktop only */}
              <Card className={`hidden lg:block bg-gradient-to-br ${statusInfo.bgColor} border-0 shadow-lg`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg font-bold">
                    <Timer className="h-5 w-5 mr-2 text-orange-600" />
                    {getStatusMessage(trackingData.status).title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{progress}%</div>
                      <div className="text-sm text-gray-600 font-medium">Selesai</div>
                    </div>
                    <Progress value={progress} className="h-4 bg-white/50" />
                    <div className="text-center">
                      <Badge className={`${statusInfo.color} text-base px-4 py-2 shadow-sm`}>
                        <statusInfo.icon className="h-4 w-4 mr-2" />
                        {statusInfo.label}
                      </Badge>
                      <p className="text-sm text-gray-700 mt-3">
                        {getStatusMessage(trackingData.status).description}
                      </p>
                    </div>
                    
                    {/* Desktop Status Actions */}
                    {trackingData.status !== 'completed' && (
                      <div className="pt-4 border-t border-white/30">
                        <p className="text-xs text-gray-600 mb-3 text-center">Demo: Simulasi perubahan status</p>
                        <div className="grid grid-cols-2 gap-2">
                          {statusFlow.map((status) => (
                            <Button
                              key={status.status}
                              onClick={() => simulateStatusChange(status.status)}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 bg-white/70 hover:bg-white"
                            >
                              {getStatusInfo(status.status).label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pickup Details - Mobile optimized */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Detail Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MapPin className="h-3 w-3 mr-2" />
                      Alamat
                    </div>
                    <div className="font-medium text-sm text-gray-900 leading-tight">{trackingData.pickup_address}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <Calendar className="h-3 w-3 mr-2" />
                        Tanggal
                      </div>
                      <div className="font-medium text-sm text-gray-900">
                        {new Date(trackingData.scheduled_date).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <Clock className="h-3 w-3 mr-2" />
                        Waktu
                      </div>
                      <div className="font-medium text-sm text-gray-900">{trackingData.scheduled_time}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <Weight className="h-3 w-3 mr-2" />
                      Berat Estimasi
                    </div>
                    <div className="font-medium text-sm text-gray-900">{trackingData.estimated_weight} kg</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 mb-2">Jenis Sampah</div>
                    <div className="flex flex-wrap gap-1">
                      {trackingData.waste_types.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs px-2 py-1">
                          {wasteTypeLabels[type] || type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Timeline Status - Full width for mobile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Timeline Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {trackingData.status_updates.map((update, index) => {
                  const updateStatusInfo = getStatusInfo(update.status);
                  const isCompleted = trackingData.status_updates.findIndex(u => u.status === trackingData.status) >= index;
                  
                  return (
                    <div key={index} className={`flex items-start space-x-3 ${!isCompleted ? 'opacity-50' : ''}`}>
                      <div className={`p-2 rounded-full ${isCompleted ? updateStatusInfo.color : 'bg-gray-100 text-gray-400'} flex-shrink-0`}>
                        <updateStatusInfo.icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900">{update.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(update.timestamp).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PickupTracking;