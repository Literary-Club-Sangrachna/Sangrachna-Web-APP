import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminIndicator: React.FC = () => {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Badge variant="default" className="bg-primary text-primary-foreground">
        Admin Mode
      </Badge>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDashboard}
        className="h-8"
      >
        <Settings className="h-4 w-4 mr-1" />
        Dashboard
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleLogout}
        className="h-8"
      >
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  );
};

export default AdminIndicator;