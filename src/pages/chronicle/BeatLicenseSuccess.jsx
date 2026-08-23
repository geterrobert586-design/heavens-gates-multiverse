import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { CheckCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "../../components/shared/SectionHeader";

export default function BeatLicenseSuccess() {
  const [searchParams] = useSearchParams();
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processSuccess = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) return;

      try {
        const response = await base44.functions.invoke("processBeatPayment", {
          session_id: sessionId,
        });
        setLicense(response.data);
      } catch (error) {
        console.error("Error processing payment:", error);
      } finally {
        setLoading(false);
      }
    };

    processSuccess();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-heading text-sm text-muted-foreground">Processing your license...</p>
        </div>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-muted-foreground">No license found. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        eyebrow="Purchase Complete"
        title="License Activated"
        subtitle="Your beat license has been successfully activated"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-sm border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-card p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold">Payment Successful</h2>
            <p className="text-muted-foreground">License certificate sent to your email</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div>
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Beat Title</p>
              <p className="font-heading text-lg font-bold">{license.beatTitle}</p>
            </div>
            <div>
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase">License Type</p>
              <p className="font-heading text-lg font-bold">{license.licenseType?.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Expiration Date</p>
              <p className="font-heading text-lg font-bold">{new Date(license.expirationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase">License ID</p>
              <p className="font-mono text-sm text-muted-foreground">UG-{Date.now()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <a href={license.certificateUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <FileText className="w-4 h-4" />
              Download Certificate
            </Button>
          </a>
          <Link to="/beats">
            <Button variant="outline">
              Back to Beat Store
            </Button>
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-sm bg-amber-500/10 border border-amber-500/30">
          <p className="font-heading text-[10px] tracking-widest text-amber-600 uppercase mb-2">
            ⚠️ Important Reminder
          </p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            You are responsible for tracking your license expiration date. 
            Buyout options are available at the end of your license term. 
            Save this certificate for your records.
          </p>
        </div>
      </motion.div>
    </div>
  );
}