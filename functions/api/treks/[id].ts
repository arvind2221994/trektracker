import { storage } from '../../../server/storage';

export async function onRequest(context: any) {
  const { request, params } = context;
  const { id } = params;

  try {
    if (request.method === 'GET') {
      const trek = await storage.getTrek(id);
      
      if (!trek) {
        return Response.json({ message: 'Trek not found' }, { status: 404 });
      }
      
      return Response.json(trek);
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in trek detail API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}