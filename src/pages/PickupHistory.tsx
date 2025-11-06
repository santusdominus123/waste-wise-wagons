import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, DialogClose } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, Search, MapPin, Weight, Clock, Star, Plus, Package, Truck, CheckCircle, AlertCircle, XCircle, Edit, Trash2, Eye, RefreshCw, History } from 'lucide-react';

interface PickupRequest {
  id: string;
  pickup_address: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_weight: number;
  waste_types: string[];
  status: string;
  special_instructions: string;
  points_earned?: number;
  created_at: string;
  user_id: string;
}

const PickupHistory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // CRUD state
  const [editingPickup, setEditingPickup] = useState<PickupRequest | null>(null);
  const [viewingPickup, setViewingPickup] = useState<PickupRequest | null>(null);
  const [deletingPickup, setDeletingPickup] = useState<PickupRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Simple waste type mapping with emojis
  const wasteTypeOptions = [
    { value: 'plastic', label: 'Botol & Kemasan Plastik', points: 3, icon: '🍼' },
    { value: 'paper', label: 'Kertas & Kardus', points: 2, icon: '📄' },
    { value: 'glass', label: 'Botol & Toples Kaca', points: 4, icon: '🍾' },
    { value: 'metal', label: 'Kaleng & Logam', points: 5, icon: '🥫' },
    { value: 'organic', label: 'Sisa Makanan', points: 1, icon: '🥬' },
    { value: 'electronic', label: 'HP & Elektronik Lama', points: 8, icon: '📱' },
  ];

  const wasteTypeIcons: { [key: string]: string } = {
    'plastic': '🍼',
    'paper': '📄',
    'glass': '🍾',
    'metal': '🥫',
    'organic': '🥬',
    'electronic': '📱',
    'textile': '👕',
    'hazardous': '⚠️',
  };

  const wasteTypeNames: { [key: string]: string } = {
    'plastic': 'Botol Plastik',
    'paper': 'Kertas',
    'glass': 'Botol Kaca',
    'metal': 'Kaleng',
    'organic': 'Sisa Makanan',
    'electronic': 'Elektronik',
    'textile': 'Kain',
    'hazardous': 'B3',
  };

  useEffect(() => {
    if (user) {
      fetchPickupHistory();
    }
  }, [user]);

  useEffect(() => {
    filterRequests();
  }, [pickupRequests, searchTerm, statusFilter]);

  const fetchPickupHistory = async () => {
    try {
      const isLocalUser = user?.id?.startsWith('local-');
      
      if (isLocalUser) {
        const localPickups = JSON.parse(localStorage.getItem('local-pickup-requests') || '[]');
        const userPickups = localPickups
          .filter((p: any) => p.user_id === user?.id)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setPickupRequests(userPickups);
      } else {
        const { data, error } = await supabase
          .from('pickup_requests')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching pickup history:', error);
          toast({
            title: t('auth.error'),
            description: "Gagal memuat riwayat pickup",
            variant: "destructive",
          });
        } else {
          setPickupRequests(data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching pickup history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = pickupRequests || [];

    if (searchTerm) {
      filtered = filtered.filter(request =>
        (request.pickup_address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.waste_types || []).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  // CRUD Operations
  const handleEdit = (pickup: PickupRequest) => {
    setEditingPickup(pickup);
    setIsEditDialogOpen(true);
  };

  const handleView = (pickup: PickupRequest) => {
    setViewingPickup(pickup);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (pickup: PickupRequest) => {
    setDeletingPickup(pickup);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPickup) return;

    try {
      const isLocalUser = user?.id?.startsWith('local-');
      
      if (isLocalUser) {
        const existingRequests = JSON.parse(localStorage.getItem('local-pickup-requests') || '[]');
        const updatedRequests = existingRequests.filter((req: any) => req.id !== deletingPickup.id);
        localStorage.setItem('local-pickup-requests', JSON.stringify(updatedRequests));
      } else {
        const { error } = await supabase
          .from('pickup_requests')
          .delete()
          .eq('id', deletingPickup.id)
          .eq('user_id', user?.id);

        if (error) throw error;
      }

      toast({
        title: "Berhasil! 🗑️",
        description: "Pickup request berhasil dihapus",
      });

      fetchPickupHistory();
      setIsDeleteDialogOpen(false);
      setDeletingPickup(null);
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || "Gagal menghapus pickup request",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingPickup) return;

    try {
      const isLocalUser = user?.id?.startsWith('local-');
      
      if (isLocalUser) {
        const existingRequests = JSON.parse(localStorage.getItem('local-pickup-requests') || '[]');
        const updatedRequests = existingRequests.map((req: any) => 
          req.id === editingPickup.id ? { ...req, ...editingPickup, updated_at: new Date().toISOString() } : req
        );
        localStorage.setItem('local-pickup-requests', JSON.stringify(updatedRequests));
      } else {
        const { error } = await supabase
          .from('pickup_requests')
          .update({
            pickup_address: editingPickup.pickup_address,
            scheduled_date: editingPickup.scheduled_date,
            scheduled_time: editingPickup.scheduled_time,
            estimated_weight: editingPickup.estimated_weight,
            waste_types: editingPickup.waste_types,
            special_instructions: editingPickup.special_instructions,
          })
          .eq('id', editingPickup.id)
          .eq('user_id', user?.id);

        if (error) throw error;
      }

      toast({
        title: "Berhasil! ✏️",
        description: "Pickup request berhasil diupdate",
      });

      fetchPickupHistory();
      setIsEditDialogOpen(false);
      setEditingPickup(null);
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || "Gagal mengupdate pickup request",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'scheduled': { label: 'Dijadwalkan', color: 'bg-blue-100 text-blue-800', icon: Clock },
      'in_progress': { label: 'Sedang Diambil', color: 'bg-yellow-100 text-yellow-800', icon: Truck },
      'completed': { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'cancelled': { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: XCircle },
      'priority': { label: 'Prioritas', color: 'bg-purple-100 text-purple-800', icon: AlertCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.scheduled;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM format
  };

  const calculateStats = () => {
    const total = pickupRequests.length;
    const completed = pickupRequests.filter(r => r.status === 'completed').length;
    const totalWeight = pickupRequests.reduce((sum, r) => sum + (r.estimated_weight || 0), 0);
    const totalPoints = pickupRequests.reduce((sum, r) => sum + (r.points_earned || 0), 0);
    
    return { total, completed, totalWeight, totalPoints };
  };

  const stats = pickupRequests.length > 0 ? calculateStats() : { total: 0, completed: 0, totalWeight: 0, totalPoints: 0 };

  if (loading) {
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

        <MainLayout>
          <div className="relative z-10 container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                <p className="text-white">Memuat riwayat pickup...</p>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }

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
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                    <History className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
                      📋 Riwayat Pickup
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg">
                      Kelola semua permintaan pickup sampah Anda
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={fetchPickupHistory}
                    className="
                      bg-white/10 backdrop-blur-sm
                      border border-white/30 
                      rounded-2xl
                      text-white hover:text-white
                      hover:bg-white/20
                      transition-all duration-300
                      p-3
                    "
                    variant="ghost"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/pickup')}
                    className="
                      bg-gradient-to-r from-emerald-500 to-green-500
                      hover:from-emerald-400 hover:to-green-400
                      text-white font-bold px-4 md:px-6
                      rounded-2xl
                      shadow-lg hover:shadow-xl
                      transform hover:scale-[1.02]
                      transition-all duration-300
                      border-0
                    "
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Pickup Baru</span>
                    <span className="sm:hidden">Baru</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Stats Summary */}
          {stats.total > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-xl md:text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs md:text-sm text-white/70">Total Pickup</div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-xl md:text-2xl font-bold text-emerald-300">{stats.completed}</div>
                <div className="text-xs md:text-sm text-white/70">Selesai</div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-xl md:text-2xl font-bold text-cyan-300">{stats.totalWeight.toFixed(1)}</div>
                <div className="text-xs md:text-sm text-white/70">kg Sampah</div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-xl md:text-2xl font-bold text-purple-300">{stats.totalPoints}</div>
                <div className="text-xs md:text-sm text-white/70">Poin</div>
              </div>
            </div>
          )}

          {/* Beautiful Search and Filter */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Cari alamat atau jenis sampah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 bg-white/10 backdrop-blur-sm border-white/30 text-white focus:border-emerald-400 focus:ring-emerald-400/20">
                <SelectValue placeholder="Filter Status" className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">Semua Status</SelectItem>
                <SelectItem value="scheduled" className="text-white hover:bg-white/10">Dijadwalkan</SelectItem>
                <SelectItem value="in_progress" className="text-white hover:bg-white/10">Sedang Diambil</SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-white/10">Selesai</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-white/10">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Beautiful Pickup List */}
          {filteredRequests.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-xl text-center">
              <Package className="h-12 w-12 md:h-16 md:w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-white mb-2">
                {pickupRequests.length === 0 ? "Belum Ada Pickup" : "Tidak Ada Hasil"}
              </h3>
              <p className="text-sm md:text-base text-white/70 mb-6">
                {pickupRequests.length === 0 
                  ? "Anda belum pernah melakukan permintaan pickup sampah"
                  : "Tidak ada pickup yang sesuai dengan pencarian Anda"
                }
              </p>
              {pickupRequests.length === 0 && (
                <Button onClick={() => navigate('/pickup')} className="
                  bg-gradient-to-r from-emerald-500 to-green-500
                  hover:from-emerald-400 hover:to-green-400
                  text-white font-bold px-6
                  rounded-2xl
                  shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02]
                  transition-all duration-300
                  border-0
                  h-10 text-sm
                ">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Pickup Pertama
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => {
                const statusInfo = getStatusInfo(request.status);
                const StatusIcon = statusInfo.icon;
                const canEdit = request.status === 'scheduled';
                
                return (
                  <div key={request.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.01]">
                    {/* Mobile-First Layout */}
                    <div className="space-y-3">
                      {/* Status and Points Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          {request.points_earned && request.points_earned > 0 && (
                            <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/30 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              +{request.points_earned}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-white/80">
                          <Weight className="h-3 w-3" />
                          <span className="font-medium">{request.estimated_weight} kg</span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-white leading-tight">
                            {request.pickup_address && request.pickup_address.length > 80 
                              ? `${request.pickup_address.substring(0, 80)}...` 
                              : (request.pickup_address || 'Alamat tidak tersedia')
                            }
                          </p>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(request.scheduled_date)}</span>
                        </div>
                        {request.scheduled_time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(request.scheduled_time)}</span>
                          </div>
                        )}
                      </div>

                      {/* Waste Types */}
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {(request.waste_types || []).slice(0, 2).map((type, index) => (
                            <span key={index} className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                              {wasteTypeIcons[type] || '📦'} {wasteTypeNames[type] || type}
                            </span>
                          ))}
                          {(request.waste_types || []).length > 2 && (
                            <span className="text-xs text-white/60 px-2 py-1">
                              +{(request.waste_types || []).length - 2} lainnya
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      {request.special_instructions && (
                        <div className="p-2 bg-white/10 backdrop-blur-sm rounded text-xs text-white/80">
                          <span className="font-medium text-white">Catatan:</span> {request.special_instructions}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          onClick={() => navigate(`/pickup-tracking/${request.id}`)}
                          className="
                            bg-emerald-500/30 backdrop-blur-sm
                            border border-emerald-400/30 
                            rounded-xl
                            text-emerald-200 hover:text-emerald-100
                            hover:bg-emerald-500/40
                            transition-all duration-300
                            h-8 px-3 text-xs flex-1
                          "
                          variant="ghost"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Lacak
                        </Button>
                        {canEdit && (
                          <Button
                            onClick={() => handleEdit(request)}
                            className="
                              bg-orange-500/30 backdrop-blur-sm
                              border border-orange-400/30 
                              rounded-xl
                              text-orange-200 hover:text-orange-100
                              hover:bg-orange-500/40
                              transition-all duration-300
                              h-8 px-2
                            "
                            variant="ghost"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button
                            onClick={() => handleDelete(request)}
                            className="
                              bg-red-500/30 backdrop-blur-sm
                              border border-red-400/30 
                              rounded-xl
                              text-red-200 hover:text-red-100
                              hover:bg-red-500/40
                              transition-all duration-300
                              h-8 px-2
                            "
                            variant="ghost"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load more if needed */}
          {filteredRequests.length > 0 && filteredRequests.length >= 10 && (
            <div className="text-center mt-8">
              <p className="text-sm text-white/70">
                Menampilkan {filteredRequests.length} dari {pickupRequests.length} pickup
              </p>
            </div>
          )}

        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                Detail Pickup Request
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang permintaan pickup ini
              </DialogDescription>
            </DialogHeader>
            {viewingPickup && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusInfo(viewingPickup.status).color}`}>
                        {getStatusInfo(viewingPickup.status).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Poin Diperoleh</Label>
                    <p className="mt-1 text-sm">{viewingPickup.points_earned || 0} poin</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Alamat Pickup</Label>
                  <p className="mt-1 text-sm">{viewingPickup.pickup_address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Tanggal</Label>
                    <p className="mt-1 text-sm">{formatDate(viewingPickup.scheduled_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Waktu</Label>
                    <p className="mt-1 text-sm">{formatTime(viewingPickup.scheduled_time) || 'Tidak ditentukan'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Berat Estimasi</Label>
                  <p className="mt-1 text-sm">{viewingPickup.estimated_weight} kg</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Jenis Sampah</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(viewingPickup.waste_types || []).map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {wasteTypeIcons[type]} {wasteTypeNames[type] || type}
                      </Badge>
                    ))}
                  </div>
                </div>
                {viewingPickup.special_instructions && (
                  <div>
                    <Label className="text-sm font-medium">Catatan Khusus</Label>
                    <p className="mt-1 text-sm p-3 bg-gray-50 rounded-lg">{viewingPickup.special_instructions}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <Label className="text-sm font-medium">Dibuat</Label>
                    <p className="mt-1">{formatDate(viewingPickup.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ID Request</Label>
                    <p className="mt-1 font-mono">{viewingPickup.id}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2 text-orange-600" />
                Edit Pickup Request
              </DialogTitle>
              <DialogDescription>
                Ubah detail permintaan pickup Anda
              </DialogDescription>
            </DialogHeader>
            {editingPickup && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-address">Alamat Pickup</Label>
                  <Textarea
                    id="edit-address"
                    value={editingPickup.pickup_address}
                    onChange={(e) => setEditingPickup({...editingPickup, pickup_address: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-date">Tanggal</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editingPickup.scheduled_date}
                      onChange={(e) => setEditingPickup({...editingPickup, scheduled_date: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-time">Waktu</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editingPickup.scheduled_time}
                      onChange={(e) => setEditingPickup({...editingPickup, scheduled_time: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-weight">Berat Estimasi (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={editingPickup.estimated_weight}
                    onChange={(e) => setEditingPickup({...editingPickup, estimated_weight: parseFloat(e.target.value)})}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Jenis Sampah</Label>
                  <div className="mt-2 space-y-2">
                    {wasteTypeOptions.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${type.value}`}
                          checked={(editingPickup.waste_types || []).includes(type.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditingPickup({
                                ...editingPickup,
                                waste_types: [...(editingPickup.waste_types || []), type.value]
                              });
                            } else {
                              setEditingPickup({
                                ...editingPickup,
                                waste_types: (editingPickup.waste_types || []).filter(t => t !== type.value)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`edit-${type.value}`} className="flex items-center space-x-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-instructions">Catatan Khusus</Label>
                  <Textarea
                    id="edit-instructions"
                    value={editingPickup.special_instructions || ''}
                    onChange={(e) => setEditingPickup({...editingPickup, special_instructions: e.target.value})}
                    className="mt-1"
                    placeholder="Instruksi khusus untuk pickup..."
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <Trash2 className="h-5 w-5 mr-2 text-red-600" />
                Hapus Pickup Request
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pickup request ini? Tindakan ini tidak dapat dibatalkan.
                {deletingPickup && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">Detail yang akan dihapus:</p>
                    <p className="text-sm text-gray-600 mt-1">{deletingPickup.pickup_address}</p>
                    <p className="text-xs text-gray-500">{formatDate(deletingPickup.scheduled_date)}</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </MainLayout>
    </div>
  );
};

export default PickupHistory;