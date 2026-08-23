import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageSquare, Plus, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeader from "../../components/shared/SectionHeader";

const catColors = {
  character: "text-blue-400 border-blue-400/30 bg-blue-400/8",
  plot: "text-primary border-primary/30 bg-primary/8",
  lore: "text-purple-400 border-purple-400/30 bg-purple-400/8",
  bloodline: "text-red-400 border-red-400/30 bg-red-400/8",
  future: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8",
};

export default function Community() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const qc = useQueryClient();

  const { data: theories = [] } = useQuery({ queryKey: ["theories"], queryFn: () => base44.entities.FanTheory.list("-votes_up") });
  const del = useMutation({ mutationFn: id => base44.entities.FanTheory.delete(id), onSuccess: () => qc.invalidateQueries(["theories"]) });
  const vote = useMutation({
    mutationFn: ({ id, field, current }) => base44.entities.FanTheory.update(id, { [field]: (current || 0) + 1 }),
    onSuccess: () => qc.invalidateQueries(["theories"])
  });

  const filtered = catFilter === "all" ? theories : theories.filter(t => t.category === catFilter);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader eyebrow="The Community" title="Fan Theories" subtitle="Share your theories, vote on others, and engage with the Heavens Gates universe. The story is alive." />
        <Button size="sm" onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Theory
        </Button>
      </div>

      {/* Coming soon features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Polls", desc: "Vote on story directions", soon: true },
          { label: "Audience Choices", desc: "Influence the narrative", soon: true },
          { label: "Theory Board", desc: "Active now", soon: false },
        ].map(f => (
          <div key={f.label} className={`p-3 rounded-sm border text-center ${f.soon ? "border-border/50 bg-card/50 opacity-60" : "border-primary/30 bg-primary/5"}`}>
            <p className="font-heading text-xs tracking-wide text-foreground">{f.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{f.desc}</p>
            {f.soon && <p className="text-[10px] text-primary/60 mt-1 font-heading uppercase tracking-widest">Coming Soon</p>}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "character", "plot", "lore", "bloodline", "future"].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1 rounded-sm font-heading text-[10px] tracking-widest uppercase transition-all ${catFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}
          >{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">No theories yet</p>
          <p className="text-sm text-muted-foreground mt-1">Be the first to submit a theory about the Heavens Gates universe.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((theory, i) => (
            <motion.div key={theory.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`group rounded-sm border transition-all p-5 ${theory.is_confirmed ? "border-emerald-500/30 bg-emerald-500/5" : theory.is_denied ? "border-red-500/20 bg-red-500/5 opacity-70" : "border-border/50 bg-card hover:border-primary/20"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border font-heading uppercase ${catColors[theory.category] || catColors.plot}`}>{theory.category}</span>
                    {theory.is_confirmed && <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-heading uppercase"><CheckCircle className="w-3 h-3" /> Confirmed</span>}
                    {theory.is_denied && <span className="flex items-center gap-1 text-[10px] text-red-400 font-heading uppercase"><XCircle className="w-3 h-3" /> Denied</span>}
                  </div>
                  <h3 className="font-heading text-sm font-bold tracking-wide mb-2">{theory.title}</h3>
                  <p className="font-prose text-sm text-muted-foreground leading-relaxed">{theory.theory}</p>
                  {theory.supporting_evidence && (
                    <div className="mt-3 p-3 rounded-sm bg-secondary/50 border border-border/50">
                      <p className="font-heading text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Evidence</p>
                      <p className="text-[11px] text-foreground/80 leading-relaxed">{theory.supporting_evidence}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => del.mutate(theory.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:text-destructive text-muted-foreground rounded shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
                <button onClick={() => vote.mutate({ id: theory.id, field: "votes_up", current: theory.votes_up })}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-400 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {theory.votes_up || 0}
                </button>
                <button onClick={() => vote.mutate({ id: theory.id, field: "votes_down", current: theory.votes_down })}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> {theory.votes_down || 0}
                </button>
                <p className="text-[10px] text-muted-foreground/50 ml-auto">Submitted by a reader</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <TheoryDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={() => qc.invalidateQueries(["theories"])} />
    </div>
  );
}

function TheoryDialog({ open, onOpenChange, onSuccess }) {
  const def = { title: "", theory: "", supporting_evidence: "", category: "plot" };
  const [form, setForm] = useState(def);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { if (!open) setForm(def); }, [open]);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.FanTheory.create({ ...form, votes_up: 0, votes_down: 0, is_confirmed: false, is_denied: false });
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader><DialogTitle className="font-heading">Submit a Theory</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div><Label className="text-xs">Theory Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Category</Label>
            <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
              <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>{["character","plot","lore","bloodline","future"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Your Theory *</Label><Textarea value={form.theory} onChange={e => setForm(p => ({ ...p, theory: e.target.value }))} className="mt-1 bg-secondary border-border h-28 font-prose" /></div>
          <div><Label className="text-xs">Supporting Evidence</Label><Textarea value={form.supporting_evidence} onChange={e => setForm(p => ({ ...p, supporting_evidence: e.target.value }))} className="mt-1 bg-secondary border-border h-20 font-prose" /></div>
          <Button onClick={handleSave} disabled={!form.title || !form.theory || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Submitting..." : "Submit Theory"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}