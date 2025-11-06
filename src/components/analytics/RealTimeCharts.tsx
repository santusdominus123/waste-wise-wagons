import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import '@/styles/elegant-theme.css';

interface RealTimeData {
  timestamp: string;
  activeUsers: number;
  pickupsInProgress: number;
  pointsEarned: number;
  wasteCollected: number;
}

interface LiveMetric {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
}

const RealTimeCharts = () => {
  const { user } = useAuth();
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 3000);

    setIsConnected(true);
    updateRealTimeData();

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const updateRealTimeData = () => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    
    // Generate realistic fluctuating data
    const newDataPoint: RealTimeData = {
      timestamp,
      activeUsers: 450 + Math.floor(Math.random() * 100 - 50),
      pickupsInProgress: 25 + Math.floor(Math.random() * 20 - 10),
      pointsEarned: 1200 + Math.floor(Math.random() * 400 - 200),
      wasteCollected: 850 + Math.floor(Math.random() * 200 - 100),
    };

    setRealTimeData(prev => {
      const updated = [...prev, newDataPoint].slice(-20); // Keep last 20 points
      return updated;
    });

    // Update live metrics with change calculations
    if (realTimeData.length > 0) {
      const previous = realTimeData[realTimeData.length - 1];
      setLiveMetrics([
        {
          label: 'Active Users',
          value: newDataPoint.activeUsers,
          change: newDataPoint.activeUsers - previous.activeUsers,
          icon: Activity,
          color: '#3b82f6'
        },
        {
          label: 'Live Pickups',
          value: newDataPoint.pickupsInProgress,
          change: newDataPoint.pickupsInProgress - previous.pickupsInProgress,
          icon: TrendingUp,
          color: '#10b981'
        },
        {
          label: 'Points/Hour',
          value: newDataPoint.pointsEarned,
          change: newDataPoint.pointsEarned - previous.pointsEarned,
          icon: Zap,
          color: '#f59e0b'
        },
        {
          label: 'Waste (kg/hour)',
          value: newDataPoint.wasteCollected,
          change: newDataPoint.wasteCollected - previous.wasteCollected,
          icon: Clock,
          color: '#8b5cf6'
        },
      ]);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="elegant-stats-card p-3 border shadow-lg">
          <p className="elegant-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="elegant-text-secondary text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="elegant-heading-secondary text-xl">Real-Time Analytics</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="elegant-text-muted text-sm">
            {isConnected ? 'Live Data Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Live Metrics Cards */}
      <div className="elegant-grid elegant-grid-4 gap-4 mb-6">
        {liveMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <Card key={metric.label} className="elegant-card elegant-hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="elegant-icon-secondary w-8 h-8">
                    <IconComponent className="h-4 w-4" style={{ color: metric.color }} />
                  </div>
                  <Badge className={isPositive ? 'elegant-badge-success' : 'bg-red-100 text-red-800'}>
                    {isPositive ? '+' : ''}{metric.change}
                  </Badge>
                </div>
                <div className="text-xl font-bold elegant-heading-primary mb-1">
                  {formatNumber(metric.value)}
                </div>
                <div className="elegant-text-secondary text-xs">{metric.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-Time Charts */}
      <div className="elegant-grid elegant-grid-2 gap-6">
        {/* Active Users Chart */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="elegant-icon-secondary w-8 h-8">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="elegant-heading-secondary text-base">User Activity</CardTitle>
                <CardDescription className="elegant-text-muted text-sm">Active users over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="timestamp" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pickups In Progress */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="elegant-icon-secondary w-8 h-8">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="elegant-heading-secondary text-base">Live Pickups</CardTitle>
                <CardDescription className="elegant-text-muted text-sm">Ongoing collections</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={realTimeData}>
                <defs>
                  <linearGradient id="colorPickups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="pickupsInProgress"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorPickups)"
                  name="Active Pickups"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Points Per Hour */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="elegant-icon-secondary w-8 h-8">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="elegant-heading-secondary text-base">Points Flow</CardTitle>
                <CardDescription className="elegant-text-muted text-sm">Points earned per hour</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={realTimeData.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="timestamp" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pointsEarned" fill="#f59e0b" name="Points" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waste Collection Rate */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="elegant-icon-secondary w-8 h-8">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="elegant-heading-secondary text-base">Collection Rate</CardTitle>
                <CardDescription className="elegant-text-muted text-sm">Waste collected per hour</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="timestamp" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="wasteCollected"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                  name="Waste (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="elegant-card elegant-hover-lift">
        <CardHeader>
          <CardTitle className="elegant-heading-secondary">Performance Summary</CardTitle>
          <CardDescription className="elegant-text-muted">Current session statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="elegant-grid elegant-grid-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold elegant-heading-primary mb-1">
                {realTimeData.length > 0 ? formatNumber(realTimeData[realTimeData.length - 1]?.activeUsers || 0) : '0'}
              </div>
              <div className="elegant-text-secondary text-sm">Peak Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold elegant-heading-primary mb-1">
                {realTimeData.reduce((sum, d) => sum + d.pickupsInProgress, 0)}
              </div>
              <div className="elegant-text-secondary text-sm">Total Pickups</div>
            </div>
            <div>
              <div className="text-2xl font-bold elegant-heading-primary mb-1">
                {formatNumber(realTimeData.reduce((sum, d) => sum + d.pointsEarned, 0))}
              </div>
              <div className="elegant-text-secondary text-sm">Points Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold elegant-heading-primary mb-1">
                {formatNumber(realTimeData.reduce((sum, d) => sum + d.wasteCollected, 0))}
              </div>
              <div className="elegant-text-secondary text-sm">Waste Collected (kg)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeCharts;