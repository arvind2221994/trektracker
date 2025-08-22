import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ageRange: text("age_range").notNull(),
  fitnessLevel: text("fitness_level").notNull(),
  trekExperience: text("trek_experience").notNull(),
  preferredDurations: text("preferred_durations").array().notNull(),
  climatePreferences: text("climate_preferences").array().notNull(),
  travelRadius: text("travel_radius").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const treks = pgTable("treks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: integer("duration").notNull(), // in days
  distance: integer("distance"), // in km
  maxElevation: integer("max_elevation"), // in meters
  bestMonths: text("best_months").array().notNull(),
  climate: text("climate").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  rating: integer("rating").notNull(), // 1-50 (represents 0.1 to 5.0)
  reviewCount: integer("review_count").default(0),
  imageUrl: text("image_url"),
  highlights: text("highlights").array().notNull(),
  requirements: jsonb("requirements"), // fitness level, experience, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userWishlist = pgTable("user_wishlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  trekId: varchar("trek_id").references(() => treks.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trekPlans = pgTable("trek_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  trekId: varchar("trek_id").references(() => treks.id).notNull(),
  startDate: timestamp("start_date"),
  preparation: jsonb("preparation"), // checklist items and timeline
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrekSchema = createInsertSchema(treks).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistSchema = createInsertSchema(userWishlist).omit({
  id: true,
  createdAt: true,
});

export const insertTrekPlanSchema = createInsertSchema(trekPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Trek = typeof treks.$inferSelect;
export type InsertTrek = z.infer<typeof insertTrekSchema>;

export type UserWishlist = typeof userWishlist.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;

export type TrekPlan = typeof trekPlans.$inferSelect;
export type InsertTrekPlan = z.infer<typeof insertTrekPlanSchema>;
