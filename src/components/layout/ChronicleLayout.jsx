import React from "react";
import { Outlet } from "react-router-dom";
import ChronicleNav from "./ChronicleNav";
import CopyrightNotice from "@/components/shared/CopyrightNotice";

export default function ChronicleLayout() {
  return (
    <div className="min-h-screen bg-background">
      <ChronicleNav />
      <main className="lg:ml-[260px] pt-[52px] lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
          <Outlet />
          <CopyrightNotice />
        </div>
      </main>
    </div>
  );
}