import { storage } from '../../server/storage';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      const treks = await storage.getAllTreks();
      return Response.json(treks);
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in treks API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}