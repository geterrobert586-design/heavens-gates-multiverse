import React from "react";
import { motion } from "framer-motion";
import { Music, Palette, BookOpen, Shield, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Music Command",
    description: "Upload tracks, albums, and EPs. Organize your discography and share with your audience on your terms."
  },
  {
    icon: Palette,
    title: "Art Gallery",
    description: "Showcase your visual art, photography, and designs in a stunning gallery that you control."
  },
  {
    icon: BookOpen,
    title: "Writing Vault",
    description: "Publish your stories, poetry, and articles. Build a library of your written work."
  },
  {
    icon: Users,
    title: "Fan Tiers",
    description: "Create exclusive membership tiers. Reward your most loyal supporters with premium access."
  },
  {
    icon: BarChart3,
    title: "Performance Dashboard",
    description: "Real-time analytics on views, engagement, and revenue. Know your numbers, grow your impact."
  },
  {
    icon: Shield,
    title: "IP Protection",
    description: "Learn how to copyright, trademark, and protect your creative work. Your art, your rights."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            All the tools to organize, showcase, and monetize your creative work — no code required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}