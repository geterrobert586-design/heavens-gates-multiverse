import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeader from "../../components/shared/SectionHeader";

const typeColors = {
  studio: "text-primary border-primary/30 bg-primary/8",
  street: "text-orange-400 border-orange-400/30 bg-orange-400/8",
  corporate: "text-blue-400 border-blue-400/30 bg-blue-400/8",
  residential: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8",
  spiritual: "text-purple-400 border-purple-400/30 bg-purple-400/8",
  hidden: "text-red-400 border-red-400/30 bg-red-400/8",
};

export default function Locations() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLoc, setEditLoc] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data: locs = [] } = useQuery({ queryKey: ["locations"], queryFn: () => base44.entities.Location.list() });
  const del = useMutation({ mutationFn: id => base44.entities.Location.delete(id), onSuccess: () => { qc.invalidateQueries(["locations"]); setSelected(null); } });

  const filtered = typeFilter === "all" ? locs : locs.filter(l => l.type === typeFilter);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="The City" title="Columbia Archive" subtitle="Every location in the Heavens Gates universe. The streets, studios, and sacred spaces of Columbia, SC." />
        <Button size="sm" onClick={() => { setEditLoc(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Location
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "studio", "street", "corporate", "residential", "spiritual", "hidden"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all ${typeFilter === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}
          >{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">No locations recorded</p>
          <p className="text-sm text-muted-foreground mt-1">Add locations from the Heavens Gates universe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((loc, i) => (
            <motion.div key={loc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group rounded-sm bg-card border border-border/50 hover:border-primary/30 cursor-pointer transition-all overflow-hidden"
              onClick={() => setSelected(selected?.id === loc.id ? null : loc)}
            >
              {loc.image_url && (
                <div className="h-32 overflow-hidden">
                  <img src={loc.image_url} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <h3 className="font-heading text-sm font-bold">{loc.name}</h3>
                    </div>
                    {loc.district && <p className="text-[11px] text-muted-foreground mt-0.5">Columbia, SC — {loc.district}</p>}
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-heading tracking-wide uppercase shrink-0 ${typeColors[loc.type] || typeColors.street}`}>{loc.type}</span>
                </div>
                {loc.description && <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">{loc.description}</p>}
                {selected?.id === loc.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-border/50 space-y-2">
                    {loc.significance && <p className="font-prose text-sm text-foreground leading-relaxed">{loc.significance}</p>}
                    {loc.characters_associated?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {loc.characters_associated.map(c => <span key={c} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary border border-border text-muted-foreground">{c}</span>)}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button onClick={e => { e.stopPropagation(); setEditLoc(loc); setDialogOpen(true); }} className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={e => { e.stopPropagation(); del.mutate(loc.id); }} className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <LocationDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditLoc(null); }} editLoc={editLoc} onSuccess={() => qc.invalidateQueries(["locations"])} />
    </div>
  );
}

function LocationDialog({ open, onOpenChange, editLoc, onSuccess }) {
  const def = { name: "", district: "", description: "", significance: "", type: "street", characters_associated: [], image_url: "" };
  const [form, setForm] = useState(editLoc || def);
  const [charInput, setCharInput] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setForm(editLoc || def); }, [editLoc, open]);

  const handleSave = async () => {
    setSaving(true);
    if (editLoc?.id) await base44.entities.Location.update(editLoc.id, form);
    else await base44.entities.Location.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader><DialogTitle className="font-heading">{editLoc ? "Edit Location" : "Add Location"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">District</Label><Input value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} className="mt-1 bg-secondary border-border" placeholder="e.g. Five Points" /></div>
          </div>
          <div><Label className="text-xs">Type</Label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{["studio","street","corporate","residential","spiritual","hidden"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1 bg-secondary border-border h-20 font-prose" /></div>
          <div><Label className="text-xs">Significance in the Story</Label><Textarea value={form.significance} onChange={e => setForm(p => ({ ...p, significance: e.target.value }))} className="mt-1 bg-secondary border-border h-20 font-prose" /></div>
          <div>
            <Label className="text-xs">Associated Characters</Label>
            <Input value={charInput} onChange={e => setCharInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setForm(p => ({ ...p, characters_associated: [...(p.characters_associated||[]), charInput.trim()] })); setCharInput(""); }}} placeholder="Character name, press Enter" className="mt-1 bg-secondary border-border" />
            <div className="flex flex-wrap gap-1 mt-1.5">{form.characters_associated?.map((c,i) => <span key={i} onClick={() => setForm(p => ({ ...p, characters_associated: p.characters_associated.filter((_,j)=>j!==i) }))} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-sm cursor-pointer">{c} ×</span>)}</div>
          </div>
          <div><Label className="text-xs">Image URL</Label><Input value={form.image_url || ""} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." className="mt-1 bg-secondary border-border" /></div>
          <Button onClick={handleSave} disabled={!form.name || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editLoc ? "Update" : "Add Location"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}