-- Create enums for various types
CREATE TYPE public.user_role AS ENUM ('user', 'driver', 'admin');
CREATE TYPE public.waste_type AS ENUM ('organic', 'plastic', 'paper', 'metal', 'glass', 'electronic', 'mixed');
CREATE TYPE public.pickup_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role user_role NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waste_rates table for point calculation
CREATE TABLE public.waste_rates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    waste_type waste_type NOT NULL,
    points_per_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pickup_requests table
CREATE TABLE public.pickup_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    estimated_weight DECIMAL(10,2),
    waste_types waste_type[] NOT NULL DEFAULT '{}',
    special_instructions TEXT,
    status pickup_status NOT NULL DEFAULT 'scheduled',
    actual_weight DECIMAL(10,2),
    points_earned INTEGER DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    pickup_photo_url TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_points table for tracking points
CREATE TABLE public.user_points (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pickup_request_id UUID REFERENCES public.pickup_requests(id) ON DELETE SET NULL,
    points_earned INTEGER NOT NULL DEFAULT 0,
    points_used INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    transaction_type TEXT NOT NULL, -- 'earned' or 'used'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create driver_performance table
CREATE TABLE public.driver_performance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    pickups_completed INTEGER DEFAULT 0,
    total_weight_collected DECIMAL(10,2) DEFAULT 0,
    commission_earned DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(driver_id, date)
);

-- Create pickup_reviews table
CREATE TABLE public.pickup_reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pickup_request_id UUID NOT NULL REFERENCES public.pickup_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards table
CREATE TABLE public.rewards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reward_redemptions table
CREATE TABLE public.reward_redemptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    points_used INTEGER NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for waste_rates
CREATE POLICY "Everyone can view waste rates" ON public.waste_rates
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage waste rates" ON public.waste_rates
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pickup_requests
CREATE POLICY "Users can view their own pickup requests" ON public.pickup_requests
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Drivers can view assigned pickup requests" ON public.pickup_requests
FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "Users can create pickup requests" ON public.pickup_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pickup requests" ON public.pickup_requests
FOR UPDATE USING (auth.uid() = user_id AND status = 'scheduled');

CREATE POLICY "Drivers can update assigned pickup requests" ON public.pickup_requests
FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view all pickup requests" ON public.pickup_requests
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points" ON public.user_points
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert points" ON public.user_points
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all points" ON public.user_points
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for driver_performance
CREATE POLICY "Drivers can view their own performance" ON public.driver_performance
FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "System can insert driver performance" ON public.driver_performance
FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own performance" ON public.driver_performance
FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view all driver performance" ON public.driver_performance
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pickup_reviews
CREATE POLICY "Users can view reviews for their pickups" ON public.pickup_reviews
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() = driver_id OR
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can create reviews for their pickups" ON public.pickup_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- RLS Policies for rewards
CREATE POLICY "Everyone can view active rewards" ON public.rewards
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage rewards" ON public.rewards
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reward_redemptions
CREATE POLICY "Users can view their own redemptions" ON public.reward_redemptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions" ON public.reward_redemptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions" ON public.reward_redemptions
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waste_rates_updated_at
  BEFORE UPDATE ON public.waste_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pickup_requests_updated_at
  BEFORE UPDATE ON public.pickup_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_driver_performance_updated_at
  BEFORE UPDATE ON public.driver_performance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default waste rates
INSERT INTO public.waste_rates (waste_type, points_per_kg, commission_rate) VALUES
('organic', 10.00, 5.00),
('plastic', 15.00, 7.50),
('paper', 8.00, 4.00),
('metal', 25.00, 12.50),
('glass', 12.00, 6.00),
('electronic', 50.00, 25.00),
('mixed', 5.00, 2.50);

-- Insert sample rewards
INSERT INTO public.rewards (name, description, points_required) VALUES
('Voucher Belanja 50K', 'Voucher belanja di minimarket partner', 500),
('Tumbler Eco-Friendly', 'Tumbler ramah lingkungan', 300),
('Tas Belanja Ramah Lingkungan', 'Tas belanja yang dapat digunakan berulang', 200),
('Voucher Pulsa 25K', 'Voucher pulsa untuk semua operator', 250),
('Powerbank Solar', 'Powerbank dengan panel solar', 800);