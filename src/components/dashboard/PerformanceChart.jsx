import React from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { name: "Jan", views: 400, likes: 120 },
  { name: "Feb", views: 600, likes: 180 },
  { name: "Mar", views: 850, likes: 240 },
  { name: "Apr", views: 720, likes: 200 },
  { name: "May", views: 1100, likes: 380 },
  { name: "Jun", views: 950, likes: 320 },
  { name: "Jul", views: 1300, likes: 450 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((item) => (
          <p key={item.dataKey} className="text-sm font-medium" style={{ color: item.color }}>
            {item.dataKey}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl bg-card border border-border/50 p-6"
    >
      <h3 className="font-heading text-lg font-semibold mb-6">Performance Overview</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#viewsGradient)" strokeWidth={2} />
            <Area type="monotone" dataKey="likes" stroke="hsl(var(--accent))" fill="url(#likesGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-xs text-muted-foreground">Likes</span>
        </div>
      </div>
    </motion.div>
  );
}