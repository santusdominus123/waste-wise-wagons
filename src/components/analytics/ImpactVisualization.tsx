import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Leaf, 
  Globe, 
  Droplets, 
  Zap, 
  TreePine, 
  Wind, 
  Recycle,
  TrendingUp 
} from 'lucide-react';
import '@/styles/elegant-theme.css';

interface EnvironmentalMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  description: string;
  trend: number;
}

interface CarbonData {
  month: string;
  prevented: number;
  saved: number;
  target: number;
  efficiency: number;
}

interface RecyclingBreakdown {
  material: string;
  recycled: number;
  landfill: number;
  incinerated: number;
  color: string;
}

const ImpactVisualization = () => {
  const [environmentalMetrics, setEnvironmentalMetrics] = useState<EnvironmentalMetric[]>([]);
  const [carbonData, setCarbonData] = useState<CarbonData[]>([]);
  const [recyclingData, setRecyclingData] = useState<RecyclingBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateImpactData();
  }, []);

  const generateImpactData = () => {
    setLoading(true);
    
    setTimeout(() => {
      setEnvironmentalMetrics([
        {
          name: 'CO₂ Emissions Prevented',
          value: 1250,
          target: 1500,
          unit: 'tons',
          icon: Globe,
          color: '#10b981',
          description: 'Carbon emissions avoided through proper waste management',
          trend: 15.2
        },
        {
          name: 'Trees Equivalent Saved',
          value: 2800,
          target: 3000,
          unit: 'trees',
          icon: TreePine,
          color: '#059669',
          description: 'Number of trees saved from CO₂ reduction',
          trend: 12.8
        },
        {
          name: 'Water Conservation',
          value: 85000,
          target: 100000,
          unit: 'liters',
          icon: Droplets,
          color: '#06b6d4',
          description: 'Water saved through recycling processes',
          trend: 8.7
        },
        {
          name: 'Energy Conservation',
          value: 45000,
          target: 50000,
          unit: 'kWh',
          icon: Zap,
          color: '#f59e0b',
          description: 'Energy saved compared to virgin material production',
          trend: 18.9
        },
        {
          name: 'Air Quality Improvement',
          value: 95,
          target: 100,
          unit: '%',
          icon: Wind,
          color: '#6366f1',
          description: 'Reduction in air pollutants from waste processing',
          trend: 5.3
        },
        {
          name: 'Recycling Rate',
          value: 78.5,
          target: 85,
          unit: '%',
          icon: Recycle,
          color: '#8b5cf6',
          description: 'Percentage of waste successfully recycled',
          trend: 11.2
        }
      ]);

      setCarbonData([
        { month: 'Jan', prevented: 180, saved: 150, target: 200, efficiency: 75 },
        { month: 'Feb', prevented: 220, saved: 180, target: 250, efficiency: 72 },
        { month: 'Mar', prevented: 280, saved: 240, target: 300, efficiency: 80 },
        { month: 'Apr', prevented: 320, saved: 280, target: 350, efficiency: 82 },
        { month: 'May', prevented: 380, saved: 320, target: 400, efficiency: 80 },
        { month: 'Jun', prevented: 450, saved: 380, target: 450, efficiency: 84 },
      ]);

      setRecyclingData([
        { material: 'Plastic', recycled: 65, landfill: 25, incinerated: 10, color: '#3b82f6' },
        { material: 'Paper', recycled: 80, landfill: 15, incinerated: 5, color: '#10b981' },
        { material: 'Glass', recycled: 90, landfill: 8, incinerated: 2, color: '#06b6d4' },
        { material: 'Metal', recycled: 95, landfill: 4, incinerated: 1, color: '#f59e0b' },
        { material: 'Organic', recycled: 45, landfill: 40, incinerated: 15, color: '#059669' },
        { material: 'Electronic', recycled: 70, landfill: 20, incinerated: 10, color: '#8b5cf6' },
      ]);

      setLoading(false);
    }, 1000);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="elegant-stats-card p-3 border shadow-lg">
          <p className="elegant-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="elegant-text-secondary text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
              {entry.unit && ` ${entry.unit}`}
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

  return (
    <div className="space-y-8">
      {/* Environmental Impact Metrics */}
      <div className="elegant-grid elegant-grid-3 gap-6">
        {environmentalMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const progress = (metric.value / metric.target) * 100;
          
          return (
            <Card key={metric.name} className="elegant-card elegant-hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="elegant-icon-secondary w-12 h-12" style={{ backgroundColor: `${metric.color}20` }}>
                      <IconComponent className="h-6 w-6" style={{ color: metric.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold elegant-text-primary text-sm">{metric.name}</h3>
                      <p className="elegant-text-muted text-xs">{metric.description}</p>
                    </div>
                  </div>
                  <Badge className={metric.trend > 0 ? 'elegant-badge-success' : 'elegant-badge'}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{metric.trend}%
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold elegant-heading-primary">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className="elegant-text-secondary text-sm">
                        of {metric.target.toLocaleString()} {metric.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold" style={{ color: metric.color }}>
                        {progress.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Carbon Impact Chart */}
      <Card className="elegant-card elegant-hover-lift">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="elegant-icon-secondary w-10 h-10">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="elegant-heading-secondary">Carbon Impact Timeline</CardTitle>
              <CardDescription className="elegant-text-muted">
                CO₂ emissions prevented and efficiency over time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" />
              <YAxis yAxisId="right" orientation="right" stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar yAxisId="left" dataKey="prevented" fill="#10b981" name="CO₂ Prevented (tons)" />
              <Bar yAxisId="left" dataKey="saved" fill="#059669" name="CO₂ Saved (tons)" />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="target"
                fill="rgba(16, 185, 129, 0.1)"
                stroke="rgba(16, 185, 129, 0.3)"
                name="Target"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                name="Efficiency %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recycling Breakdown */}
      <div className="elegant-grid elegant-grid-2 gap-6">
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="elegant-icon-secondary w-10 h-10">
                <Recycle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="elegant-heading-secondary">Recycling Efficiency</CardTitle>
                <CardDescription className="elegant-text-muted">
                  Waste processing breakdown by material
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recyclingData.map((item) => (
                <div key={item.material} className="elegant-stats-card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold elegant-text-primary">{item.material}</h4>
                    <Badge className="elegant-badge" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.recycled}% recycled
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="elegant-text-secondary">Recycled</span>
                      <span className="font-medium" style={{ color: item.color }}>{item.recycled}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="elegant-text-secondary">Landfill</span>
                      <span className="font-medium text-orange-600">{item.landfill}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="elegant-text-secondary">Incinerated</span>
                      <span className="font-medium text-red-600">{item.incinerated}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex rounded overflow-hidden h-2">
                    <div 
                      className="h-full" 
                      style={{ backgroundColor: item.color, width: `${item.recycled}%` }}
                    ></div>
                    <div 
                      className="h-full bg-orange-500" 
                      style={{ width: `${item.landfill}%` }}
                    ></div>
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${item.incinerated}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Score */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="elegant-icon-secondary w-10 h-10">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="elegant-heading-secondary">Environmental Score</CardTitle>
                <CardDescription className="elegant-text-muted">
                  Overall sustainability rating
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Achieved', value: 78.5, color: '#10b981' },
                      { name: 'Remaining', value: 21.5, color: '#e5e7eb' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold elegant-heading-primary">78.5</div>
                  <div className="elegant-text-secondary text-sm">Eco Score</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="elegant-text-secondary">Carbon Reduction</span>
                <span className="font-medium text-green-600">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="elegant-text-secondary">Recycling Rate</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="elegant-text-secondary">Energy Efficiency</span>
                <span className="font-medium text-blue-600">Very Good</span>
              </div>
              <div className="flex justify-between">
                <span className="elegant-text-secondary">Water Conservation</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpactVisualization;