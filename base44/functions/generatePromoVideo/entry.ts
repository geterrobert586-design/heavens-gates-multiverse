import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, label } = await req.json();

    if (!prompt || !label) {
      return Response.json({ error: 'Missing required fields: prompt and label' }, { status: 400 });
    }

    // Generate video using Core integration
    const response = await base44.integrations.Core.GenerateVideo({
      prompt: prompt,
      label: label,
      duration: 6,
      aspect_ratio: "16:9"
    });

    return Response.json({ 
      success: true, 
      url: response.url,
      message: 'Video generated successfully'
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});