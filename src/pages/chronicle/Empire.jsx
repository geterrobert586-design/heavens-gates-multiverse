import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Shield, Music, Layers, DollarSign, Users, Globe, FileText, ChevronDown, ChevronRight } from "lucide-react";
import SectionHeader from "../../components/shared/SectionHeader";

const departments = [
  {
    id: "executive",
    name: "Executive Office",
    lead: "Barry Parker",
    icon: Shield,
    color: "border-primary/50 bg-primary/8",
    description: "The shadow command center. Barry Parker operates as the hidden architect — strategic decisions, power structures, and long-term empire building. Nothing moves without his awareness.",
    functions: ["Empire strategy & direction", "Talent acquisition authority", "Distribution agreements", "Legal shield operations", "Legacy architecture"],
  },
  {
    id: "creative",
    name: "Creative & A&R",
    lead: "Barry Parker / Lil Gangsta",
    icon: Music,
    color: "border-orange-500/20 bg-orange-500/5",
    description: "The heartbeat of the company. Raw talent is identified, developed, and protected. Artists retain ownership while the label provides infrastructure.",
    functions: ["Artist development", "Sound direction", "Studio access & scheduling", "Creative freedom agreements", "Music production oversight"],
  },
  {
    id: "engineering",
    name: "Sound & Technology",
    lead: "Asad Mansa",
    icon: Layers,
    color: "border-blue-500/20 bg-blue-500/5",
    description: "The invisible backbone. Asad Mansa engineers both sound and systems — from recording infrastructure to digital distribution frameworks.",
    functions: ["Recording engineering", "Digital infrastructure", "Technology systems", "Sound architecture", "Distribution tech"],
  },
  {
    id: "finance",
    name: "Finance & Administration",
    lead: "Jamila Parker",
    icon: DollarSign,
    color: "border-emerald-500/20 bg-emerald-500/5",
    description: "Generational wealth management. Jamila Parker oversees financial discipline, administrative structure, and the preservation of company assets for future generations.",
    functions: ["Revenue management", "Contract administration", "Royalty structures", "Investment strategy", "Legacy fund management"],
  },
  {
    id: "strategy",
    name: "Strategy & Operations",
    lead: "Makaila Hill Parker",
    icon: Globe,
    color: "border-rose-500/20 bg-rose-500/5",
    description: "The spiritual-strategic core. Makaila Hill Parker aligns purpose with action — ensuring the empire operates from values, not just numbers.",
    functions: ["Strategic planning", "Partnership alignment", "Spiritual business framework", "Operations management", "Brand integrity"],
  },
  {
    id: "legal",
    name: "Rights & Legal Protection",
    lead: "Barry Parker",
    icon: FileText,
    color: "border-red-500/20 bg-red-500/5",
    description: "The fortress wall. Every artist, every recording, every brand asset is protected through aggressive IP management and carefully structured legal frameworks.",
    functions: ["Copyright registration", "Master recording ownership", "Publishing rights management", "Contract enforcement", "IP monetization"],
  },
  {
    id: "roster",
    name: "Artist Roster",
    lead: "Barry Parker",
    icon: Users,
    color: "border-purple-500/20 bg-purple-500/5",
    description: "Every artist is a partner, not a product. The Heavens Gates roster operates on ownership models — artists keep their masters, build equity, and grow with the company.",
    functions: ["Lil Gangsta — Street / Hip-Hop", "Sarah Rae — Soul / R&B", "Future expansion artists", "Joint venture deals", "Independent distribution partners"],
  },
];

const doctrines = [
  "Artists own their masters. Period.",
  "The label is armor, not a cage.",
  "We don't sign talent — we develop legacy.",
  "Distribution is power. Control yours.",
  "Every deal protects the creator first.",
  "Generational wealth is the only acceptable outcome.",
];

export default function Empire() {
  const [expanded, setExpanded] = useState("executive");

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader eyebrow="The Structure" title="Heavens Gates Music Group" subtitle="A music and media empire built to protect artists, control distribution, and create generational legacy from Columbia, SC." />

      {/* Mission Statement */}
      <div className="relative overflow-hidden rounded-sm border border-primary/30 bg-gradient-to-r from-primary/10 via-crimson/5 to-transparent p-6 red-glow">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase mb-3">Mission Statement</p>
          <p className="font-prose text-lg md:text-xl text-foreground leading-relaxed italic">
            "Heavens Gates Music Group exists to give artists the infrastructure, ownership, and protection they need to build generational legacies. We are not in the business of exploitation. We are in the business of creation, preservation, and power."
          </p>
          <p className="font-heading text-[10px] tracking-widest text-primary mt-3 uppercase">— Barry Parker, Founder</p>
        </div>
      </div>

      {/* Org Chart */}
      <div className="space-y-2">
        <p className="font-heading text-[10px] tracking-widest uppercase text-muted-foreground mb-4">Organizational Structure</p>
        {departments.map((dept, i) => (
          <motion.div key={dept.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-sm border transition-all duration-200 ${dept.color} ${expanded === dept.id ? "" : "border-border/50 bg-card"}`}
          >
            <button
              onClick={() => setExpanded(expanded === dept.id ? null : dept.id)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              <div className="w-9 h-9 rounded-sm bg-background/50 flex items-center justify-center shrink-0">
                <dept.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs tracking-wide font-bold text-foreground">{dept.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Lead: {dept.lead}</p>
              </div>
              {expanded === dept.id ? <ChevronDown className="w-4 h-4 text-primary shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </button>
            {expanded === dept.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4">
                <div className="pl-[52px] space-y-3">
                  <p className="font-prose text-sm text-muted-foreground leading-relaxed">{dept.description}</p>
                  <ul className="space-y-1.5">
                    {dept.functions.map(fn => (
                      <li key={fn} className="flex items-center gap-2 text-xs text-secondary-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                        {fn}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Doctrines */}
      <div className="rounded-sm border border-border/50 bg-card p-6">
        <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase mb-4">Company Doctrines</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {doctrines.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-sm bg-secondary/50 border border-border/50"
            >
              <span className="font-heading text-primary text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-prose text-sm text-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}