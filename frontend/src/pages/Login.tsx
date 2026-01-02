import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";
import { loginWithEmail, signInWithGoogle } from "@/api/authService";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const result = await loginWithEmail({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      navigate("/");
    } else {
      toast({
        title: "Google Sign-In Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
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

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
              <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
              <span className="text-primary-foreground text-sm font-medium">Welcome Back</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
              Sign In
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Log in to your Saath Ghoomo account
            </p>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-md bg-primary-foreground/10 border border-primary-foreground/20 p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/50"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-primary-foreground font-medium">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gold-light hover:text-gold transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/50"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-foreground/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-primary-foreground/10 text-primary-foreground/70">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="glass"
              size="lg"
              className="w-full text-primary-foreground border-primary-foreground/30"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.5,12.545,1.5 c-6.029,0-10.9,4.871-10.9,10.9c0,6.029,4.871,10.9,10.9,10.9c6.029,0,10.9-4.871,10.9-10.9c0-0.393-0.023-0.781-0.069-1.163H12.545z" />
              </svg>
              Google
            </Button>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-primary-foreground/80">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-gold-light hover:text-gold font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </Card>

          {/* Terms */}
          <p className="text-center text-primary-foreground/60 text-sm mt-6">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-gold-light hover:text-gold">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-gold-light hover:text-gold">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
