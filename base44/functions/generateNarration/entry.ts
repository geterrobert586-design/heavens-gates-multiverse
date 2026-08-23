import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chapter_id } = await req.json();
    
    if (!chapter_id) {
      return Response.json({ error: 'Chapter ID required' }, { status: 400 });
    }

    const chapter = await base44.entities.Chapter.get(chapter_id);
    
    if (!chapter || !chapter.content) {
      return Response.json({ error: 'Chapter not found or has no content' }, { status: 404 });
    }

    // For now, just mark that narration is available
    // The actual TTS will happen in the browser using Web Speech API
    const audioDuration = estimateDuration(chapter.content.length);
    await base44.entities.Chapter.update(chapter_id, {
      audio_url: 'tts-ready',
      audio_duration: audioDuration
    });

    return Response.json({ 
      success: true, 
      message: 'Narration ready',
      audio_duration: audioDuration
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function estimateDuration(charCount) {
  const wordCount = charCount / 5;
  const minutes = Math.floor(wordCount / 200);
  const seconds = Math.floor((wordCount % 200) / 200 * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}