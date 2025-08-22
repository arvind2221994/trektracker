import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TrekCard from "@/components/trek-card";
import TrekFilters from "@/components/trek-filters";
import { Trek } from "@shared/schema";

export default function Discover() {
  const [filters, setFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: treks, isLoading } = useQuery<Trek[]>({
    queryKey: ["/api/treks/search", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/treks/search?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch treks");
      return response.json();
    },
  });

  const { data: wishlist } = useQuery<Trek[]>({
    queryKey: ["/api/wishlist"],
  });

  const wishlistIds = new Set(wishlist?.map(trek => trek.id) || []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-white" data-testid="discover-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-forest mb-4" data-testid="text-discover-title">
              Discover Amazing Treks
            </h1>
            <p className="text-lg text-slate-gray mb-8" data-testid="text-discover-description">
              Explore our collection of world-class trekking adventures
            </p>
            
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
                data-testid="button-toggle-filters"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <TrekFilters
                filters={filters}
                onFiltersChange={setFilters}
                className="mb-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trek Results */}
      <section className="py-16 bg-warm-beige" data-testid="discover-results">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-t-xl"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : treks && treks.length > 0 ? (
            <div>
              <div className="mb-6">
                <p className="text-slate-gray text-sm" data-testid="text-results-count">
                  Found {treks.length} trek{treks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="treks-grid">
                {treks.map((trek) => (
                  <TrekCard
                    key={trek.id}
                    trek={trek}
                    isInWishlist={wishlistIds.has(trek.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12" data-testid="no-results">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-forest mb-4">No treks found</h3>
                <p className="text-slate-gray mb-6">
                  Try adjusting your filters or search terms to find more results.
                </p>
                <Button
                  onClick={() => setFilters({})}
                  variant="outline"
                  data-testid="button-clear-filters"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
