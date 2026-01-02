import { Gift, Users, Coins, ArrowRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const referralSteps = [
  {
    icon: Copy,
    title: "Share Your Code",
    description: "Copy your unique referral code and share it with friends and family.",
  },
  {
    icon: Users,
    title: "Friends Join",
    description: "When they sign up using your code and make their first booking, you both earn rewards.",
  },
  {
    icon: Coins,
    title: "Earn Saath Coins",
    description: "Get 100 Saath Coins for each successful referral. No limits!",
  },
];

const ReferSection = () => {
  const referralCode = "SAATH2024";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Code Copied!",
      description: "Your referral code has been copied to clipboard.",
    });
  };

  return (
    <section id="refer" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 romantic-gradient opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Refer & Earn</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Earn <span className="text-gradient">Saath Coins</span> By Sharing
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Love Saath Ghoomo? Share it with your friends and earn Saath Coins that you can use 
              for your next companion booking. The more you share, the more you earn!
            </p>

            {/* Referral Code Card */}
            <Card variant="romantic" className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
                    <p className="text-2xl font-bold text-primary font-display">{referralCode}</p>
                  </div>
                  <Button variant="romantic" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Highlight */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gold/10 border border-gold/20">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                <Gift className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Earn 100 Saath Coins</p>
                <p className="text-sm text-muted-foreground">For every successful referral</p>
              </div>
            </div>
          </div>

          {/* Right Content - Steps */}
          <div className="space-y-6">
            {referralSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 p-6 rounded-2xl bg-card shadow-card hover:shadow-romantic transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < referralSteps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-primary/50 flex-shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferSection;
