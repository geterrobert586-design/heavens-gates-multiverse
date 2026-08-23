import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Plus, Trash2, Edit, Eye, EyeOff, Film, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../../components/shared/SectionHeader";

const sceneTypes = {
  character_intro: { label: "Character Intro", color: "bg-primary/20 text-primary" },
  key_moment: { label: "Key Moment", color: "bg-crimson/20 text-crimson" },
  doctrine: { label: "Doctrine", color: "bg-amber-600/20 text-amber-600" },
  location: { label: "Location", color: "bg-emerald-600/20 text-emerald-600" },
  quote: { label: "Quote", color: "bg-purple-600/20 text-purple-600" },
  teaser: { label: "Teaser", color: "bg-blue-600/20 text-blue-600" },
};

export default function PromoVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      setIsAdmin(user?.role === 'admin');
    });
  }, []);

  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["promoVideos"],
    queryFn: () => base44.entities.PromoVideo.list("-orderNumber"),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PromoVideo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoVideos"] });
      setSelectedVideo(null);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }) =>
      base44.entities.PromoVideo.update(id, { isPublished: !isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoVideos"] });
    },
  });

  const handleGenerateVideo = async (videoData) => {
    setIsGenerating(true);
    try {
      const response = await base44.functions.invoke("generatePromoVideo", {
        prompt: videoData.prompt,
        label: videoData.title,
      });
      if (response.data.url) {
        await base44.entities.PromoVideo.create({
          ...videoData,
          videoUrl: response.data.url,
        });
        queryClient.invalidateQueries({ queryKey: ["promoVideos"] });
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const publishedVideos = videos.filter((v) => v.isPublished);

  if (!isAdmin) {
    return (
      <div className="text-center py-24">
        <Film className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
        <h2 className="font-heading text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Our claymation promotional video series is currently in production. Check back soon for exclusive visual teasers from the Heavens Gates Chronicles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-start justify-between">
        <SectionHeader
          eyebrow="Claymation Promotional Series"
          title="Heavens Gates Chronicles: Visual Teasers"
          subtitle="10-15 atmospheric claymation-style clips promoting the book and app. Stop-motion aesthetic with textured, handcrafted visuals."
        />
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                Generate New Clip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Promotional Video Clip</DialogTitle>
              </DialogHeader>
              <VideoGeneratorForm
                onSubmit={handleGenerateVideo}
                onCancel={() => setDialogOpen(false)}
                isGenerating={isGenerating}
              />
            </DialogContent>
          </Dialog>
        )}
        {!isAdmin && <div className="w-[140px]" />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-sm bg-card border border-border/50">
          <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Total Clips</p>
          <p className="font-heading text-2xl font-bold mt-1">{videos.length}</p>
        </div>
        <div className="p-4 rounded-sm bg-card border border-border/50">
          <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Published</p>
          <p className="font-heading text-2xl font-bold mt-1">{publishedVideos.length}</p>
        </div>
        <div className="p-4 rounded-sm bg-card border border-border/50">
          <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Duration</p>
          <p className="font-heading text-2xl font-bold mt-1">6s each</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publishedVideos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative overflow-hidden rounded-sm border border-border/50 bg-card hover:border-primary/30 transition-all"
          >
            {/* Video Preview */}
            <div className="aspect-video bg-secondary relative overflow-hidden">
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-sm font-semibold">{video.title}</h3>
                  {video.featuredCharacter && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {video.featuredCharacter}
                    </p>
                  )}
                </div>
                <Badge className={sceneTypes[video.sceneType]?.color}>
                  {sceneTypes[video.sceneType]?.label}
                </Badge>
              </div>

              {video.description && (
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedVideo(video)}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Watch
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs ml-auto"
                      onClick={() =>
                        togglePublishMutation.mutate({
                          id: video.id,
                          isPublished: video.isPublished,
                        })
                      }
                    >
                      {video.isPublished ? (
                        <Eye className="w-3 h-3 mr-1" />
                      ) : (
                        <EyeOff className="w-3 h-3 mr-1" />
                      )}
                      {video.isPublished ? "Published" : "Hidden"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(video.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-secondary rounded-sm overflow-hidden">
                {selectedVideo.videoUrl && (
                  <video
                    src={selectedVideo.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                  />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
                {selectedVideo.featuredCharacter && (
                  <p className="text-[12px] text-muted-foreground">
                    Featured: {selectedVideo.featuredCharacter}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {publishedVideos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-heading text-sm text-muted-foreground">
            No promotional clips yet. Generate your first claymation teaser!
          </p>
        </div>
      )}
    </div>
  );
}

function VideoGeneratorForm({ onSubmit, onCancel, isGenerating }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    featuredCharacter: "",
    sceneType: "character_intro",
    orderNumber: 1,
    prompt: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Clip Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Barry Parker - The Architect"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Scene Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what happens in this 6-second clip..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredCharacter">Featured Character</Label>
        <Input
          id="featuredCharacter"
          value={formData.featuredCharacter}
          onChange={(e) => setFormData({ ...formData, featuredCharacter: e.target.value })}
          placeholder="e.g., Barry Parker, Makaila Hill Parker"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sceneType">Scene Type</Label>
        <Select
          value={formData.sceneType}
          onValueChange={(value) => setFormData({ ...formData, sceneType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sceneTypes).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderNumber">Display Order</Label>
        <Input
          id="orderNumber"
          type="number"
          value={formData.orderNumber}
          onChange={(e) => setFormData({ ...formData, orderNumber: parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">AI Video Generation Prompt</Label>
        <Textarea
          id="prompt"
          value={formData.prompt}
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          placeholder="Detailed visual prompt for claymation style... Be specific about lighting, mood, character appearance, camera angle, and action."
          rows={4}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          Example: "Claymation stop-motion style. Barry Parker standing on a rooftop overlooking Columbia, South Carolina at dusk. Warm golden lighting, textured clay aesthetic, atmospheric smoke. Camera slowly pushes in. Moody, cinematic, handcrafted look."
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating... (30-60s)
            </>
          ) : (
            <>
              <Film className="w-4 h-4 mr-2" />
              Generate 6s Clip
            </>
          )}
        </Button>
      </div>
    </form>
  );
}