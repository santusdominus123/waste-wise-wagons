import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Calculator, 
  Plus, 
  Minus, 
  Trash2, 
  TrendingUp, 
  Recycle,
  Star,
  Target,
  Award,
  Lightbulb,
  ShoppingCart,
  Leaf,
  DollarSign
} from 'lucide-react';

interface WasteItem {
  id: string;
  name: string;
  nameId: string;
  type: string;
  points: number;
  co2Savings: number; // kg CO2 per kg waste
  icon: string;
  tips: string[];
  color: string;
  examples: string[];
}

interface CartItem extends WasteItem {
  weight: number;
  totalPoints: number;
  totalCO2: number;
}

const Cart = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedWasteId, setSelectedWasteId] = useState<string>('');
  const [inputWeight, setInputWeight] = useState<string>('1');

  // Simplified waste types dengan emoji dan tips
  const wasteTypes: WasteItem[] = [
    {
      id: 'plastic',
      name: 'Botol & Kemasan Plastik',
      nameId: 'Botol Plastik',
      type: 'plastic',
      points: 3,
      co2Savings: 1.8, // kg CO2 per kg
      icon: '🍼',
      color: 'bg-blue-100 text-blue-800',
      examples: ['Botol minuman', 'Kemasan makanan', 'Kantong plastik', 'Wadah yogurt'],
      tips: [
        'Bersihkan dari sisa makanan/minuman',
        'Pisahkan tutup dan label jika memungkinkan',
        'Botol PET (angka 1) paling mudah didaur ulang'
      ]
    },
    {
      id: 'paper',
      name: 'Kertas & Kardus',
      nameId: 'Kertas',
      type: 'paper',
      points: 2,
      co2Savings: 1.1,
      icon: '📄',
      color: 'bg-orange-100 text-orange-800',
      examples: ['Kardus bekas', 'Koran', 'Majalah', 'Kertas kantor'],
      tips: [
        'Pastikan kertas kering dan tidak berminyak',
        'Lepaskan pita atau stiker plastic',
        'Lipat kardus untuk menghemat ruang'
      ]
    },
    {
      id: 'glass',
      name: 'Botol & Toples Kaca',
      nameId: 'Kaca',
      type: 'glass',
      points: 4,
      co2Savings: 0.5,
      icon: '🍾',
      color: 'bg-green-100 text-green-800',
      examples: ['Botol kaca', 'Toples selai', 'Botol saus', 'Gelas kaca'],
      tips: [
        'Bilas untuk menghilangkan sisa makanan',
        'Lepaskan tutup logam atau plastik',
        'Hati-hati saat menangani kaca pecah'
      ]
    },
    {
      id: 'metal',
      name: 'Kaleng & Logam',
      nameId: 'Logam',
      type: 'metal',
      points: 5,
      co2Savings: 2.2,
      icon: '🥫',
      color: 'bg-gray-100 text-gray-800',
      examples: ['Kaleng minuman', 'Kaleng makanan', 'Foil aluminium', 'Tutup botol'],
      tips: [
        'Bilas kaleng dari sisa makanan',
        'Aluminium bernilai tinggi untuk daur ulang',
        'Magnet dapat memisahkan besi dari aluminium'
      ]
    },
    {
      id: 'organic',
      name: 'Sisa Makanan',
      nameId: 'Organik',
      type: 'organic',
      points: 1,
      co2Savings: 0.8,
      icon: '🥬',
      color: 'bg-emerald-100 text-emerald-800',
      examples: ['Kulit buah', 'Sisa sayuran', 'Ampas kopi', 'Daun kering'],
      tips: [
        'Cocok untuk kompos rumah',
        'Hindari daging dan produk susu untuk kompos',
        'Bisa jadi pupuk organic berkualitas'
      ]
    },
    {
      id: 'electronic',
      name: 'Elektronik & Gadget',
      nameId: 'Elektronik',
      type: 'electronic',
      points: 8,
      co2Savings: 15.0,
      icon: '📱',
      color: 'bg-purple-100 text-purple-800',
      examples: ['HP lama', 'Laptop rusak', 'Charger', 'Baterai'],
      tips: [
        'Hapus data pribadi sebelum menyerahkan',
        'Mengandung material berharga yang bisa didaur ulang',
        'Jangan buang ke tempat sampah biasa'
      ]
    }
  ];

  const addToCart = () => {
    const selectedWaste = wasteTypes.find(w => w.id === selectedWasteId);
    const weight = parseFloat(inputWeight);

    if (!selectedWaste || !weight || weight <= 0) {
      toast({
        title: "Input Tidak Valid",
        description: "Pilih jenis sampah dan masukkan berat yang valid",
        variant: "destructive",
      });
      return;
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === selectedWaste.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].weight += weight;
      updatedCart[existingItemIndex].totalPoints = updatedCart[existingItemIndex].weight * selectedWaste.points;
      updatedCart[existingItemIndex].totalCO2 = updatedCart[existingItemIndex].weight * selectedWaste.co2Savings;
      setCartItems(updatedCart);
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...selectedWaste,
        weight: weight,
        totalPoints: weight * selectedWaste.points,
        totalCO2: weight * selectedWaste.co2Savings,
      };
      setCartItems([...cartItems, cartItem]);
    }

    setInputWeight('1');
    
    toast({
      title: "Ditambahkan! 🎉",
      description: `${weight} kg ${selectedWaste.nameId} berhasil ditambahkan`,
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Dihapus",
      description: "Item berhasil dihapus dari kalkulator",
    });
  };

  const updateWeight = (id: string, newWeight: number) => {
    if (newWeight <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          weight: newWeight,
          totalPoints: newWeight * item.points,
          totalCO2: newWeight * item.co2Savings,
        };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Dikosongkan",
      description: "Semua item telah dihapus dari kalkulator",
    });
  };

  // Calculate totals
  const totalWeight = cartItems.reduce((sum, item) => sum + item.weight, 0);
  const totalPoints = cartItems.reduce((sum, item) => sum + item.totalPoints, 0);
  const totalCO2 = cartItems.reduce((sum, item) => sum + item.totalCO2, 0);
  const estimatedValue = totalWeight * 2.5; // Rp 2,500 per kg average

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
        <div className="relative z-10 container mx-auto px-3 py-2 md:py-6 max-w-6xl">
          {/* Compact Header for Mobile */}
          <div className="mb-4 md:mb-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-xl md:rounded-3xl p-3 md:p-8 shadow-lg md:shadow-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2 md:mb-4">
                  <div className="w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg md:rounded-2xl flex items-center justify-center mr-2 md:mr-4">
                    <Calculator className="h-4 w-4 md:h-8 md:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-4xl font-bold text-white mb-1 md:mb-2">
                      🧮 Smart Calculator
                    </h1>
                    <p className="text-white/80 text-xs md:text-lg max-w-2xl mx-auto hidden md:block">
                      Hitung berapa poin dan dampak lingkungan yang bisa Anda dapatkan dari sampah daur ulang
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Compact Layout */}
          <div className="space-y-4 mb-4 md:mb-8">
            {/* Mobile: Combined Input Section */}
            <div className="lg:hidden">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-xl">
                <div className="mb-3">
                  <h3 className="text-base font-bold text-white flex items-center">
                    <Plus className="h-4 w-4 mr-2 text-emerald-400" />
                    Pilih & Tambah Sampah
                  </h3>
                </div>
                
                {/* Compact Waste Type Selection */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {wasteTypes.map((waste) => (
                    <button
                      key={waste.id}
                      onClick={() => setSelectedWasteId(waste.id)}
                      className={`p-2 border-2 rounded-lg text-center transition-all duration-300 ${
                        selectedWasteId === waste.id
                          ? 'border-emerald-400 bg-emerald-500/20'
                          : 'border-white/30 bg-white/5 hover:border-white/50'
                      }`}
                    >
                      <div className="text-xl mb-1">{waste.icon}</div>
                      <div className="font-medium text-xs text-white">{waste.nameId}</div>
                      <div className="text-xs text-white/60">{waste.points}p</div>
                    </button>
                  ))}
                </div>

                {/* Weight Input and Add Button */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={inputWeight}
                      onChange={(e) => setInputWeight(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      placeholder="Berat (kg)"
                    />
                  </div>
                  <Button
                    onClick={addToCart}
                    disabled={!selectedWasteId || !inputWeight}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 px-4"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Preview */}
                {selectedWasteId && inputWeight && parseFloat(inputWeight) > 0 && (
                  <div className="mt-3 p-2 bg-blue-500/20 rounded-lg text-center">
                    <div className="text-xs text-blue-200">
                      {parseFloat(inputWeight).toFixed(1)} kg = {(parseFloat(inputWeight) * (wasteTypes.find(w => w.id === selectedWasteId)?.points || 0)).toFixed(0)} poin
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile: Quick Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl text-center">
                  <div className="text-lg font-bold text-white">{totalWeight.toFixed(1)}</div>
                  <div className="text-xs text-white/70">kg</div>
                </div>
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl text-center">
                  <div className="text-lg font-bold text-emerald-300">{totalPoints}</div>
                  <div className="text-xs text-white/70">Poin</div>
                </div>
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl text-center">
                  <div className="text-lg font-bold text-cyan-300">{totalCO2.toFixed(1)}</div>
                  <div className="text-xs text-white/70">CO₂</div>
                </div>
              </div>
            </div>

            {/* Desktop: Original Layout */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6">
              {/* Desktop Waste Type Selection */}
              <div className="col-span-2">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Pilih Jenis Sampah</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {wasteTypes.map((waste) => (
                      <button
                        key={waste.id}
                        onClick={() => setSelectedWasteId(waste.id)}
                        className={`p-3 border-2 rounded-xl text-center transition-all duration-300 ${
                          selectedWasteId === waste.id
                            ? 'border-emerald-400 bg-emerald-500/20 backdrop-blur-sm'
                            : 'border-white/30 bg-white/5 backdrop-blur-sm hover:border-white/50 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-2">{waste.icon}</div>
                        <div className="font-medium text-xs text-white">{waste.nameId}</div>
                        <div className="text-xs text-white/60 mt-1">
                          {waste.points}p • {waste.co2Savings}CO₂
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Weight Input */}
              <div className="col-span-1">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Berat & Tambah</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="weight" className="text-sm font-medium text-white/90">Berat (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={inputWeight}
                        onChange={(e) => setInputWeight(e.target.value)}
                        className="mt-2 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="1.0"
                      />
                    </div>
                    <Button
                      onClick={addToCart}
                      disabled={!selectedWasteId || !inputWeight}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 disabled:opacity-50 disabled:transform-none"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah
                    </Button>
                    {selectedWasteId && inputWeight && parseFloat(inputWeight) > 0 && (
                      <div className="p-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl text-center">
                        <div className="text-xs text-blue-200">{parseFloat(inputWeight).toFixed(1)} kg</div>
                        <div className="text-xs font-medium text-blue-100">
                          = {(parseFloat(inputWeight) * (wasteTypes.find(w => w.id === selectedWasteId)?.points || 0)).toFixed(0)} poin
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Quick Stats */}
              <div className="col-span-1">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Total Hasil</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{totalWeight.toFixed(1)} kg</div>
                      <div className="text-xs text-white/70">Berat Total</div>
                    </div>
                    <div className="border-t border-white/20"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-300">{totalPoints}</div>
                      <div className="text-xs text-white/70">Poin</div>
                    </div>
                    <div className="border-t border-white/20"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-300">{totalCO2.toFixed(1)}</div>
                      <div className="text-xs text-white/70">kg CO₂</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items - Mobile Optimized */}
          <div className="space-y-4 mb-4 md:mb-8">
            {/* Mobile: Compact Cart Items */}
            <div className="lg:hidden">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
                      <ShoppingCart className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">Daftar ({cartItems.length})</h3>
                  </div>
                  {cartItems.length > 0 && (
                    <Button
                      onClick={clearCart}
                      className="bg-red-500/30 border border-red-400/30 rounded-lg text-red-200 hover:bg-red-500/40 px-2 py-1 h-7"
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-8 w-8 text-white/40 mx-auto mb-2" />
                    <p className="text-sm text-white/70">Kalkulator kosong</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-white/5 border border-white/20 rounded-lg">
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white truncate">{item.nameId}</div>
                          <div className="text-xs text-white/60">{item.weight.toFixed(1)} kg • {item.totalPoints}p</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => updateWeight(item.id, item.weight - 0.5)}
                            disabled={item.weight <= 0.5}
                            className="h-6 w-6 p-0 bg-white/10 border border-white/30 rounded text-white"
                            variant="ghost"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-white w-8 text-center">{item.weight.toFixed(1)}</span>
                          <Button
                            onClick={() => updateWeight(item.id, item.weight + 0.5)}
                            className="h-6 w-6 p-0 bg-white/10 border border-white/30 rounded text-white"
                            variant="ghost"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0 bg-red-500/30 border border-red-400/30 rounded text-red-200 ml-1"
                            variant="ghost"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Original Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {/* Desktop Cart Items */}
              <div className="col-span-2">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Daftar Sampah ({cartItems.length})</h3>
                      </div>
                      {cartItems.length > 0 && (
                        <Button
                          onClick={clearCart}
                          className="bg-red-500/30 backdrop-blur-sm border border-red-400/30 rounded-xl text-red-200 hover:text-red-100 hover:bg-red-500/40 transition-all duration-300"
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Kosongkan
                        </Button>
                      )}
                    </div>
                  </div>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-white/40 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-white mb-2">
                      Kalkulator Kosong
                    </h3>
                    <p className="text-sm text-white/70">
                      Pilih jenis sampah untuk mulai menghitung
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-xl sm:text-2xl">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white truncate">{item.nameId}</div>
                            <div className="text-xs text-white/60">
                              {item.points} poin/kg • {item.co2Savings} CO₂/kg
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-1">
                            <Button
                              onClick={() => updateWeight(item.id, item.weight - 0.5)}
                              disabled={item.weight <= 0.5}
                              className="
                                h-7 w-7 p-0 flex-shrink-0
                                bg-white/10 backdrop-blur-sm
                                border border-white/30
                                rounded-lg
                                text-white hover:text-white
                                hover:bg-white/20
                                transition-all duration-300
                              "
                              variant="ghost"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={item.weight.toFixed(1)}
                              onChange={(e) => updateWeight(item.id, parseFloat(e.target.value) || 0)}
                              className="w-14 sm:w-16 h-7 text-center text-xs flex-shrink-0 bg-white/10 backdrop-blur-sm border-white/30 text-white"
                            />
                            <Button
                              onClick={() => updateWeight(item.id, item.weight + 0.5)}
                              className="
                                h-7 w-7 p-0 flex-shrink-0
                                bg-white/10 backdrop-blur-sm
                                border border-white/30
                                rounded-lg
                                text-white hover:text-white
                                hover:bg-white/20
                                transition-all duration-300
                              "
                              variant="ghost"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-semibold text-emerald-300 text-sm">
                              {item.totalPoints}p
                            </div>
                            <div className="text-xs text-cyan-300">
                              {item.totalCO2.toFixed(1)} CO₂
                            </div>
                            <Button
                              onClick={() => removeFromCart(item.id)}
                              className="
                                text-red-300 hover:text-red-200 mt-1 h-6 w-6 p-0
                                bg-red-500/20 backdrop-blur-sm
                                border border-red-400/30
                                rounded-lg
                                hover:bg-red-500/30
                                transition-all duration-300
                              "
                              variant="ghost"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tips & Info */}
            <div className="col-span-1 lg:col-span-1 space-y-4">
              {/* Tips for Selected Waste */}
              {selectedWasteId && (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl">
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                        <Lightbulb className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">Tips {wasteTypes.find(w => w.id === selectedWasteId)?.nameId}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {wasteTypes.find(w => w.id === selectedWasteId)?.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-300 mt-1 text-sm">💡</span>
                        <p className="text-xs text-white/80 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Action */}
              {totalWeight > 0 && (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white">🎯 Siap Pickup?</h3>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-300">{totalPoints}</div>
                      <div className="text-xs text-white/70">Poin Menunggu</div>
                    </div>
                    <Button
                      onClick={() => window.location.href = '/pickup'}
                      className="
                        w-full 
                        bg-gradient-to-r from-emerald-500 to-green-500
                        hover:from-emerald-400 hover:to-green-400
                        text-white font-bold
                        rounded-2xl
                        shadow-lg hover:shadow-xl
                        transform hover:scale-[1.02]
                        transition-all duration-300
                        border-0
                      "
                      size="sm"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Request Pickup
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Impact - Mobile Optimized */}
          {totalWeight > 0 && (
            <div>
              {/* Mobile: Compact Impact */}
              <div className="lg:hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-2">
                      <Leaf className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">Dampak Lingkungan</h3>
                  </div>
                  <Button
                    onClick={() => window.location.href = '/pickup'}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-lg px-3 py-1 text-xs"
                  >
                    Pickup Sekarang
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <div className="font-semibold text-emerald-300 text-lg">{totalWeight.toFixed(1)} kg</div>
                    <div className="text-xs text-white/70">Sampah</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg">
                    <div className="font-semibold text-cyan-300 text-lg">{Math.ceil(totalCO2 / 22)} 🌳</div>
                    <div className="text-xs text-white/70">Pohon</div>
                  </div>
                </div>
              </div>

              {/* Desktop: Full Impact */}
              <div className="hidden lg:block backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Dampak Lingkungan & Estimasi Nilai</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Recycle className="h-6 w-6 text-emerald-300" />
                    </div>
                    <div className="font-semibold text-white">{totalWeight.toFixed(1)} kg</div>
                    <div className="text-sm text-white/70">Sampah Tidak ke TPA</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div className="font-semibold text-cyan-300">{Math.ceil(totalCO2 / 22)} 🌳</div>
                    <div className="text-sm text-white/70">Setara Tanam Pohon</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="h-6 w-6 text-purple-300" />
                    </div>
                    <div className="font-semibold text-purple-300">Rp{estimatedValue.toLocaleString()}</div>
                    <div className="text-sm text-white/70">Potensi Penghasilan</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-emerald-300" />
                    </div>
                    <div className="font-semibold text-emerald-300">{totalPoints} Poin</div>
                    <div className="text-sm text-white/70">Total Reward</div>
                  </div>
                </div>
              </div>
            </div>
          )}
            </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default Cart;