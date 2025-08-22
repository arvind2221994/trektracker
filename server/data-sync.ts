import { storage } from './storage';
import { BikatScraper } from './scrapers/bikat-scraper';
import { YHAIScraper } from './scrapers/yhai-scraper';
import { IndiahikesScraper } from './scrapers/indiahikes-scraper';

export class DataSyncService {
  private bikatScraper = new BikatScraper();
  private yhaiScraper = new YHAIScraper();
  private indiahikesScraper = new IndiahikesScraper();

  async syncAllData(): Promise<void> {
    console.log('🚀 Starting comprehensive data sync from adventure companies...');
    
    try {
      // Sync data from all providers
      await Promise.all([
        this.syncBikatData(),
        this.syncYHAIData(),
        this.syncIndiahikesData()
      ]);
      
      console.log('✅ Data sync completed successfully!');
    } catch (error) {
      console.error('❌ Error during data sync:', error);
    }
  }

  private async syncBikatData(): Promise<void> {
    try {
      console.log('📥 Syncing Bikat Adventures data...');
      const bikatTreks = await this.bikatScraper.scrapeTreks();
      
      for (const trek of bikatTreks) {
        // Check if trek already exists by provider ID
        const existingTrek = await storage.getTrekByProviderId('bikat', trek.providerTrekId!);
        
        if (!existingTrek) {
          await storage.createTrek(trek);
          console.log(`✅ Added Bikat trek: ${trek.name}`);
        } else {
          console.log(`ℹ️  Bikat trek already exists: ${trek.name}`);
        }
      }
      
      console.log(`📊 Bikat Adventures: ${bikatTreks.length} treks processed`);
    } catch (error) {
      console.error('❌ Error syncing Bikat data:', error);
    }
  }

  private async syncYHAIData(): Promise<void> {
    try {
      console.log('📥 Syncing YHAI data...');
      const yhaiTreks = await this.yhaiScraper.scrapeTreks();
      
      for (const trek of yhaiTreks) {
        const existingTrek = await storage.getTrekByProviderId('yhai', trek.providerTrekId!);
        
        if (!existingTrek) {
          await storage.createTrek(trek);
          console.log(`✅ Added YHAI trek: ${trek.name}`);
        } else {
          console.log(`ℹ️  YHAI trek already exists: ${trek.name}`);
        }
      }
      
      console.log(`📊 YHAI: ${yhaiTreks.length} treks processed`);
    } catch (error) {
      console.error('❌ Error syncing YHAI data:', error);
    }
  }

  private async syncIndiahikesData(): Promise<void> {
    try {
      console.log('📥 Syncing Indiahikes data...');
      const indiahikesTreks = await this.indiahikesScraper.scrapeTreks();
      
      for (const trek of indiahikesTreks) {
        const existingTrek = await storage.getTrekByProviderId('indiahikes', trek.providerTrekId!);
        
        if (!existingTrek) {
          await storage.createTrek(trek);
          console.log(`✅ Added Indiahikes trek: ${trek.name}`);
        } else {
          console.log(`ℹ️  Indiahikes trek already exists: ${trek.name}`);
        }
      }
      
      console.log(`📊 Indiahikes: ${indiahikesTreks.length} treks processed`);
    } catch (error) {
      console.error('❌ Error syncing Indiahikes data:', error);
    }
  }

  // Schedule automatic sync every 24 hours
  startPeriodicSync(): void {
    console.log('⏰ Starting periodic data sync (every 24 hours)...');
    
    // Initial sync
    this.syncAllData();
    
    // Schedule periodic sync every 24 hours
    setInterval(() => {
      console.log('🔄 Running scheduled data sync...');
      this.syncAllData();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  }
}