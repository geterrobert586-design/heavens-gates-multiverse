import React from "react";
import { Lock, Star, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TierBadge({ tierLevel, showLabel = true }) {
  if (tierLevel === 0) {
    return null; // Free content, no badge needed
  }

  const config = {
    1: {
      name: "Supporter",
      icon: Star,
      className: "bg-gold/10 text-gold border-gold/20",
    },
    2: {
      name: "Inner Circle",
      icon: Crown,
      className: "bg-crimson/10 text-crimson border-crimson/20",
    },
  };

  const { name, icon: IconComponent, className } = config[tierLevel] || config[1];

  return (
    <Badge variant="outline" className={`text-[9px] px-1.5 py-0.5 h-auto ${className}`}>
      <IconComponent className="w-2.5 h-2.5 mr-1" />
      {showLabel && name}
    </Badge>
  );
}