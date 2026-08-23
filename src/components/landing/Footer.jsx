import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-heading font-bold text-primary-foreground text-xs">HG</span>
          </div>
          <span className="font-heading text-sm font-bold text-foreground">Heavens Gates</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/protection" className="text-xs text-muted-foreground hover:text-foreground transition-colors">IP Protection</Link>
          <a href="#pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</a>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Heavens Gates. All rights reserved.
        </p>
      </div>
    </footer>
  );
}