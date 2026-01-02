import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Users,
  Filter,
  DollarSign
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Companion {
  id: number;
  name: string;
  age: number;
  location: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  bio: string;
  interests: string[];
  availability: string;
  image: string;
}

const Bookings = () => {
  const navigate = useNavigate();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [filteredCompanions, setFilteredCompanions] = useState<Companion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  useEffect(() => {
    // TODO: Fetch companions from API
    const mockCompanions: Companion[] = [
      {
        id: 1,
        name: "Priya Sharma",
        age: 24,
        location: "Mumbai",
        rating: 4.8,
        reviews: 47,
        pricePerHour: 500,
        bio: "Adventure enthusiast, love exploring new places and meeting new people. Let's create amazing memories together!",
        interests: ["Movies", "Dining", "Shopping", "City Tours"],
        availability: "Weekends",
        image: "/api/placeholder/200/200"
      },
      {
        id: 2,
        name: "Rahul Verma",
        age: 28,
        location: "Delhi",
        rating: 4.9,
        reviews: 63,
        pricePerHour: 600,
        bio: "Professional companion with expertise in city tours and cultural experiences. Your perfect adventure partner!",
        interests: ["City Tours", "Museums", "Photography", "Food"],
        availability: "Flexible",
        image: "/api/placeholder/200/200"
      },
      {
        id: 3,
        name: "Ananya Patel",
        age: 26,
        location: "Bangalore",
        rating: 4.7,
        reviews: 35,
        pricePerHour: 450,
        bio: "Fun-loving companion who enjoys movies, concerts, and outdoor activities. Let's have some fun!",
        interests: ["Movies", "Concerts", "Parks", "Coffee"],
        availability: "Evenings",
        image: "/api/placeholder/200/200"
      }
    ];
    
    setCompanions(mockCompanions);
    setFilteredCompanions(mockCompanions);
  }, []);

  useEffect(() => {
    let filtered = companions;

    if (searchTerm) {
      filtered = filtered.filter(companion => 
        companion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companion.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companion.interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(companion => companion.location === selectedLocation);
    }

    if (selectedActivity) {
      filtered = filtered.filter(companion => 
        companion.interests.some(interest => 
          interest.toLowerCase().includes(selectedActivity.toLowerCase())
        )
      );
    }

    setFilteredCompanions(filtered);
  }, [searchTerm, selectedLocation, selectedActivity, companions]);

  const handleBookCompanion = (companionId: number) => {
    // TODO: Navigate to booking details page
    navigate(`/book/${companionId}`);
  };

  return (
    <>
      <Helmet>
        <title>Find Companions - Saath Ghoomo</title>
        <meta name="description" content="Find verified companions for movies, dinners, city tours, and adventures" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect Companion</h1>
              <p className="text-muted-foreground text-lg">Browse verified companions for your next adventure</p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, interests, or bio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Activities</SelectItem>
                      <SelectItem value="Movies">Movies</SelectItem>
                      <SelectItem value="Dining">Dining</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="City Tours">City Tours</SelectItem>
                      <SelectItem value="Concerts">Concerts</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredCompanions.length} of {companions.length} companions
              </p>
            </div>

            {/* Companion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanions.map((companion) => (
                <Card key={companion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{companion.name}</h3>
                        <p className="text-muted-foreground">{companion.age} years • {companion.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{companion.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">({companion.reviews} reviews)</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {companion.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {companion.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {companion.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{companion.interests.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{companion.availability}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        <span>{companion.pricePerHour}/hr</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/companion/${companion.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handleBookCompanion(companion.id)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCompanions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No companions found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setSelectedLocation("");
                    setSelectedActivity("");
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Bookings;
