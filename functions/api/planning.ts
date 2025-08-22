import { storage } from '../../server/storage';
import { insertTrekPlanSchema } from '../../shared/schema';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      // For demo purposes, return empty plans
      return Response.json([]);
    }

    if (request.method === 'POST') {
      const body = await request.json();
      
      try {
        const planData = insertTrekPlanSchema.parse(body);
        
        // For demo purposes, create plan with a dummy user ID
        const plan = await storage.createTrekPlan({
          ...planData,
          userId: 'demo-user-id'
        });
        
        return Response.json(plan);
      } catch (validationError) {
        return Response.json(
          { message: 'Invalid plan data', errors: validationError },
          { status: 400 }
        );
      }
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in planning API:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}