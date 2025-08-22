import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProfileSchema, insertWishlistSchema, insertTrekPlanSchema } from "@shared/schema";
import { setupAuthentication } from "./auth/auth-routes";
import { DataSyncService } from "./data-sync";
import { z } from "zod";

const searchFiltersSchema = z.object({
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  climate: z.string().optional(),
  country: z.string().optional(),
  search: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuthentication(app);
  
  // Initialize and start data sync service
  const dataSyncService = new DataSyncService();
  dataSyncService.startPeriodicSync();
  // Trek routes
  app.get("/api/treks", async (req, res) => {
    try {
      const treks = await storage.getAllTreks();
      res.json(treks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch treks" });
    }
  });

  app.get("/api/treks/search", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse(req.query);
      const treks = await storage.searchTreks(filters);
      res.json(treks);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  app.get("/api/treks/:id", async (req, res) => {
    try {
      const trek = await storage.getTrek(req.params.id);
      if (!trek) {
        return res.status(404).json({ message: "Trek not found" });
      }
      res.json(trek);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trek" });
    }
  });

  // User profile routes
  app.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertUserProfileSchema.parse(req.body);
      // For demo purposes, using a static userId. In real app, get from session/auth
      const userId = "demo-user-id";
      
      // Check if profile already exists
      const existingProfile = await storage.getUserProfile(userId);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, profileData);
      } else {
        profile = await storage.createUserProfile({ ...profileData, userId });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  app.get("/api/profile", async (req, res) => {
    try {
      // For demo purposes, using a static userId
      const userId = "demo-user-id";
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Recommendations route
  app.get("/api/recommendations", async (req, res) => {
    try {
      // For demo purposes, using a static userId
      const userId = "demo-user-id";
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        // Return popular treks if no profile
        const allTreks = await storage.getAllTreks();
        const popularTreks = allTreks.sort((a, b) => b.rating - a.rating).slice(0, 6);
        return res.json(popularTreks);
      }
      
      const recommendations = await storage.getRecommendedTreks(profile);
      res.json(recommendations.slice(0, 6));
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", async (req, res) => {
    try {
      const userId = "demo-user-id";
      const wishlistItems = await storage.getUserWishlist(userId);
      
      // Get trek details for each wishlist item
      const trekIds = wishlistItems.map(item => item.trekId);
      const treks = [];
      for (const trekId of trekIds) {
        const trek = await storage.getTrek(trekId);
        if (trek) treks.push(trek);
      }
      
      res.json(treks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const userId = "demo-user-id";
      const { trekId } = req.body;
      
      if (!trekId) {
        return res.status(400).json({ message: "Trek ID is required" });
      }
      
      const wishlistItem = await storage.addToWishlist({ userId, trekId });
      res.json(wishlistItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:trekId", async (req, res) => {
    try {
      const userId = "demo-user-id";
      const { trekId } = req.params;
      
      const removed = await storage.removeFromWishlist(userId, trekId);
      if (!removed) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Trek plans routes
  app.get("/api/plans", async (req, res) => {
    try {
      const userId = "demo-user-id";
      const plans = await storage.getUserTrekPlans(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trek plans" });
    }
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const userId = "demo-user-id";
      const planData = insertTrekPlanSchema.parse({ ...req.body, userId });
      
      const plan = await storage.createTrekPlan(planData);
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trek plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
