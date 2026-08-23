import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../../components/shared/SectionHeader";

export default function MyLicenses() {
  const { data: licenses = [] } = useQuery({
    queryKey: ["myLicenses"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.BeatLicense.filter({ owner_email: user.email });
    },
    initialData: [],
  });

  const getStatusBadge = (license) => {
    const now = new Date();
    const expiration = new Date(license.expiration_date);
    const daysUntilExpiration = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));

    if (license.status === 'expired') {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Expired</Badge>;
    }
    
    if (daysUntilExpiration <= 30) {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expires in {daysUntilExpiration} days
        </Badge>
      );
    }

    return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
  };

  const getLicenseTypeLabel = (type) => {
    const labels = {
      mp3: 'MP3 License',
      wav_premium: 'WAV Premium',
      unlimited_exclusive: 'Unlimited Exclusive',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        eyebrow="License Management"
        title="My Beat Licenses"
        subtitle="View and manage all your purchased beat licenses"
      />

      {licenses.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-heading text-sm text-muted-foreground">
            No licenses yet. Purchase your first beat license from the store!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license, idx) => {
            const daysUntilExpiration = Math.ceil(
              (new Date(license.expiration_date) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-sm border border-border/50 bg-card p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-heading text-lg font-bold">{license.beat_title}</h3>
                      {getStatusBadge(license)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="font-heading text-[10px] tracking-widest text-primary uppercase">License Type</p>
                        <p className="font-prose text-sm mt-1">{getLicenseTypeLabel(license.license_type)}</p>
                      </div>
                      <div>
                        <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Purchase Date</p>
                        <p className="font-prose text-sm mt-1">{new Date(license.purchase_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Expiration</p>
                        <p className={`font-prose text-sm mt-1 ${daysUntilExpiration <= 30 ? 'text-amber-500' : ''}`}>
                          {new Date(license.expiration_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-heading text-[10px] tracking-widest text-primary uppercase">Price Paid</p>
                        <p className="font-prose text-sm mt-1">${license.price_paid.toFixed(2)}</p>
                      </div>
                    </div>

                    {license.is_buyout_requested && (
                      <div className="flex items-center gap-2 text-amber-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Buyout request submitted</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {license.license_certificate_url && (
                      <a href={license.license_certificate_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-3 h-3" />
                          Certificate
                        </Button>
                      </a>
                    )}
                    {daysUntilExpiration <= 30 && license.status === 'active' && (
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-500">
                        Request Buyout
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}