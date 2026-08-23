import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import CatalogCard from "../components/catalog/CatalogCard";
import CatalogUploadDialog from "../components/catalog/CatalogUploadDialog";

export default function Catalog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["catalogItems"],
    queryFn: () => base44.entities.CatalogItem.list("-created_date", 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CatalogItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalogItems"] }),
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (item) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage your creative catalog. Upload, organize, and publish.</p>
        </div>
        <Button onClick={() => { setEditItem(null); setDialogOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Upload Content
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your catalog..."
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="art">Art</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-secondary border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No content found.</p>
          <p className="text-muted-foreground text-sm mt-1">Upload your first piece to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, i) => (
            <CatalogCard
              key={item.id}
              item={item}
              index={i}
              onEdit={handleEdit}
              onDelete={(item) => deleteMutation.mutate(item.id)}
            />
          ))}
        </div>
      )}

      <CatalogUploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editItem={editItem}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["catalogItems"] })}
      />
    </div>
  );
}