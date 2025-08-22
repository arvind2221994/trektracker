import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Discover from "@/pages/discover";
import TrekDetail from "@/pages/trek-detail";
import Planning from "@/pages/planning";
import Navigation from "@/components/navigation";

function Router() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/discover" component={Discover} />
        <Route path="/trek/:id" component={TrekDetail} />
        <Route path="/planning" component={Planning} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
