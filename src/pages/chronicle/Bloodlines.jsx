import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GitBranch, User } from "lucide-react";
import SectionHeader from "../../components/shared/SectionHeader";

const FAMILY_DATA = {
  name: "PARKER BLOODLINE",
  description: "The Parker family lineage — architects of the Heavens Gates empire.",
  members: [
    {
      name: "Parker Ancestors",
      role: "Ancestral Root",
      detail: "Roots in Columbia, SC — a legacy of resilience, coded knowledge, and generational memory.",
      generation: 0,
      color: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    },
    {
      name: "Barry Parker",
      role: "Founder / Shadow Operator",
      detail: "Strategist and hidden architect. Built Heavens Gates Music Group to protect artists and preserve ownership.",
      generation: 1,
      color: "border-primary/60 bg-primary/15 text-primary",
    },
    {
      name: "Makaila Hill Parker",
      role: "Partner / Spiritual Strategist",
      detail: "Barry's wife and equal. Manages spiritual alignment and business infrastructure in the empire.",
      generation: 1,
      color: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    },
    {
      name: "Jamila Parker",
      role: "Legacy Builder",
      detail: "Barry's disciplined daughter. Studies finance, administration, and legacy structures to carry the empire forward.",
      generation: 2,
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
  ]
};

const CONNECTIONS = [
  { from: "Barry Parker", to: "Makaila Hill Parker", type: "Married", color: "text-rose-400" },
  { from: "Barry Parker", to: "Jamila Parker", type: "Father / Daughter", color: "text-emerald-400" },
  { from: "Makaila Hill Parker", to: "Jamila Parker", type: "Mother / Daughter", color: "text-emerald-400" },
  { from: "Barry Parker", to: "Lil Gangsta", type: "Mentor / Artist", color: "text-primary" },
  { from: "Barry Parker", to: "Sarah Rae", type: "Executive / Artist", color: "text-primary" },
  { from: "Barry Parker", to: "Asad Mansa", type: "Ally / Engineer", color: "text-primary" },
  { from: "Asad Mansa", to: "Lil Gangsta", type: "Technical Support", color: "text-blue-400" },
  { from: "Asad Mansa", to: "Sarah Rae", type: "Sound Engineer", color: "text-blue-400" },
];

const EXTENDED = [
  { name: "Lil Gangsta", role: "Artist / Street Energy", generation: 1, color: "border-orange-500/40 bg-orange-500/10 text-orange-300" },
  { name: "Sarah Rae", role: "Vocalist / Soul", generation: 1, color: "border-pink-500/40 bg-pink-500/10 text-pink-300" },
  { name: "Asad Mansa", role: "Engineer / Architect", generation: 1, color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
];

export default function Bloodlines() {
  const [activeNode, setActiveNode] = useState(null);
  const allMembers = [...FAMILY_DATA.members, ...EXTENDED];

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader eyebrow="The Lineage" title="Bloodline Map" subtitle="Family ties, power bonds, and the connections that hold the empire together." />

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Parker Family", color: "border-primary/40 bg-primary/10 text-primary" },
          { label: "Spouse / Partner", color: "border-rose-500/30 bg-rose-500/10 text-rose-300" },
          { label: "Inner Circle", color: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
          { label: "Next Generation", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
        ].map(l => (
          <span key={l.label} className={`text-[10px] px-2.5 py-1 rounded-sm border font-heading tracking-wide ${l.color}`}>{l.label}</span>
        ))}
      </div>

      {/* Ancestry Root */}
      <div className="relative">
        <div className="flex justify-center mb-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="relative p-4 rounded-sm border border-purple-500/30 bg-purple-500/5 max-w-xs text-center cursor-pointer hover:border-purple-500/50 transition-all"
            onClick={() => setActiveNode(activeNode?.name === "Parker Ancestors" ? null : FAMILY_DATA.members[0])}
          >
            <p className="font-heading text-[10px] tracking-widest uppercase text-purple-400 mb-1">Ancestral Root</p>
            <p className="font-heading text-sm text-foreground">Parker Ancestors</p>
            <p className="text-[11px] text-muted-foreground mt-1">Columbia, South Carolina</p>
          </motion.div>
        </div>

        {/* Connector line */}
        <div className="flex justify-center mb-6">
          <div className="w-px h-8 bg-gradient-to-b from-purple-500/40 to-primary/40" />
        </div>

        {/* Generation 1 - Core */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[FAMILY_DATA.members[1], FAMILY_DATA.members[2], ...EXTENDED].map((member, i) => (
            <motion.div key={member.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => setActiveNode(activeNode?.name === member.name ? null : member)}
              className={`relative p-4 rounded-sm border cursor-pointer transition-all duration-200 hover:scale-[1.01] ${member.color} ${activeNode?.name === member.name ? "ring-1 ring-primary/50 scale-[1.01]" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-current opacity-60" />
                </div>
                <div>
                  <p className="font-heading text-xs font-bold tracking-wide text-foreground">{member.name}</p>
                  <p className="text-[10px] mt-0.5 text-current opacity-80">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Generation 2 */}
        <div className="flex justify-center">
          <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-emerald-500/40" />
        </div>
        <div className="flex justify-center mt-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            onClick={() => setActiveNode(activeNode?.name === "Jamila Parker" ? null : FAMILY_DATA.members[3])}
            className={`p-4 rounded-sm border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 cursor-pointer hover:border-emerald-500/60 transition-all max-w-xs text-center ${activeNode?.name === "Jamila Parker" ? "ring-1 ring-emerald-500/50" : ""}`}
          >
            <p className="font-heading text-xs font-bold tracking-wide text-foreground">{FAMILY_DATA.members[3].name}</p>
            <p className="text-[10px] mt-0.5">Next Generation — Legacy Builder</p>
          </motion.div>
        </div>
      </div>

      {/* Active Node Detail */}
      {activeNode && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-sm border border-primary/30 bg-primary/5 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase mb-1">Profile</p>
              <h3 className="font-heading text-lg font-bold">{activeNode.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{activeNode.role}</p>
              {activeNode.detail && <p className="font-prose text-sm text-muted-foreground mt-3 leading-relaxed">{activeNode.detail}</p>}
            </div>
            <button onClick={() => setActiveNode(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
          </div>
          {/* Connections for this node */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="font-heading text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Connections</p>
            <div className="space-y-1.5">
              {CONNECTIONS.filter(c => c.from === activeNode.name || c.to === activeNode.name).map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-foreground font-medium">{c.from === activeNode.name ? c.to : c.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className={c.color + " font-heading text-[10px] uppercase tracking-wide"}>{c.type}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Connections Table */}
      <div className="rounded-sm border border-border/50 bg-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">All Known Connections</p>
        </div>
        <div className="divide-y divide-border/50">
          {CONNECTIONS.map((c, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="text-foreground font-medium min-w-[120px]">{c.from}</span>
              <GitBranch className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium min-w-[120px]">{c.to}</span>
              <span className={`ml-auto text-[10px] font-heading uppercase tracking-wide ${c.color}`}>{c.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}