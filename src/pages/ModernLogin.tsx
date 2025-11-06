import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

const ModernLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { localSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const { error } = await localSignIn(username, password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
          filter: 'blur(3px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-green-900/50 to-emerald-900/60" />
      
      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Login
            </h1>
            <p className="text-white/80 text-base font-medium">
              Welcome back please login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <User className="h-5 w-5 text-white/70" />
              </div>
              <Input
                name="username"
                type="text"
                placeholder="User Name"
                required
                className="
                  w-full h-14 pl-12 pr-4 
                  bg-white/10 backdrop-blur-sm
                  border border-white/30 
                  rounded-2xl
                  text-white placeholder:text-white/60
                  focus:border-white/60 focus:bg-white/15
                  transition-all duration-300
                  focus:ring-0 focus:ring-offset-0
                  font-medium
                "
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="
                  w-full h-14 pl-4 pr-12
                  bg-white/10 backdrop-blur-sm
                  border border-white/30 
                  rounded-2xl
                  text-white placeholder:text-white/60
                  focus:border-white/60 focus:bg-white/15
                  transition-all duration-300
                  focus:ring-0 focus:ring-offset-0
                  font-medium
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hover:scale-110 transition-transform duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/70 hover:text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-white/70 hover:text-white" />
                )}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="
                  w-5 h-5 
                  border-2 border-white/50 
                  data-[state=checked]:bg-green-500 
                  data-[state=checked]:border-green-500
                  data-[state=checked]:text-white
                  rounded-md
                  transition-all duration-200
                "
              />
              <label 
                htmlFor="remember" 
                className="text-white font-medium cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full h-14 
                bg-gradient-to-r from-lime-500 to-green-500
                hover:from-lime-400 hover:to-green-400
                text-white font-bold text-lg
                rounded-2xl
                shadow-lg hover:shadow-xl
                transform hover:scale-[1.02]
                transition-all duration-300
                border-0
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
              "
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-white/80 font-medium">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="font-bold text-white hover:text-lime-300 transition-colors duration-200 underline decoration-2 underline-offset-2"
              >
                Signup
              </button>
            </p>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm font-medium">
            Created by anggidwiiputra
          </p>
        </div>
      </div>

      {/* Floating Elements for Extra Visual Appeal */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-lime-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};

export default ModernLogin;