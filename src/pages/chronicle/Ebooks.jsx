import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Book, Download, ShoppingCart, CheckCircle, Lock, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "../../components/shared/SectionHeader";
import LockedOverlay from "../../components/shared/LockedOverlay";

export default function Ebooks() {
  const [user, setUser] = useState(null);
  const [purchasedBooks, setPurchasedBooks] = useState([]);

  const { data: books = [] } = useQuery({ 
    queryKey: ["ebooks"], 
    queryFn: () => base44.entities.Book.list(),
  });

  const publishedBooks = books.filter(b => b.is_published).sort((a, b) => a.book_number - b.book_number);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      if (u) {
        try {
          const purchases = await base44.entities.BookPurchase.filter({ owner_email: u.email });
          setPurchasedBooks(purchases);
        } catch (err) {
          console.error('Failed to fetch purchases:', err);
        }
      }
    }).catch(() => setUser(null));
  }, []);

  const purchasedBookIds = purchasedBooks.map(p => p.book_id);

  const handlePurchase = async (book) => {
    try {
      // Check if running in iframe
      if (window.self !== window.top) {
        alert('Checkout only works in the published app, not within an iframe. Please open in a new window.');
        return;
      }

      const response = await base44.functions.invoke('createEbookCheckout', {
        bookId: book.id,
        bookTitle: book.title,
        ebookFormat: book.ebook_format || 'pdf',
        price: book.ebook_price,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  const handleBundlePurchase = async () => {
    try {
      // Check if running in iframe
      if (window.self !== window.top) {
        alert('Checkout only works in the published app, not within an iframe. Please open in a new window.');
        return;
      }

      const bundleBooks = publishedBooks.slice(0, 3);
      const bookIds = bundleBooks.map(b => b.id);

      const response = await base44.functions.invoke('createEbookBundleCheckout', {
        bookIds,
        totalPrice: 25.00,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Bundle checkout error:', error);
      alert('Failed to start bundle checkout. Please try again.');
    }
  };

  const handleDownload = (purchase) => {
    window.open(purchase.ebook_file_url, '_blank');
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        eyebrow="Welcome to" 
        title="Anu Narrative" 
        subtitle="A New Narrative - The Heavens Gates saga in digital form. Immerse yourself in the chronicles." 
      />

      {/* Bundle Deal Banner */}
      {publishedBooks.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-sm bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-2 border-primary/40 p-6 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Package className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Complete Trilogy Bundle
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Get all three books and save 40%</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground line-through">$30.00</p>
                <p className="font-heading text-3xl font-bold text-primary">$25.00</p>
              </div>
              <Button 
                size="lg" 
                onClick={handleBundlePurchase}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
              >
                Buy Bundle
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {publishedBooks.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase">The library awaits...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedBooks.map((book, i) => {
            const isPurchased = purchasedBookIds.includes(book.id);
            
            return (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => !isPurchased && handlePurchase(book)}
                className={`rounded-sm bg-card border border-border/50 overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all group ${!isPurchased ? 'cursor-pointer' : ''}`}
              >
                <div className="relative">
                  {book.cover_image_url ? (
                    <div className="aspect-[2/3] relative bg-background overflow-hidden">
                      <img 
                        src={book.cover_image_url} 
                        alt={book.title} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${book.book_number === 3 ? 'object-[top_center] scale-110' : 'group-hover:scale-105'}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-[2/3] bg-gradient-to-br from-secondary to-card flex items-center justify-center">
                      <Book className="w-16 h-16 text-primary/20" />
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-lg font-bold leading-tight">{book.title}</h3>
                        {book.subtitle && (
                          <p className="text-sm text-muted-foreground font-prose italic mt-1">{book.subtitle}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">by Robert Leon Geter II</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-primary font-heading tracking-widest uppercase mt-3">
                      Book {book.book_number}
                    </p>
                  </div>

                  {book.synopsis && (
                    <div className="relative">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {book.synopsis}
                      </p>
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-1 rounded-sm bg-secondary border border-border uppercase tracking-wide">
                      {book.ebook_format || 'PDF'}
                    </span>
                    {isPurchased && (
                      <span className="text-[10px] px-2 py-1 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Owned
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="text-primary font-heading text-xl font-bold">
                      ${book.ebook_price?.toFixed(2)}
                    </div>
                    
                    {isPurchased ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(purchasedBooks.find(p => p.book_id === book.id))}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handlePurchase(book)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" /> Buy Now
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-12 p-8 rounded-sm bg-gradient-to-br from-secondary/50 to-card border border-border/50">
        <h4 className="font-heading text-lg font-bold mb-4 text-center">About Anu Narrative</h4>
        <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
          A New Narrative - Experience the Heavens Gates saga in immersive digital form. Each book transports you deeper into the chronicles, 
          where street wisdom meets spiritual awakening, and the empire's secrets unfold chapter by chapter.
        </p>
      </div>

      {/* Future Authors Statement */}
      <div className="p-6 rounded-sm bg-card/50 border border-border/50 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          <span className="font-heading text-primary font-bold uppercase tracking-wide">Coming Soon:</span> This platform will expand to feature other independent authors and creators. 
          Stay tuned for a growing library of voices, stories, and perspectives from the Heavens Gates Music Group collective.
        </p>
      </div>
    </div>
  );
}