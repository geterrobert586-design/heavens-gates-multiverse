import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { Plus, X, Loader2 } from "lucide-react";

export default function TierDialog({ open, onOpenChange, onSuccess, editTier }) {
  const [form, setForm] = useState(editTier || {
    name: "",
    description: "",
    price: 0,
    benefits: [],
    is_active: true,
  });
  const [benefitInput, setBenefitInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setForm(prev => ({ ...prev, benefits: [...(prev.benefits || []), benefitInput.trim()] }));
      setBenefitInput("");
    }
  };

  const removeBenefit = (index) => {
    setForm(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (editTier?.id) {
      await base44.entities.AudienceTier.update(editTier.id, form);
    } else {
      await base44.entities.AudienceTier.create(form);
    }
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {editTier ? "Edit Tier" : "Create New Tier"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Tier Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Supporter, Premium..."
              className="mt-1 bg-secondary border-border"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What does this tier offer?"
              className="mt-1 bg-secondary border-border h-20"
            />
          </div>

          <div>
            <Label>Monthly Price ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="mt-1 bg-secondary border-border"
            />
          </div>

          <div>
            <Label>Benefits</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                placeholder="Add a benefit..."
                className="bg-secondary border-border"
              />
              <Button type="button" variant="outline" size="icon" onClick={addBenefit} className="border-border shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {form.benefits?.length > 0 && (
              <ul className="mt-3 space-y-2">
                {form.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm bg-secondary/50 px-3 py-2 rounded-lg">
                    <span className="flex-1">{b}</span>
                    <button onClick={() => removeBenefit(i)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <Label>Active</Label>
            <Switch
              checked={form.is_active !== false}
              onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!form.name || saving}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5"
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editTier ? "Update Tier" : "Create Tier"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}