import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Trash2, Users } from "lucide-react";

export default function TierCard({ tier, onEdit, onDelete, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-xl font-semibold">{tier.name}</h3>
            {tier.is_active !== false ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">Inactive</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{tier.description || "No description"}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-heading font-bold text-primary">${tier.price}</p>
          <p className="text-xs text-muted-foreground">/month</p>
        </div>
      </div>

      {/* Subscribers */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-secondary/50">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{tier.subscriber_count || 0} subscribers</span>
      </div>

      {/* Benefits */}
      {tier.benefits?.length > 0 && (
        <ul className="space-y-2 mb-4">
          {tier.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-secondary-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-border/50">
        <Button variant="outline" size="sm" className="flex-1 border-border" onClick={() => onEdit(tier)}>
          <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="border-border text-destructive hover:text-destructive" onClick={() => onDelete(tier)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}