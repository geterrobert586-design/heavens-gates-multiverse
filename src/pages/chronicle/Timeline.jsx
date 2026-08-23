import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "../../components/shared/SectionHeader";

const eraConfig = {
  origins: { label: "Origins", color: "border-purple-500/50 bg-purple-500/10 text-purple-400", dot: "bg-purple-500" },
  rise: { label: "The Rise", color: "border-primary/50 bg-primary/10 text-primary", dot: "bg-primary" },
  empire: { label: "The Empire", color: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400", dot: "bg-yellow-500" },
  conflict: { label: "Conflict", color: "border-red-500/50 bg-red-500/10 text-red-400", dot: "bg-red-500" },
  legacy: { label: "Legacy", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
};
const sigColors = { critical: "bg-red-500/20 text-red-400 border-red-500/30", major: "bg-primary/20 text-primary border-primary/30", minor: "bg-secondary text-muted-foreground border-border" };

export default function Timeline() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [eraFilter, setEraFilter] = useState("all");
  const qc = useQueryClient();

  const { data: events = [] } = useQuery({ queryKey: ["timeline"], queryFn: () => base44.entities.TimelineEvent.list() });
  const del = useMutation({ mutationFn: id => base44.entities.TimelineEvent.delete(id), onSuccess: () => qc.invalidateQueries(["timeline"]) });

  const filtered = eraFilter === "all" ? events : events.filter(e => e.era === eraFilter);
  const grouped = filtered.reduce((acc, e) => { const era = e.era || "origins"; if (!acc[era]) acc[era] = []; acc[era].push(e); return acc; }, {});

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="The Archive" title="Empire Timeline" subtitle="Every pivotal moment in the Heavens Gates story, traced from origins to legacy." />
        <Button size="sm" onClick={() => { setEditEvent(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Event
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "origins", "rise", "empire", "conflict", "legacy"].map(e => (
          <button key={e} onClick={() => setEraFilter(e)}
            className={`px-3 py-1 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all ${eraFilter === e ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}
          >{e}</button>
        ))}
      </div>

      {Object.keys(eraConfig).filter(era => grouped[era]?.length > 0).map(era => (
        <div key={era} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] px-3 py-1 rounded-sm border font-heading tracking-widest uppercase ${eraConfig[era].color}`}>
              {eraConfig[era].label}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
            <div className="space-y-3">
              {grouped[era].map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="group relative rounded-sm bg-card border border-border/50 hover:border-primary/20 p-4 transition-all"
                >
                  <div className={`absolute -left-[18px] top-5 w-3 h-3 rounded-full border-2 border-background ${eraConfig[era].dot}`} />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-heading text-sm font-bold">{event.title}</h3>
                        {event.year_in_story && <span className="text-[10px] text-muted-foreground font-heading">{event.year_in_story}</span>}
                        {event.significance && <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-heading uppercase ${sigColors[event.significance]}`}>{event.significance}</span>}
                      </div>
                      {event.description && <p className="font-prose text-sm text-muted-foreground leading-relaxed">{event.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.location && <span className="text-[11px] text-primary">📍 {event.location}</span>}
                        {event.characters_involved?.map(c => <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-secondary text-muted-foreground">{c}</span>)}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => { setEditEvent(event); setDialogOpen(true); }} className="p-1.5 hover:text-primary text-muted-foreground transition-colors rounded"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => del.mutate(event.id)} className="p-1.5 hover:text-destructive text-muted-foreground transition-colors rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">No events recorded</p>
        </div>
      )}

      <TimelineDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditEvent(null); }} editEvent={editEvent} onSuccess={() => qc.invalidateQueries(["timeline"])} />
    </div>
  );
}

function TimelineDialog({ open, onOpenChange, editEvent, onSuccess }) {
  const def = { title: "", description: "", era: "origins", year_in_story: "", location: "", characters_involved: [], significance: "major", is_hidden: false };
  const [form, setForm] = useState(editEvent || def);
  const [charInput, setCharInput] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setForm(editEvent || def); }, [editEvent, open]);

  const handleSave = async () => {
    setSaving(true);
    if (editEvent?.id) await base44.entities.TimelineEvent.update(editEvent.id, form);
    else await base44.entities.TimelineEvent.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader><DialogTitle className="font-heading">{editEvent ? "Edit Event" : "Add Event"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Era</Label>
              <Select value={form.era} onValueChange={v => setForm(p => ({ ...p, era: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{["origins","rise","empire","conflict","legacy"].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Significance</Label>
              <Select value={form.significance} onValueChange={v => setForm(p => ({ ...p, significance: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{["critical","major","minor"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Year in Story</Label><Input value={form.year_in_story} onChange={e => setForm(p => ({ ...p, year_in_story: e.target.value }))} className="mt-1 bg-secondary border-border" placeholder="e.g. Year 3" /></div>
            <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          </div>
          <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1 bg-secondary border-border h-24 font-prose" /></div>
          <div>
            <Label className="text-xs">Characters Involved</Label>
            <Input value={charInput} onChange={e => setCharInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setForm(p => ({ ...p, characters_involved: [...(p.characters_involved||[]), charInput.trim()] })); setCharInput(""); }}} placeholder="Character name, press Enter" className="mt-1 bg-secondary border-border" />
            <div className="flex flex-wrap gap-1 mt-1.5">{form.characters_involved?.map((c,i) => <span key={i} onClick={() => setForm(p => ({ ...p, characters_involved: p.characters_involved.filter((_,j) => j!==i) }))} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-sm cursor-pointer">{c} ×</span>)}</div>
          </div>
          <div className="flex items-center justify-between"><Label className="text-xs">Hidden Event</Label><Switch checked={!!form.is_hidden} onCheckedChange={v => setForm(p => ({ ...p, is_hidden: v }))} /></div>
          <Button onClick={handleSave} disabled={!form.title || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editEvent ? "Update" : "Add Event"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}