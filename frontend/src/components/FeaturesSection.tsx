import { Shield, Heart, Coins, Star, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "All companions undergo thorough ID verification for your safety and peace of mind.",
  },
  {
    icon: Coins,
    title: "Saath Coins",
    description: "Our exclusive coin system makes payments seamless. Earn coins through referrals and activities.",
  },
  {
    icon: Star,
    title: "Rating System",
    description: "Transparent ratings and reviews help you choose the perfect companion for your outing.",
  },
  {
    icon: Users,
    title: "Diverse Companions",
    description: "Find companions for any occasion - movies, dinners, city tours, events, and more.",
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    description: "Book companions for a few hours or an entire day. Plans change? Easy rescheduling available.",
  },
  {
    icon: Heart,
    title: "Genuine Connections",
    description: "Build meaningful friendships and create lasting memories with like-minded people.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Features That Make Us <span className="text-primary">Special</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Saath Ghoomo is designed with your comfort and safety in mind. Here's what sets us apart.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="elevated"
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl romantic-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-romantic">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
