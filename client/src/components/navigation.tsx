import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/discover", label: "Discover", dataTestId: "link-discover" },
    { href: "/providers", label: "Partners", dataTestId: "link-providers" },
    { href: "/planning", label: "Planning", dataTestId: "link-planning" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <h1 className="text-2xl font-bold text-forest cursor-pointer hover:opacity-80 transition-opacity">
                  TrekTracker
                </h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} data-testid={item.dataTestId}>
                    <span
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        location === item.href
                          ? "text-forest bg-forest/10"
                          : "text-slate-gray hover:text-forest hover:bg-forest/5"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
              onClick={() => alert('OAuth not configured for demo. Continue as guest!')}
              data-testid="button-google-login"
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
