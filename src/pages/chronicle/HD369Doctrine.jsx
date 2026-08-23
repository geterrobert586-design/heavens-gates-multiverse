import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Download, FileText, Flame, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "../../components/shared/SectionHeader";

export default function HD369Doctrine() {
  const [activeTab, setActiveTab] = useState("overview");
  const [myWord, setMyWord] = useState("");
  const [myWork, setMyWork] = useState("");
  const [myWitness, setMyWitness] = useState("");

  const { data: doctrines = [] } = useQuery({
    queryKey: ["hd369Doctrines"],
    queryFn: () => base44.entities.HD369Doctrine.list(),
    initialData: [],
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "the_word", label: "The Word" },
    { id: "the_work", label: "The Work" },
    { id: "the_witness", label: "The Witness" },
    { id: "the_gates", label: "The 9 Gates" },
    { id: "daily_alignment", label: "Daily Alignment" },
    { id: "scriptures", label: "Principles" },
    { id: "practices", label: "Practices" },
    { id: "sacred_texts", label: "Sacred Texts" },
  ];

  const currentContent = doctrines.find((d) => d.section === activeTab);

  const gatePillars = [
    {
      number: "3",
      title: "The Word",
      meaning: "Declaration, intention, command, prayer, speech, and purpose.",
      description: "The Word is what is spoken, written, prayed, declared, and released with intention.",
      icon: Flame,
      color: "from-amber-600 to-amber-900",
    },
    {
      number: "6",
      title: "The Work",
      meaning: "Discipline, repetition, structure, correction, sacrifice, and practice.",
      description: "The Work is the action that proves the word was not empty.",
      icon: Shield,
      color: "from-emerald-600 to-emerald-900",
    },
    {
      number: "9",
      title: "The Witness",
      meaning: "Completion, proof, manifestation, testimony, result, and revelation.",
      description: "The Witness is what appears after the word and the work have moved through time.",
      icon: Crown,
      color: "from-gold to-primary",
    },
  ];

  const gates = [
    { num: "1", title: "No Word Returns Void", desc: "Foundation principle" },
    { num: "2", title: "Speak With Purpose", desc: "Clean intention matters" },
    { num: "3", title: "Align the Tongue With the Spirit", desc: "Word-work agreement" },
    { num: "4", title: "Patience", desc: "Trust the process" },
    { num: "5", title: "Confidence", desc: "Spiritual authority" },
    { num: "6", title: "Consistency", desc: "Feed the field daily" },
    { num: "7", title: "Definiteness of Purpose", desc: "Know what you're sending" },
    { num: "8", title: "Pure Intention", desc: "No hidden contamination" },
    { num: "9", title: "Completion Through Witness", desc: "Seal and receive" },
  ];

  if (activeTab === "daily_alignment") {
    return (
      <div className="space-y-8 pb-12">
        <SectionHeader
          eyebrow="Daily Practice"
          title="Daily Alignment"
          subtitle="Morning Word. Daytime Work. Night Witness."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-sm border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-8"
        >
          <div className="max-w-2xl mx-auto space-y-8">
            {/* My Word */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-sm bg-amber-600/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-amber-600">3</span>
                </div>
                <h3 className="font-heading font-bold text-lg">My Word Today</h3>
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">
                What will you declare, speak, or set as intention today?
              </p>
              <textarea
                value={myWord}
                onChange={(e) => setMyWord(e.target.value)}
                placeholder="E.g., 'I speak steady progress over my work today.'"
                className="w-full h-24 p-3 rounded-sm bg-card border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary/50 focus:outline-none resize-none"
              />
            </div>

            {/* My Work */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-sm bg-emerald-600/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-emerald-600">6</span>
                </div>
                <h3 className="font-heading font-bold text-lg">My Work Today</h3>
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">
                What action will you carry to support your word?
              </p>
              <textarea
                value={myWork}
                onChange={(e) => setMyWork(e.target.value)}
                placeholder="E.g., 'I will complete one chapter or one business task.'"
                className="w-full h-24 p-3 rounded-sm bg-card border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary/50 focus:outline-none resize-none"
              />
            </div>

            {/* My Witness */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-primary">9</span>
                </div>
                <h3 className="font-heading font-bold text-lg">My Witness Today</h3>
              </div>
              <p className="text-[12px] text-muted-foreground mb-3">
                At the end of the day, what moved, what resisted, what was revealed?
              </p>
              <textarea
                value={myWitness}
                onChange={(e) => setMyWitness(e.target.value)}
                placeholder="E.g., 'I completed the chapter. Resistance came from fatigue but clarity returned by evening.'"
                className="w-full h-24 p-3 rounded-sm bg-card border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary/50 focus:outline-none resize-none"
              />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">
              Save Today's Alignment
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (activeTab === "sacred_texts") {
    return (
      <div className="space-y-8 pb-12">
        <SectionHeader
          eyebrow="The Inner Library"
          title="Sacred Texts of the Doctrine"
          subtitle="The official spiritual books of the Heavens Gates universe."
        />

        {/* HD 3,6,9 Book */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-sm border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-card p-6"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Book Cover placeholder */}
            <div className="w-32 h-44 rounded-sm bg-gradient-to-br from-primary/30 via-background to-primary/10 border border-primary/40 flex flex-col items-center justify-center text-center p-3 shrink-0">
              <p className="font-heading text-xs font-bold text-primary leading-tight">HD 3,6,9</p>
              <div className="w-8 h-px bg-primary/40 my-2" />
              <p className="font-prose text-[10px] italic text-muted-foreground leading-tight">The Word, The Work, and The Witness</p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="font-heading text-[10px] tracking-widest text-primary uppercase mb-2">Hoodoo Dynamics · High Definition</p>
                <h2 className="font-heading text-2xl font-bold">HD 3,6,9</h2>
                <p className="font-prose text-lg italic text-muted-foreground mt-1">The Word, The Work, and The Witness</p>
                <p className="text-sm text-muted-foreground mt-1">By The Ancient Voices · UG Publishing</p>
              </div>
              <p className="font-prose text-base text-muted-foreground leading-relaxed italic">
                "Speak clean. Work steady. Seal fully. No Word Returns Void."
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The official spiritual operating framework of the Heavens Gates universe. Built around three gates: Gate 3 (The Word), Gate 6 (The Work), Gate 9 (The Witness). A system of intention, discipline, ritual structure, and completion rooted in hoodoo-rooted concepts, scripture, vortex symbolism, and sacred geometry.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://media.base44.com/files/public/6a0b535f618d6770d1a21b30/91885231a_HD_369_The_Word_The_Work_and_The_Witness_Corrected_AppendixA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <BookOpen className="w-4 h-4" />
                    Read the Book
                  </Button>
                </a>
                <a
                  href="https://media.base44.com/files/public/6a0b535f618d6770d1a21b30/91885231a_HD_369_The_Word_The_Work_and_The_Witness_Corrected_AppendixA.pdf"
                  download
                >
                  <Button variant="outline" className="border-primary/30 text-primary gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Path of Sacred Becoming */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-sm border border-amber-600/30 bg-gradient-to-br from-amber-600/10 via-background to-card p-6"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Book Cover */}
            <div className="w-32 h-44 rounded-sm bg-gradient-to-br from-amber-900/60 via-background to-amber-900/20 border border-amber-600/40 flex flex-col items-center justify-center text-center p-3 shrink-0">
              <p className="font-heading text-[9px] font-bold text-amber-500 uppercase tracking-widest leading-tight">The Path of</p>
              <p className="font-heading text-xs font-bold text-amber-400 leading-tight mt-1">Sacred Becoming</p>
              <div className="w-8 h-px bg-amber-600/40 my-2" />
              <p className="font-prose text-[9px] italic text-amber-600/80 leading-tight">A Voice from the Flames</p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="font-heading text-[10px] tracking-widest text-amber-500 uppercase mb-2">The Spiritual Creed · Sacred Thesis</p>
                <h2 className="font-heading text-2xl font-bold">The Path of Sacred Becoming</h2>
                <p className="font-prose text-lg italic text-muted-foreground mt-1">A Book of Reverence, Covenant, Conduct, and Legacy</p>
                <p className="text-sm text-muted-foreground mt-1">By A Voice from the Flames</p>
              </div>
              <p className="font-prose text-base text-muted-foreground leading-relaxed italic">
                "The goal is not self-image. The goal is not performance. The goal is not vague spirituality. The goal is sacred becoming."
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The spiritual creed and thesis behind the Heavens Gates doctrine. Seven books covering Origin, the Inner Path, Reverence, Covenant, Conduct, Community, and Becoming. The principles, values, moral codes, disciplines, and sacred laws that form a life through trial, memory, and return — now offered as a path for those called toward truth, dignity, and living inheritance.
              </p>

              {/* Seven Books Summary */}
              <div className="grid grid-cols-1 gap-2 mt-4">
                {[
                  { num: "I", title: "The Book of Origin", desc: "Of womb, hidden flame, ancestral memory, and sacred currents" },
                  { num: "II", title: "The Book of the Inner Path", desc: "Purification, balance, discipline, and self-mastery" },
                  { num: "III", title: "The Book of Reverence", desc: "Devotion, ancestor reverence, offerings, and sacred practice" },
                  { num: "IV", title: "The Book of Covenant", desc: "Marriage, courtship, brotherhood, sisterhood, and binding oaths" },
                  { num: "V", title: "The Book of Conduct", desc: "Character, speech, trade, leadership, and daily ethics" },
                  { num: "VI", title: "The Book of Community", desc: "Households, councils, mutual aid, and generational continuity" },
                  { num: "VII", title: "The Book of Becoming", desc: "Formation, initiation, maturity, and legacy" },
                ].map((book) => (
                  <div key={book.num} className="flex gap-3 items-start p-2 rounded-sm bg-card/50 border border-border/30">
                    <span className="font-heading text-[10px] text-amber-500 font-bold shrink-0 mt-0.5">BOOK {book.num}</span>
                    <div>
                      <p className="font-heading text-[11px] font-semibold text-foreground">{book.title}</p>
                      <p className="text-[11px] text-muted-foreground">{book.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap pt-2">
                <a
                  href="https://media.base44.com/files/public/6a0b535f618d6770d1a21b30/738de217b_the_path_of_sacred_becoming_with_cover_draft.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-amber-700 hover:bg-amber-600 gap-2">
                    <BookOpen className="w-4 h-4" />
                    Read the Book
                  </Button>
                </a>
                <a
                  href="https://media.base44.com/files/public/6a0b535f618d6770d1a21b30/738de217b_the_path_of_sacred_becoming_with_cover_draft.pdf"
                  download
                >
                  <Button variant="outline" className="border-amber-600/30 text-amber-500 gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Articles of Sacred Order */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-sm border border-border/50 bg-card/50 p-6 space-y-4"
        >
          <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Articles of Sacred Order</p>
          <div className="grid gap-3">
            {[
              { title: "On Source", text: "Life is not self-generated, and sacred order begins in reverent acknowledgment of what is deeper than appetite, vanity, and self-invention." },
              { title: "On the Inner Spirit", text: "There is an inward witness that must be awakened, guarded, and brought under truthful rule." },
              { title: "On the Ancestors", text: "Life reaches the living through line, sacrifice, and memory; ancestry must be honored with gratitude, sobriety, and truth." },
              { title: "On Discipline", text: "Discipline is the guardian of becoming and the proof that insight has entered conduct." },
              { title: "On Covenant", text: "What is holy in human relation must be given witness, duty, and form." },
              { title: "On Legacy", text: "The final test of becoming is not only what one experiences inwardly, but what order one leaves behind." },
            ].map((article, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-sm bg-secondary/20 border border-border/30">
                <span className="font-heading text-[11px] font-bold text-primary shrink-0">{article.title} —</span>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{article.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="rounded-sm border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="font-heading text-[10px] tracking-widest text-amber-600 uppercase mb-2">Disclaimer</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            These texts are presented as spiritual, cultural, literary, and educational content connected to the Heavens Gates Chronicles universe. They are not medical, legal, financial, or professional advice.
          </p>
        </div>
      </div>
    );
  }

  if (activeTab === "the_gates") {
    return (
      <div className="space-y-8 pb-12">
        <SectionHeader
          eyebrow="Spiritual Discipline"
          title="The 9 Gates"
          subtitle="Nine principles of the Word, Work, and Witness."
        />

        <div className="grid gap-4">
          {gates.map((gate, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-start gap-4 p-4 rounded-sm border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-secondary/50 transition-all"
            >
              <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="font-heading font-bold text-lg text-primary">
                  {gate.num}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-foreground">
                  {gate.title}
                </h4>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {gate.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        eyebrow="The Official Spiritual System"
        title="HD 3,6,9 Doctrine"
        subtitle="The Word, The Work, and The Witness"
      />

      {/* Core Principle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-sm border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-8"
      >
        <div className="relative z-10 text-center space-y-4">
          <p className="font-prose text-2xl italic text-foreground leading-relaxed">
            "Before there is power, there is word. Before there is manifestation, there is work.
            Before there is completion, there is witness."
          </p>
          <p className="font-heading text-[10px] tracking-widest text-primary uppercase">
            Speak Clean. Work Steady. Seal Fully.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gatePillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-sm border border-border/50 p-6 bg-gradient-to-br ${pillar.color}`}
            >
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-sm bg-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-heading text-[10px] tracking-widest text-white/80 uppercase mb-1">
                    Gate {pillar.number}
                  </p>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm text-white/90">{pillar.meaning}</p>
                <p className="text-[13px] text-white/80 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-sm text-[12px] font-heading tracking-wide whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {currentContent && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">
              {currentContent.title}
            </h2>
            {currentContent.subtitle && (
              <p className="text-muted-foreground">{currentContent.subtitle}</p>
            )}
          </div>

          <div
            className="font-prose text-base text-muted-foreground leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: currentContent.content.replace(/\n/g, "<br/>"),
            }}
          />

          {currentContent.inTheChronicles && (
            <div className="rounded-sm bg-card border border-border/50 p-4 space-y-2">
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase">
                In the Chronicles
              </p>
              <p className="text-sm text-muted-foreground">
                {currentContent.inTheChronicles}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-sm border border-amber-500/30 bg-amber-500/5 p-4"
      >
        <p className="font-heading text-[10px] tracking-widest text-amber-600 uppercase mb-2">
          Disclaimer
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This section is presented as spiritual, cultural, literary, and educational content
          connected to the Heavens Gates Chronicles universe. It is not medical, legal, financial,
          or professional advice.
        </p>
      </motion.div>
    </div>
  );
}