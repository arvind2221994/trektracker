import { storage } from '../../server/storage';

export async function onRequest(context: any) {
  const { request } = context;

  try {
    if (request.method === 'GET') {
      // Get all treks as recommendations for now
      // In a real app, this would use user profile data
      const treks = await storage.getAllTreks();
      
      // Limit to top 6 for recommendations
      const recommendations = treks.slice(0, 6);
      
      return Response.json(recommendations);
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}