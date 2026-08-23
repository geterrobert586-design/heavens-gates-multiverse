import React from "react";
import { motion } from "framer-motion";
import { Shield, Copyright, FileText, Scale, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    icon: Copyright,
    title: "Copyright Your Work",
    description: "Your creative work is automatically protected by copyright the moment it's created and fixed in a tangible form. However, registering with the U.S. Copyright Office provides additional legal protections.",
    steps: [
      "Document your creative process with dated records",
      "Register your work at copyright.gov ($35-$65 per work)",
      "Include copyright notices on all published work",
      "Keep records of all versions and drafts"
    ],
    link: "https://www.copyright.gov/registration/"
  },
  {
    icon: FileText,
    title: "Trademark Your Brand",
    description: "Protect your artist name, logos, and brand identity. A trademark prevents others from using confusingly similar marks in your industry.",
    steps: [
      "Search the USPTO database for existing trademarks",
      "File a trademark application with the USPTO",
      "Use the ™ symbol while your application is pending",
      "Monitor for infringement once registered"
    ],
    link: "https://www.uspto.gov/trademarks"
  },
  {
    icon: Scale,
    title: "Licensing & Contracts",
    description: "Control how your work is used by others. Licensing agreements let you earn revenue while maintaining ownership of your intellectual property.",
    steps: [
      "Never grant exclusive rights without fair compensation",
      "Always get agreements in writing",
      "Understand the difference between exclusive and non-exclusive licenses",
      "Set clear terms for duration, territory, and usage"
    ]
  },
  {
    icon: AlertTriangle,
    title: "Handling Infringement",
    description: "Know what to do when someone uses your work without permission. Acting quickly is important to protect your rights.",
    steps: [
      "Document the infringement with screenshots and URLs",
      "Send a DMCA takedown notice to the hosting platform",
      "Consider a cease and desist letter for serious cases",
      "Consult an IP attorney for legal action if needed"
    ]
  },
  {
    icon: BookOpen,
    title: "Publishing Rights",
    description: "Understand your rights when working with publishers, labels, or distributors. Retain as much control as possible over your creative work.",
    steps: [
      "Read every contract thoroughly before signing",
      "Negotiate to retain master recordings and original works",
      "Understand royalty structures and payment schedules",
      "Get independent legal advice for major deals"
    ]
  }
];

export default function Protection() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">IP Protection Guide</h1>
        <p className="text-muted-foreground mt-1">Learn how to protect your creative work and intellectual property.</p>
      </div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold mb-2">Your Art, Your Rights</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              As an independent creator, protecting your intellectual property is one of the most important things you can do. This guide covers the essential steps to secure your creative work, from copyrights to handling infringement.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold">{section.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{section.description}</p>
              </div>
            </div>

            <ul className="space-y-2 ml-14 mb-4">
              {section.steps.map((step, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                    {j + 1}
                  </span>
                  <span className="text-secondary-foreground">{step}</span>
                </li>
              ))}
            </ul>

            {section.link && (
              <div className="ml-14">
                <a href={section.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5">
                    Learn More <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}