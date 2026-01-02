import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 h-8 w-8 text-primary-foreground/20 animate-float" style={{ animationDelay: "0s" }} />
        <Heart className="absolute top-1/3 right-1/4 h-6 w-6 text-primary-foreground/15 animate-float" style={{ animationDelay: "1s" }} />
        <Heart className="absolute bottom-1/3 left-1/3 h-10 w-10 text-primary-foreground/10 animate-float" style={{ animationDelay: "2s" }} />
        <Heart className="absolute top-1/2 right-1/3 h-5 w-5 text-primary-foreground/20 animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8 animate-fade-in">
            <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
            <span className="text-primary-foreground text-sm font-medium">Find Your Perfect Companion</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Never Explore
            <span className="block text-gold-light">Alone Again</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Book a companion for movies, dinners, city tours, or any adventure. 
            Connect with verified partners and create unforgettable memories together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button variant="gold" size="xl">
              <Users className="h-5 w-5" />
              Find a Companion
            </Button>
            <Button variant="romantic" size="xl" className="text-primary-foreground border-primary-foreground/30">
              <MapPin className="h-5 w-5" />
              Become a Companion
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">10K+</div>
              <div className="text-primary-foreground/70 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">5K+</div>
              <div className="text-primary-foreground/70 text-sm">Companions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">50K+</div>
              <div className="text-primary-foreground/70 text-sm">Happy Outings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
