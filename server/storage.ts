import { type User, type InsertUser, type UserProfile, type InsertUserProfile, type Trek, type InsertTrek, type UserWishlist, type InsertWishlist, type TrekPlan, type InsertTrekPlan } from "@shared/schema";

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  createUser(user: Partial<InsertUser>): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  
  // User profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Treks
  getAllTreks(): Promise<Trek[]>;
  getTrek(id: string): Promise<Trek | undefined>;
  getTrekByProviderId(provider: string, providerTrekId: string): Promise<Trek | undefined>;
  createTrek(trek: InsertTrek): Promise<Trek>;
  getRecommendedTreks(userProfile: UserProfile): Promise<Trek[]>;
  searchTreks(filters: any): Promise<Trek[]>;
  
  // Wishlist
  getUserWishlist(userId: string): Promise<UserWishlist[]>;
  addToWishlist(wishlistItem: InsertWishlist): Promise<UserWishlist>;
  removeFromWishlist(userId: string, trekId: string): Promise<boolean>;
  
  // Trek plans
  getUserTrekPlans(userId: string): Promise<TrekPlan[]>;
  createTrekPlan(plan: InsertTrekPlan): Promise<TrekPlan>;
  updateTrekPlan(id: string, plan: Partial<InsertTrekPlan>): Promise<TrekPlan | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private treks: Map<string, Trek>;
  private wishlists: Map<string, UserWishlist>;
  private trekPlans: Map<string, TrekPlan>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.treks = new Map();
    this.wishlists = new Map();
    this.trekPlans = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some sample treks
    const sampleTreks: Trek[] = [
      {
        id: "1",
        name: "Everest Base Camp",
        location: "Nepal • Himalayas",
        country: "Nepal",
        difficulty: "Challenging",
        duration: 14,
        distance: 130,
        maxElevation: 5364,
        bestMonths: ["March", "April", "May", "September", "October", "November"],
        climate: "Alpine",
        description: "Experience the legendary trek to the base of the world's highest peak.",
        longDescription: "The Everest Base Camp Trek is one of the most iconic adventures on Earth. This challenging journey takes you through the heart of the Khumbu region, home to the legendary Sherpa people, spectacular Himalayan peaks, and ancient Buddhist monasteries.",
        rating: 48,
        reviewCount: 234,
        imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        highlights: ["Everest Base Camp", "Sherpa Culture", "Mountain Views", "Buddhist Monasteries"],
        requirements: { fitnessLevel: "Advanced", experience: "Intermediate" },
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Tour du Mont Blanc",
        location: "France, Italy, Switzerland • Alps",
        country: "Multi-country",
        difficulty: "Moderate",
        duration: 11,
        distance: 170,
        maxElevation: 2665,
        bestMonths: ["June", "July", "August", "September"],
        climate: "Alpine",
        description: "Classic alpine circuit through three countries with stunning mountain vistas.",
        longDescription: "The Tour du Mont Blanc is a classic long-distance hiking trail that circumnavigates the Mont Blanc massif, passing through France, Italy, and Switzerland.",
        rating: 49,
        reviewCount: 456,
        imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        highlights: ["Three Countries", "Alpine Views", "Charming Villages", "Diverse Landscapes"],
        requirements: { fitnessLevel: "Intermediate", experience: "Beginner" },
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Inca Trail",
        location: "Peru • Andes Mountains",
        country: "Peru",
        difficulty: "Challenging",
        duration: 4,
        distance: 45,
        maxElevation: 4215,
        bestMonths: ["May", "June", "July", "August", "September"],
        climate: "Highland",
        description: "Historic trail following ancient Inca paths to Machu Picchu.",
        longDescription: "The Inca Trail to Machu Picchu is a hiking trail in Peru that terminates at Machu Picchu. It consists of three overlapping trails: Mollepata, Classic, and One Day.",
        rating: 47,
        reviewCount: 892,
        imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        highlights: ["Machu Picchu", "Inca History", "Cloud Forest", "Ancient Ruins"],
        requirements: { fitnessLevel: "Intermediate", experience: "Beginner" },
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Torres del Paine W Trek",
        location: "Chile • Patagonia",
        country: "Chile",
        difficulty: "Moderate",
        duration: 5,
        distance: 75,
        maxElevation: 1200,
        bestMonths: ["November", "December", "January", "February", "March"],
        climate: "Temperate",
        description: "Spectacular Patagonian wilderness with dramatic granite towers.",
        longDescription: "The W Trek is the most popular multi-day trek in Torres del Paine National Park, offering spectacular views of the famous granite towers.",
        rating: 46,
        reviewCount: 321,
        imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        highlights: ["Granite Towers", "Pristine Lakes", "Patagonian Wildlife", "Glacial Views"],
        requirements: { fitnessLevel: "Intermediate", experience: "Beginner" },
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Pacific Crest Trail",
        location: "USA • California Section",
        country: "USA",
        difficulty: "Easy",
        duration: 7,
        distance: 160,
        maxElevation: 2100,
        bestMonths: ["June", "July", "August", "September", "October"],
        climate: "Mediterranean",
        description: "Diverse landscapes from desert to alpine in California.",
        longDescription: "The Pacific Crest Trail is a long-distance hiking and equestrian trail closely aligned with the highest portion of the Cascade and Sierra Nevada mountain ranges.",
        rating: 45,
        reviewCount: 567,
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        highlights: ["Diverse Ecosystems", "Desert to Alpine", "Wildlife", "Scenic Views"],
        requirements: { fitnessLevel: "Beginner", experience: "Beginner" },
        createdAt: new Date(),
      },
      {
        id: "6",
        name: "Annapurna Circuit",
        location: "Nepal • Himalayas",
        country: "Nepal",
        difficulty: "Challenging",
        duration: 16,
        distance: 230,
        maxElevation: 5416,
        bestMonths: ["March", "April", "May", "October", "November"],
        climate: "Alpine",
        description: "Complete circuit around the Annapurna massif with diverse cultures.",
        longDescription: "The Annapurna Circuit is a trek within the mountain ranges of central Nepal. The total length of the route varies between 160–230 km, depending on where motor transportation is used.",
        rating: 48,
        reviewCount: 412,
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        highlights: ["360° Mountain Views", "Cultural Diversity", "Thorong La Pass", "Varied Landscapes"],
        requirements: { fitnessLevel: "Advanced", experience: "Intermediate" },
        createdAt: new Date(),
      },
    ];

    sampleTreks.forEach(trek => {
      this.treks.set(trek.id, trek);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: Partial<InsertUser>): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username || null,
      password: insertUser.password || null,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      googleId: insertUser.googleId || null,
      facebookId: insertUser.facebookId || null,
      provider: insertUser.provider || 'local',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.facebookId === facebookId);
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...existingUser,
      ...userUpdate,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const newProfile: UserProfile = {
      ...profile,
      id,
      userId: profile.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userProfiles.set(id, newProfile);
    return newProfile;
  }

  async updateUserProfile(userId: string, profileUpdate: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existingProfile = Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
    if (!existingProfile) return undefined;

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...profileUpdate,
      updatedAt: new Date(),
    };
    this.userProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  async getAllTreks(): Promise<Trek[]> {
    return Array.from(this.treks.values());
  }

  async getTrek(id: string): Promise<Trek | undefined> {
    return this.treks.get(id);
  }

  async getTrekByProviderId(provider: string, providerTrekId: string): Promise<Trek | undefined> {
    return Array.from(this.treks.values()).find(
      trek => trek.provider === provider && trek.providerTrekId === providerTrekId
    );
  }

  async createTrek(trek: InsertTrek): Promise<Trek> {
    const id = randomUUID();
    const newTrek: Trek = {
      ...trek,
      id,
      distance: trek.distance ?? null,
      maxElevation: trek.maxElevation ?? null,
      longDescription: trek.longDescription ?? null,
      imageUrl: trek.imageUrl ?? null,
      reviewCount: trek.reviewCount ?? 0,
      price: trek.price ?? null,
      provider: trek.provider ?? 'custom',
      providerUrl: trek.providerUrl ?? null,
      providerTrekId: trek.providerTrekId ?? null,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    this.treks.set(id, newTrek);
    return newTrek;
  }

  async getRecommendedTreks(userProfile: UserProfile): Promise<Trek[]> {
    const allTreks = await this.getAllTreks();
    
    // Simple recommendation algorithm based on user preferences
    return allTreks.filter(trek => {
      // Match fitness level
      const fitnessMatch = this.matchesFitnessLevel(userProfile.fitnessLevel, trek.difficulty);
      
      // Match duration preferences
      const durationMatch = this.matchesDuration(userProfile.preferredDurations, trek.duration);
      
      // Match climate preferences
      const climateMatch = userProfile.climatePreferences.some(climate => 
        trek.climate.toLowerCase().includes(climate.toLowerCase())
      );
      
      return fitnessMatch && (durationMatch || climateMatch);
    }).sort((a, b) => b.rating - a.rating);
  }

  private matchesFitnessLevel(userFitness: string, trekDifficulty: string): boolean {
    const fitnessLevels = ["Beginner", "Intermediate", "Advanced"];
    const difficultyMap: { [key: string]: string } = {
      "Easy": "Beginner",
      "Moderate": "Intermediate", 
      "Challenging": "Advanced"
    };
    
    const userLevel = fitnessLevels.indexOf(userFitness);
    const requiredLevel = fitnessLevels.indexOf(difficultyMap[trekDifficulty] || "Beginner");
    
    return userLevel >= requiredLevel;
  }

  private matchesDuration(preferredDurations: string[], trekDuration: number): boolean {
    const durationRanges: { [key: string]: [number, number] } = {
      "day-hikes": [1, 1],
      "weekend": [2, 3],
      "week": [4, 7],
      "long": [8, 30]
    };
    
    return preferredDurations.some(pref => {
      const range = durationRanges[pref];
      return range && trekDuration >= range[0] && trekDuration <= range[1];
    });
  }

  async searchTreks(filters: any): Promise<Trek[]> {
    const allTreks = await this.getAllTreks();
    
    return allTreks.filter(trek => {
      if (filters.difficulty && trek.difficulty !== filters.difficulty) return false;
      if (filters.duration && !this.matchesDuration([filters.duration], trek.duration)) return false;
      if (filters.climate && !trek.climate.toLowerCase().includes(filters.climate.toLowerCase())) return false;
      if (filters.country && trek.country !== filters.country) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return trek.name.toLowerCase().includes(searchLower) || 
               trek.location.toLowerCase().includes(searchLower) ||
               trek.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  async getUserWishlist(userId: string): Promise<UserWishlist[]> {
    return Array.from(this.wishlists.values()).filter(item => item.userId === userId);
  }

  async addToWishlist(wishlistItem: InsertWishlist): Promise<UserWishlist> {
    const id = randomUUID();
    const newWishlistItem: UserWishlist = {
      ...wishlistItem,
      id,
      createdAt: new Date(),
    };
    this.wishlists.set(id, newWishlistItem);
    return newWishlistItem;
  }

  async removeFromWishlist(userId: string, trekId: string): Promise<boolean> {
    const item = Array.from(this.wishlists.values()).find(
      item => item.userId === userId && item.trekId === trekId
    );
    if (item) {
      this.wishlists.delete(item.id);
      return true;
    }
    return false;
  }

  async getUserTrekPlans(userId: string): Promise<TrekPlan[]> {
    return Array.from(this.trekPlans.values()).filter(plan => plan.userId === userId);
  }

  async createTrekPlan(plan: InsertTrekPlan): Promise<TrekPlan> {
    const id = randomUUID();
    const newPlan: TrekPlan = {
      ...plan,
      id,
      startDate: plan.startDate ?? null,
      preparation: plan.preparation ?? null,
      isCompleted: plan.isCompleted ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.trekPlans.set(id, newPlan);
    return newPlan;
  }

  async updateTrekPlan(id: string, planUpdate: Partial<InsertTrekPlan>): Promise<TrekPlan | undefined> {
    const existingPlan = this.trekPlans.get(id);
    if (!existingPlan) return undefined;

    const updatedPlan: TrekPlan = {
      ...existingPlan,
      ...planUpdate,
      updatedAt: new Date(),
    };
    this.trekPlans.set(id, updatedPlan);
    return updatedPlan;
  }
}

export const storage = new MemStorage();
