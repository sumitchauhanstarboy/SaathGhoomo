import { Coins, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const coinPackages = [
  {
    coins: 100,
    price: 99,
    popular: false,
  },
  {
    coins: 500,
    price: 449,
    popular: true,
    bonus: 50,
  },
  {
    coins: 1000,
    price: 849,
    popular: false,
    bonus: 150,
  },
];

const SaathCoinsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Coins className="h-5 w-5 text-gold" />
            <span className="text-gold font-medium">Our Currency</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Introducing <span className="text-gradient">Saath Coins</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Use Saath Coins to book companions, unlock premium features, and enjoy exclusive benefits. 
            Earn coins through referrals or purchase them directly.
          </p>
        </div>

        {/* Coin Packages */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {coinPackages.map((pkg, index) => (
            <Card
              key={pkg.coins}
              variant={pkg.popular ? "romantic" : "elevated"}
              className={`relative animate-fade-in ${pkg.popular ? "scale-105 z-10" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full romantic-gradient text-primary-foreground text-sm font-medium flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Most Popular
                </div>
              )}
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center mb-4 shadow-lg">
                  <Coins className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-foreground font-display mb-2">
                  {pkg.coins}
                  {pkg.bonus && (
                    <span className="text-lg text-primary ml-2">+{pkg.bonus}</span>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">Saath Coins</p>
                <div className="text-3xl font-bold text-foreground mb-6">
                  ₹{pkg.price}
                </div>
                <Button
                  variant={pkg.popular ? "romantic" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            💡 <span className="font-medium">Pro Tip:</span> Refer friends to earn 100 free Saath Coins per referral!
          </p>
        </div>
      </div>
    </section>
  );
};

export default SaathCoinsSection;
