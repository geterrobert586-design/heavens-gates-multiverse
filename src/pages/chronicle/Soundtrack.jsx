import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Music2, Plus, Play, Trash2, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "../../components/shared/SectionHeader";

const moodColors = {
  intense: "text-red-400 bg-red-400/10 border-red-400/20",
  spiritual: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  street: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  corporate: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  melancholy: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  triumphant: "text-primary bg-primary/10 border-primary/20",
  hidden: "text-red-600 bg-red-600/10 border-red-600/20",
};

export default function Soundtrack() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTrack, setEditTrack] = useState(null);
  const [moodFilter, setMoodFilter] = useState("all");
  const qc = useQueryClient();

  const { data: tracks = [] } = useQuery({ queryKey: ["tracks"], queryFn: () => base44.entities.Track.list() });
  const del = useMutation({ mutationFn: id => base44.entities.Track.delete(id), onSuccess: () => qc.invalidateQueries(["tracks"]) });

  const featured = tracks.filter(t => t.is_featured);
  const filtered = moodFilter === "all" ? tracks : tracks.filter(t => t.mood === moodFilter);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="The Frequency" title="Soundtrack" subtitle="The music that scores the Heavens Gates universe. Every track tells a chapter's story." />
        <Button size="sm" onClick={() => { setEditTrack(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Track
        </Button>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <p className="font-heading text-[10px] tracking-widest uppercase text-primary mb-3">Featured</p>
          <div className="space-y-2">
            {featured.map((track, i) => <TrackCard key={track.id} track={track} featured onEdit={() => { setEditTrack(track); setDialogOpen(true); }} onDelete={() => del.mutate(track.id)} index={i} />)}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "intense", "spiritual", "street", "corporate", "melancholy", "triumphant", "hidden"].map(m => (
          <button key={m} onClick={() => setMoodFilter(m)}
            className={`px-3 py-1 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all ${moodFilter === m ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}
          >{m}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Music2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">No tracks in the archive</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((track, i) => <TrackCard key={track.id} track={track} onEdit={() => { setEditTrack(track); setDialogOpen(true); }} onDelete={() => del.mutate(track.id)} index={i} />)}
        </div>
      )}

      <TrackDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditTrack(null); }} editTrack={editTrack} onSuccess={() => qc.invalidateQueries(["tracks"])} />
    </div>
  );
}

function TrackCard({ track, featured, onEdit, onDelete, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div key={track.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className={`group rounded-sm border transition-all ${featured ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card hover:border-primary/20"}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0 relative overflow-hidden">
          {track.cover_url ? <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" /> : <Music2 className="w-5 h-5 text-primary/60" />}
        </div>
        <div className="flex-1 min-w-0" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <p className="font-heading text-xs font-bold tracking-wide text-foreground truncate">{track.title}</p>
            {featured && <Star className="w-3 h-3 text-primary shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground">{track.artist}</span>
            {track.album && <><span className="text-muted-foreground/40">·</span><span className="text-[11px] text-muted-foreground">{track.album}</span></>}
            {track.mood && <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-heading uppercase ${moodColors[track.mood] || ""}`}>{track.mood}</span>}
          </div>
          {track.chapter_tie && <p className="text-[11px] text-primary mt-0.5">Tied to: {track.chapter_tie}</p>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={onEdit} className="p-1.5 hover:text-primary text-muted-foreground rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 hover:text-destructive text-muted-foreground rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      {expanded && (track.description || track.lyrics_excerpt) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-4 pl-[72px] space-y-2">
          {track.description && <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>}
          {track.lyrics_excerpt && (
            <div className="border-l-2 border-primary/30 pl-3">
              <p className="font-prose text-sm italic text-foreground/80 leading-relaxed">{track.lyrics_excerpt}</p>
            </div>
          )}
          {track.audio_url && (
            <a href={track.audio_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="mt-1 border-primary/30 text-primary text-xs">
                <Play className="w-3.5 h-3.5 mr-1" /> Play Track
              </Button>
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function TrackDialog({ open, onOpenChange, editTrack, onSuccess }) {
  const def = { title: "", artist: "", album: "", mood: "street", chapter_tie: "", description: "", lyrics_excerpt: "", audio_url: "", cover_url: "", is_featured: false };
  const [form, setForm] = useState(editTrack || def);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setForm(editTrack || def); }, [editTrack, open]);

  const handleSave = async () => {
    setSaving(true);
    if (editTrack?.id) await base44.entities.Track.update(editTrack.id, form);
    else await base44.entities.Track.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{editTrack ? "Edit Track" : "Add Track"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Artist</Label><Input value={form.artist} onChange={e => setForm(p => ({ ...p, artist: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Album</Label><Input value={form.album} onChange={e => setForm(p => ({ ...p, album: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Mood</Label>
              <Select value={form.mood} onValueChange={v => setForm(p => ({ ...p, mood: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{["intense","spiritual","street","corporate","melancholy","triumphant","hidden"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Chapter Tie-In</Label><Input value={form.chapter_tie} onChange={e => setForm(p => ({ ...p, chapter_tie: e.target.value }))} className="mt-1 bg-secondary border-border" placeholder="e.g. Chapter 3: The Meeting" /></div>
          <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1 bg-secondary border-border h-16 font-prose" /></div>
          <div><Label className="text-xs">Lyrics Excerpt</Label><Textarea value={form.lyrics_excerpt} onChange={e => setForm(p => ({ ...p, lyrics_excerpt: e.target.value }))} className="mt-1 bg-secondary border-border h-16 font-prose" /></div>
          <div><Label className="text-xs">Audio URL</Label><Input value={form.audio_url} onChange={e => setForm(p => ({ ...p, audio_url: e.target.value }))} placeholder="https://..." className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Cover Image URL</Label><Input value={form.cover_url} onChange={e => setForm(p => ({ ...p, cover_url: e.target.value }))} placeholder="https://..." className="mt-1 bg-secondary border-border" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Featured Track</Label><Switch checked={!!form.is_featured} onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))} /></div>
          <Button onClick={handleSave} disabled={!form.title || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editTrack ? "Update" : "Add Track"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}