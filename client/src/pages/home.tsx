import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileSetup from "@/components/profile-setup";
import TrekCard from "@/components/trek-card";
import { Trek } from "@shared/schema";
import { Star, Users, Globe, TrendingUp } from "lucide-react";

export default function Home() {
  const { data: recommendations, isLoading } = useQuery<Trek[]>({
    queryKey: ["/api/recommendations"],
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-center justify-center text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        data-testid="hero-section"
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90" data-testid="text-hero-description">
            Personalized trek recommendations based on your preferences and experience level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-warm-orange text-white hover:bg-warm-orange/90 px-8 py-3 text-lg"
              data-testid="button-start-profile"
              onClick={() => document.getElementById('profile-setup')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Profile
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-slate-gray px-8 py-3 text-lg"
              data-testid="button-explore-treks"
              asChild
            >
              <Link href="/discover">Explore Treks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Profile Setup or Recommendations */}
      {!profile ? (
        <ProfileSetup />
      ) : (
        <>
          {/* Stats Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <Globe className="h-12 w-12 text-forest mb-4" />
                  <div className="text-3xl font-bold text-forest">500+</div>
                  <div className="text-slate-gray">Global Treks</div>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-12 w-12 text-sage mb-4" />
                  <div className="text-3xl font-bold text-forest">10K+</div>
                  <div className="text-slate-gray">Happy Trekkers</div>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="h-12 w-12 text-warm-orange mb-4" />
                  <div className="text-3xl font-bold text-forest">4.8/5</div>
                  <div className="text-slate-gray">Average Rating</div>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-12 w-12 text-forest mb-4" />
                  <div className="text-3xl font-bold text-forest">95%</div>
                  <div className="text-slate-gray">Success Rate</div>
                </div>
              </div>
            </div>
          </section>

          {/* Recommendations Section */}
          <section className="py-16 bg-warm-beige" data-testid="recommendations-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-forest mb-4" data-testid="text-recommendations-title">
                  Recommended for You
                </h2>
                <p className="text-lg text-slate-gray" data-testid="text-recommendations-description">
                  Based on your profile, here are some perfect matches
                </p>
              </div>

              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              ) : recommendations && recommendations.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="recommendations-grid">
                  {recommendations.map((trek) => (
                    <TrekCard key={trek.id} trek={trek} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" data-testid="no-recommendations">
                  <p className="text-slate-gray">No recommendations available. Complete your profile to get personalized suggestions.</p>
                </div>
              )}

              <div className="text-center mt-12">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-sage text-white hover:bg-sage/90"
                  data-testid="button-view-all-treks"
                  asChild
                >
                  <Link href="/discover">View All Treks</Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-forest text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TrekTracker</h3>
              <p className="text-gray-300 mb-4">
                Discover and plan your next adventure with personalized recommendations and comprehensive preparation guides.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/discover"><a className="hover:text-white transition-colors">Popular Treks</a></Link></li>
                <li><a href="#" className="hover:text-white transition-colors">By Difficulty</a></li>
                <li><a href="#" className="hover:text-white transition-colors">By Duration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">By Season</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Planning</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/planning"><a className="hover:text-white transition-colors">Preparation Guide</a></Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Packing Lists</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Plans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 TrekTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
