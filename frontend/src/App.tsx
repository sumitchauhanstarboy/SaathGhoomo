import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Handles OAuth redirect fragments like #accessToken=...&refreshToken=... */}
          <OAuthHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

function OAuthHandler() {
  const navigate = useNavigate();

  // Run once on mount to parse tokens returned in URL fragment
  useEffect(() => {
    try {
      const hash = window.location.hash || "";
      if (!hash) return;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Remove fragment from URL to clean up
      const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);

      // Redirect to home
      navigate("/", { replace: true });
    } catch (e) {
      // ignore
    }
  }, [navigate]);

  return null;
}

export default App;
