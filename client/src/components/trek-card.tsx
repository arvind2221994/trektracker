import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trek } from "@shared/schema";
import { Star, Heart, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TrekCardProps {
  trek: Trek;
  isInWishlist?: boolean;
  showWishlistButton?: boolean;
}

export default function TrekCard({ trek, isInWishlist = false, showWishlistButton = true }: TrekCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToWishlistMutation = useMutation({
    mutationFn: async (trekId: string) => {
      const response = await apiRequest("POST", "/api/wishlist", { trekId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to Wishlist",
        description: `${trek.name} has been added to your wishlist.`,
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
        description: `${trek.name} has been removed from your wishlist.`,
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

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      await removeFromWishlistMutation.mutateAsync(trek.id);
    } else {
      await addToWishlistMutation.mutateAsync(trek.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-600";
      case "moderate":
        return "bg-sage";
      case "challenging":
        return "bg-warm-orange";
      default:
        return "bg-slate-gray";
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "bikat":
        return "bg-blue-600";
      case "yhai":
        return "bg-green-600";
      case "indiahikes":
        return "bg-orange-600";
      default:
        return "bg-forest";
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "bikat":
        return "Bikat";
      case "yhai":
        return "YHAI";
      case "indiahikes":
        return "Indiahikes";
      default:
        return "Custom";
    }
  };

  const rating = trek.rating / 10; // Convert from 1-50 to 0.1-5.0 scale

  return (
    <Card 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      data-testid={`card-trek-${trek.id}`}
    >
      <Link href={`/trek/${trek.id}`}>
        <div>
          <img 
            src={trek.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`}
            alt={trek.name}
            className="w-full h-48 object-cover"
            data-testid={`img-trek-${trek.id}`}
          />
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-forest" data-testid={`text-trek-name-${trek.id}`}>
                {trek.name}
              </h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-warm-orange mr-1" />
                <span className="text-sm font-medium" data-testid={`text-trek-rating-${trek.id}`}>
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-gray" data-testid={`text-trek-location-${trek.id}`}>
                {trek.location}
              </p>
              {trek.provider && trek.provider !== 'custom' && (
                <span className={`text-xs px-2 py-1 rounded-full text-white ${getProviderColor(trek.provider)}`} data-testid={`badge-provider-${trek.id}`}>
                  {getProviderName(trek.provider)}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mb-4">
              <span 
                className={cn(
                  "text-white px-3 py-1 rounded-full text-sm font-medium",
                  getDifficultyColor(trek.difficulty)
                )}
                data-testid={`badge-trek-difficulty-${trek.id}`}
              >
                {trek.difficulty}
              </span>
              <span className="text-slate-gray text-sm" data-testid={`text-trek-duration-${trek.id}`}>
                {trek.duration} days
              </span>
            </div>
            <p className="text-slate-gray text-sm mb-4 line-clamp-2" data-testid={`text-trek-description-${trek.id}`}>
              {trek.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-forest font-semibold text-sm" data-testid={`text-trek-best-time-${trek.id}`}>
                  Best: {trek.bestMonths.slice(0, 2).join("-")}
                </span>
                {trek.price && (
                  <span className="text-warm-orange font-semibold text-sm" data-testid={`text-trek-price-${trek.id}`}>
                    ₹{trek.price.toLocaleString()}
                  </span>
                )}
              </div>
              {showWishlistButton && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sage hover:text-forest p-1"
                    onClick={handleWishlistToggle}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                    data-testid={`button-wishlist-${trek.id}`}
                  >
                    <Heart className={cn("h-4 w-4", isInWishlist && "fill-current text-red-500")} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sage hover:text-forest p-1"
                    data-testid={`button-compare-${trek.id}`}
                  >
                    <Scale className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
