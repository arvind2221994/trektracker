import { storage } from '../../server/storage';
import { insertUserProfileSchema } from '../../shared/schema';
import { z } from 'zod';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      // For demo purposes, return 404 as no auth is implemented yet
      return Response.json({ message: 'Profile not found' }, { status: 404 });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      
      try {
        const profileData = insertUserProfileSchema.parse(body);
        
        // For demo purposes, create profile with a dummy user ID
        const profile = await storage.createUserProfile({
          ...profileData,
          userId: 'demo-user-id'
        });
        
        return Response.json(profile);
      } catch (validationError) {
        return Response.json(
          { message: 'Invalid profile data', errors: validationError },
          { status: 400 }
        );
      }
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in profile API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}