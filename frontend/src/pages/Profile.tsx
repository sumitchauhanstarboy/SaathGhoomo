import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Calendar,
  Star,
  Heart,
  Camera,
  Save,
  Edit,
  Phone,
  Mail,
  Globe,
  Languages,
  Music,
  Book,
  Coffee,
  Plane,
  Gamepad2
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    age: 25,
    location: "Mumbai",
    bio: "Adventure enthusiast looking for amazing experiences and great company. Love exploring new places and trying different cuisines.",
    interests: ["Movies", "Dining", "Travel", "Photography", "Music"],
    languages: ["English", "Hindi"],
    availability: "Weekends",
    pricePerHour: 400,
    isCompanion: false
  });

  const [stats, setStats] = useState({
    totalBookings: 12,
    completedBookings: 8,
    averageRating: 4.8,
    totalReviews: 15
  });

  useEffect(() => {
    // TODO: Fetch profile data from API
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    // TODO: Save profile data to API
    setIsEditing(false);
  };

  const interestOptions = [
    "Movies", "Dining", "Travel", "Photography", "Music", "Art", "Sports",
    "Shopping", "Coffee", "Nightlife", "Parks", "Museums", "Concerts", "Theater",
    "Gaming", "Reading", "Cooking", "Dancing", "Hiking", "Cycling"
  ];

  const languageOptions = [
    "English", "Hindi", "Spanish", "French", "German", "Italian", "Portuguese",
    "Chinese", "Japanese", "Korean", "Arabic", "Russian", "Bengali", "Tamil"
  ];

  const getInterestIcon = (interest: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "Movies": <Camera className="h-4 w-4" />,
      "Travel": <Plane className="h-4 w-4" />,
      "Music": <Music className="h-4 w-4" />,
      "Reading": <Book className="h-4 w-4" />,
      "Coffee": <Coffee className="h-4 w-4" />,
      "Gaming": <Gamepad2 className="h-4 w-4" />
    };
    return iconMap[interest] || <Heart className="h-4 w-4" />;
  };

  return (
    <>
      <Helmet>
        <title>Profile - Saath Ghoomo</title>
        <meta name="description" content="Manage your profile and preferences on Saath Ghoomo" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
                <p className="text-muted-foreground text-lg">Manage your personal information and preferences</p>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={profileData.age}
                          onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Interests & Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Interests & Languages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Interests</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {getInterestIcon(interest)}
                            {interest}
                            {isEditing && (
                              <button
                                onClick={() => setProfileData({
                                  ...profileData,
                                  interests: profileData.interests.filter(i => i !== interest)
                                })}
                                className="ml-1 text-xs"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Select onValueChange={(value) => {
                          if (!profileData.interests.includes(value)) {
                            setProfileData({
                              ...profileData,
                              interests: [...profileData.interests, value]
                            });
                          }
                        }}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Add interests..." />
                          </SelectTrigger>
                          <SelectContent>
                            {interestOptions
                              .filter(interest => !profileData.interests.includes(interest))
                              .map(interest => (
                                <SelectItem key={interest} value={interest}>
                                  {interest}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div>
                      <Label>Languages</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.languages.map((language, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <Languages className="h-3 w-3" />
                            {language}
                            {isEditing && (
                              <button
                                onClick={() => setProfileData({
                                  ...profileData,
                                  languages: profileData.languages.filter(l => l !== language)
                                })}
                                className="ml-1 text-xs"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Select onValueChange={(value) => {
                          if (!profileData.languages.includes(value)) {
                            setProfileData({
                              ...profileData,
                              languages: [...profileData.languages, value]
                            });
                          }
                        }}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Add languages..." />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions
                              .filter(language => !profileData.languages.includes(language))
                              .map(language => (
                                <SelectItem key={language} value={language}>
                                  {language}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Companion Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Become a Companion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Offer Companion Services</p>
                        <p className="text-sm text-muted-foreground">
                          Allow others to book you as a companion
                        </p>
                      </div>
                      <Button
                        variant={profileData.isCompanion ? "default" : "outline"}
                        onClick={() => setProfileData({...profileData, isCompanion: !profileData.isCompanion})}
                        disabled={!isEditing}
                      >
                        {profileData.isCompanion ? "Active" : "Inactive"}
                      </Button>
                    </div>

                    {profileData.isCompanion && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="availability">Availability</Label>
                          <Select
                            value={profileData.availability}
                            onValueChange={(value) => setProfileData({...profileData, availability: value})}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Weekdays">Weekdays</SelectItem>
                              <SelectItem value="Weekends">Weekends</SelectItem>
                              <SelectItem value="Flexible">Flexible</SelectItem>
                              <SelectItem value="Evenings">Evenings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="price">Price per Hour (Coins)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={profileData.pricePerHour}
                            onChange={(e) => setProfileData({...profileData, pricePerHour: parseInt(e.target.value)})}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Avatar */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src="/api/placeholder/200/200" />
                      <AvatarFallback className="text-2xl">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{profileData.name}</h3>
                    <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {profileData.location}
                    </p>
                    {isEditing && (
                      <Button variant="outline" size="sm" className="mt-4">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>My Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Bookings</span>
                      <span className="font-semibold">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-semibold">{stats.completedBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{stats.averageRating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <span className="font-semibold">{stats.totalReviews}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      View My Bookings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      My Reviews
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="h-4 w-4 mr-2" />
                      Favorites
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Profile;
