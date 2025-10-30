import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import TestCardCreation from "./pages/TestCardCreation";
import NotFound from "./pages/NotFound";
import { authService } from "@/services/authService";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Custom hook to redirect authenticated users away from auth pages
const useRedirectIfAuthenticated = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  useEffect(() => {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && userRole && (location.pathname === "/login" || location.pathname === "/register")) {
      // Redirect to appropriate dashboard
      window.location.replace(userRole === "admin" ? "/admin" : "/client");
    }
  }, [location, isAuthenticated, userRole]);
};

// Protected Route Components
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={userRole === "admin" ? "/admin" : "/client"} replace />;
  }

  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => (
  <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
);

const ClientRoute = ({ children }: { children: JSX.Element }) => (
  <ProtectedRoute allowedRoles={["client"]}>{children}</ProtectedRoute>
);

// Component to handle redirects for authenticated users
const AuthRedirectHandler = () => {
  useRedirectIfAuthenticated();
  return null;
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="ui-theme" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthRedirectHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/client" 
              element={
                <ClientRoute>
                  <ClientDashboard />
                </ClientRoute>
              } 
            />
            {/* Test route for card creation */}
            <Route path="/test-card" element={<TestCardCreation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;