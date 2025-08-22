export async function onRequest(context: any) {
  const { request } = context;

  try {
    if (request.method === 'GET') {
      // For demo purposes, return message about OAuth not configured
      return Response.json({ 
        message: 'Facebook authentication not configured. Set up FACEBOOK_APP_ID and FACEBOOK_APP_SECRET environment variables to enable social login.' 
      }, { status: 503 });
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in Facebook auth:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}