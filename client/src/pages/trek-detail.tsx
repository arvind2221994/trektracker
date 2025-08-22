import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trek } from "@shared/schema";
import { Star, Heart, ArrowLeft, Mountain, Home, Users, Camera, MapPin, Calendar, Clock, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function TrekDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trek, isLoading } = useQuery<Trek>({
    queryKey: [`/api/treks/${id}`],
    enabled: !!id,
  });

  const { data: wishlist } = useQuery<Trek[]>({
    queryKey: ["/api/wishlist"],
  });

  const isInWishlist = wishlist?.some(item => item.id === id);

  const addToWishlistMutation = useMutation({
    mutationFn: async (trekId: string) => {
      const response = await apiRequest("POST", "/api/wishlist", { trekId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to Wishlist",
        description: `${trek?.name} has been added to your wishlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (trekId: string) => {
      const response = await apiRequest("DELETE", `/api/wishlist/${trekId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Removed from Wishlist",
        description: `${trek?.name} has been removed from your wishlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createTrekPlanMutation = useMutation({
    mutationFn: async (trekId: string) => {
      const response = await apiRequest("POST", "/api/plans", { trekId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: "Trek Plan Created",
        description: "Your personalized trek plan has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create trek plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWishlistToggle = async () => {
    if (!id) return;

    if (isInWishlist) {
      await removeFromWishlistMutation.mutateAsync(id);
    } else {
      await addToWishlistMutation.mutateAsync(id);
    }
  };

  const handleStartPlanning = async () => {
    if (!id) return;
    await createTrekPlanMutation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest"></div>
          <p className="mt-4 text-slate-gray">Loading trek details...</p>
        </div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-forest mb-4">Trek not found</h1>
          <Link href="/discover">
            <Button variant="outline" data-testid="button-back-discover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discover
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rating = trek.rating / 10;

  return (
    <div className="min-h-screen bg-white" data-testid="trek-detail">
      {/* Breadcrumb */}
      <div className="bg-warm-beige py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/discover">
              <a className="text-slate-gray hover:text-forest transition-colors" data-testid="breadcrumb-discover">
                Discover
              </a>
            </Link>
            <span className="text-slate-gray">/</span>
            <span className="text-forest font-medium" data-testid="breadcrumb-current">
              {trek.name}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Trek Images */}
            <div className="space-y-4">
              <img 
                src={trek.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                alt={trek.name}
                className="w-full h-64 md:h-96 object-cover rounded-xl"
                data-testid="img-trek-main"
              />
            </div>

            {/* Trek Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-forest" data-testid="text-trek-title">
                    {trek.name}
                  </h1>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-warm-orange mr-1" />
                    <span className="font-semibold text-lg" data-testid="text-trek-rating">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-slate-gray ml-2" data-testid="text-trek-reviews">
                      ({trek.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-xl text-slate-gray mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span data-testid="text-trek-location">{trek.location}</span>
                </div>
                <p className="text-slate-gray leading-relaxed" data-testid="text-trek-description">
                  {trek.longDescription || trek.description}
                </p>
              </div>

              {/* Quick Stats */}
              <Card className="bg-warm-beige" data-testid="card-trek-stats">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-forest mr-2" />
                      </div>
                      <div className="text-2xl font-bold text-forest" data-testid="text-trek-duration">
                        {trek.duration}
                      </div>
                      <div className="text-slate-gray text-sm">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Mountain className="h-5 w-5 text-forest mr-2" />
                      </div>
                      <div className="text-2xl font-bold text-forest" data-testid="text-trek-distance">
                        {trek.distance}
                      </div>
                      <div className="text-slate-gray text-sm">km Total</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Gauge className="h-5 w-5 text-forest mr-2" />
                      </div>
                      <div className="text-2xl font-bold text-forest" data-testid="text-trek-elevation">
                        {trek.maxElevation?.toLocaleString()}
                      </div>
                      <div className="text-slate-gray text-sm">m Max Elevation</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Mountain className="h-5 w-5 text-forest mr-2" />
                      </div>
                      <div className="text-2xl font-bold text-forest" data-testid="text-trek-difficulty">
                        {trek.difficulty}
                      </div>
                      <div className="text-slate-gray text-sm">Difficulty</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Time */}
              <Card className="bg-sage/10" data-testid="card-best-time">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-forest mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Best Time to Trek
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trek.bestMonths.map((month) => (
                      <Badge key={month} variant="secondary" className="bg-sage/20 text-forest">
                        {month}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  onClick={handleStartPlanning}
                  className="flex-1 bg-forest text-white hover:bg-forest/90 py-3"
                  disabled={createTrekPlanMutation.isPending}
                  data-testid="button-start-planning"
                >
                  {createTrekPlanMutation.isPending ? "Creating Plan..." : "Start Planning"}
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 border-2 border-sage text-sage hover:bg-sage hover:text-white"
                  onClick={handleWishlistToggle}
                  disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                  data-testid="button-wishlist-toggle"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
                  {isInWishlist ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 bg-warm-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full" data-testid="tabs-trek-details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="highlights" data-testid="tab-highlights">Highlights</TabsTrigger>
              <TabsTrigger value="preparation" data-testid="tab-preparation">Preparation</TabsTrigger>
              <TabsTrigger value="requirements" data-testid="tab-requirements">Requirements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-forest mb-4">What to Expect</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Mountain className="h-5 w-5 text-sage mt-1 mr-3" />
                        <div>
                          <div className="font-medium">High Altitude</div>
                          <div className="text-slate-gray text-sm">Maximum elevation of {trek.maxElevation?.toLocaleString()}m</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Home className="h-5 w-5 text-sage mt-1 mr-3" />
                        <div>
                          <div className="font-medium">Accommodation</div>
                          <div className="text-slate-gray text-sm">Traditional lodges and camping</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-sage mt-1 mr-3" />
                        <div>
                          <div className="font-medium">Local Culture</div>
                          <div className="text-slate-gray text-sm">Experience authentic traditions</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Camera className="h-5 w-5 text-sage mt-1 mr-3" />
                        <div>
                          <div className="font-medium">Scenic Views</div>
                          <div className="text-slate-gray text-sm">Breathtaking mountain landscapes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="highlights" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-forest mb-4">Trek Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {trek.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-warm-beige rounded-lg">
                        <div className="w-2 h-2 bg-forest rounded-full"></div>
                        <span className="text-slate-gray">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preparation" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-forest mb-4">Preparation Guidelines</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Physical Preparation</h4>
                      <p className="text-slate-gray mb-4">Start training at least 3-6 months before your trek.</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-gray ml-4">
                        <li>Build cardiovascular endurance</li>
                        <li>Strengthen leg and core muscles</li>
                        <li>Practice hiking with a loaded backpack</li>
                        <li>Gradually increase hiking distances</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Mental Preparation</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-gray ml-4">
                        <li>Research the trek route and conditions</li>
                        <li>Set realistic expectations</li>
                        <li>Practice mindfulness and meditation</li>
                        <li>Build mental resilience for challenging days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="requirements" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-forest mb-4">Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-forest mb-3">Fitness Requirements</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-gray">Recommended Fitness Level:</span>
                          <Badge variant="outline">{(trek.requirements as any)?.fitnessLevel || "Intermediate"}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-gray">Prior Experience:</span>
                          <Badge variant="outline">{(trek.requirements as any)?.experience || "Some"}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-forest mb-3">Essential Gear</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-gray text-sm">
                        <li>Quality hiking boots</li>
                        <li>Weather-appropriate clothing</li>
                        <li>Sleeping bag rated for conditions</li>
                        <li>Trekking poles</li>
                        <li>First aid kit</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
