import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Plus, Lock, Unlock, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "../../components/shared/SectionHeader";

const catColors = {
  doctrine: "text-primary border-primary/30 bg-primary/8",
  backstory: "text-blue-400 border-blue-400/30 bg-blue-400/8",
  bloodline: "text-purple-400 border-purple-400/30 bg-purple-400/8",
  corporate: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8",
  street: "text-orange-400 border-orange-400/30 bg-orange-400/8",
  spiritual: "text-violet-400 border-violet-400/30 bg-violet-400/8",
  hidden: "text-red-400 border-red-400/30 bg-red-400/8",
};

export default function HiddenLore() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLore, setEditLore] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [unlockedIds, setUnlockedIds] = useState([]);
  const qc = useQueryClient();

  const { data: lore = [] } = useQuery({ queryKey: ["lore"], queryFn: () => base44.entities.LoreEntry.list() });
  const del = useMutation({ mutationFn: id => base44.entities.LoreEntry.delete(id), onSuccess: () => qc.invalidateQueries(["lore"]) });

  const filtered = catFilter === "all" ? lore : lore.filter(l => l.category === catFilter);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="The Archive" title="Hidden Lore" subtitle="Classified doctrines, buried backstories, and the truths the story doesn't always say out loud." />
        <Button size="sm" onClick={() => { setEditLore(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Entry
        </Button>
      </div>

      {/* Classified banner */}
      <div className="flex items-center gap-3 p-3 rounded-sm border border-red-500/20 bg-red-500/5">
        <Eye className="w-4 h-4 text-red-400 shrink-0" />
        <p className="text-[11px] text-red-400/80">Some entries are classified. Click locked entries to attempt access.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "doctrine", "backstory", "bloodline", "corporate", "street", "spiritual", "hidden"].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all ${catFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}
          >{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Eye className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">No lore entries</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry, i) => {
            const isLocked = entry.is_locked && !unlockedIds.includes(entry.id);
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`group relative rounded-sm border transition-all overflow-hidden ${isLocked ? "border-red-500/20 bg-red-500/5 cursor-pointer" : `border-border/50 bg-card hover:border-primary/20 ${catColors[entry.category] ? "" : ""}`}`}
                onClick={() => isLocked && setUnlockedIds(ids => [...ids, entry.id])}
              >
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                    <Lock className="w-7 h-7 text-red-400/60 mb-2" />
                    <p className="font-heading text-xs text-red-400/80 uppercase tracking-widest">Classified</p>
                    {entry.unlock_hint && <p className="text-[11px] text-muted-foreground mt-1 text-center px-4">{entry.unlock_hint}</p>}
                    <p className="text-[10px] text-red-400/50 mt-2">Click to access</p>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-heading uppercase tracking-wide ${catColors[entry.category] || catColors.hidden}`}>{entry.category}</span>
                      <h3 className="font-heading text-sm font-bold mt-2">{entry.title}</h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {entry.is_locked ? (
                        <button onClick={e => { e.stopPropagation(); setUnlockedIds(ids => ids.includes(entry.id) ? ids.filter(id => id !== entry.id) : [...ids, entry.id]); }} className="p-1.5 hover:text-primary text-muted-foreground rounded transition-colors">
                          {unlockedIds.includes(entry.id) ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      ) : null}
                      <button onClick={e => { e.stopPropagation(); setEditLore(entry); setDialogOpen(true); }} className="p-1.5 hover:text-primary text-muted-foreground rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={e => { e.stopPropagation(); del.mutate(entry.id); }} className="p-1.5 hover:text-destructive text-muted-foreground rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className={`font-prose text-sm leading-relaxed ${isLocked ? "blur-sm select-none" : "text-muted-foreground"}`}>{entry.content || "No content."}</p>
                  {entry.related_characters?.length > 0 && !isLocked && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.related_characters.map(c => <span key={c} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary border border-border text-muted-foreground">{c}</span>)}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <LoreDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditLore(null); }} editLore={editLore} onSuccess={() => qc.invalidateQueries(["lore"])} />
    </div>
  );
}

function LoreDialog({ open, onOpenChange, editLore, onSuccess }) {
  const def = { title: "", category: "doctrine", content: "", related_characters: [], is_locked: false, unlock_hint: "" };
  const [form, setForm] = useState(editLore || def);
  const [charInput, setCharInput] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setForm(editLore || def); }, [editLore, open]);

  const handleSave = async () => {
    setSaving(true);
    if (editLore?.id) await base44.entities.LoreEntry.update(editLore.id, form);
    else await base44.entities.LoreEntry.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{editLore ? "Edit Lore Entry" : "Add Lore Entry"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{["doctrine","backstory","bloodline","corporate","street","spiritual","hidden"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Content</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="mt-1 bg-secondary border-border h-36 font-prose" /></div>
          <div>
            <Label className="text-xs">Related Characters</Label>
            <Input value={charInput} onChange={e => setCharInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setForm(p => ({ ...p, related_characters: [...(p.related_characters||[]), charInput.trim()] })); setCharInput(""); }}} placeholder="Character name, press Enter" className="mt-1 bg-secondary border-border" />
            <div className="flex flex-wrap gap-1 mt-1.5">{form.related_characters?.map((c,i) => <span key={i} onClick={() => setForm(p => ({ ...p, related_characters: p.related_characters.filter((_,j)=>j!==i) }))} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-sm cursor-pointer">{c} ×</span>)}</div>
          </div>
          <div className="flex items-center justify-between"><Label className="text-xs">Locked Entry</Label><Switch checked={!!form.is_locked} onCheckedChange={v => setForm(p => ({ ...p, is_locked: v }))} /></div>
          {form.is_locked && <div><Label className="text-xs">Unlock Hint</Label><Input value={form.unlock_hint} onChange={e => setForm(p => ({ ...p, unlock_hint: e.target.value }))} className="mt-1 bg-secondary border-border" placeholder="Hint shown to readers..." /></div>}
          <Button onClick={handleSave} disabled={!form.title || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editLore ? "Update" : "Add Entry"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}