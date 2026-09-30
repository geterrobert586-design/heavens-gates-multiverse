import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Lock, RotateCcw } from "lucide-react";
import { clearEpisodeState } from "./engine/saveManager";

export default function InteractiveHome() {
  const [hasSave, setHasSave] = useState(() => typeof window !== "undefined" && Boolean(window.localStorage.getItem("hg_interactive_episode_zero")));

  function startOver() {
    clearEpisodeState();
    setHasSave(false);
  }

  return (
    <section className="max-w-4xl mx-auto py-8 md:py-14">
      <p className="font-heading text-[10px] tracking-[0.35em] uppercase text-primary mb-3">Heavens Gates</p>
      <h1 className="font-heading text-3xl md:text-5xl font-black gold-shimmer">Interactive Chronicles</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">Watch. Listen. Read. Choose. Step inside the Multiverse and make decisions that shape how the story responds.</p>

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        <div className="border border-primary/30 bg-card/70 rounded-xl p-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary">Episode Zero</p>
          <h2 className="font-heading text-2xl font-bold mt-2">The Invitation</h2>
          <p className="text-sm text-muted-foreground mt-3">An internal breach. Barry's credentials. Somebody already has the key.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/interactive/episode-zero" className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-3 font-semibold">
              <Play className="w-4 h-4" />
              {hasSave ? "Continue Episode" : "Enter the Gates"}
            </Link>
            {hasSave && (
              <Link to="/interactive/episode-zero" onClick={startOver} className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-semibold">
                <RotateCcw className="w-4 h-4" /> Start Over
              </Link>
            )}
          </div>
        </div>

        <div className="border border-border/60 bg-card/30 rounded-xl p-6 opacity-60">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Episode One</p>
          <h2 className="font-heading text-2xl font-bold mt-2">Locked</h2>
          <div className="mt-6 inline-flex items-center gap-2 text-muted-foreground"><Lock className="w-4 h-4" /> Coming later</div>
        </div>
      </div>
    </section>
  );
}
