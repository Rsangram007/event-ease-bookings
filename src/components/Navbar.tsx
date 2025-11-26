import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Calendar, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-gradient">EventEase</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/events">
              <Button variant="ghost">Browse Events</Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin">
                    <Button variant="ghost">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button variant="ghost">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
