import { Heart } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Heart className="h-8 w-8 text-primary fill-primary animate-heart-beat" />
        <Heart className="h-8 w-8 text-primary/30 fill-primary/30 absolute top-0 left-0 animate-ping" />
      </div>
      <span className="font-display text-2xl font-bold text-foreground">
        Saath <span className="text-primary">Ghoomo</span>
      </span>
    </div>
  );
};

export default Logo;
