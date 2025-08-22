// Middleware to initialize storage and set CORS headers
import { storage } from '../server/storage';
import { DataSyncService } from '../server/data-sync';

// Initialize data sync once when functions start
let initialized = false;

export async function onRequest(context: any) {
  // Initialize data if not already done
  if (!initialized) {
    try {
      const dataSyncService = new DataSyncService();
      await dataSyncService.syncAllData();
      initialized = true;
      console.log('✅ Functions initialized with data sync');
    } catch (error) {
      console.error('❌ Failed to initialize data sync:', error);
    }
  }

  // Set CORS headers
  const response = await context.next();
  
  if (response) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}