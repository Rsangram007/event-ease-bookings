import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Shield, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to <span className="text-gradient">EventEase</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your ultimate platform for discovering, booking, and managing amazing events.
              From concerts to workshops, find your next experience here.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/events">
                <Button size="lg" className="text-lg shadow-elegant">
                  Browse Events
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button size="lg" variant="outline" className="text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose EventEase?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-muted-foreground">
                Browse through diverse events across multiple categories and locations
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Book your spot with just a few clicks. Simple, fast, and secure
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Join thousands of event-goers and connect with like-minded people
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your bookings are safe with us. Cancel anytime before the event
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join EventEase today and never miss out on amazing experiences
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="text-lg shadow-elegant">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 EventEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
