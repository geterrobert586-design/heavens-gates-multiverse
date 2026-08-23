import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Palette, BookOpen, Video, File, Eye, Heart, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

const categoryIcons = {
  music: Music,
  art: Palette,
  writing: BookOpen,
  video: Video,
  other: File,
};

const tierColors = {
  free: "bg-muted text-muted-foreground border-border",
  supporter: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  premium: "bg-primary/10 text-primary border-primary/20",
  exclusive: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const statusColors = {
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  draft: "bg-muted text-muted-foreground border-border",
  archived: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function CatalogCard({ item, onEdit, onDelete, index }) {
  const Icon = categoryIcons[item.category] || File;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/20 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-40 bg-secondary overflow-hidden">
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Icon className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <Badge variant="outline" className={`text-[10px] ${tierColors[item.tier] || tierColors.free}`}>
            {item.tier}
          </Badge>
          <Badge variant="outline" className={`text-[10px] ${statusColors[item.status] || statusColors.draft}`}>
            {item.status || "draft"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-foreground truncate">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description || "No description"}</p>
          </div>
        </div>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{item.views || 0}</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{item.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}