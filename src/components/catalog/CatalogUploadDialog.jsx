import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2 } from "lucide-react";

const categories = [
  { value: "music", label: "Music" },
  { value: "art", label: "Art" },
  { value: "writing", label: "Writing" },
  { value: "video", label: "Video" },
  { value: "other", label: "Other" },
];

const tiers = [
  { value: "free", label: "Free" },
  { value: "supporter", label: "Supporter" },
  { value: "premium", label: "Premium" },
  { value: "exclusive", label: "Exclusive" },
];

export default function CatalogUploadDialog({ open, onOpenChange, onSuccess, editItem }) {
  const [form, setForm] = useState(editItem || {
    title: "",
    description: "",
    category: "music",
    tier: "free",
    status: "draft",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, [field]: file_url }));
    setUploading(false);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setForm(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (editItem?.id) {
      await base44.entities.CatalogItem.update(editItem.id, form);
    } else {
      await base44.entities.CatalogItem.create(form);
    }
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {editItem ? "Edit Content" : "Upload New Content"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title..."
              className="mt-1 bg-secondary border-border"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your content..."
              className="mt-1 bg-secondary border-border h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Access Tier</Label>
              <Select value={form.tier} onValueChange={(v) => setForm(prev => ({ ...prev, tier: v }))}>
                <SelectTrigger className="mt-1 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
              <SelectTrigger className="mt-1 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tags</Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type and press Enter to add tags..."
              className="mt-1 bg-secondary border-border"
            />
            {form.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => removeTag(i)}
                    className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Cover Image</Label>
            <div className="mt-1">
              <label className="flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {form.cover_image_url ? "Image uploaded ✓" : "Upload cover image"}
                </span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "cover_image_url")} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <Label>Content File</Label>
            <div className="mt-1">
              <label className="flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {form.file_url ? "File uploaded ✓" : "Upload content file"}
                </span>
                <input type="file" onChange={(e) => handleFileUpload(e, "file_url")} className="hidden" />
              </label>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!form.title || saving || uploading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5"
          >
            {(saving || uploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editItem ? "Update Content" : "Add to Catalog"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}