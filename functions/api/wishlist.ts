import { storage } from '../../server/storage';
import { insertWishlistSchema } from '../../shared/schema';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      // For demo purposes, return empty wishlist
      return Response.json([]);
    }

    if (request.method === 'POST') {
      const body = await request.json();
      
      try {
        const wishlistData = insertWishlistSchema.parse(body);
        
        // For demo purposes, create wishlist item with a dummy user ID
        const wishlistItem = await storage.addToWishlist({
          ...wishlistData,
          userId: 'demo-user-id'
        });
        
        return Response.json(wishlistItem);
      } catch (validationError) {
        return Response.json(
          { message: 'Invalid wishlist data', errors: validationError },
          { status: 400 }
        );
      }
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in wishlist API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}