import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TierCard from "../components/tiers/TierCard";
import TierDialog from "../components/tiers/TierDialog";

export default function Tiers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTier, setEditTier] = useState(null);
  const queryClient = useQueryClient();

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ["audienceTiers"],
    queryFn: () => base44.entities.AudienceTier.list("-created_date"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AudienceTier.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audienceTiers"] }),
  });

  const handleEdit = (tier) => {
    setEditTier(tier);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Audience Tiers</h1>
          <p className="text-muted-foreground mt-1">Create membership levels and reward your most loyal fans.</p>
        </div>
        <Button onClick={() => { setEditTier(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Create Tier
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 h-64 animate-pulse" />
          ))}
        </div>
      ) : tiers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No tiers created yet.</p>
          <p className="text-muted-foreground text-sm mt-1">Set up your first membership tier to start building your community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <TierCard
              key={tier.id}
              tier={tier}
              index={i}
              onEdit={handleEdit}
              onDelete={(tier) => deleteMutation.mutate(tier.id)}
            />
          ))}
        </div>
      )}

      <TierDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editTier={editTier}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["audienceTiers"] })}
      />
    </div>
  );
}