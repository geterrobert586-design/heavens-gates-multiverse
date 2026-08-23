import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, Users, GitBranch, Building2, Clock,
  MapPin, Music2, Eye, StickyNote, MessageSquare, Menu, X, ChevronRight,
  Crown, Sparkles, Film, Disc, FileText, Library, Settings
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home, color: "text-primary" },
  { path: "/chronicle", label: "Read the Chronicle", icon: BookOpen, color: "text-primary" },
  { path: "/characters", label: "Character Vault", icon: Users, color: "text-crimson" },
  { path: "/bloodlines", label: "Bloodline Map", icon: GitBranch, color: "text-crimson" },
  { path: "/empire", label: "The Empire", icon: Building2, color: "text-primary" },
  { path: "/timeline", label: "Timeline", icon: Clock, color: "text-primary" },
  { path: "/locations", label: "Columbia Archive", icon: MapPin, color: "text-emerald-400" },
  { path: "/soundtrack", label: "Soundtrack", icon: Music2, color: "text-primary" },
  { path: "/lore", label: "Hidden Lore", icon: Eye, color: "text-red-400" },
  { path: "/notes", label: "Reader Notes", icon: StickyNote, color: "text-primary" },
  { path: "/community", label: "Fan Theories", icon: MessageSquare, color: "text-primary" },
  { path: "/barry", label: "Talk to Barry", icon: MessageSquare, color: "text-primary" },
  { path: "/academy", label: "Ownership Academy", icon: Crown, color: "text-gold-light" },
  { path: "/hd369", label: "HD 3,6,9 Doctrine", icon: Sparkles, color: "text-emerald-400" },
  { path: "/promos", label: "Promo Videos", icon: Film, color: "text-primary" },
  { path: "/beats", label: "Beat Store", icon: Disc, color: "text-primary" },
  { path: "/my-licenses", label: "My Licenses", icon: FileText, color: "text-primary" },
  { path: "/books", label: "Anu Narrative", icon: Library, color: "text-primary" },
  { path: "/admin/ebooks", label: "Manage Ebooks (Admin)", icon: Settings, color: "text-muted-foreground" },
];

export default function ChronicleNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] flex-col z-40 bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="block">
            <p className="font-heading text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-1">The Chronicle</p>
            <h1 className="font-heading text-lg font-bold leading-tight gold-shimmer">
              HEAVENS GATES
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                <span className="text-xs tracking-wide">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="font-heading text-[9px] tracking-[0.2em] text-muted-foreground/40 text-center uppercase">
            Powered by Heavens Gates Music Group
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <h1 className="font-heading text-sm font-bold gold-shimmer">HEAVENS GATES</h1>
        </Link>
        <button onClick={() => setOpen(!open)} className="text-foreground p-1">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-50 bg-sidebar"
          >
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <h1 className="font-heading text-base font-bold gold-shimmer">HEAVENS GATES</h1>
              <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-foreground" /></button>
            </div>
            <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-64px)]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all ${
                      isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground/70"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}