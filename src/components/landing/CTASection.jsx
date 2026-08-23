import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
          This Is More Than an App.
          <br />
          <span className="text-primary">It's a Movement.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Powered by the Heavens Gates legacy. Join thousands of independent creators who are taking control of their artistry.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="text-base px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 group">
            Join the Movement
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}