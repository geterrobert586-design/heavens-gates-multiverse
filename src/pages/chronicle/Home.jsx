import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Users, Clock, Eye, Music2, ArrowRight, Shield, Star } from "lucide-react";

const quickLinks = [
  { to: "/chronicle", label: "Read the Chronicle", icon: BookOpen, desc: "Begin your journey" },
  { to: "/characters", label: "Character Vault", icon: Users, desc: "Meet the players" },
  { to: "/timeline", label: "Timeline", icon: Clock, desc: "Trace the empire's rise" },
  { to: "/lore", label: "Hidden Lore", icon: Eye, desc: "Uncover the truth" },
  { to: "/soundtrack", label: "Soundtrack", icon: Music2, desc: "Feel the frequency" },
  { to: "/empire", label: "The Empire", icon: Shield, desc: "Know the structure" },
];

const doctrines = [
  { text: "Own everything. License nothing you haven't built.", author: "Barry Parker" },
  { text: "The music is the message. The business is the armor.", author: "Barry Parker" },
  { text: "They can steal your sound. They cannot steal your structure.", author: "Makaila Hill Parker" },
  { text: "Every street has a frequency. Learn to tune it.", author: "Asad Mansa" },
];

export default function Home() {
  const [docIndex, setDocIndex] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setDocIndex(i => (i + 1) % doctrines.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 px-6">
        {/* BG layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-crimson/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/6 rounded-full blur-[80px]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 max-w-3xl">
          <p className="font-heading text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-4">A Living Archive</p>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2">
            <span className="text-foreground">HEAVENS GATES</span>
          </h1>
          <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] text-primary mb-6">
            CHRONICLES
          </h2>

          <p className="font-prose text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed italic">
            A gritty, spiritual, street-corporate saga from the heart of Columbia, South Carolina. Follow Barry Parker as he builds an empire designed for the ages.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/chronicle">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-primary text-primary-foreground font-heading text-xs tracking-widest rounded-sm hover:bg-gold-light transition-colors"
              >
                ENTER THE CHRONICLE
              </motion.button>
            </Link>
            <Link to="/characters">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-primary/30 text-primary font-heading text-xs tracking-widest rounded-sm hover:bg-primary/5 transition-colors"
              >
                MEET THE PLAYERS
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

{/* Multiverse Launch Poster */}
<section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 items-center rounded-sm border border-primary/20 bg-card/40 p-4 md:p-6 overflow-hidden gold-glow">
  <div className="relative rounded-sm overflow-hidden border border-primary/20 bg-background">
    <img
      src="/assets/heavens-gates-launch-poster.png"
      alt="Heavens Gates Multiverse launch poster"
      className="w-full h-full object-cover"
    />
  </div>
  <div className="space-y-4">
    <p className="font-heading text-[10px] tracking-[0.35em] text-primary uppercase">The Multiverse Build</p>
    <h3 className="font-heading text-2xl md:text-3xl font-black leading-tight text-foreground">
      Books. Music. Characters. Doctrine. One Digital Universe.
    </h3>
    <p className="font-prose text-lg text-muted-foreground leading-relaxed">
      This is where the Chronicle expands from written story into a living software universe — a place to explore the books, meet the players, follow the soundtrack, unlock hidden lore, and build the empire layer by layer.
    </p>
    <div className="flex flex-wrap gap-2">
      {["Books", "Music", "Characters", "Doctrine", "Ownership", "Legacy"].map((tag) => (
        <span key={tag} className="px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 font-heading text-[10px] tracking-widest text-primary uppercase">
          {tag}
        </span>
      ))}
    </div>
  </div>
</section>

      {/* Rotating Doctrine */}
      <motion.section
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-sm border border-primary/20 bg-gradient-to-r from-primary/5 via-crimson/5 to-transparent p-8 text-center red-glow"
      >
        <Star className="w-4 h-4 text-primary/40 mx-auto mb-4" />
        <AnimatedDoctrine doctrine={doctrines[docIndex]} />
        <div className="flex justify-center gap-1.5 mt-4">
          {doctrines.map((_, i) => (
            <button key={i} onClick={() => setDocIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === docIndex ? "bg-primary w-4" : "bg-primary/30"}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Quick Links */}
      <section>
        <p className="font-heading text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-5">Navigate the Universe</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Link to={link.to} className="group flex items-start gap-3 p-4 rounded-sm bg-card border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-[11px] tracking-wide text-foreground leading-tight">{link.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{link.desc}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-primary/0 group-hover:text-primary/60 ml-auto shrink-0 self-center transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Columbia Animated Image */}
      <section className="relative overflow-hidden rounded-sm border border-primary/20">
        <img
          src="https://media.base44.com/images/public/6a0b535f618d6770d1a21b30/1dbdfc360_generated_image.png"
          alt="Columbia, South Carolina — The PJs animation style aerial view"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="font-heading text-[9px] tracking-[0.3em] text-primary/60 uppercase mb-1">The City</p>
          <p className="font-prose text-sm italic text-muted-foreground">Columbia, South Carolina — where the empire began.</p>
        </div>
      </section>

      {/* About strip */}
      <section className="border-t border-border/50 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {[
            { label: "The Founder", text: "Barry Parker — strategist, protector, shadow operator. The architect of a movement disguised as a music group." },
            { label: "The City", text: "Columbia, South Carolina. A city of coded streets, ancestral memory, and power waiting to be claimed." },
            { label: "The Mission", text: "Protect artists. Control distribution. Preserve ownership. Create generational legacy." },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-sm bg-card border border-border/50">
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase mb-2">{item.label}</p>
              <p className="font-prose text-base text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnimatedDoctrine({ doctrine }) {
  return (
    <motion.div key={doctrine.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <blockquote className="font-prose text-xl md:text-2xl italic text-foreground leading-relaxed max-w-2xl mx-auto">
        "{doctrine.text}"
      </blockquote>
      <p className="font-heading text-[10px] tracking-[0.2em] text-primary mt-3 uppercase">— {doctrine.author}</p>
    </motion.div>
  );
}