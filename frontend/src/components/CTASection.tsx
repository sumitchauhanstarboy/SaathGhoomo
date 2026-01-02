import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 romantic-gradient" />
      
      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 h-12 w-12 text-primary-foreground/10 animate-float" />
        <Heart className="absolute top-1/2 right-1/4 h-8 w-8 text-primary-foreground/15 animate-float" style={{ animationDelay: "1s" }} />
        <Heart className="absolute bottom-1/4 left-1/3 h-10 w-10 text-primary-foreground/10 animate-float" style={{ animationDelay: "2s" }} />
        <Heart className="absolute top-1/3 right-1/3 h-6 w-6 text-primary-foreground/20 animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
          Ready to Find Your
          <span className="block text-gold-light">Perfect Companion?</span>
        </h2>
        <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
          Join thousands of happy users who have found amazing companions for their adventures. 
          Sign up today and get 50 free Saath Coins!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="gold" size="xl">
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button variant="glass" size="xl" className="text-primary-foreground border-primary-foreground/30">
            Learn More
          </Button>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 flex items-center justify-center gap-8 flex-wrap text-primary-foreground/70">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Verified Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
