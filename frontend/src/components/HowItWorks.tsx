import { Search, CalendarCheck, MapPin, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Companions",
    description: "Browse through verified profiles and find someone who matches your interests and vibe.",
    step: "01",
  },
  {
    icon: CalendarCheck,
    title: "Book Your Date",
    description: "Select your preferred time, location, and activity. Use Saath Coins for seamless payment.",
    step: "02",
  },
  {
    icon: MapPin,
    title: "Meet & Explore",
    description: "Meet at your chosen spot and enjoy a wonderful outing with your companion.",
    step: "03",
  },
  {
    icon: CreditCard,
    title: "Rate & Earn",
    description: "Leave a review and earn Saath Coins through referrals for future bookings.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Simple Process</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            How <span className="text-primary">Saath Ghoomo</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Finding a companion for your adventures has never been easier. Just follow these simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}

              <div className="relative z-10 p-6 rounded-2xl bg-card shadow-card hover:shadow-romantic transition-all duration-300 group-hover:-translate-y-2">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full romantic-gradient flex items-center justify-center text-primary-foreground font-bold text-lg shadow-romantic">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
