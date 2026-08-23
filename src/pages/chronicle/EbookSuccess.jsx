import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function EbookSuccess() {
  const [searchParams] = useSearchParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    
    if (!session_id) {
      setError('No purchase session found');
      setLoading(false);
      return;
    }

    const processPayment = async () => {
      try {
        // Try bundle payment first
        try {
          const response = await base44.functions.invoke('processEbookBundlePayment', {
            session_id,
          });
          if (response.data?.success) {
            setPurchase({ 
              ...response.data, 
              purchaseId: 'Bundle Purchase',
              isBundle: true,
              books_count: response.data.books_count
            });
            return;
          }
        } catch {
          // Not a bundle, try single ebook
        }

        const response = await base44.functions.invoke('processEbookPayment', {
          session_id,
        });

        if (response.data?.success) {
          setPurchase({ ...response.data, isBundle: false });
        }
      } catch (err) {
        console.error('Payment processing error:', err);
        setError(err.response?.data?.error || 'Failed to process purchase');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-heading text-sm tracking-widest uppercase text-muted-foreground">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-heading text-xl font-bold">Purchase Issue</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
          <Link to="/books">
            <Button variant="outline">Browse Ebooks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12 space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="font-heading text-3xl font-bold">Purchase Complete!</h1>
        <p className="text-muted-foreground">Thank you for your order. Your ebook is ready for download.</p>
      </div>

      {purchase && (
        <div className="rounded-sm bg-card border border-border/50 p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
              {purchase.isBundle ? (
                <>
                  <Package className="w-6 h-6 text-primary" />
                  Bundle Purchase Complete!
                </>
              ) : (
                purchase.purchaseId
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {purchase.isBundle 
                ? `You purchased ${purchase.books_count} books. Downloads available below.`
                : 'Download your ebook below'}
            </p>
          </div>

          {purchase.isBundle ? (
            <div className="p-4 bg-secondary/50 rounded-sm border border-border">
              <p className="text-sm text-muted-foreground">
                Visit the <Link to="/books" className="text-primary hover:underline">Ebooks page</Link> to access all your purchased books from your library.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.open(purchase.ebookUrl, '_blank')}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" /> Download Ebook
              </Button>
              <Link to="/books">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Browse More
                </Button>
              </Link>
            </div>
          )}

          <div className="pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent with your download link(s). You can also access your purchases anytime from your account.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}