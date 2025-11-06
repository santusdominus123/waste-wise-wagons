import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import Navigation from '@/components/layout/Navigation';
import { 
  MapPin, 
  Calendar, 
  Weight, 
  Recycle, 
  Send, 
  Star, 
  Clock, 
  Info, 
  AlertCircle, 
  History, 
  Calculator,
  Camera,
  Truck,
  Shield,
  Zap,
  TreePine,
  Home,
  Building2,
  Factory,
  Phone,
  MessageSquare,
  Gift,
  Target,
  TrendingUp,
  MapIcon,
  Users,
  DollarSign
} from 'lucide-react';

interface WasteType {
  value: string;
  label: string;
  points: number;
  description: string;
  multiplier: number;
  category: 'recyclable' | 'organic' | 'hazardous' | 'electronic';
  icon: string;
  estimatedPrice: number;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  popular?: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
  demand: 'low' | 'medium' | 'high';
}

const AdvancedPickupRequest = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [selectedService, setSelectedService] = useState<string>('standard');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  const [formData, setFormData] = useState({
    // Basic Info
    address: '',
    detailedAddress: '',
    addressType: 'residential',
    coordinates: { lat: 0, lng: 0 },
    
    // Scheduling
    scheduledDate: '',
    flexibleDates: false,
    alternativeDates: [] as string[],
    recurringSchedule: {
      enabled: false,
      frequency: 'weekly',
      endDate: '',
      skipDates: [] as string[]
    },
    
    // Waste Details
    estimatedWeight: [5],
    totalVolume: '',
    wasteCondition: 'dry',
    packaging: 'mixed',
    sortingLevel: 'basic',
    
    // Service Options
    priorityLevel: 'standard',
    photoDocumentation: false,
    certificateOfDestruction: false,
    realTimeTracking: true,
    sameDay: false,
    
    // Access & Instructions
    accessInstructions: '',
    contactPerson: '',
    phoneNumber: '',
    buildingFloor: '',
    parkingInstructions: '',
    gateCode: '',
    
    // Special Requirements
    specialInstructions: '',
    equipmentNeeded: [] as string[],
    safetyRequirements: [] as string[],
    environmentalConcerns: '',
    
    // Pricing & Payment
    budgetRange: [100, 500],
    paymentMethod: 'cash',
    needInvoice: false,
    companyDetails: {
      name: '',
      taxId: '',
      address: ''
    }
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    // Enhanced waste types with more details
    const enhancedWasteTypes: WasteType[] = [
      {
        value: 'plastic_bottles',
        label: 'Plastic Bottles',
        points: 4,
        description: 'PET bottles, water bottles, soft drink containers',
        multiplier: 1.2,
        category: 'recyclable',
        icon: '🍼',
        estimatedPrice: 2000
      },
      {
        value: 'plastic_bags',
        label: 'Plastic Bags',
        points: 2,
        description: 'Shopping bags, food packaging, plastic wraps',
        multiplier: 0.8,
        category: 'recyclable',
        icon: '🛍️',
        estimatedPrice: 500
      },
      {
        value: 'cardboard',
        label: 'Cardboard',
        points: 3,
        description: 'Boxes, packaging materials, corrugated cardboard',
        multiplier: 1.1,
        category: 'recyclable',
        icon: '📦',
        estimatedPrice: 1500
      },
      {
        value: 'newspapers',
        label: 'Newspapers & Magazines',
        points: 2,
        description: 'Old newspapers, magazines, printed materials',
        multiplier: 1.0,
        category: 'recyclable',
        icon: '📰',
        estimatedPrice: 1000
      },
      {
        value: 'glass',
        label: 'Glass Containers',
        points: 6,
        description: 'Bottles, jars, glass containers (clean)',
        multiplier: 1.5,
        category: 'recyclable',
        icon: '🍾',
        estimatedPrice: 3000
      },
      {
        value: 'aluminum',
        label: 'Aluminum Cans',
        points: 8,
        description: 'Beverage cans, food containers',
        multiplier: 2.0,
        category: 'recyclable',
        icon: '🥤',
        estimatedPrice: 5000
      },
      {
        value: 'food_waste',
        label: 'Organic Food Waste',
        points: 1,
        description: 'Fruit peels, vegetable scraps, food leftovers',
        multiplier: 0.6,
        category: 'organic',
        icon: '🥬',
        estimatedPrice: 300
      },
      {
        value: 'garden_waste',
        label: 'Garden Waste',
        points: 2,
        description: 'Leaves, branches, grass clippings',
        multiplier: 0.8,
        category: 'organic',
        icon: '🌱',
        estimatedPrice: 800
      },
      {
        value: 'electronics',
        label: 'Electronics',
        points: 15,
        description: 'Phones, computers, small appliances',
        multiplier: 3.0,
        category: 'electronic',
        icon: '📱',
        estimatedPrice: 10000
      },
      {
        value: 'batteries',
        label: 'Batteries',
        points: 20,
        description: 'Household batteries, rechargeable batteries',
        multiplier: 4.0,
        category: 'hazardous',
        icon: '🔋',
        estimatedPrice: 15000
      },
      {
        value: 'paint_chemicals',
        label: 'Paint & Chemicals',
        points: 25,
        description: 'Paint cans, solvents, cleaning chemicals',
        multiplier: 5.0,
        category: 'hazardous',
        icon: '🧪',
        estimatedPrice: 20000
      }
    ];

    const services: ServiceOption[] = [
      {
        id: 'basic',
        name: 'Basic Collection',
        description: 'Standard pickup service',
        price: 25000,
        duration: '2-4 hours window'
      },
      {
        id: 'standard',
        name: 'Standard Service',
        description: 'Sorting assistance + collection',
        price: 50000,
        duration: '1-2 hours window',
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium Service',
        description: 'Full service with documentation',
        price: 100000,
        duration: '30min window'
      },
      {
        id: 'eco_plus',
        name: 'Eco Plus',
        description: 'Premium + carbon offset certificate',
        price: 150000,
        duration: 'Precise timing'
      }
    ];

    const slots: TimeSlot[] = [
      { id: '08:00', time: '08:00 - 09:00', available: true, price: 0, demand: 'low' },
      { id: '09:00', time: '09:00 - 10:00', available: true, price: 5000, demand: 'medium' },
      { id: '10:00', time: '10:00 - 11:00', available: true, price: 10000, demand: 'high' },
      { id: '11:00', time: '11:00 - 12:00', available: true, price: 5000, demand: 'medium' },
      { id: '13:00', time: '13:00 - 14:00', available: true, price: 0, demand: 'low' },
      { id: '14:00', time: '14:00 - 15:00', available: false, price: 10000, demand: 'high' },
      { id: '15:00', time: '15:00 - 16:00', available: true, price: 15000, demand: 'high' },
      { id: '16:00', time: '16:00 - 17:00', available: true, price: 10000, demand: 'high' }
    ];

    setWasteTypes(enhancedWasteTypes);
    setServiceOptions(services);
    setTimeSlots(slots);
  };

  const calculateTotalCost = () => {
    let baseCost = 0;
    
    // Service cost
    const service = serviceOptions.find(s => s.id === selectedService);
    if (service) baseCost += service.price;
    
    // Time slot cost
    const timeSlot = timeSlots.find(t => t.id === selectedTimeSlot);
    if (timeSlot) baseCost += timeSlot.price;
    
    // Waste type costs
    const wasteCost = selectedWasteTypes.reduce((total, wasteType) => {
      const type = wasteTypes.find(t => t.value === wasteType);
      return total + (type ? type.estimatedPrice : 0);
    }, 0);
    
    // Weight multiplier
    const weightMultiplier = Math.max(1, formData.estimatedWeight[0] / 5);
    
    // Priority multiplier
    const priorityMultiplier = formData.priorityLevel === 'urgent' ? 1.5 : 
                              formData.priorityLevel === 'express' ? 2.0 : 1.0;
    
    return Math.round((baseCost + wasteCost) * weightMultiplier * priorityMultiplier);
  };

  const calculatePoints = () => {
    return selectedWasteTypes.reduce((total, wasteType) => {
      const type = wasteTypes.find(t => t.value === wasteType);
      if (type) {
        const basePoints = type.points * formData.estimatedWeight[0];
        const multiplier = type.multiplier;
        const priorityBonus = formData.priorityLevel === 'urgent' ? 1.2 : 1.0;
        return total + (basePoints * multiplier * priorityBonus);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const pickupRequest = {
        id: `advanced-pickup-${Date.now()}`,
        user_id: userData?.id,
        type: 'advanced',
        
        // Basic info
        address: `${formData.address}, ${formData.detailedAddress}`,
        address_type: formData.addressType,
        coordinates: formData.coordinates,
        
        // Scheduling
        scheduled_date: formData.scheduledDate,
        time_slot: selectedTimeSlot,
        flexible_dates: formData.flexibleDates,
        alternative_dates: formData.alternativeDates,
        recurring_schedule: formData.recurringSchedule,
        
        // Waste details
        waste_types: selectedWasteTypes,
        estimated_weight: formData.estimatedWeight[0],
        total_volume: formData.totalVolume,
        waste_condition: formData.wasteCondition,
        packaging: formData.packaging,
        sorting_level: formData.sortingLevel,
        
        // Service
        service_type: selectedService,
        priority_level: formData.priorityLevel,
        photo_documentation: formData.photoDocumentation,
        certificate_of_destruction: formData.certificateOfDestruction,
        real_time_tracking: formData.realTimeTracking,
        same_day: formData.sameDay,
        
        // Access details
        access_instructions: formData.accessInstructions,
        contact_person: formData.contactPerson,
        phone_number: formData.phoneNumber,
        building_floor: formData.buildingFloor,
        parking_instructions: formData.parkingInstructions,
        gate_code: formData.gateCode,
        
        // Special requirements
        special_instructions: formData.specialInstructions,
        equipment_needed: formData.equipmentNeeded,
        safety_requirements: formData.safetyRequirements,
        environmental_concerns: formData.environmentalConcerns,
        
        // Pricing
        estimated_cost: calculateTotalCost(),
        points_earned: Math.floor(calculatePoints()),
        budget_range: formData.budgetRange,
        payment_method: formData.paymentMethod,
        need_invoice: formData.needInvoice,
        company_details: formData.companyDetails,
        
        // Meta
        status: 'advanced_pending',
        created_at: new Date().toISOString(),
        complexity_score: selectedWasteTypes.length + (formData.priorityLevel === 'urgent' ? 2 : 0)
      };

      // Save to localStorage for local users
      const existingRequests = JSON.parse(localStorage.getItem('local-pickup-requests') || '[]');
      existingRequests.push(pickupRequest);
      localStorage.setItem('local-pickup-requests', JSON.stringify(existingRequests));

      toast({
        title: "Advanced Request Submitted!",
        description: `Your detailed pickup request has been submitted. Estimated cost: Rp ${calculateTotalCost().toLocaleString()}`,
      });

      navigate('/pickup-history');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Address Type</Label>
                  <RadioGroup 
                    value={formData.addressType} 
                    onValueChange={(value) => setFormData({...formData, addressType: value})}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="residential" id="residential" />
                      <Label htmlFor="residential" className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        Residential
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commercial" id="commercial" />
                      <Label htmlFor="commercial" className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        Commercial
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="industrial" id="industrial" />
                      <Label htmlFor="industrial" className="flex items-center">
                        <Factory className="h-4 w-4 mr-1" />
                        Industrial
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Street Address</Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Complete street address with landmarks"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Building/Floor Details</Label>
                    <Input
                      value={formData.buildingFloor}
                      onChange={(e) => setFormData({...formData, buildingFloor: e.target.value})}
                      placeholder="Floor 5, Unit 502"
                    />
                  </div>
                  <div>
                    <Label>Gate/Access Code</Label>
                    <Input
                      value={formData.gateCode}
                      onChange={(e) => setFormData({...formData, gateCode: e.target.value})}
                      placeholder="Security code or instructions"
                    />
                  </div>
                </div>

                <div>
                  <Label>Parking Instructions</Label>
                  <Textarea
                    value={formData.parkingInstructions}
                    onChange={(e) => setFormData({...formData, parkingInstructions: e.target.value})}
                    placeholder="Where collection vehicle can park safely"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Recycle className="h-5 w-5 mr-2" />
                  Waste Categories & Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="selection" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="selection">Selection</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="condition">Condition</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="selection" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {['recyclable', 'organic', 'electronic', 'hazardous'].map(category => (
                        <div key={category} className="space-y-3">
                          <h4 className="font-semibold capitalize text-lg">{category} Waste</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {wasteTypes
                              .filter(type => type.category === category)
                              .map(wasteType => (
                                <div
                                  key={wasteType.value}
                                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedWasteTypes.includes(wasteType.value)
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => {
                                    const isSelected = selectedWasteTypes.includes(wasteType.value);
                                    if (isSelected) {
                                      setSelectedWasteTypes(selectedWasteTypes.filter(t => t !== wasteType.value));
                                    } else {
                                      setSelectedWasteTypes([...selectedWasteTypes, wasteType.value]);
                                    }
                                  }}
                                >
                                  <div className="flex items-start space-x-3">
                                    <span className="text-2xl">{wasteType.icon}</span>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{wasteType.label}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{wasteType.description}</p>
                                      <div className="flex items-center justify-between">
                                        <Badge variant="secondary">{wasteType.points} pts/kg</Badge>
                                        <span className="text-sm text-green-600">
                                          Rp {wasteType.estimatedPrice.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Estimated Weight (kg)</Label>
                        <div className="mt-2 mb-4">
                          <Slider
                            value={formData.estimatedWeight}
                            onValueChange={(value) => setFormData({...formData, estimatedWeight: value})}
                            max={100}
                            min={1}
                            step={0.5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>1 kg</span>
                            <span className="font-medium">{formData.estimatedWeight[0]} kg</span>
                            <span>100 kg</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Total Volume (Optional)</Label>
                        <Input
                          value={formData.totalVolume}
                          onChange={(e) => setFormData({...formData, totalVolume: e.target.value})}
                          placeholder="e.g., 2 cubic meters, 10 bags"
                        />
                      </div>

                      <div>
                        <Label>Sorting Level</Label>
                        <Select 
                          value={formData.sortingLevel} 
                          onValueChange={(value) => setFormData({...formData, sortingLevel: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic - Mixed waste</SelectItem>
                            <SelectItem value="partial">Partial - Some separation</SelectItem>
                            <SelectItem value="advanced">Advanced - Well sorted</SelectItem>
                            <SelectItem value="professional">Professional - Industrial grade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="condition" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Waste Condition</Label>
                        <RadioGroup 
                          value={formData.wasteCondition} 
                          onValueChange={(value) => setFormData({...formData, wasteCondition: value})}
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dry" id="dry" />
                            <Label htmlFor="dry">Dry - Clean and dry materials</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="wet" id="wet" />
                            <Label htmlFor="wet">Wet - Contains moisture/liquids</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mixed" id="mixed" />
                            <Label htmlFor="mixed">Mixed - Combination of dry and wet</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hazardous" id="hazardous" />
                            <Label htmlFor="hazardous">Hazardous - Requires special handling</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Packaging</Label>
                        <RadioGroup 
                          value={formData.packaging} 
                          onValueChange={(value) => setFormData({...formData, packaging: value})}
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="loose" id="loose" />
                            <Label htmlFor="loose">Loose - No packaging</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bagged" id="bagged" />
                            <Label htmlFor="bagged">Bagged - In plastic bags</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="boxed" id="boxed" />
                            <Label htmlFor="boxed">Boxed - In cardboard boxes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mixed" id="mixed-packaging" />
                            <Label htmlFor="mixed-packaging">Mixed - Various packaging</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Scheduling & Service Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Date</Label>
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <Select 
                      value={formData.priorityLevel} 
                      onValueChange={(value) => setFormData({...formData, priorityLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard - Regular processing</SelectItem>
                        <SelectItem value="urgent">Urgent - +50% cost, same day</SelectItem>
                        <SelectItem value="express">Express - +100% cost, 2-4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Service Package</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {serviceOptions.map(service => (
                      <div
                        key={service.id}
                        className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        {service.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500">Popular</Badge>
                        )}
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-green-600">
                            Rp {service.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">{service.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Time Slot</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {timeSlots.map(slot => (
                      <div
                        key={slot.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTimeSlot === slot.id
                            ? 'border-blue-500 bg-blue-50'
                            : slot.available 
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                        }`}
                        onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className={slot.available ? 'text-gray-900' : 'text-gray-400'}>
                            {slot.time}
                          </span>
                          <div className="flex items-center space-x-2">
                            {slot.price > 0 && (
                              <span className="text-sm text-green-600">
                                +Rp {slot.price.toLocaleString()}
                              </span>
                            )}
                            <Badge 
                              variant={
                                slot.demand === 'high' ? 'destructive' :
                                slot.demand === 'medium' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {slot.demand}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Additional Services</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Photo Documentation</Label>
                        <p className="text-sm text-gray-600">Before/after photos for verification</p>
                      </div>
                      <Switch
                        checked={formData.photoDocumentation}
                        onCheckedChange={(checked) => setFormData({...formData, photoDocumentation: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Real-time Tracking</Label>
                        <p className="text-sm text-gray-600">Live GPS tracking of collection team</p>
                      </div>
                      <Switch
                        checked={formData.realTimeTracking}
                        onCheckedChange={(checked) => setFormData({...formData, realTimeTracking: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Certificate of Destruction</Label>
                        <p className="text-sm text-gray-600">Official disposal certificate (+Rp 25,000)</p>
                      </div>
                      <Switch
                        checked={formData.certificateOfDestruction}
                        onCheckedChange={(checked) => setFormData({...formData, certificateOfDestruction: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact & Special Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Person</Label>
                    <Input
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="Person to contact on pickup day"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="Active phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label>Special Instructions</Label>
                  <Textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    placeholder="Any special requirements, handling instructions, or concerns..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Equipment Needed (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      'Gloves', 'Masks', 'Safety gear', 'Heavy lifting equipment',
                      'Trolley/Cart', 'Protective sheets', 'Containers', 'Labels'
                    ].map(equipment => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.equipmentNeeded.includes(equipment)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData, 
                                equipmentNeeded: [...formData.equipmentNeeded, equipment]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                equipmentNeeded: formData.equipmentNeeded.filter(e => e !== equipment)
                              });
                            }
                          }}
                        />
                        <Label>{equipment}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Environmental Concerns</Label>
                  <Textarea
                    value={formData.environmentalConcerns}
                    onChange={(e) => setFormData({...formData, environmentalConcerns: e.target.value})}
                    placeholder="Any environmental considerations or disposal preferences..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Service Package</span>
                      <span>Rp {serviceOptions.find(s => s.id === selectedService)?.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Slot Premium</span>
                      <span>Rp {(timeSlots.find(t => t.id === selectedTimeSlot)?.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waste Processing</span>
                      <span>Rp {selectedWasteTypes.reduce((total, wasteType) => {
                        const type = wasteTypes.find(t => t.value === wasteType);
                        return total + (type ? type.estimatedPrice : 0);
                      }, 0).toLocaleString()}</span>
                    </div>
                    {formData.certificateOfDestruction && (
                      <div className="flex justify-between">
                        <span>Certificate of Destruction</span>
                        <span>Rp 25,000</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Cost</span>
                      <span className="text-green-600">Rp {calculateTotalCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-orange-600 font-semibold">
                      <span>Points Earned</span>
                      <span>+{Math.floor(calculatePoints())} points</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Label htmlFor="ewallet">E-Wallet (GoPay, OVO, DANA)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit">Credit Card</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.needInvoice}
                    onCheckedChange={(checked) => setFormData({...formData, needInvoice: checked as boolean})}
                  />
                  <Label>I need an official invoice for this transaction</Label>
                </div>

                {formData.needInvoice && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Company Details</h4>
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={formData.companyDetails.name}
                        onChange={(e) => setFormData({
                          ...formData, 
                          companyDetails: {...formData.companyDetails, name: e.target.value}
                        })}
                        placeholder="PT. Company Name"
                      />
                    </div>
                    <div>
                      <Label>Tax ID (NPWP)</Label>
                      <Input
                        value={formData.companyDetails.taxId}
                        onChange={(e) => setFormData({
                          ...formData,
                          companyDetails: {...formData.companyDetails, taxId: e.target.value}
                        })}
                        placeholder="00.000.000.0-000.000"
                      />
                    </div>
                    <div>
                      <Label>Company Address</Label>
                      <Textarea
                        value={formData.companyDetails.address}
                        onChange={(e) => setFormData({
                          ...formData,
                          companyDetails: {...formData.companyDetails, address: e.target.value}
                        })}
                        placeholder="Complete company address"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Pickup Request</h1>
          <p className="text-gray-600">Comprehensive waste collection service with full customization</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { step: 1, title: 'Location', icon: MapPin },
              { step: 2, title: 'Waste Details', icon: Recycle },
              { step: 3, title: 'Scheduling', icon: Calendar },
              { step: 4, title: 'Requirements', icon: MessageSquare },
              { step: 5, title: 'Payment', icon: DollarSign }
            ].map(({ step, title, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex flex-col items-center ${step <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step < currentStep ? 'bg-green-500 text-white' :
                    step === currentStep ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {step < currentStep ? '✓' : <Icon className="h-5 w-5" />}
                  </div>
                  <span className="text-sm mt-2">{title}</span>
                </div>
                {index < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-4xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-4">
            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                disabled={
                  (currentStep === 1 && !formData.address) ||
                  (currentStep === 2 && selectedWasteTypes.length === 0) ||
                  (currentStep === 3 && (!formData.scheduledDate || !selectedTimeSlot))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Advanced Request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPickupRequest;