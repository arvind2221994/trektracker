export async function onRequest(context: any) {
  const { request } = context;

  try {
    if (request.method === 'GET') {
      // For demo purposes, return not authenticated
      return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in user auth:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}