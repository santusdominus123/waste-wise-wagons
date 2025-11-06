import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Gift, 
  Star, 
  Trophy, 
  Zap, 
  ShoppingBag, 
  Crown, 
  Target, 
  Award,
  Coins,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  is_active: boolean;
}

interface UserPoints {
  total: number;
}

const Rewards = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints>({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRewardsData();
    }
  }, [user]);

  const fetchRewardsData = async () => {
    try {
      // Fetch available rewards
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      setRewards(rewardsData || []);

      // Fetch user's total points
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('points_earned, points_used')
        .eq('user_id', user?.id);

      const totalEarned = pointsData?.reduce((sum, p) => sum + p.points_earned, 0) || 0;
      const totalUsed = pointsData?.reduce((sum, p) => sum + p.points_used, 0) || 0;
      
      setUserPoints({ total: totalEarned - totalUsed });
    } catch (error) {
      console.error('Error fetching rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: string, pointsRequired: number) => {
    if (userPoints.total < pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points to redeem this reward.",
        variant: "destructive",
      });
      return;
    }

    setRedeeming(rewardId);

    try {
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user?.id,
          reward_id: rewardId,
          points_used: pointsRequired,
        });

      if (redemptionError) throw redemptionError;

      // Record points usage
      const { error: pointsError } = await supabase
        .from('user_points')
        .insert({
          user_id: user?.id,
          transaction_type: 'used',
          points_used: pointsRequired,
          description: 'Points used for reward redemption',
        });

      if (pointsError) throw pointsError;

      toast({
        title: "Success",
        description: "Reward redeemed successfully! You'll receive details soon.",
      });

      fetchRewardsData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Memuat rewards...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Mock rewards data untuk demo
  const mockRewards = [
    { id: '1', name: 'Voucher Belanja 50k', description: 'Voucher belanja di minimarket terdekat', points_required: 500, category: 'voucher', icon: '🛒' },
    { id: '2', name: 'Tumbler Eksklusif', description: 'Tumbler ramah lingkungan dengan design unik', points_required: 800, category: 'merchandise', icon: '🥤' },
    { id: '3', name: 'Diskon Uber 25%', description: 'Potongan harga transportasi online', points_required: 300, category: 'transport', icon: '🚗' },
    { id: '4', name: 'Bibit Pohon Gratis', description: 'Paket bibit pohon untuk ditanam di rumah', points_required: 200, category: 'environmental', icon: '🌱' },
    { id: '5', name: 'Voucher Makanan 100k', description: 'Voucher makan di restaurant partner', points_required: 1000, category: 'voucher', icon: '🍽️' },
    { id: '6', name: 'Tas Belanja Ramah Lingkungan', description: 'Tas belanja yang bisa digunakan berulang kali', points_required: 600, category: 'merchandise', icon: '👜' },
  ];

  const { t } = useLanguage();
  const displayRewards = rewards.length > 0 ? rewards : mockRewards;
  
  // Group rewards by category
  const groupedRewards = displayRewards.reduce((groups: any, reward) => {
    const category = (reward as any).category || 'general';
    if (!groups[category]) groups[category] = [];
    groups[category].push(reward);
    return groups;
  }, {});

  const categories = {
    voucher: { name: 'Voucher & Diskon', icon: ShoppingBag, color: 'bg-blue-100 text-blue-800' },
    merchandise: { name: 'Merchandise', icon: Gift, color: 'bg-purple-100 text-purple-800' },
    transport: { name: 'Transportasi', icon: Target, color: 'bg-green-100 text-green-800' },
    environmental: { name: 'Lingkungan', icon: Award, color: 'bg-emerald-100 text-emerald-800' },
    general: { name: 'Umum', icon: Star, color: 'bg-gray-100 text-gray-800' }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Rewards & Hadiah
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tukar poin Anda dengan berbagai hadiah menarik dan voucher berguna
          </p>
        </div>

        {/* Top Section - Points Balance & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Points Balance - Larger Card */}
          <div className="md:col-span-2">
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Coins className="h-6 w-6 mr-2" />
                  Total Poin Anda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  {userPoints.total.toLocaleString()}
                </div>
                <div className="flex items-center space-x-4 text-sm opacity-90">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Siap Ditukar
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +250 minggu ini
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{displayRewards.length}</div>
                <div className="text-sm text-gray-600">Hadiah Tersedia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Sudah Ditukar</div>
              </CardContent>
            </Card>
          </div>

          {/* Next Reward Progress */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Target className="h-4 w-4 mr-2 text-orange-600" />
                  Target Berikutnya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-medium">Voucher Belanja 50k</div>
                  <Progress value={(userPoints.total / 500) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{userPoints.total} poin</span>
                    <span>500 poin</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Tabbed Interface */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="voucher">Voucher</TabsTrigger>
            <TabsTrigger value="merchandise">Barang</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="environmental">Lingkungan</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
              const categoryRewards = groupedRewards[categoryKey];
              if (!categoryRewards || categoryRewards.length === 0) return null;

              return (
                <div key={categoryKey}>
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg ${categoryInfo.color} mr-3`}>
                      <categoryInfo.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{categoryInfo.name}</h3>
                    <Badge variant="secondary" className="ml-2">{categoryRewards.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {categoryRewards.map((reward: any) => {
                      const canRedeem = userPoints.total >= reward.points_required;
                      const isRedeeming = redeeming === reward.id;
                      const progressPercentage = Math.min((userPoints.total / reward.points_required) * 100, 100);

                      return (
                        <Card key={reward.id} className={`transition-all hover:shadow-lg ${!canRedeem ? 'opacity-75' : 'hover:scale-105'}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="text-3xl mb-2">{reward.icon || '🎁'}</div>
                              {canRedeem && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Siap
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-base font-semibold leading-tight">
                              {reward.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600 line-clamp-2">
                              {reward.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {/* Points Required */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Dibutuhkan:</span>
                              <Badge variant={canRedeem ? "default" : "secondary"}>
                                {reward.points_required.toLocaleString()} poin
                              </Badge>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                              <Progress value={progressPercentage} className="h-2" />
                              <div className="text-xs text-gray-500 text-center">
                                {progressPercentage.toFixed(0)}% tercapai
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button
                              onClick={() => redeemReward(reward.id, reward.points_required)}
                              disabled={!canRedeem || isRedeeming}
                              className={`w-full ${
                                canRedeem 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              }`}
                              size="sm"
                            >
                              {isRedeeming ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Menukar...
                                </>
                              ) : canRedeem ? (
                                <>
                                  <Gift className="mr-2 h-3 w-3" />
                                  Tukar Sekarang
                                </>
                              ) : (
                                <>
                                  <Star className="mr-2 h-3 w-3" />
                                  Butuh {(reward.points_required - userPoints.total).toLocaleString()} lagi
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Individual Category Tabs */}
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => (
            <TabsContent key={categoryKey} value={categoryKey}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(groupedRewards[categoryKey] || []).map((reward: any) => {
                  const canRedeem = userPoints.total >= reward.points_required;
                  const isRedeeming = redeeming === reward.id;

                  return (
                    <Card key={reward.id} className={`transition-all hover:shadow-lg ${!canRedeem ? 'opacity-75' : 'hover:scale-105'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="text-4xl">{reward.icon || '🎁'}</div>
                          {canRedeem && <Badge className="bg-green-100 text-green-800">Tersedia</Badge>}
                        </div>
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Harga:</span>
                          <Badge variant={canRedeem ? "default" : "secondary"}>
                            {reward.points_required.toLocaleString()} poin
                          </Badge>
                        </div>
                        
                        <Button
                          onClick={() => redeemReward(reward.id, reward.points_required)}
                          disabled={!canRedeem || isRedeeming}
                          className={`w-full ${
                            canRedeem 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {isRedeeming ? (
                            <>Loading...</>
                          ) : canRedeem ? (
                            <>Tukar Sekarang</>
                          ) : (
                            <>Poin Tidak Cukup</>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Penukaran</CardTitle>
                <CardDescription>Daftar hadiah yang sudah Anda tukar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1,2,3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🎁</div>
                        <div>
                          <div className="font-medium">Voucher Belanja 50k</div>
                          <div className="text-sm text-gray-600">Ditukar 3 hari yang lalu</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selesai
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Rewards;