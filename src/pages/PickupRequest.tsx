import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { MapPin, Calendar, Weight, Recycle, Send, Clock, Package, Star, CreditCard, Banknote } from 'lucide-react';

interface WasteType {
  value: string;
  label: string;
  points: number;
  icon: string;
}

const PickupRequest = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [estimatedPoints, setEstimatedPoints] = useState(0);

  const [formData, setFormData] = useState({
    address: '',
    scheduledDate: '',
    scheduledTime: '10:00',
    estimatedWeight: '5',
    specialInstructions: '',
    paymentMethod: 'cash',
  });

  // Simplified waste types dengan icon dan bahasa yang mudah dipahami
  const wasteTypes: WasteType[] = [
    { value: 'plastic', label: 'Botol & Kemasan Plastik', points: 3, icon: '🍼' },
    { value: 'paper', label: 'Kertas & Kardus', points: 2, icon: '📄' },
    { value: 'glass', label: 'Botol & Toples Kaca', points: 4, icon: '🍾' },
    { value: 'metal', label: 'Kaleng & Logam', points: 5, icon: '🥫' },
    { value: 'organic', label: 'Sisa Makanan', points: 1, icon: '🥬' },
    { value: 'electronic', label: 'HP & Elektronik Lama', points: 8, icon: '📱' },
  ];

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      scheduledDate: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  // Calculate points when waste types or weight change
  useEffect(() => {
    const weight = parseFloat(formData.estimatedWeight) || 0;
    const points = selectedWasteTypes.reduce((total, typeValue) => {
      const type = wasteTypes.find(w => w.value === typeValue);
      return total + (type ? type.points * weight : 0);
    }, 0);
    setEstimatedPoints(Math.floor(points));
  }, [selectedWasteTypes, formData.estimatedWeight]);

  const handleWasteTypeChange = (wasteType: string, checked: boolean) => {
    if (checked) {
      setSelectedWasteTypes([...selectedWasteTypes, wasteType]);
    } else {
      setSelectedWasteTypes(selectedWasteTypes.filter(type => type !== wasteType));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedWasteTypes.length === 0) {
      toast({
        title: t('auth.error'),
        description: "Pilih minimal satu jenis sampah",
        variant: "destructive",
      });
      return;
    }

    if (!formData.address.trim()) {
      toast({
        title: t('auth.error'),
        description: "Alamat harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const isLocalUser = user?.id?.startsWith('local-');
      
      const pickupRequest = {
        id: `pickup-${Date.now()}`,
        user_id: user?.id,
        pickup_address: formData.address,
        scheduled_date: formData.scheduledDate,
        scheduled_time: formData.scheduledTime,
        estimated_weight: parseFloat(formData.estimatedWeight),
        waste_types: selectedWasteTypes,
        special_instructions: formData.specialInstructions || null,
        payment_method: formData.paymentMethod,
        status: 'scheduled',
        points_earned: estimatedPoints,
        created_at: new Date().toISOString(),
      };

      if (isLocalUser) {
        // Store in localStorage for local users
        const existingRequests = JSON.parse(localStorage.getItem('local-pickup-requests') || '[]');
        existingRequests.push(pickupRequest);
        localStorage.setItem('local-pickup-requests', JSON.stringify(existingRequests));

        // Add points to local user
        const existingPoints = JSON.parse(localStorage.getItem('local-user-points') || '[]');
        existingPoints.push({
          id: `points-${Date.now()}`,
          user_id: user?.id,
          points_earned: estimatedPoints,
          points_used: 0,
          transaction_type: 'pickup',
          description: `Poin dari permintaan pickup`,
          pickup_request_id: pickupRequest.id,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('local-user-points', JSON.stringify(existingPoints));
      } else {
        // Store in Supabase for regular users
        const { error } = await supabase
          .from('pickup_requests')
          .insert({
            user_id: user?.id,
            pickup_address: formData.address,
            scheduled_date: formData.scheduledDate,
            scheduled_time: formData.scheduledTime,
            estimated_weight: parseFloat(formData.estimatedWeight),
            waste_types: selectedWasteTypes,
            special_instructions: formData.specialInstructions || null,
            payment_method: formData.paymentMethod as 'cash' | 'transfer',
            status: 'scheduled',
          });

        if (error) throw error;
      }

      toast({
        title: "Berhasil! 🎉",
        description: `Permintaan pickup berhasil dikirim! Anda akan mendapat ${estimatedPoints} poin.`,
      });

      // Reset form
      setFormData({
        address: '',
        scheduledDate: '',
        scheduledTime: '10:00',
        estimatedWeight: '5',
        specialInstructions: '',
        paymentMethod: 'cash',
      });
      setSelectedWasteTypes([]);
      
      // Redirect to tracking page for the new pickup
      navigate(`/pickup-tracking/${pickupRequest.id}`);

    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-4xl">
          {/* Beautiful Header with Glass Effect */}
          <div className="mb-6 md:mb-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg md:shadow-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                    <Package className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                      📦 Minta Pickup Sampah
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg">
                      Isi form ini untuk menjadwalkan pengambilan sampah di rumah Anda
                    </p>
                  </div>
                </div>
                
                {estimatedPoints > 0 && (
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-emerald-200 px-4 py-2 rounded-2xl border border-white/20">
                    <Star className="h-4 w-4 mr-2" />
                    Perkiraan poin: <strong className="ml-1">{estimatedPoints} poin</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Basic Info */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
              <div className="mb-4 md:mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Informasi Pickup</h3>
                    <p className="text-white/70 text-xs md:text-sm">Data dasar untuk penjadwalan pickup</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Address */}
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-white/90">
                    📍 Alamat Lengkap
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Contoh: Jl. Merdeka No. 123, RT 01/RW 02, dekat warung Pak Budi"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="mt-2 min-h-[80px] bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                    required
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Tulis alamat selengkap mungkin dengan patokan yang mudah ditemukan
                  </p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium text-white/90">
                      📅 Tanggal
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 bg-white/10 backdrop-blur-sm border-white/30 text-white focus:border-emerald-400 focus:ring-emerald-400/20"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-sm font-medium text-white/90">
                      ⏰ Jam
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                      className="mt-2 bg-white/10 backdrop-blur-sm border-white/30 text-white focus:border-emerald-400 focus:ring-emerald-400/20"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium text-white/90">
                    ⚖️ Perkiraan Berat (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={formData.estimatedWeight}
                    onChange={(e) => setFormData({...formData, estimatedWeight: e.target.value})}
                    className="mt-2 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                    required
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Perkiraan berat total sampah (minimal 0.5 kg)
                  </p>
                </div>

                {/* Special Instructions */}
                <div>
                  <Label htmlFor="instructions" className="text-sm font-medium text-white/90">
                    📝 Catatan Khusus (opsional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Contoh: Sampah di teras depan, atau hubungi dulu sebelum datang"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    className="mt-2 min-h-[60px] bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-sm font-medium text-white/90">
                    💳 Metode Pembayaran
                  </Label>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                    className="mt-3 space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300">
                      <RadioGroupItem 
                        value="cash" 
                        id="cash" 
                        className="border-white/40 text-emerald-500 focus:ring-emerald-400/20"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Banknote className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="cash" className="font-medium cursor-pointer text-white">
                            Tunai (Cash)
                          </Label>
                          <p className="text-xs text-white/60">
                            Bayar langsung saat pickup
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300">
                      <RadioGroupItem 
                        value="transfer" 
                        id="transfer"
                        className="border-white/40 text-emerald-500 focus:ring-emerald-400/20"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="transfer" className="font-medium cursor-pointer text-white">
                            Transfer Digital
                          </Label>
                          <p className="text-xs text-white/60">
                            Transfer via DANA, GoPay, OVO, dll
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-white/60 mt-2">
                    Pilih cara pembayaran yang paling mudah untuk Anda
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column - Waste Types */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
              <div className="mb-4 md:mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <Recycle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Jenis Sampah</h3>
                    <p className="text-white/70 text-xs md:text-sm">Pilih jenis sampah yang akan diambil (minimal 1)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {wasteTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <Checkbox
                      id={type.value}
                      checked={selectedWasteTypes.includes(type.value)}
                      onCheckedChange={(checked) => handleWasteTypeChange(type.value, checked as boolean)}
                      className="border-white/40 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <Label htmlFor={type.value} className="font-medium cursor-pointer text-white">
                            {type.label}
                          </Label>
                          <div className="text-xs text-white/60">
                            {type.points} poin per kg
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedWasteTypes.length === 0 && (
                <div className="mt-4 p-3 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl">
                  <p className="text-sm text-yellow-200">
                    ⚠️ Pilih minimal satu jenis sampah untuk melanjutkan
                  </p>
                </div>
              )}
            </div>
        </div>

          {/* Submit Button - Fixed at bottom */}
          <div className="mt-6 md:mt-8 sticky bottom-6 z-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-white/80">
                  {selectedWasteTypes.length > 0 ? (
                    <div>
                      <div>Jenis sampah: <strong className="text-white">{selectedWasteTypes.length} dipilih</strong></div>
                      <div>Berat: <strong className="text-white">{formData.estimatedWeight} kg</strong></div>
                      <div>Pembayaran: <strong className="text-white">{formData.paymentMethod === 'cash' ? 'Tunai' : 'Transfer'}</strong></div>
                    </div>
                  ) : (
                    "Pilih jenis sampah untuk melihat perkiraan poin"
                  )}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || selectedWasteTypes.length === 0 || !formData.address.trim()}
                  className="
                    bg-gradient-to-r from-emerald-500 to-green-500
                    hover:from-emerald-400 hover:to-green-400
                    text-white font-bold px-6 md:px-8
                    rounded-2xl
                    shadow-lg hover:shadow-xl
                    transform hover:scale-[1.02]
                    transition-all duration-300
                    border-0
                    disabled:opacity-50 disabled:transform-none
                  "
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Permintaan
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default PickupRequest;