import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Pause, Download, Lock, Headphones, Clock, Tag, Music, ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../../components/shared/SectionHeader";
import LockedOverlay from "../../components/shared/LockedOverlay";
import { useUserTier } from "../../hooks/useUserTier";

const moodColors = {
  intense: "bg-red-500/20 text-red-400 border-red-500/30",
  chill: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  uplifting: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  dark: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  spiritual: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  street: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  corporate: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  melancholy: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export default function BeatStore() {
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMood, setSelectedMood] = useState("all");
  const audioRef = useRef(null);
  const { userTier, loading: tierLoading } = useUserTier();

  const { data: beats = [] } = useQuery({
    queryKey: ["beats"],
    queryFn: () => base44.entities.Beat.list("-orderNumber"),
    initialData: [],
  });

  const filteredBeats = selectedMood === "all" 
    ? beats.filter(b => b.is_published) 
    : beats.filter(b => b.mood === selectedMood && b.is_published);

  const featuredBeats = filteredBeats.filter(b => b.is_featured);
  const allBeats = filteredBeats.filter(b => !b.is_featured);

  const handlePlay = (beat) => {
    if (currentTrack?.id === beat.id) {
      togglePlay();
    } else {
      setCurrentTrack(beat);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async (beat) => {
    if (userTier?.tierLevel < 1) {
      alert("MP3 download requires Supporter tier ($7/month)");
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.href = beat.audio_url;
      link.download = `${beat.title.replace(/\s+/g, "_")}_HG_Music.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`🎵 Downloaded: ${beat.title}\n\n📄 MP3 License Agreement:\n• Up to 10,000 streams\n• Non-profit use only\n• Credit: "Prod. by Urban Guerilla Beats & Productions"\n• Valid for 3 years\n\n⚠️ Artist Responsibility: You must track license expiration\n⚠️ For commercial use, upgrade to WAV Premium ($25) or Unlimited ($50)`);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleBuyLicense = async (beat, licenseType, price) => {
    // Check if running in iframe (preview mode)
    if (window.self !== window.top) {
      alert("⚠️ Payment checkout only works in the published app.\n\nPlease publish your app and open it in a new tab to purchase licenses.");
      return;
    }

    try {
      const user = await base44.auth.me();
      const response = await base44.functions.invoke("createBeatCheckout", {
        beatId: beat.id,
        beatTitle: beat.title,
        licenseType: licenseType,
        price: price,
        email: user?.email,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hidden audio element */}
      {currentTrack?.audio_url && (
        <audio
          ref={audioRef}
          src={currentTrack.audio_url}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      <div className="flex items-start justify-between">
        <SectionHeader
          eyebrow="Heavens Gates Music Group"
          title="Urban Guerilla Beats & Productions"
          subtitle="Original production from the HG archives. All beats available to stream. Supporter tier unlocks MP3 downloads. Premium licenses available for purchase."
        />
        <Link to="/my-licenses">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="w-4 h-4" />
            My Licenses
          </Button>
        </Link>
      </div>

      {/* License Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-sm border border-primary/20 bg-primary/5 p-4"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-primary mt-0.5" />
          <div>
            <p className="font-heading text-[10px] tracking-widest text-primary uppercase mb-2">
              Standard License Agreement
            </p>
            <div className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
              <div>
                <strong className="text-foreground">MP3 License (Free for Supporter tier):</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Up to 10,000 streams/downloads</li>
                  <li>Non-profit use only</li>
                  <li>No radio or TV broadcast</li>
                  <li>Must credit: "Prod. by Urban Guerilla Beats & Productions"</li>
                  <li>Valid for 3 years from download</li>
                  <li><strong>Artist responsibility:</strong> Track license expiration</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-border/30">
                <strong className="text-foreground">WAV Premium License ($25):</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Up to 100,000 streams/downloads</li>
                  <li>Commercial use allowed (Spotify, Apple Music, etc.)</li>
                  <li>Radio play permitted (non-major stations)</li>
                  <li>Music video rights included</li>
                  <li>Valid for 5 years from download</li>
                  <li><strong>Buyout option:</strong> Available at term end</li>
                  <li><strong>Artist responsibility:</strong> Track license expiration</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-border/30">
                <strong className="text-foreground">Unlimited Exclusive ($50):</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Unlimited streams and distribution</li>
                  <li>Full commercial rights</li>
                  <li>Radio, TV, and sync licensing</li>
                  <li>Track ownership transfer</li>
                  <li>Lifetime validity</li>
                  <li><strong>Buyout option:</strong> Available at term end</li>
                  <li><strong>Artist responsibility:</strong> Track license expiration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Now Playing */}
      {currentTrack && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-sm overflow-hidden bg-gradient-to-br from-card via-secondary to-card border border-border/50 p-4"
        >
          <div className="flex items-center gap-4">
            {currentTrack.cover_image_url ? (
              <img
                src={currentTrack.cover_image_url}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-sm bg-background object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-sm bg-background flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Now Playing</p>
              <h3 className="font-heading text-base font-bold truncate">{currentTrack.title}</h3>
              <p className="text-[12px] text-muted-foreground">Prod. by {currentTrack.producer}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedMood === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedMood("all")}
          className={selectedMood === "all" ? "bg-primary" : "border-border/50"}
        >
          All Beats
        </Button>
        {Object.keys(moodColors).map((mood) => (
          <Button
            key={mood}
            variant={selectedMood === mood ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMood(mood)}
            className={selectedMood === mood ? "bg-primary" : "border-border/50 capitalize"}
          >
            {mood}
          </Button>
        ))}
      </div>

      {/* Featured Beats */}
      {featuredBeats.length > 0 && (
        <div className="space-y-4">
          <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Featured Productions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBeats.map((beat, idx) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                isPlaying={currentTrack?.id === beat.id && isPlaying}
                onPlay={() => handlePlay(beat)}
                onDownload={() => handleDownload(beat)}
                onBuyLicense={handleBuyLicense}
                userTier={userTier}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Beats */}
      <div className="space-y-4">
        <p className="font-heading text-[10px] tracking-widest text-primary uppercase">
          {selectedMood === "all" ? "All Beats" : `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Beats`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBeats.map((beat, idx) => (
            <BeatCard
              key={beat.id}
              beat={beat}
              isPlaying={currentTrack?.id === beat.id && isPlaying}
              onPlay={() => handlePlay(beat)}
              onDownload={() => handleDownload(beat)}
              onBuyLicense={handleBuyLicense}
              userTier={userTier}
              index={idx}
            />
            ))}
          </div>
        </div>

      {filteredBeats.length === 0 && (
        <div className="text-center py-12">
          <Headphones className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-heading text-sm text-muted-foreground">
            No beats available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}

function BeatCard({ beat, isPlaying, onPlay, onDownload, userTier, index, onBuyLicense }) {
  const canDownload = userTier?.tierLevel >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-sm border border-border/50 bg-card hover:border-primary/30 transition-all"
    >
      {/* Cover Art */}
      <div className="aspect-square bg-background relative overflow-hidden">
        {beat.cover_image_url ? (
          <img
            src={beat.cover_image_url}
            alt={beat.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Play Overlay */}
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? <Pause className="w-6 h-6 text-primary-foreground" /> : <Play className="w-6 h-6 text-primary-foreground" />}
          </div>
        </button>

        {/* Featured Badge */}
        {beat.is_featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}

        {/* Download Badge */}
        {canDownload && (
          <Badge className="absolute top-2 right-2 bg-emerald-600/90 text-white">
            <Download className="w-3 h-3 mr-1" />
            Available
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading text-base font-bold">{beat.title}</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Prod. by {beat.producer}</p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          {beat.bpm && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {beat.bpm} BPM
            </div>
          )}
          {beat.key && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Music className="w-3 h-3" />
              {beat.key}
            </div>
          )}
          {beat.mood && (
            <Badge variant="outline" className={`text-[9px] px-1.5 py-0.5 h-auto ${moodColors[beat.mood]}`}>
              {beat.mood}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {beat.tags && beat.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {beat.tags.slice(0, 3).map((tag, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            onClick={onPlay}
            className="flex-1 border-border/50"
          >
            <Headphones className="w-3 h-3 mr-1" />
            {isPlaying ? "Playing" : "Preview"}
          </Button>
          <Button
            variant={canDownload ? "default" : "secondary"}
            size="sm"
            onClick={canDownload ? onDownload : undefined}
            disabled={!canDownload}
            className={`flex-1 ${canDownload ? "bg-primary hover:bg-primary/90" : ""}`}
          >
            {canDownload ? (
              <>
                <Download className="w-3 h-3 mr-1" />
                Download
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Supporter
              </>
            )}
          </Button>
        </div>
        {/* License Purchase Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBuyLicense(beat, 'wav_premium', 25)}
            className="text-[11px] h-auto py-1.5"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            WAV $25
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBuyLicense(beat, 'unlimited_exclusive', 50)}
            className="text-[11px] h-auto py-1.5 border-primary/50 text-primary hover:bg-primary/10"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Unlimited $50
          </Button>
        </div>
      </div>
    </motion.div>
  );
}