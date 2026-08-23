import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 group hover:border-primary/20 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-6 translate-x-6 group-hover:bg-primary/10 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
        <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>
    </motion.div>
  );
}