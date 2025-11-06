import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import Navigation from '@/components/layout/Navigation';
import { MapPin, Clock, Weight, CheckCircle, Truck, Activity, Map, Route, TrendingUp, Award, BarChart3, Target } from 'lucide-react';
import '@/styles/elegant-theme.css';

interface PickupRequest {
  id: string;
  pickup_address: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_weight: number;
  waste_types: string[];
  status: string;
  special_instructions: string;
  user_id: string;
  driver_id: string | null;
}

const DriverDashboard = () => {
  const { user } = useAuth();
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingPickup, setCompletingPickup] = useState<string | null>(null);
  const [driverStats, setDriverStats] = useState({
    completedPickups: 0,
    totalWeight: 0,
    totalCommission: 0,
    currentStreak: 0,
    rating: 4.8,
    monthlyTarget: 50,
    completedThisMonth: 0
  });
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    try {
      // Fetch available pickup requests (not assigned to any driver)
      const { data } = await supabase
        .from('pickup_requests')
        .select('*')
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true });

      setPickupRequests(data || []);
    } catch (error) {
      console.error('Error fetching pickup requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptPickup = async (pickupId: string) => {
    try {
      const { error } = await supabase
        .from('pickup_requests')
        .update({
          driver_id: user?.id,
          status: 'in_progress',
        })
        .eq('id', pickupId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pickup accepted successfully!",
      });

      fetchPickupRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const completePickup = async (pickupId: string, actualWeight: number) => {
    if (!actualWeight || actualWeight <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight.",
        variant: "destructive",
      });
      return;
    }

    setCompletingPickup(pickupId);

    try {
      // Update pickup request
      const { error: pickupError } = await supabase
        .from('pickup_requests')
        .update({
          status: 'completed',
          actual_weight: actualWeight,
          completed_at: new Date().toISOString(),
        })
        .eq('id', pickupId);

      if (pickupError) throw pickupError;

      // Calculate points and commission based on actual weight
      const pickup = pickupRequests.find(p => p.id === pickupId);
      if (pickup) {
        // Fetch waste rates to calculate points
        const { data: wasteRates } = await supabase
          .from('waste_rates')
          .select('*')
          .in('waste_type', pickup.waste_types as any);

        let totalPoints = 0;
        let totalCommission = 0;

        wasteRates?.forEach(rate => {
          const points = actualWeight * rate.points_per_kg;
          const commission = actualWeight * rate.commission_rate;
          totalPoints += points;
          totalCommission += commission;
        });

        // Add points to user
        await supabase
          .from('user_points')
          .insert({
            user_id: pickup.user_id,
            pickup_request_id: pickupId,
            transaction_type: 'earned',
            points_earned: Math.round(totalPoints),
            description: 'Points earned from completed pickup',
          });

        // Update pickup with calculated values
        await supabase
          .from('pickup_requests')
          .update({
            points_earned: Math.round(totalPoints),
            commission_amount: totalCommission,
          })
          .eq('id', pickupId);
      }

      toast({
        title: "Success",
        description: "Pickup completed successfully!",
      });

      fetchPickupRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCompletingPickup(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="elegant-bg min-h-screen">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="text-center">
            <div className="elegant-loading mx-auto mb-6"></div>
            <p className="elegant-text-muted text-lg">Loading pickup requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-bg min-h-screen">
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="mb-12 text-center elegant-fade-in">
          <div className="elegant-icon w-16 h-16 mx-auto mb-6">
            <Truck className="h-8 w-8" />
          </div>
          <h1 className="elegant-heading-primary text-3xl md:text-4xl mb-4">Driver Hub</h1>
          <p className="elegant-text-muted text-lg">Manage pickup requests and collections</p>
        </div>

        <div className="grid gap-8">
          {pickupRequests.length === 0 ? (
            <Card className="elegant-card elegant-hover-lift">
              <CardContent className="text-center p-12">
                <Activity className="h-16 w-16 elegant-text-muted mx-auto mb-6" />
                <p className="elegant-text-secondary text-lg">No pickup requests available</p>
                <p className="elegant-text-muted text-sm mt-2">Check back later for new collection requests</p>
              </CardContent>
            </Card>
          ) : (
            pickupRequests.map((pickup) => (
              <Card key={pickup.id} className="elegant-card elegant-hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="elegant-heading-secondary text-xl flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Pickup Request
                      </CardTitle>
                      <CardDescription className="elegant-text-muted">
                        ID: {pickup.id.slice(0, 8).toUpperCase()}
                      </CardDescription>
                    </div>
                    <Badge className={`${
                      pickup.status === 'scheduled' ? 'elegant-badge-secondary' : 
                      pickup.status === 'in_progress' ? 'elegant-badge' : 'elegant-badge-success'
                    }`}>
                      {pickup.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="elegant-grid elegant-grid-2">
                    <div className="elegant-stats-card p-4">
                      <div className="flex items-center space-x-3">
                        <div className="elegant-icon-secondary w-10 h-10">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold elegant-text-primary">Pickup Location</p>
                          <p className="elegant-text-secondary">{pickup.pickup_address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="elegant-stats-card p-4">
                      <div className="flex items-center space-x-3">
                        <div className="elegant-icon-secondary w-10 h-10">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold elegant-text-primary">Scheduled</p>
                          <p className="elegant-text-secondary">
                            {new Date(pickup.scheduled_date).toLocaleDateString()}
                            {pickup.scheduled_time && ` • ${pickup.scheduled_time}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="elegant-stats-card p-4">
                      <div className="flex items-center space-x-3">
                        <div className="elegant-icon-secondary w-10 h-10">
                          <Weight className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold elegant-text-primary">Estimated Weight</p>
                          <p className="elegant-heading-primary font-bold text-lg">{pickup.estimated_weight} KG</p>
                        </div>
                      </div>
                    </div>

                    <div className="elegant-stats-card p-4 col-span-2">
                      <div>
                        <p className="font-semibold elegant-text-primary mb-3">Waste Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {pickup.waste_types.map(type => (
                            <Badge key={type} className="elegant-badge-secondary">
                              {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {pickup.special_instructions && (
                    <div className="elegant-stats-card p-4">
                      <p className="font-semibold elegant-text-primary mb-2">Special Instructions</p>
                      <p className="elegant-text-secondary">{pickup.special_instructions}</p>
                    </div>
                  )}

                  <div className="elegant-divider"></div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    {pickup.status === 'scheduled' && (
                      <Button 
                        onClick={() => acceptPickup(pickup.id)}
                        className="elegant-btn-primary w-full sm:w-auto"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Pickup
                      </Button>
                    )}

                    {pickup.status === 'in_progress' && pickup.driver_id === user?.id && (
                      <div className="w-full space-y-4">
                        <div className="elegant-stats-card p-4">
                          <Label htmlFor={`weight-${pickup.id}`} className="elegant-label mb-3">
                            Actual Weight (KG):
                          </Label>
                          <Input
                            id={`weight-${pickup.id}`}
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="Enter actual weight"
                            className="elegant-input mb-4"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            const input = document.getElementById(`weight-${pickup.id}`) as HTMLInputElement;
                            const weight = parseFloat(input.value);
                            completePickup(pickup.id, weight);
                          }}
                          disabled={completingPickup === pickup.id}
                          className="elegant-btn-primary w-full"
                        >
                          {completingPickup === pickup.id ? (
                            <>
                              <div className="elegant-loading mr-2 w-4 h-4"></div>
                              Completing Pickup...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Pickup
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;