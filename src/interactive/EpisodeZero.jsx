import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { episodeZero, initialEpisodeState } from "./story/episodeZero";
import { clearEpisodeState, loadEpisodeState, saveEpisodeState } from "./engine/saveManager";

export default function EpisodeZero() {
  const [state, setState] = useState(() => loadEpisodeState(initialEpisodeState));
  const scene = episodeZero.scenes[state.currentScene] || episodeZero.scenes.opening;
  const [imageFailed, setImageFailed] = useState(false);
  const [choiceLocked, setChoiceLocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechRun = useRef(0);
  const audioSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const isMuted = Boolean(state.audioSettings?.muted);
  const captionsOn = state.audioSettings?.captions !== false;
  const sceneOrder = ["opening", "scene-1", "scene-2", "scene-3", "payoff", "ending"];
  const sceneNumber = Math.max(0, sceneOrder.indexOf(state.currentScene));
  const progressPercent = Math.round((sceneNumber / (sceneOrder.length - 1)) * 100);

  useEffect(() => {
    setImageFailed(false);
    setChoiceLocked(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.currentScene]);

  useEffect(() => { saveEpisodeState(state); }, [state]);

  useEffect(() => {
    const nextIndex = sceneOrder.indexOf(state.currentScene) + 1;
    const nextScene = episodeZero.scenes[sceneOrder[nextIndex]];
    if (nextScene?.visual?.src && typeof window !== "undefined") {
      const preload = new Image();
      preload.src = nextScene.visual.src;
    }
  }, [state.currentScene]);

  const firstChoice = state.choices.find((choice) => ["tell-makaila", "keep-quiet", "call-gangsta"].includes(choice));
  const secondChoice = state.choices.find((choice) => ["follow-gangsta", "listen-sarah", "call-barry"].includes(choice));

  const dialogue = useMemo(() => {
    const base = scene.dialogue || [];
    const prelude = scene.conditionalPrelude?.[firstChoice];
    const payoff = scene.conditionalDialogue?.[firstChoice];
    const reaction = scene.conditionalReaction?.[secondChoice];
    return [prelude, ...base, reaction, payoff].filter(Boolean);
  }, [scene, firstChoice, secondChoice]);

  const spokenLines = useMemo(() => [
    ...(state.currentScene === "opening" ? episodeZero.opening.narration : [scene.narration]),
    ...dialogue.map((line) => `${line.speaker}. ${line.text}`),
    ...(scene.ending && scene.endingVariations ? [scene.endingVariations[
      [["trust", state.trust], ["power", state.power], ["legacy", state.legacy]]
        .sort((a, b) => b[1] - a[1])[0][0]
    ]] : [])
  ].filter(Boolean), [state.currentScene, scene, dialogue, state.trust, state.power, state.legacy]);

  function stopAudio() {
    speechRun.current += 1;
    if (audioSupported) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }

  function playAudio() {
    if (!audioSupported || isMuted) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    const speech = window.speechSynthesis;
    speech.cancel();
    const run = ++speechRun.current;
    spokenLines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.rate = 0.92;
      if (index === spokenLines.length - 1) utterance.onend = () => {
        if (speechRun.current === run) setIsPlaying(false);
      };
      utterance.onerror = () => {
        if (speechRun.current === run) setIsPlaying(false);
      };
      speech.speak(utterance);
    });
    setIsPlaying(true);
  }

  function togglePlayback() {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else playAudio();
  }

  useEffect(() => {
    // Stop the prior scene before the new scene's narration can begin.
    speechRun.current += 1;
    if (audioSupported) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    if (state.audioSettings?.autoplay && !isMuted && audioSupported) {
      const run = ++speechRun.current;
      const speech = window.speechSynthesis;
      spokenLines.forEach((line, index) => {
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.rate = 0.92;
        if (index === spokenLines.length - 1) utterance.onend = () => {
          if (speechRun.current === run) setIsPlaying(false);
        };
        speech.speak(utterance);
      });
      setIsPlaying(true);
    }
    return () => {
      speechRun.current += 1;
      if (audioSupported) window.speechSynthesis.cancel();
    };
  }, [scene.id]);

  useEffect(() => {
    if (isMuted) stopAudio();
  }, [isMuted]);

  const endingPath = useMemo(() => {
    const paths = [
      ["trust", state.trust],
      ["power", state.power],
      ["legacy", state.legacy]
    ];
    return paths.sort((a, b) => b[1] - a[1])[0]?.[0] || "legacy";
  }, [state.trust, state.power, state.legacy]);

  function choose(choice) {
    if (choiceLocked) return;
    setChoiceLocked(true);
    setState((current) => {
      const effect = choice.effect || {};
      return {
        ...current,
        currentScene: choice.next,
        choices: choice.id ? [...current.choices, choice.id] : current.choices,
        trust: current.trust + (effect.trust || 0),
        power: current.power + (effect.power || 0),
        legacy: current.legacy + (effect.legacy || 0),
        episodeCompleted: choice.next === "ending"
      };
    });
  }

  function updateAudioSetting(key, value) {
    setState((prev) => ({ ...prev, audioSettings: { ...prev.audioSettings, [key]: value } }));
  }

  function restart() {
    stopAudio();
    clearEpisodeState();
    setState(initialEpisodeState);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/50 bg-background/90">
        <Link to="/interactive" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Multiverse</Link>
        <div className="text-center">
          <p className="font-heading text-[9px] tracking-[0.28em] uppercase text-primary">Episode Zero</p>
          <p className="font-heading text-xs font-bold">The Invitation</p>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <button type="button" onClick={togglePlayback} disabled={!audioSupported || isMuted} aria-label={isPlaying ? "Pause spoken audio" : isPaused ? "Resume spoken audio" : "Play spoken audio"} title={audioSupported ? "Spoken narration" : "Speech unavailable on this device"} className="rounded-md p-1 hover:text-foreground disabled:opacity-40">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
          <button type="button" onClick={() => updateAudioSetting("muted", !isMuted)} aria-label={isMuted ? "Unmute episode audio" : "Mute episode audio"} className="rounded-md p-1 hover:text-foreground">{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
          <button type="button" onClick={() => setState((s) => ({ ...s, readMode: !s.readMode }))} aria-label="Toggle read mode" className={state.readMode ? "text-primary" : ""}><BookOpen className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="flex-1 flex items-stretch justify-center p-4 md:p-8">
        <section className="w-full max-w-3xl min-h-[72vh] rounded-2xl border border-border/60 bg-card/40 overflow-hidden flex flex-col">
          <div className="relative aspect-[2/1] overflow-hidden bg-background">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                {scene.visual?.src && !imageFailed && (
                  <img
                    src={scene.visual.src}
                    alt={scene.visual.alt || ""}
                    onError={() => setImageFailed(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: scene.id === "ending" ? "center 35%" : scene.id === "opening" ? "center 35%" : "center 22%" }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-border/60 px-5 py-4 md:px-8 bg-card/60">
            <p className="text-[10px] tracking-[0.25em] uppercase text-primary">{scene.label}</p>
            <h1 className="font-heading text-xl md:text-3xl font-bold mt-1">{scene.title}</h1>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-2">{scene.location}</p>
          </div>

          <div className={`p-5 md:p-8 border-t border-border/60 bg-background/90 ${state.readMode ? "md:px-14" : ""}`}>
            <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted/40" aria-label="Episode progress">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mb-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>{state.readMode ? "Read Mode" : "Story Mode"} · {progressPercent}% · Choices remembered</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => updateAudioSetting("autoplay", !state.audioSettings?.autoplay)} disabled={!audioSupported} aria-pressed={Boolean(state.audioSettings?.autoplay)} className="rounded border border-border/60 px-2 py-1 disabled:opacity-40">Auto Voice {state.audioSettings?.autoplay ? "On" : "Off"}</button>
                <button type="button" onClick={() => updateAudioSetting("captions", !captionsOn)} aria-pressed={captionsOn} className="rounded border border-border/60 px-2 py-1">Text {captionsOn ? "On" : "Off"}</button>
              </div>
            </div>
            {(captionsOn || state.readMode || !audioSupported || isMuted) && state.currentScene === "opening" && episodeZero.opening.narration.map((line) => (
              <p key={line} className="text-base md:text-lg mb-1">{line}</p>
            ))}
            {(captionsOn || state.readMode || !audioSupported || isMuted) && state.currentScene !== "opening" && <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">{scene.narration}</p>}

            {(captionsOn || state.readMode || !audioSupported || isMuted) && dialogue.map((line, index) => (
              <div key={index} className="mb-4">
                <p className="text-[10px] tracking-[0.25em] uppercase text-primary">{line.speaker}</p>
                <p className="text-lg md:text-xl font-medium mt-1">“{line.text}”</p>
              </div>
            ))}

            {scene.ending ? (
              <div className="mt-7">
                {scene.endingVariations?.[endingPath] && (
                  <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Your path</p>
                    <p className="mt-2 text-sm md:text-base leading-relaxed">{scene.endingVariations[endingPath]}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Link to="/books" className="border border-border rounded-md px-4 py-3 text-center">Read the Books</Link>
                  <Link to="/characters" className="border border-border rounded-md px-4 py-3 text-center">Character Vault</Link>
                  <Link to="/soundtrack" className="border border-border rounded-md px-4 py-3 text-center">Heavens Gates Music</Link>
                  <button onClick={restart} className="border border-primary/50 rounded-md px-4 py-3 inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Replay Episode Zero</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 mt-6">
                {(scene.choices || []).map((choice) => (
                  <button key={choice.id || choice.text} disabled={choiceLocked} onClick={() => choose(choice)} className="w-full text-left rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 disabled:opacity-60 disabled:cursor-wait px-5 py-4 transition-colors">
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
