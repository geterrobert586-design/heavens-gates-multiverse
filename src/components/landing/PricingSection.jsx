import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: 9,
    icon: Zap,
    description: "For creators just getting started",
    features: [
      "Upload up to 50 items",
      "Basic analytics dashboard",
      "1 audience tier",
      "Community support",
      "Standard catalog page"
    ],
    highlighted: false
  },
  {
    name: "Creator Pro",
    price: 24,
    icon: Star,
    description: "For serious independent artists",
    features: [
      "Unlimited uploads",
      "Advanced analytics & insights",
      "Unlimited audience tiers",
      "Priority support",
      "Custom catalog branding",
      "IP protection guides",
      "Revenue tracking"
    ],
    highlighted: true
  },
  {
    name: "Legacy",
    price: 49,
    icon: Crown,
    description: "For established creators & labels",
    features: [
      "Everything in Creator Pro",
      "Multi-artist management",
      "White-label options",
      "Dedicated account manager",
      "API access",
      "Advanced royalty tracking",
      "Legal consultation credits"
    ],
    highlighted: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Invest in Your Art</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Simple, transparent pricing. Cancel anytime. Your art is always yours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary/5 border-primary/40 shadow-lg shadow-primary/5 scale-[1.02]"
                  : "bg-card/50 border-border/50 hover:border-primary/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  plan.highlighted ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-heading text-xl font-semibold">{plan.name}</h3>
              </div>

              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-heading font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-secondary-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/dashboard">
                <Button
                  className={`w-full py-5 ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}