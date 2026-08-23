import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Music, Palette, BookOpen, Video, File, Eye, Heart } from "lucide-react";
import { format } from "date-fns";

const categoryIcons = {
  music: Music,
  art: Palette,
  writing: BookOpen,
  video: Video,
  other: File,
};

const statusColors = {
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  draft: "bg-muted text-muted-foreground border-border",
  archived: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function RecentUploads({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
        <p className="text-muted-foreground">No content uploaded yet. Start building your catalog!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card border border-border/50 overflow-hidden"
    >
      <div className="p-6 border-b border-border/50">
        <h3 className="font-heading text-lg font-semibold">Recent Uploads</h3>
      </div>
      <div className="divide-y divide-border/50">
        {items.slice(0, 5).map((item) => {
          const Icon = categoryIcons[item.category] || File;
          return (
            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.category} · {format(new Date(item.created_date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{item.likes || 0}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${statusColors[item.status] || statusColors.draft}`}>
                  {item.status || "draft"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}