import { storage } from '../../server/storage';
import { z } from 'zod';

const searchFiltersSchema = z.object({
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  climate: z.string().optional(),
  country: z.string().optional(),
  search: z.string().optional(),
});

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      const searchParams = Object.fromEntries(url.searchParams.entries());
      
      try {
        const filters = searchFiltersSchema.parse(searchParams);
        const results = await storage.searchTreks(filters);
        return Response.json(results);
      } catch (validationError) {
        return Response.json(
          { message: 'Invalid search parameters', errors: validationError },
          { status: 400 }
        );
      }
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in search API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}