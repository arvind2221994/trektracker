import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trek } from "@shared/schema";
import { ExternalLink, Users, Star, Calendar, MapPin } from "lucide-react";

export default function Providers() {
  const { data: treks, isLoading } = useQuery<Trek[]>({
    queryKey: ["/api/treks"],
  });

  const providerStats = {
    bikat: treks?.filter(trek => trek.provider === 'bikat') || [],
    yhai: treks?.filter(trek => trek.provider === 'yhai') || [],
    indiahikes: treks?.filter(trek => trek.provider === 'indiahikes') || [],
    custom: treks?.filter(trek => trek.provider === 'custom') || [],
  };

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case 'bikat':
        return {
          name: 'Bikat Adventures',
          description: 'Premium trekking company with 14+ years experience. Known for structured progression system and small group sizes.',
          website: 'https://www.bikatadventures.com',
          specialty: 'Premium treks, BRS rating system, max 15 people per group',
          color: 'bg-blue-600',
          established: '2010'
        };
      case 'yhai':
        return {
          name: 'Youth Hostels Association of India',
          description: "India's largest budget adventure organization since 1952. Affordable treks and educational programs.",
          website: 'https://www.yhaindia.org',
          specialty: 'Budget-friendly treks, youth hostels, educational programs',
          color: 'bg-green-600',
          established: '1952'
        };
      case 'indiahikes':
        return {
          name: 'Indiahikes',
          description: "India's largest trekking organization with 200+ documented treks across 26+ states.",
          website: 'https://indiahikes.com',
          specialty: 'Largest trek database, comprehensive documentation',
          color: 'bg-orange-600',
          established: '2014'
        };
      default:
        return {
          name: 'TrekTracker Custom',
          description: 'Curated treks from various sources and local guides.',
          website: '#',
          specialty: 'Custom curated content',
          color: 'bg-forest',
          established: '2024'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest"></div>
          <p className="mt-4 text-slate-gray">Loading provider information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige" data-testid="providers-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-forest mb-4" data-testid="text-providers-title">
            Adventure Company Partners
          </h1>
          <p className="text-lg text-slate-gray" data-testid="text-providers-description">
            We partner with India's leading trekking organizations to bring you comprehensive trek information
          </p>
        </div>

        {/* Provider Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {Object.entries(providerStats).map(([provider, trekList]) => {
            const info = getProviderInfo(provider);
            return (
              <Card key={provider} className="text-center bg-white">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${info.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-forest mb-2">{info.name}</h3>
                  <div className="text-2xl font-bold text-forest mb-1">{trekList.length}</div>
                  <div className="text-slate-gray text-sm">Available Treks</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Provider Information */}
        <div className="space-y-8">
          {Object.entries(providerStats).map(([provider, trekList]) => {
            const info = getProviderInfo(provider);
            if (trekList.length === 0) return null;

            return (
              <Card key={provider} className="bg-white" data-testid={`card-provider-${provider}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${info.color} rounded-full flex items-center justify-center`}>
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-forest">{info.name}</CardTitle>
                        <p className="text-slate-gray text-sm">Est. {info.established}</p>
                      </div>
                    </div>
                    {info.website !== '#' && (
                      <a
                        href={info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sage hover:text-forest transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-slate-gray mb-2">{info.description}</p>
                    <Badge variant="outline" className="text-forest border-forest">
                      {info.specialty}
                    </Badge>
                  </div>

                  {/* Trek Listings */}
                  <div>
                    <h4 className="font-semibold text-forest mb-4 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Available Treks ({trekList.length})
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {trekList.slice(0, 6).map((trek) => (
                        <div key={trek.id} className="bg-warm-beige p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-forest text-sm">{trek.name}</h5>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-warm-orange mr-1" />
                              <span className="text-xs">{(trek.rating / 10).toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-gray mb-2">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {trek.duration} days
                            </span>
                            <span>{trek.difficulty}</span>
                          </div>
                          <p className="text-xs text-slate-gray line-clamp-2">{trek.description}</p>
                          {trek.price && (
                            <div className="mt-2 text-xs font-medium text-forest">
                              ₹{trek.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {trekList.length > 6 && (
                      <div className="mt-4 text-center">
                        <p className="text-slate-gray text-sm">
                          And {trekList.length - 6} more treks available...
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Data Sync Information */}
        <Card className="mt-12 bg-sage/10">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-forest mb-2">🔄 Live Data Integration</h3>
            <p className="text-slate-gray text-sm">
              Trek information is automatically synchronized every 24 hours from our partner organizations to ensure you have the latest details, pricing, and availability.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}