import { Heart, Instagram, Twitter, Facebook, Mail } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <span className="font-display text-2xl font-bold">
                Saath <span className="text-primary">Ghoomo</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 mb-6">
              Find your perfect companion for any adventure. Safe, verified, and memorable experiences await.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/saathghoomo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://x.com/SaathGhoomo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com/saathghoomo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:support@saathghoomo.com" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Saath Ghoomo. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
