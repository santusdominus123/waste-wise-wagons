import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Truck, Package, Star, MapPin, AlertCircle } from 'lucide-react';
import '@/styles/elegant-theme.css';

interface PickupStatus {
  id: string;
  status: 'scheduled' | 'confirmed' | 'in_transit' | 'arrived' | 'collecting' | 'completed' | 'cancelled';
  timestamp: string;
  message?: string;
  driverName?: string;
  estimatedTime?: string;
  actualTime?: string;
  location?: string;
}

interface StatusTrackerProps {
  pickupId: string;
  currentStatus: string;
  scheduledDate: string;
  onStatusUpdate?: (newStatus: string) => void;
}

const StatusTracker = ({ pickupId, currentStatus, scheduledDate, onStatusUpdate }: StatusTrackerProps) => {
  const [statusHistory, setStatusHistory] = useState<PickupStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const statusSteps = [
    { key: 'scheduled', label: 'Scheduled', icon: Calendar, description: 'Pickup request submitted' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Driver assigned' },
    { key: 'in_transit', label: 'En Route', icon: Truck, description: 'Driver on the way' },
    { key: 'arrived', label: 'Arrived', icon: MapPin, description: 'Driver at location' },
    { key: 'collecting', label: 'Collecting', icon: Package, description: 'Waste collection in progress' },
    { key: 'completed', label: 'Completed', icon: Star, description: 'Pickup completed successfully' },
  ];

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const getProgressPercentage = () => {
    const currentIndex = getStatusIndex(currentStatus);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'elegant-badge-secondary';
      case 'confirmed': return 'elegant-badge';
      case 'in_transit': return 'elegant-badge';
      case 'arrived': return 'bg-yellow-100 text-yellow-800';
      case 'collecting': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'elegant-badge-success';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstimatedArrival = () => {
    const scheduled = new Date(scheduledDate);
    if (currentStatus === 'in_transit') {
      const eta = new Date(scheduled);
      eta.setMinutes(eta.getMinutes() + 15);
      return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const simulateStatusUpdate = () => {
    if (loading) return;
    
    setLoading(true);
    const currentIndex = getStatusIndex(currentStatus);
    
    setTimeout(() => {
      const nextIndex = Math.min(currentIndex + 1, statusSteps.length - 1);
      const nextStatus = statusSteps[nextIndex];
      
      if (nextStatus && onStatusUpdate) {
        onStatusUpdate(nextStatus.key);
        
        const newStatusUpdate: PickupStatus = {
          id: `status-${Date.now()}`,
          status: nextStatus.key as any,
          timestamp: new Date().toISOString(),
          message: `Status updated to ${nextStatus.label}`,
          driverName: 'John Driver',
          estimatedTime: getEstimatedArrival(),
        };
        
        setStatusHistory(prev => [newStatusUpdate, ...prev]);
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Initialize with current status
    const initialStatus: PickupStatus = {
      id: `initial-${pickupId}`,
      status: currentStatus as any,
      timestamp: new Date().toISOString(),
      message: `Pickup ${currentStatus.replace('_', ' ')}`,
    };
    setStatusHistory([initialStatus]);
  }, [pickupId, currentStatus]);

  if (currentStatus === 'cancelled') {
    return (
      <Card className="elegant-card">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold elegant-text-primary mb-2">Pickup Cancelled</h3>
          <p className="elegant-text-muted text-sm">This pickup request has been cancelled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="elegant-card elegant-hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="elegant-heading-secondary">Pickup Status</CardTitle>
              <CardDescription className="elegant-text-muted">
                Track your waste collection progress
              </CardDescription>
            </div>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="elegant-text-secondary text-sm">Progress</span>
                <span className="elegant-text-primary text-sm font-medium">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Status Steps */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statusSteps.map((step, index) => {
                const isCompleted = getStatusIndex(currentStatus) >= index;
                const isCurrent = step.key === currentStatus;
                const IconComponent = step.icon;
                
                return (
                  <div 
                    key={step.key} 
                    className={`elegant-stats-card p-3 text-center ${
                      isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    } ${!isCompleted ? 'opacity-60' : ''}`}
                  >
                    <div className={`elegant-icon-secondary w-8 h-8 mx-auto mb-2 ${
                      isCompleted ? 'bg-green-100' : ''
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        isCompleted ? 'text-green-600' : ''
                      }`} />
                    </div>
                    <p className="font-medium elegant-text-primary text-xs mb-1">
                      {step.label}
                    </p>
                    <p className="elegant-text-muted text-xs">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Status Info */}
            {(currentStatus === 'in_transit' || currentStatus === 'arrived') && (
              <div className="elegant-stats-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 elegant-text-muted" />
                    <span className="elegant-text-secondary text-sm">
                      {currentStatus === 'in_transit' ? 'Estimated Arrival' : 'Arrived At'}
                    </span>
                  </div>
                  <span className="elegant-text-primary font-medium">
                    {getEstimatedArrival()}
                  </span>
                </div>
                {currentStatus === 'in_transit' && (
                  <p className="elegant-text-muted text-xs mt-2">
                    Driver will arrive within the scheduled time window
                  </p>
                )}
              </div>
            )}

            {/* Demo Update Button */}
            <Button 
              onClick={simulateStatusUpdate}
              disabled={loading || currentStatus === 'completed'}
              className="elegant-btn-secondary w-full"
              variant="outline"
            >
              {loading ? (
                <>
                  <div className="elegant-loading mr-2 w-4 h-4"></div>
                  Updating...
                </>
              ) : currentStatus === 'completed' ? (
                'Pickup Completed'
              ) : (
                'Simulate Status Update'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="elegant-heading-secondary">Status History</CardTitle>
          <CardDescription className="elegant-text-muted">
            Timeline of status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusHistory.map((status, index) => {
              const StepIcon = statusSteps.find(step => step.key === status.status)?.icon || Clock;
              
              return (
                <div 
                  key={status.id} 
                  className={`flex items-start space-x-3 pb-4 ${
                    index < statusHistory.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="elegant-icon-secondary w-8 h-8 flex-shrink-0">
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium elegant-text-primary text-sm">
                        {status.message}
                      </p>
                      <Badge className={getStatusColor(status.status)} size="sm">
                        {status.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="elegant-text-muted text-xs">
                      {new Date(status.timestamp).toLocaleString()}
                    </p>
                    {status.driverName && (
                      <p className="elegant-text-secondary text-xs mt-1">
                        Driver: {status.driverName}
                      </p>
                    )}
                    {status.estimatedTime && status.status === 'in_transit' && (
                      <p className="elegant-text-secondary text-xs">
                        ETA: {status.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusTracker;