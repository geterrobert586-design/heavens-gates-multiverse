import React from "react";
import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 ${align === "center" ? "text-center" : ""}`}
    >
      {eyebrow && (
        <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase mb-2">{eyebrow}</p>
      )}
      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">{subtitle}</p>}
      <div className={`mt-3 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent ${align === "center" ? "mx-auto w-32" : "w-full max-w-sm"}`} />
    </motion.div>
  );
}