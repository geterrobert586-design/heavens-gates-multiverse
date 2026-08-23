import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, BookOpen, Headphones, Clock, ChevronRight, ArrowLeft, Wand2, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "../../components/shared/SectionHeader";

export default function Audiobook() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [generatingId, setGeneratingId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: () => base44.entities.Book.list(),
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => base44.entities.Chapter.list(),
  });

  const organizedBooks = books.map(book => ({
    ...book,
    chapters: chapters.filter(ch => ch.book_id === book.id).sort((a, b) => a.chapter_number - b.chapter_number),
  })).sort((a, b) => a.book_number - b.book_number);

  const handlePlay = (chapter, book) => {
    console.log('handlePlay called for:', chapter.title);
    console.log('chapter.audio_url:', chapter.audio_url);
    
    // Use TTS if no real audio URL exists
    const hasRealAudio = chapter.audio_url && 
      !chapter.audio_url.startsWith('tts_placeholder_') && 
      chapter.audio_url !== 'tts-ready';
    
    if (!hasRealAudio) {
      console.log('Using TTS...');
      speakChapter(chapter, book);
      return;
    }
    console.log('Using existing audio...');
    setCurrentTrack({ ...chapter, bookTitle: book.title });
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime("0:00");
    setDuration(chapter.audio_duration || "0:00");
  };

  const speakChapter = (chapter, book) => {
    console.log('speakChapter called');
    console.log('speechSynthesis available:', !!window.speechSynthesis);
    console.log('Chapter content length:', chapter.content?.length);
    
    if (!window.speechSynthesis) {
      console.error('No speechSynthesis');
      alert('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setCurrentTrack({ ...chapter, bookTitle: book.title });
    setIsPlaying(true);
    setIsSpeaking(true);
    setProgress(0);

    const utterance = new SpeechSynthesisUtterance(chapter.content || '');
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Select voice synchronously
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.length);
    const maleVoice = voices.find(v => 
      v.lang.includes('en-US') && (v.name.includes('David') || v.name.includes('Male'))
    ) || voices.find(v => v.lang.includes('en-US'));
    
    console.log('Selected voice:', maleVoice?.name);
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onstart = () => {
      console.log('Speech started!');
      setDuration(chapter.audio_duration || estimateDuration(chapter.content.length));
    };

    utterance.ontimeupdate = (event) => {
      console.log('Time update:', event.elapsedTime);
      const progress = (event.elapsedTime / (chapter.content.length / 100)) * 100;
      setProgress(Math.min(progress, 100));
      setCurrentTime(formatTime(event.elapsedTime));
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsPlaying(false);
      setIsSpeaking(false);
      setProgress(100);
      setCurrentTime(formatTime(parseInt(chapter.audio_duration?.split(':')[0] || 0) * 60 + parseInt(chapter.audio_duration?.split(':')[1] || 0)));
    };

    utterance.onerror = (event) => {
      console.error('TTS Error:', event.error);
      if (event.error !== 'interrupted') {
        setIsPlaying(false);
        setIsSpeaking(false);
      }
    };

    utteranceRef.current = utterance;
    console.log('Calling speak()...');
    window.speechSynthesis.speak(utterance);
  };

  const generateNarration = async (chapter, book) => {
    setGeneratingId(chapter.id);
    try {
      const response = await base44.functions.invoke('generateNarration', { chapter_id: chapter.id });
      if (response.data.success) {
        const updatedChapter = await base44.entities.Chapter.get(chapter.id);
        setCurrentTrack({ ...updatedChapter, bookTitle: book.title });
        setIsPlaying(true);
        setDuration(response.data.audio_duration);
      }
    } catch (error) {
      console.error('Failed to generate narration:', error);
    } finally {
      setGeneratingId(null);
    }
  };

  const togglePlay = () => {
    if (isSpeaking) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsSpeaking(false);
      setProgress(0);
      setCurrentTime("0:00");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimateDuration = (charCount) => {
    const wordCount = charCount / 5;
    const minutes = Math.floor(wordCount / 200);
    const seconds = Math.floor((wordCount % 200) / 200 * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Browser TTS - seeking not supported

  const handleContinue = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      const firstBook = organizedBooks[0];
      const firstChapter = firstBook?.chapters?.[0];
      if (firstBook && firstChapter) {
        handlePlay(firstChapter, firstBook);
      }
    }
  };

  const handleStartFromBeginning = () => {
    const firstBook = organizedBooks[0];
    const firstChapter = firstBook?.chapters?.[0];
    if (firstBook && firstChapter) {
      handlePlay(firstChapter, firstBook);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mt-1 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <SectionHeader
          eyebrow="Immersive Audio Experience"
          title="Heavens Gates Chronicles Audiobook"
          subtitle="Experience the saga in cinematic audio. Narrated with depth, emotion, and the weight of the story."
        />
      </div>

      {/* Featured Player */}
      {currentTrack && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-sm overflow-hidden bg-gradient-to-br from-card via-secondary to-card border border-border/50 p-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-heading tracking-widest text-primary uppercase">Now Playing</span>
            </div>
            <h3 className="font-heading text-lg font-bold">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{currentTrack.bookTitle}</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="p-3 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={handleStop} className="p-2 rounded-sm bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Pause className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-heading tracking-wide">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleContinue} className="bg-primary text-primary-foreground">
          <Play className="w-4 h-4 mr-2" />
          {currentTrack ? "Continue Listening" : "Start Listening"}
        </Button>
        <Button onClick={handleStartFromBeginning} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
          <BookOpen className="w-4 h-4 mr-2" />
          Start from Book One
        </Button>
        <Button variant="ghost" onClick={() => window.location.href = "/chronicle"} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chronicles
        </Button>
      </div>

      {/* Books & Chapters */}
      {organizedBooks.map((book, bookIndex) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: bookIndex * 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <span className="font-heading text-xs font-bold text-primary">{book.book_number}</span>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">{book.title}</h3>
              {book.subtitle && <p className="text-sm text-muted-foreground">{book.subtitle}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            {book.chapters?.map((chapter, chapterIndex) => (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: chapterIndex * 0.03 }}
                onClick={() => handlePlay(chapter, book)}
                className={`group flex items-center gap-4 p-4 rounded-sm border transition-all text-left ${
                  currentTrack?.id === chapter.id
                    ? "bg-primary/10 border-primary/40"
                    : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${
                  generatingId === chapter.id ? "bg-primary/20 text-primary" :
                  currentTrack?.id === chapter.id && isPlaying ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-primary"
                }`}>
                  {generatingId === chapter.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : currentTrack?.id === chapter.id && isPlaying ? (
                    <Volume2 className="w-5 h-5" />
                  ) : chapter.audio_url ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading tracking-widest text-muted-foreground uppercase">Chapter {chapter.chapter_number}</span>
                    {chapter.is_published && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </div>
                  <h4 className="font-heading text-sm font-semibold truncate">{chapter.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{chapter.word_count ? `${Math.round(chapter.word_count / 150)} min` : "—"}</span>
                    </div>
                    {chapter.pov_character && (
                      <span className="text-[10px] text-muted-foreground">POV: {chapter.pov_character}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}