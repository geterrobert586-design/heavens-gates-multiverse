import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

// Tier levels: 0 = Reader (free), 1 = Supporter ($7), 2 = Inner Circle ($17)
const TIER_LEVELS = {
  "Reader": 0,
  "Supporter": 1,
  "Inner Circle": 2,
};

export function useUserTier() {
  const [userTier, setUserTier] = useState({ tierLevel: 0, name: "Reader" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTier = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          // Check if user has a tier subscription stored in their profile
          const userTierName = user.subscription_tier || "Reader";
          setUserTier({
            tierLevel: TIER_LEVELS[userTierName] || 0,
            name: userTierName,
          });
        }
      } catch (error) {
        console.error("Error checking user tier:", error);
      } finally {
        setLoading(false);
      }
    };

    checkTier();
  }, []);

  return { userTier, loading };
}

export function useTiers() {
  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ["audienceTiers"],
    queryFn: () => base44.entities.AudienceTier.list(),
  });

  const getTierByLevel = (level) => {
    const tierMap = {
      0: tiers.find(t => t.name === "Reader"),
      1: tiers.find(t => t.name === "Supporter"),
      2: tiers.find(t => t.name === "Inner Circle"),
    };
    return tierMap[level];
  };

  return { tiers, isLoading, getTierByLevel };
}

// Helper to check if user has access
export function hasAccess(userTierLevel, requiredTierLevel) {
  return userTierLevel >= requiredTierLevel;
}