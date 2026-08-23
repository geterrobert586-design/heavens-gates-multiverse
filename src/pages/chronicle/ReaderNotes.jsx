import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StickyNote, Plus, Heart, Trash2, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "../../components/shared/SectionHeader";

export default function ReaderNotes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [favOnly, setFavOnly] = useState(false);
  const qc = useQueryClient();

  const { data: notes = [] } = useQuery({ queryKey: ["readerNotes"], queryFn: () => base44.entities.ReaderNote.list("-created_date") });
  const del = useMutation({ mutationFn: id => base44.entities.ReaderNote.delete(id), onSuccess: () => qc.invalidateQueries(["readerNotes"]) });
  const toggleFav = useMutation({
    mutationFn: ({ id, is_favorite }) => base44.entities.ReaderNote.update(id, { is_favorite }),
    onSuccess: () => qc.invalidateQueries(["readerNotes"])
  });

  const displayed = favOnly ? notes.filter(n => n.is_favorite) : notes;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="Your Notes" title="Reader Notes" subtitle="Track your favorite scenes, personal reflections, and moments that hit different." />
        <Button size="sm" onClick={() => { setEditNote(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Note
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setFavOnly(!favOnly)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all border ${favOnly ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`}
        >
          <Heart className={`w-3.5 h-3.5 ${favOnly ? "fill-primary text-primary" : ""}`} />
          Favorites Only
        </button>
        <p className="text-xs text-muted-foreground">{notes.length} note{notes.length !== 1 ? "s" : ""} saved</p>
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <StickyNote className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">{favOnly ? "No favorites yet" : "No notes yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">Capture your thoughts, reactions, and favorite moments.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {displayed.map((note, i) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group break-inside-avoid rounded-sm bg-card border border-border/50 hover:border-primary/20 transition-all p-4 mb-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-heading text-xs font-bold tracking-wide text-foreground">{note.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleFav.mutate({ id: note.id, is_favorite: !note.is_favorite })}
                    className={`p-1 rounded transition-colors ${note.is_favorite ? "text-primary" : "text-muted-foreground/40 hover:text-primary/60"}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${note.is_favorite ? "fill-primary" : ""}`} />
                  </button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                    <button onClick={() => { setEditNote(note); setDialogOpen(true); }} className="p-1 hover:text-primary text-muted-foreground rounded transition-colors"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => del.mutate(note.id)} className="p-1 hover:text-destructive text-muted-foreground rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
              {note.scene_reference && <p className="text-[10px] text-primary font-heading uppercase tracking-wide mb-2">{note.scene_reference}</p>}
              <p className="font-prose text-sm text-muted-foreground leading-relaxed">{note.content}</p>
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {note.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary border border-border text-muted-foreground">#{t}</span>)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <NoteDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditNote(null); }} editNote={editNote} onSuccess={() => qc.invalidateQueries(["readerNotes"])} />
    </div>
  );
}

function NoteDialog({ open, onOpenChange, editNote, onSuccess }) {
  const def = { title: "", content: "", scene_reference: "", is_favorite: false, tags: [] };
  const [form, setForm] = useState(editNote || def);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setForm(editNote || def); }, [editNote, open]);

  const handleSave = async () => {
    setSaving(true);
    if (editNote?.id) await base44.entities.ReaderNote.update(editNote.id, form);
    else await base44.entities.ReaderNote.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader><DialogTitle className="font-heading">{editNote ? "Edit Note" : "New Note"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Scene / Chapter Reference</Label><Input value={form.scene_reference} onChange={e => setForm(p => ({ ...p, scene_reference: e.target.value }))} className="mt-1 bg-secondary border-border" placeholder="e.g. Chapter 3, The Meeting" /></div>
          <div><Label className="text-xs">Your Note</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="mt-1 bg-secondary border-border h-32 font-prose" /></div>
          <div>
            <Label className="text-xs">Tags</Label>
            <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setForm(p => ({ ...p, tags: [...(p.tags||[]), tagInput.trim()] })); setTagInput(""); }}} placeholder="Tag, press Enter" className="mt-1 bg-secondary border-border" />
            <div className="flex flex-wrap gap-1 mt-1.5">{form.tags?.map((t,i) => <span key={i} onClick={() => setForm(p => ({ ...p, tags: p.tags.filter((_,j)=>j!==i) }))} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-sm cursor-pointer">#{t} ×</span>)}</div>
          </div>
          <div className="flex items-center justify-between"><Label className="text-xs">Mark as Favorite</Label><Switch checked={!!form.is_favorite} onCheckedChange={v => setForm(p => ({ ...p, is_favorite: v }))} /></div>
          <Button onClick={handleSave} disabled={!form.title || !form.content || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editNote ? "Update" : "Save Note"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}