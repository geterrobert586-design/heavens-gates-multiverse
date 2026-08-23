import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen, Eye, Heart, Users } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import RecentUploads from "../components/dashboard/RecentUploads";
import PerformanceChart from "../components/dashboard/PerformanceChart";

export default function Dashboard() {
  const { data: catalogItems = [] } = useQuery({
    queryKey: ["catalogItems"],
    queryFn: () => base44.entities.CatalogItem.list("-created_date", 50),
  });

  const { data: tiers = [] } = useQuery({
    queryKey: ["audienceTiers"],
    queryFn: () => base44.entities.AudienceTier.list(),
  });

  const totalViews = catalogItems.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalLikes = catalogItems.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalSubscribers = tiers.reduce((sum, tier) => sum + (tier.subscriber_count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Command Center</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's how your content is performing.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Uploads" value={catalogItems.length} icon={FolderOpen} trend={12} delay={0} />
        <StatCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} trend={8} delay={0.05} />
        <StatCard title="Total Likes" value={totalLikes.toLocaleString()} icon={Heart} trend={15} delay={0.1} />
        <StatCard title="Subscribers" value={totalSubscribers.toLocaleString()} icon={Users} trend={5} delay={0.15} />
      </div>

      {/* Charts and Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <RecentUploads items={catalogItems} />
      </div>
    </div>
  );
}