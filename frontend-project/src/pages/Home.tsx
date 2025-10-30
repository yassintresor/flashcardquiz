import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Trophy, Users, ArrowRight, Sparkles, Target, BarChart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { authService } from "@/services/authService";
import { useState } from "react";

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Apply theme class to body
  useEffect(() => {
    if (theme) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }
  }, [theme]);

  // Check if user is authenticated and redirect to dashboard
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const userRole = authService.getUserRole();
      
      if (isAuthenticated && userRole) {
        // Redirect to appropriate dashboard
        navigate(userRole === "admin" ? "/admin" : "/client", { replace: true });
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Don't render content if checking authentication or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Adaptive flashcards that adjust to your learning pace and style"
    },
    {
      icon: Zap,
      title: "Quick Quizzes",
      description: "Fast-paced quizzes designed to maximize retention and engagement"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Comprehensive analytics to monitor your learning journey"
    },
    {
      icon: Users,
      title: "Collaborative",
      description: "Share and learn from community-created content"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Flashcard Sets", value: "50K+" },
    { label: "Questions Answered", value: "1M+" },
    { label: "Success Rate", value: "94%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Transform Your Learning Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Master Any Subject with{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent animate-gradient">
                Smart Flashcards
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create, study, and master flashcards with our intelligent learning platform. 
              Perfect for students, professionals, and lifelong learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300">
                  Start Learning Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose FlashQuiz?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to accelerate your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-10" />
        <div className="container mx-auto px-4 relative">
          <Card className="max-w-4xl mx-auto border-primary/20 bg-card/80 backdrop-blur">
            <CardContent className="p-12 text-center space-y-6">
              <Target className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Boost Your Learning?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of learners who are already mastering their subjects with FlashQuiz
              </p>
              <Link to="/register">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 FlashQuiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;