import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Wallet, 
  Star, 
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Heart
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalCoins: 0,
    averageRating: 0,
    upcomingBookings: []
  });

  useEffect(() => {
    // TODO: Fetch user data from API
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Mock data for now
    setUserStats({
      totalBookings: 12,
      completedBookings: 8,
      totalCoins: 2500,
      averageRating: 4.8,
      upcomingBookings: [
        {
          id: 1,
          partnerName: "Priya Sharma",
          date: "2025-01-05",
          time: "18:00",
          activity: "Dinner at Italian Restaurant",
          status: "confirmed"
        },
        {
          id: 2,
          partnerName: "Rahul Verma",
          date: "2025-01-07",
          time: "14:00",
          activity: "City Tour & Shopping",
          status: "pending"
        }
      ]
    });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Dashboard - Saath Ghoomo</title>
        <meta name="description" content="Manage your bookings, wallet, and profile on Saath Ghoomo" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back!</h1>
              <p className="text-muted-foreground text-lg">Manage your adventures and connections</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-pink-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-pink-900">{userStats.totalBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-pink-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Completed</p>
                      <p className="text-3xl font-bold text-purple-900">{userStats.completedBookings}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Saath Coins</p>
                      <p className="text-3xl font-bold text-amber-900">{userStats.totalCoins}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Rating</p>
                      <p className="text-3xl font-bold text-green-900">{userStats.averageRating}</p>
                    </div>
                    <Star className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Bookings</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Adventures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userStats.upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {userStats.upcomingBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h3 className="font-semibold">{booking.activity}</h3>
                              <p className="text-sm text-muted-foreground">with {booking.partnerName}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {booking.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No upcoming bookings</p>
                        <Button className="mt-4" onClick={() => navigate('/bookings')}>
                          Find a Companion
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Past Adventures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your past adventures will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Saath Coins Wallet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-2xl font-bold mb-2">{userStats.totalCoins} Coins</p>
                      <p className="text-muted-foreground">Earn coins by completing adventures and referring friends</p>
                      <div className="flex gap-2 justify-center mt-4">
                        <Button variant="outline">Transaction History</Button>
                        <Button>Earn More Coins</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Profile management coming soon</p>
                      <Button variant="outline" className="mt-4">Edit Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/bookings')}>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Find Companions</h3>
                  <p className="text-sm text-muted-foreground">Browse available companions</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/wallet')}>
                <CardContent className="p-6 text-center">
                  <Wallet className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Manage Wallet</h3>
                  <p className="text-sm text-muted-foreground">View coins and transactions</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/referrals')}>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Refer Friends</h3>
                  <p className="text-sm text-muted-foreground">Earn coins by referring</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
