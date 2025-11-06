import { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Dashboard = () => {
  const { userData, isAdmin, isDriver, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userData) {
      // Redirect to appropriate dashboard based on role
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else if (isDriver) {
        navigate('/driver-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [userData, isAdmin, isDriver, loading, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;