import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2, Shield, Sword, Heart, Star, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "../../components/shared/SectionHeader";

const roleColors = {
  protagonist: "text-primary border-primary/30 bg-primary/10",
  antagonist: "text-red-400 border-red-400/30 bg-red-400/10",
  ally: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  neutral: "text-muted-foreground border-border bg-secondary",
  legacy: "text-purple-400 border-purple-400/30 bg-purple-400/10",
};
const roleIcons = { protagonist: Star, antagonist: Sword, ally: Shield, neutral: HelpCircle, legacy: Star };
const statusColors = { active: "bg-emerald-500/20 text-emerald-400", deceased: "bg-red-500/20 text-red-400", unknown: "bg-yellow-500/20 text-yellow-400", legacy: "bg-purple-500/20 text-purple-400" };

export default function Characters() {
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editChar, setEditChar] = useState(null);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const qc = useQueryClient();

  const { data: chars = [], refetch } = useQuery({ 
    queryKey: ["characters"], 
    queryFn: () => base44.entities.Character.list(),
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });
  const del = useMutation({ mutationFn: id => base44.entities.Character.delete(id), onSuccess: () => { qc.invalidateQueries(["characters"]); setSelected(null); } });

  const filtered = filter === "all" ? chars : chars.filter(c => c.role === filter);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const isAdmin = user?.role === 'admin';

  if (selected) return <CharacterProfile char={selected} onBack={() => setSelected(null)} onEdit={() => { setEditChar(selected); setDialogOpen(true); }} onDelete={() => del.mutate(selected.id)} />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="The Players" title="Character Vault" subtitle="Every key figure in the Heavens Gates universe." />
        {isAdmin && (
          <div className="flex gap-2 shrink-0 mt-1">
            <Button size="sm" onClick={() => { setEditChar(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "protagonist", "ally", "antagonist", "neutral", "legacy"].map(r => (
          <button key={r} onClick={() => setFilter(r)}
            className={`px-3 py-1 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all ${filter === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}
          >{r}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><p className="font-heading text-xs tracking-widest uppercase">No characters found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((char, i) => {
            const RoleIcon = roleIcons[char.role] || Star;
            return (
              <motion.div key={char.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(char)}
                className="group relative cursor-pointer rounded-sm bg-card border border-border/50 hover:border-primary/40 transition-all duration-200 overflow-hidden"
              >
                {char.image_url ? (
                  <div className="h-52 relative bg-transparent">
                    <img src={char.image_url} alt={char.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                      <h3 className="font-heading text-sm font-bold tracking-wide">{char.name}</h3>
                      {char.alias && <p className="text-[11px] text-muted-foreground italic">"{char.alias}"</p>}
                      {char.faction && <p className="text-[10px] text-primary mt-0.5 font-heading tracking-wide">{char.faction}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="h-52 flex items-center justify-center bg-gradient-to-br from-secondary to-card border-b border-border/50">
                    <RoleIcon className="w-12 h-12 text-primary/20" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-heading tracking-wide uppercase shrink-0 ${roleColors[char.role] || roleColors.neutral}`}>
                        {char.role}
                      </span>
                      {char.status && <span className={`text-[10px] px-2 py-0.5 rounded-sm font-heading uppercase ${statusColors[char.status] || ""}`}>{char.status}</span>}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-primary/0 group-hover:text-primary/60 ml-auto transition-all" />
                  </div>
                  {char.bio && <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{char.bio}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      {isAdmin && (
        <CharacterDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditChar(null); }} editChar={editChar} onSuccess={() => qc.invalidateQueries(["characters"])} />
      )}
    </div>
  );
}

function CharacterProfile({ char, onBack, onEdit, onDelete }) {
  const RoleIcon = roleIcons[char.role] || Star;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto pb-12 space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <X className="w-4 h-4" /> Close Profile
      </button>
      <div className="relative rounded-sm overflow-hidden bg-card border border-border/50">
        {char.image_url ? (
          <div className="h-64 relative overflow-hidden bg-background flex items-center justify-center">
            <img src={char.image_url} alt={char.name} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-crimson/20 via-secondary to-card flex items-center justify-center">
            <RoleIcon className="w-16 h-16 text-primary/20" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-bold">{char.name}</h2>
              {char.alias && <p className="font-prose text-lg italic text-muted-foreground">"{char.alias}"</p>}
              {char.faction && <p className="text-xs text-primary font-heading tracking-widest uppercase mt-1">{char.faction}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={onEdit} className="p-2 rounded-sm bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={onDelete} className="p-2 rounded-sm bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>

          {char.bio && <p className="font-prose text-base text-muted-foreground mt-4 leading-relaxed">{char.bio}</p>}

          {char.quote && (
            <div className="mt-4 p-4 border-l-2 border-primary/40 bg-primary/5">
              <p className="font-prose text-base italic text-foreground">"{char.quote}"</p>
              <p className="font-heading text-[10px] tracking-widest text-primary mt-1.5 uppercase">— {char.name}</p>
            </div>
          )}

          {char.skills?.length > 0 && (
            <div className="mt-4">
              <p className="font-heading text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Skills & Domains</p>
              <div className="flex flex-wrap gap-1.5">
                {char.skills.map(s => <span key={s} className="text-[11px] px-2 py-0.5 rounded-sm bg-secondary border border-border text-foreground">{s}</span>)}
              </div>
            </div>
          )}

          {char.backstory && (
            <div className="mt-4">
              <p className="font-heading text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Backstory</p>
              <p className="font-prose text-base text-muted-foreground leading-relaxed">{char.backstory}</p>
            </div>
          )}

          {char.relationships?.length > 0 && (
            <div className="mt-4">
              <p className="font-heading text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Connections</p>
              <div className="space-y-2">
                {char.relationships.map((rel, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-sm bg-secondary/50 border border-border/50 text-sm">
                    <span className="text-foreground font-medium">{rel.character_name}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-primary text-xs font-heading tracking-wide">{rel.relation}</span>
                    {rel.nature && <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-sm ${roleColors[rel.nature] || "bg-secondary text-muted-foreground border border-border"}`}>{rel.nature}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CharacterDialog({ open, onOpenChange, editChar, onSuccess }) {
  const defaultForm = { name: "", alias: "", role: "protagonist", faction: "", bio: "", backstory: "", quote: "", skills: [], relationships: [], status: "active", is_hidden: false };
  const [form, setForm] = useState(editChar || defaultForm);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setForm(editChar || defaultForm); }, [editChar, open]);

  const handleSave = async () => {
    setSaving(true);
    if (editChar?.id) await base44.entities.Character.update(editChar.id, form);
    else await base44.entities.Character.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{editChar ? "Edit Character" : "Add Character"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Alias / Handle</Label><Input value={form.alias} onChange={e => setForm(p => ({ ...p, alias: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Role</Label>
              <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{["protagonist","antagonist","ally","neutral","legacy"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{["active","deceased","unknown","legacy"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Faction / Affiliation</Label><Input value={form.faction} onChange={e => setForm(p => ({ ...p, faction: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Bio</Label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="mt-1 bg-secondary border-border h-20 font-prose" /></div>
          <div><Label className="text-xs">Backstory</Label><Textarea value={form.backstory} onChange={e => setForm(p => ({ ...p, backstory: e.target.value }))} className="mt-1 bg-secondary border-border h-20 font-prose" /></div>
          <div><Label className="text-xs">Signature Quote</Label><Input value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div>
            <Label className="text-xs">Skills / Domains</Label>
            <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setForm(p => ({ ...p, skills: [...(p.skills||[]), skillInput.trim()] })); setSkillInput(""); }}} placeholder="Type skill, press Enter" className="mt-1 bg-secondary border-border" />
            <div className="flex flex-wrap gap-1 mt-1.5">{form.skills?.map((s, i) => <span key={i} onClick={() => setForm(p => ({ ...p, skills: p.skills.filter((_,j) => j!==i) }))} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary border border-border cursor-pointer hover:border-destructive/50">{s} ×</span>)}</div>
          </div>
          <div><Label className="text-xs">Image URL</Label><Input value={form.image_url || ""} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." className="mt-1 bg-secondary border-border" /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Hidden Character</Label><Switch checked={!!form.is_hidden} onCheckedChange={v => setForm(p => ({ ...p, is_hidden: v }))} /></div>
          <Button onClick={handleSave} disabled={!form.name || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editChar ? "Update" : "Add Character"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}