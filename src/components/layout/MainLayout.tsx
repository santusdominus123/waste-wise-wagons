import { ReactNode } from 'react';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <Navigation />
      
      {/* Main Content */}
      <div className="lg:ml-64 pb-16 lg:pb-0 pt-16 lg:pt-0">
        <main className="p-2 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;