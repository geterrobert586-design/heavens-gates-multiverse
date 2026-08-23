import React from "react";
import { Lock, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function LockedOverlay({ requiredTier, userTier, children }) {
  // If no required tier, show content
  if (!requiredTier) return children;

  // If user has no tier, treat as free
  const userTierLevel = userTier?.tierLevel || 0;
  const requiredTierLevel = requiredTier.tierLevel || 0;

  // User has access
  if (userTierLevel >= requiredTierLevel) {
    return children;
  }

  // Lock icons and messages by tier
  const tierInfo = {
    1: { name: "Supporter", icon: Star, color: "text-gold", bg: "from-gold/10 to-gold/5" },
    2: { name: "Inner Circle", icon: Crown, color: "text-crimson", bg: "from-crimson/10 to-crimson/5" },
  };

  const info = tierInfo[requiredTierLevel] || tierInfo[1];
  const Icon = info.icon;

  return (
    <div className={`relative rounded-sm border border-border/50 overflow-hidden bg-gradient-to-br ${info.bg}`}>
      {/* Blurred Content Preview */}
      <div className="absolute inset-0 blur-sm opacity-30 pointer-events-none">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <div className={`w-16 h-16 rounded-sm bg-gradient-to-br ${info.bg} border border-border/50 flex items-center justify-center mb-4`}>
          <Icon className={`w-8 h-8 ${info.color}`} />
        </div>

        <h3 className="font-heading text-lg font-bold mb-2">
          {info.name} Access Required
        </h3>

        <p className="text-sm text-muted-foreground max-w-md mb-6">
          This content is locked. Upgrade to {info.name} to unlock {requiredTier.feature || "this feature"}.
        </p>

        <div className="flex gap-3">
          <Link to="/tiers">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              View Membership Tiers
            </Button>
          </Link>
        </div>

        {/* Tier Badge */}
        <Badge variant="outline" className={`mt-4 ${info.color} border-current`}>
          <Icon className="w-3 h-3 mr-1" />
          {info.name}
        </Badge>
      </div>
    </div>
  );
}