import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogIn, LogOut, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "client" | null>(null);

  useEffect(() => {
    // Check authentication status on component mount and when location changes
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      const role = authService.getUserRole() as "admin" | "client" | null;
      
      setIsLoggedIn(authenticated);
      setUserRole(role);
    };

    checkAuthStatus();
    
    // Set up an interval to periodically check auth status
    const interval = setInterval(checkAuthStatus, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FlashQuiz
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {userRole === "admin" && (
                  <Link to="/admin">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                {userRole === "client" && (
                  <Link to="/client">
                    <Button variant="ghost">My Quizzes</Button>
                  </Link>
                )}
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};