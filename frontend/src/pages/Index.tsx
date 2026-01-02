import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import SaathCoinsSection from "@/components/SaathCoinsSection";
import ReferSection from "@/components/ReferSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Saath Ghoomo - Find Your Perfect Companion for Any Adventure</title>
        <meta 
          name="description" 
          content="Book verified companions for movies, dinners, city tours, and adventures. Safe, trusted, and memorable experiences with Saath Ghoomo." 
        />
        <meta name="keywords" content="companion booking, social companion, city tours, adventure partner, Saath Ghoomo" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <HowItWorks />
          <FeaturesSection />
          <SaathCoinsSection />
          <ReferSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
