import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart 
} from 'recharts';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator, 
  TrendingUp, 
  Recycle,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import '@/styles/elegant-theme.css';

interface WasteItem {
  id: string;
  name: string;
  type: string;
  weight: number;
  points: number;
  multiplier: number;
  color: string;
  description: string;
  price: number; // Price per kg for environmental cost
}

interface CartItem extends WasteItem {
  quantity: number;
  totalWeight: number;
  totalPoints: number;
  totalPrice: number;
}

interface ChartData {
  name: string;
  value: number;
  points: number;
  color: string;
}

const WasteCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [availableWaste, setAvailableWaste] = useState<WasteItem[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [impactData, setImpactData] = useState<any[]>([]);
  const [selectedWaste, setSelectedWaste] = useState<string>('');
  const [inputWeight, setInputWeight] = useState<string>('');
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    initializeWasteTypes();
  }, []);

  useEffect(() => {
    updateCharts();
  }, [cartItems]);

  const initializeWasteTypes = () => {
    const wasteTypes: WasteItem[] = [
      {
        id: '1',
        name: 'Plastic Bottles',
        type: 'plastic',
        weight: 0.1,
        points: 3,
        multiplier: 1.2,
        color: '#3b82f6',
        description: 'PET bottles, containers',
        price: 2.5
      },
      {
        id: '2',
        name: 'Cardboard',
        type: 'paper',
        weight: 0.3,
        points: 2,
        multiplier: 1.5,
        color: '#f59e0b',
        description: 'Clean cardboard boxes',
        price: 1.8
      },
      {
        id: '3',
        name: 'Glass Bottles',
        type: 'glass',
        weight: 0.5,
        points: 4,
        multiplier: 1.8,
        color: '#06b6d4',
        description: 'Glass containers, bottles',
        price: 3.2
      },
      {
        id: '4',
        name: 'Aluminum Cans',
        type: 'metal',
        weight: 0.05,
        points: 5,
        multiplier: 2.0,
        color: '#6366f1',
        description: 'Aluminum beverage cans',
        price: 4.5
      },
      {
        id: '5',
        name: 'Food Waste',
        type: 'organic',
        weight: 0.2,
        points: 1,
        multiplier: 0.8,
        color: '#10b981',
        description: 'Compostable organic matter',
        price: 0.5
      },
      {
        id: '6',
        name: 'Electronics',
        type: 'electronic',
        weight: 2.0,
        points: 8,
        multiplier: 3.0,
        color: '#8b5cf6',
        description: 'Old phones, batteries',
        price: 15.0
      },
      {
        id: '7',
        name: 'Textiles',
        type: 'textile',
        weight: 0.8,
        points: 6,
        multiplier: 1.3,
        color: '#ec4899',
        description: 'Clean clothing, fabrics',
        price: 2.8
      },
      {
        id: '8',
        name: 'Mixed Paper',
        type: 'paper',
        weight: 0.1,
        points: 2,
        multiplier: 1.1,
        color: '#f97316',
        description: 'Newspapers, magazines',
        price: 1.2
      }
    ];

    setAvailableWaste(wasteTypes);
  };

  const addToCart = () => {
    if (!selectedWaste || !inputWeight || parseFloat(inputWeight) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select waste type and enter valid weight",
        variant: "destructive",
      });
      return;
    }

    const waste = availableWaste.find(w => w.id === selectedWaste);
    if (!waste) return;

    const weight = parseFloat(inputWeight);
    const existingItem = cartItems.find(item => item.id === selectedWaste);

    if (existingItem) {
      // Update existing item
      setCartItems(prev => prev.map(item => 
        item.id === selectedWaste
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalWeight: item.totalWeight + weight,
              totalPoints: Math.round((item.totalWeight + weight) * item.points * item.multiplier),
              totalPrice: Math.round(((item.totalWeight + weight) * item.price) * 100) / 100
            }
          : item
      ));
    } else {
      // Add new item
      const newItem: CartItem = {
        ...waste,
        quantity: 1,
        totalWeight: weight,
        totalPoints: Math.round(weight * waste.points * waste.multiplier),
        totalPrice: Math.round((weight * waste.price) * 100) / 100
      };
      setCartItems(prev => [...prev, newItem]);
    }

    // Reset inputs
    setSelectedWaste('');
    setInputWeight('');
    setShowCharts(true);

    toast({
      title: "Added to Cart",
      description: `${waste.name} (${weight}kg) added successfully`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    if (cartItems.length <= 1) {
      setShowCharts(false);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        if (newQuantity === 0) {
          return null;
        }
        const weightPerUnit = item.totalWeight / item.quantity;
        const newWeight = newQuantity * weightPerUnit;
        return {
          ...item,
          quantity: newQuantity,
          totalWeight: newWeight,
          totalPoints: Math.round(newWeight * item.points * item.multiplier),
          totalPrice: Math.round((newWeight * item.price) * 100) / 100
        };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const updateCharts = () => {
    if (cartItems.length === 0) {
      setChartData([]);
      setImpactData([]);
      return;
    }

    // Pie chart data
    const pieData = cartItems.map(item => ({
      name: item.name,
      value: item.totalWeight,
      points: item.totalPoints,
      color: item.color
    }));
    setChartData(pieData);

    // Impact timeline simulation
    const timeline = [];
    let cumulativeWeight = 0;
    let cumulativePoints = 0;
    let cumulativeSavings = 0;

    for (let i = 0; i < 7; i++) {
      cartItems.forEach((item, index) => {
        if (i >= index) {
          cumulativeWeight += item.totalWeight / 7;
          cumulativePoints += item.totalPoints / 7;
          cumulativeSavings += (item.totalPrice * 0.3) / 7; // Environmental savings
        }
      });

      timeline.push({
        day: `Day ${i + 1}`,
        weight: Math.round(cumulativeWeight * 100) / 100,
        points: Math.round(cumulativePoints),
        savings: Math.round(cumulativeSavings * 100) / 100,
        co2Saved: Math.round((cumulativeWeight * 2.5) * 100) / 100 // 2.5kg CO2 per kg waste
      });
    }

    setImpactData(timeline);
  };

  const getTotalStats = () => {
    const totalWeight = cartItems.reduce((sum, item) => sum + item.totalWeight, 0);
    const totalPoints = cartItems.reduce((sum, item) => sum + item.totalPoints, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const co2Saved = totalWeight * 2.5; // kg CO2 saved per kg waste
    const treesEquivalent = Math.round(co2Saved / 22); // 22kg CO2 per tree annually

    return {
      totalWeight: Math.round(totalWeight * 100) / 100,
      totalPoints,
      totalPrice: Math.round(totalPrice * 100) / 100,
      co2Saved: Math.round(co2Saved * 100) / 100,
      treesEquivalent
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="elegant-stats-card p-3 border shadow-lg">
          <p className="elegant-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="elegant-text-secondary text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
              {entry.dataKey === 'weight' && ' kg'}
              {entry.dataKey === 'points' && ' pts'}
              {entry.dataKey === 'co2Saved' && ' kg CO₂'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <Card className="elegant-card elegant-hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="elegant-icon w-12 h-12">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="elegant-heading-primary text-2xl">Waste Collection Cart</CardTitle>
                <CardDescription className="elegant-text-muted">
                  Add waste items to see real-time environmental impact
                </CardDescription>
              </div>
            </div>
            <Badge className="elegant-badge text-lg px-4 py-2">
              {cartItems.length} items
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="elegant-grid elegant-grid-3 gap-6">
        {/* Add Items Section */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <CardTitle className="elegant-heading-secondary flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add Waste Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="elegant-label">Waste Type</Label>
              <select
                value={selectedWaste}
                onChange={(e) => setSelectedWaste(e.target.value)}
                className="elegant-input w-full"
              >
                <option value="">Select waste type</option>
                {availableWaste.map(waste => (
                  <option key={waste.id} value={waste.id}>
                    {waste.name} ({waste.points * waste.multiplier} pts/kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="elegant-label">Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="elegant-input"
              />
            </div>

            {selectedWaste && (
              <div className="elegant-stats-card p-3">
                <div className="text-sm space-y-1">
                  {(() => {
                    const waste = availableWaste.find(w => w.id === selectedWaste);
                    const weight = parseFloat(inputWeight) || 0;
                    const points = weight * (waste?.points || 0) * (waste?.multiplier || 1);
                    const price = weight * (waste?.price || 0);
                    
                    return (
                      <>
                        <p className="elegant-text-primary font-medium">{waste?.description}</p>
                        <p className="elegant-text-secondary">Points: {Math.round(points)}</p>
                        <p className="elegant-text-secondary">Environmental Value: ${price.toFixed(2)}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            <Button 
              onClick={addToCart}
              className="elegant-btn-primary w-full"
              disabled={!selectedWaste || !inputWeight}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>

        {/* Cart Items */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <CardTitle className="elegant-heading-secondary">Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 elegant-text-muted mx-auto mb-4" />
                <p className="elegant-text-secondary">No items in cart</p>
                <p className="elegant-text-muted text-sm">Add waste items to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="elegant-stats-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <div>
                          <p className="font-medium elegant-text-primary text-sm">{item.name}</p>
                          <p className="elegant-text-muted text-xs">{item.type}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeFromCart(item.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => updateQuantity(item.id, -1)}
                          variant="outline"
                          size="sm"
                          className="elegant-btn-secondary w-8 h-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="elegant-text-primary font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => updateQuantity(item.id, 1)}
                          variant="outline"
                          size="sm"
                          className="elegant-btn-secondary w-8 h-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="elegant-text-secondary">Weight:</span>
                        <span className="elegant-text-primary">{item.totalWeight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="elegant-text-secondary">Points:</span>
                        <span className="elegant-text-primary">{item.totalPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="elegant-text-secondary">Value:</span>
                        <span className="elegant-text-primary">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="elegant-card elegant-hover-lift">
          <CardHeader>
            <CardTitle className="elegant-heading-secondary flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Cart Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="elegant-stats-card p-4 text-center">
                <div className="text-2xl font-bold elegant-heading-primary mb-1">
                  {stats.totalWeight} kg
                </div>
                <div className="elegant-text-secondary text-sm">Total Weight</div>
              </div>

              <div className="elegant-stats-card p-4 text-center">
                <div className="text-2xl font-bold elegant-heading-primary mb-1">
                  {stats.totalPoints}
                </div>
                <div className="elegant-text-secondary text-sm">Total Points</div>
              </div>

              <div className="elegant-stats-card p-4 text-center">
                <div className="text-2xl font-bold elegant-heading-primary mb-1">
                  {stats.co2Saved} kg
                </div>
                <div className="elegant-text-secondary text-sm">CO₂ Saved</div>
              </div>

              <div className="elegant-stats-card p-4 text-center">
                <div className="text-2xl font-bold elegant-heading-primary mb-1">
                  ${stats.totalPrice}
                </div>
                <div className="elegant-text-secondary text-sm">Environmental Value</div>
              </div>

              {stats.treesEquivalent > 0 && (
                <div className="elegant-stats-card p-3 bg-green-50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-700 mb-1">
                      {stats.treesEquivalent} 🌳
                    </div>
                    <div className="text-green-600 text-xs">Trees Worth of CO₂</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Charts - Only show when cart has items */}
      {showCharts && cartItems.length > 0 && (
        <div className="space-y-6">
          <Separator />
          
          <div className="text-center">
            <h3 className="elegant-heading-primary text-2xl mb-2">Real-Time Impact Analysis</h3>
            <p className="elegant-text-muted">Charts update automatically as you modify your cart</p>
          </div>

          <div className="elegant-grid elegant-grid-2 gap-6">
            {/* Waste Distribution Pie Chart */}
            <Card className="elegant-card elegant-hover-lift">
              <CardHeader>
                <CardTitle className="elegant-heading-secondary flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Waste Distribution
                </CardTitle>
                <CardDescription className="elegant-text-muted">
                  Weight distribution by waste type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}kg`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Points Breakdown Bar Chart */}
            <Card className="elegant-card elegant-hover-lift">
              <CardHeader>
                <CardTitle className="elegant-heading-secondary flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Points Breakdown
                </CardTitle>
                <CardDescription className="elegant-text-muted">
                  Points earned by waste type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="name" type="category" stroke="#666" width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="points" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Impact Timeline */}
            <Card className="elegant-card elegant-hover-lift col-span-2">
              <CardHeader>
                <CardTitle className="elegant-heading-secondary flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Environmental Impact Timeline
                </CardTitle>
                <CardDescription className="elegant-text-muted">
                  Projected environmental benefits over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={impactData}>
                    <defs>
                      <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#666" />
                    <YAxis stroke="#666" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="co2Saved"
                      stackId="1"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorCO2)"
                      name="CO₂ Saved (kg)"
                    />
                    <Area
                      type="monotone"
                      dataKey="points"
                      stackId="2"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorPoints)"
                      name="Points Earned"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteCart;