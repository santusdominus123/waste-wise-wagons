import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Leaf,
  Recycle,
  Globe,
  Users,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import RealTimeCharts from './RealTimeCharts';
import ImpactVisualization from './ImpactVisualization';
import '@/styles/elegant-theme.css';
import '@/styles/horizontal-scroll.css';

interface AnalyticsData {
  wasteTrends: any[];
  wasteTypes: any[];
  monthlyStats: any[];
  environmentalImpact: any[];
  userEngagement: any[];
  regionalData: any[];
}

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    generateAnalyticsData();
  }, [timeRange]);

  const generateAnalyticsData = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const data: AnalyticsData = {
        wasteTrends: [
          { date: '2024-01-01', plastic: 450, paper: 320, glass: 180, metal: 90, organic: 280, electronic: 45 },
          { date: '2024-01-02', plastic: 520, paper: 380, glass: 220, metal: 110, organic: 320, electronic: 55 },
          { date: '2024-01-03', plastic: 480, paper: 350, glass: 200, metal: 95, organic: 300, electronic: 48 },
          { date: '2024-01-04', plastic: 600, paper: 420, glass: 250, metal: 130, organic: 380, electronic: 65 },
          { date: '2024-01-05', plastic: 550, paper: 400, glass: 230, metal: 120, organic: 350, electronic: 60 },
          { date: '2024-01-06', plastic: 680, paper: 480, glass: 280, metal: 150, organic: 420, electronic: 75 },
          { date: '2024-01-07', plastic: 720, paper: 520, glass: 310, metal: 160, organic: 460, electronic: 80 },
        ],
        wasteTypes: [
          { name: 'Plastik', value: 3820, color: '#3b82f6', percentage: 35.2 },
          { name: 'Organik', value: 2510, color: '#10b981', percentage: 23.1 },
          { name: 'Kertas', value: 2870, color: '#f59e0b', percentage: 26.4 },
          { name: 'Kaca', value: 1670, color: '#06b6d4', percentage: 15.4 },
          { name: 'Logam', value: 855, color: '#6366f1', percentage: 7.9 },
          { name: 'Elektronik', value: 433, color: '#8b5cf6', percentage: 4.0 },
        ],
        monthlyStats: [
          { month: 'Jan', pickups: 1200, points: 24000, weight: 3200, users: 450 },
          { month: 'Feb', pickups: 1350, points: 27000, weight: 3600, users: 520 },
          { month: 'Mar', pickups: 1500, points: 30000, weight: 4000, users: 580 },
          { month: 'Apr', pickups: 1680, points: 33600, weight: 4480, users: 640 },
          { month: 'May', pickups: 1820, points: 36400, weight: 4860, users: 720 },
          { month: 'Jun', pickups: 2100, points: 42000, weight: 5600, users: 850 },
        ],
        environmentalImpact: [
          { category: 'CO2 Saved', value: 850, target: 1000, unit: 'tons', icon: Globe },
          { category: 'Trees Saved', value: 1250, target: 1500, unit: 'trees', icon: Leaf },
          { category: 'Water Saved', value: 45000, target: 50000, unit: 'liters', icon: Activity },
          { category: 'Energy Saved', value: 12500, target: 15000, unit: 'kWh', icon: Target },
        ],
        userEngagement: [
          { metric: 'Active Users', current: 850, previous: 720, growth: 18.1 },
          { metric: 'Avg Points/User', current: 1250, previous: 1100, growth: 13.6 },
          { metric: 'Retention Rate', current: 78.5, previous: 74.2, growth: 5.8 },
          { metric: 'Daily Pickups', current: 45, previous: 38, growth: 18.4 },
        ],
        regionalData: [
          { region: 'North', plastic: 120, paper: 80, glass: 45, metal: 25, organic: 90, electronic: 15 },
          { region: 'South', plastic: 100, paper: 95, glass: 50, metal: 30, organic: 85, electronic: 20 },
          { region: 'East', plastic: 90, paper: 75, glass: 40, metal: 20, organic: 70, electronic: 12 },
          { region: 'West', plastic: 110, paper: 85, glass: 55, metal: 35, organic: 95, electronic: 18 },
          { region: 'Central', plastic: 130, paper: 105, glass: 60, metal: 40, organic: 110, electronic: 25 },
        ],
      };
      
      setAnalyticsData(data);
      setLoading(false);
    }, 1000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="elegant-stats-card p-3 border shadow-lg">
          <p className="elegant-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="elegant-text-secondary text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span> {formatNumber(entry.value)}
              {entry.name.includes('Weight') ? ' kg' : 
               entry.name.includes('Points') ? ' pts' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="elegant-stats-card p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Simplified for mobile */}
      <div className="text-center mb-3 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-white/90 mb-1 md:mb-2">Dashboard Analitik</h2>
        <p className="text-white/70 text-xs md:text-sm mb-3 md:mb-6">Wawasan real-time tentang pengelolaan sampah</p>
        
        {/* Time Range Selector - Mobile Friendly */}
        <div className="overflow-x-auto pb-2 scroll-hidden smooth-scroll">
          <div className="flex justify-center gap-2 min-w-max px-2">
            {[
              { value: '7d', label: '7H' },
              { value: '30d', label: '30H' },
              { value: '90d', label: '90H' },
              { value: '1y', label: '1T' }
            ].map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
                className={`flex-shrink-0 text-xs h-8 px-3 rounded-xl ${
                  timeRange === range.value 
                    ? 'bg-white/20 text-white border-white/30 hover:bg-white/25' 
                    : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-3 md:space-y-4">
        {/* Mobile: Horizontal Scroll Tabs - No Borders */}
        <div className="overflow-x-auto pb-2 scroll-hidden smooth-scroll md:hidden">
          <TabsList className="flex w-max gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white px-3 py-2 text-xs flex-shrink-0 rounded-lg">
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white px-3 py-2 text-xs flex-shrink-0 rounded-lg">
              Tren
            </TabsTrigger>
            <TabsTrigger value="impact" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white px-3 py-2 text-xs flex-shrink-0 rounded-lg">
              Dampak
            </TabsTrigger>
            <TabsTrigger value="regional" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white px-3 py-2 text-xs flex-shrink-0 rounded-lg">
              Regional
            </TabsTrigger>
            <TabsTrigger value="realtime" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white px-3 py-2 text-xs flex-shrink-0 rounded-lg">
              Langsung
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Desktop: Grid Tabs - Glassmorphism */}
        <TabsList className="hidden md:grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm rounded-xl">
          <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg">
            Ringkasan
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg">
            Tren
          </TabsTrigger>
          <TabsTrigger value="impact" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg">
            Dampak
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg">
            Regional
          </TabsTrigger>
          <TabsTrigger value="realtime" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg">
            Langsung
          </TabsTrigger>
        </TabsList>

        {/* Real-Time Tab */}
        <TabsContent value="realtime" className="space-y-6 elegant-fade-in">
          <RealTimeCharts />
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3 md:space-y-4">
          {/* KPI Cards - Mobile Optimized */}
          <div className="overflow-x-auto pb-3 scroll-hidden smooth-scroll md:overflow-visible md:pb-0">
            <div className="flex gap-3 min-w-max md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4">
              {analyticsData.userEngagement.map((metric, index) => (
                <div key={metric.metric} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 w-44 md:w-auto flex-shrink-0 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <Badge className={`text-xs px-2 py-1 rounded-full ${
                      metric.growth > 0 
                        ? 'bg-green-500/20 text-green-200' 
                        : 'bg-red-500/20 text-red-200'
                    }`}>
                      {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-white mb-1">
                    {formatNumber(metric.current)}
                    {metric.metric === 'Retention Rate' ? '%' : ''}
                  </div>
                  <div className="text-white/70 text-xs md:text-sm">
                    {metric.metric === 'Active Users' ? 'Pengguna Aktif' :
                     metric.metric === 'Avg Points/User' ? 'Rata-rata Poin/Pengguna' :
                     metric.metric === 'Retention Rate' ? 'Tingkat Retensi' :
                     metric.metric === 'Daily Pickups' ? 'Penjemputan Harian' :
                     metric.metric}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Grid - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {/* Waste Distribution Pie Chart */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white">Distribusi Sampah</h3>
                  <p className="text-xs md:text-sm text-white/70">Berdasarkan kategori periode ini</p>
                </div>
              </div>
              
              <div className="h-48 md:h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.wasteTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.wasteTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                              <p className="text-xs font-semibold text-gray-800">{data.name}</p>
                              <p className="text-xs text-gray-600">{data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend - Horizontal Scroll */}
              <div className="mt-2 overflow-x-auto pb-2 scroll-hidden smooth-scroll">
                <div className="flex gap-3 min-w-max">
                  {analyticsData.wasteTypes.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-1.5 flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs text-white/70">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white">Kinerja Bulanan</h3>
                  <p className="text-xs md:text-sm text-white/70">Penjemputan dan berat dari waktu ke waktu</p>
                </div>
              </div>
              
              <div className="h-48 md:h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={10} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={10} />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                              <p className="text-xs font-semibold text-gray-800 mb-1">{label}</p>
                              {payload.map((entry: any, index: number) => (
                                <p key={index} className="text-xs text-gray-600">
                                  <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
                                  {entry.name.includes('Weight') ? ' kg' : ''}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="pickups" fill="#3b82f6" name="Penjemputan" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="weight" fill="#10b981" name="Berat" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-3 md:space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center space-x-2 md:space-x-3 mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-white">Tren Pengumpulan Sampah</h3>
                <p className="text-xs md:text-sm text-white/70">Pengumpulan sampah harian berdasarkan kategori</p>
              </div>
            </div>
            
            <div className="h-56 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.wasteTrends}>
                  <defs>
                    <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPaper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={10}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                  />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={10} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                            <p className="text-xs font-semibold text-gray-800 mb-1">
                              {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            {payload.map((entry: any, index: number) => (
                              <p key={index} className="text-xs text-gray-600">
                                <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value} kg
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="plastic"
                    stackId="1"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorPlastic)"
                    name="Plastik"
                  />
                  <Area
                    type="monotone"
                    dataKey="paper"
                    stackId="1"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorPaper)"
                    name="Kertas"
                  />
                  <Area
                    type="monotone"
                    dataKey="organic"
                    stackId="1"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorOrganic)"
                    name="Organik"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend for mobile */}
            <div className="mt-2 flex gap-4 justify-center">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-white/70">Plastik</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-white/70">Kertas</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-white/70">Organik</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Environmental Impact Tab */}
        <TabsContent value="impact" className="space-y-6 elegant-fade-in">
          <ImpactVisualization />
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-4 lg:space-y-6 elegant-fade-in">
          <Card className="elegant-card elegant-hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="elegant-icon-secondary w-8 h-8 lg:w-10 lg:h-10">
                  <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div>
                  <CardTitle className="elegant-heading-secondary text-sm lg:text-base">Regional Analysis</CardTitle>
                  <CardDescription className="elegant-text-muted text-xs lg:text-sm">Waste collection by region</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analyticsData.regionalData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="region" fontSize={12} />
                    <PolarRadiusAxis angle={90} domain={[0, 150]} fontSize={12} />
                    <Radar
                      name="Plastic"
                      dataKey="plastic"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Paper"
                      dataKey="paper"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Organic"
                      dataKey="organic"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;