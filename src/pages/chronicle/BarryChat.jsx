import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Shield } from "lucide-react";
import ReactMarkdown from "react-markdown";
import LockedOverlay from "../../components/shared/LockedOverlay";
import { useUserTier } from "../../hooks/useUserTier";

export default function BarryChat() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { userTier, loading: tierLoading } = useUserTier();

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    setLoading(true);
    const conv = await base44.agents.createConversation({
      agent_name: "barry_parker",
      metadata: { name: "Conversation with Barry Parker" }
    });
    setConversation(conv);

    const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });

    setLoading(false);
    return () => unsubscribe();
  };

  const handleSend = async () => {
    if (!input.trim() || sending || !conversation) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starters = [
    "What is Heavens Gates Music Group?",
    "Why did you build this empire?",
    "How do you protect your artists?",
    "Tell me about copyright and ownership for artists.",
    "How does music distribution really work?",
    "What should I know about trademarks and protecting my brand?",
    "How do I keep my masters and build legacy wealth?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px] pb-4">
      <LockedOverlay
        requiredTier={{ tierLevel: 2, name: "Inner Circle", feature: "Barry Parker AI chat" }}
        userTier={userTier}
      >
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-sm overflow-hidden shrink-0">
            <img
              src="https://media.base44.com/images/public/6a0b535f618d6770d1a21b30/4a4416886_generated_image.png"
              alt="Barry Parker"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
        </div>
        <div>
          <h2 className="font-heading text-sm font-bold tracking-wide">Barry Parker</h2>
          <p className="text-[11px] text-muted-foreground">Founder · Heavens Gates Music Group · Columbia, SC</p>
        </div>
        <div className="ml-auto">
          <p className="font-heading text-[9px] tracking-[0.2em] text-primary uppercase">Live</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
              <p className="font-heading text-xs text-muted-foreground tracking-widest uppercase">Connecting...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-4">
            <div className="text-center">
              <p className="font-prose text-lg italic text-muted-foreground">"Ask me anything. The empire has no secrets from those who seek truth."</p>
              <p className="font-heading text-[10px] tracking-widest text-primary uppercase mt-2">— Barry Parker</p>
            </div>
            <div>
              <p className="font-heading text-[10px] tracking-widest uppercase text-muted-foreground mb-3">Start a conversation:</p>
              <div className="space-y-2">
                {starters.map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    className="w-full text-left px-4 py-2.5 rounded-sm border border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.filter(m => m.role !== "system").map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-sm overflow-hidden shrink-0 mt-0.5">
                    <img
                      src="https://media.base44.com/images/public/6a0b535f618d6770d1a21b30/4a4416886_generated_image.png"
                      alt="Barry Parker"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-sm px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary/10 border border-primary/20 text-foreground"
                    : "bg-card border border-border/50"
                }`}>
                  {msg.role === "user" ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <ReactMarkdown className="font-prose text-base text-foreground leading-relaxed prose-sm prose-invert max-w-none">
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {sending && (
          <div className="flex gap-3 justify-start">
          <div className="w-8 h-8 rounded-sm overflow-hidden shrink-0">
            <img
              src="https://media.base44.com/images/public/6a0b535f618d6770d1a21b30/4a4416886_generated_image.png"
              alt="Barry Parker"
              className="w-full h-full object-cover"
            />
          </div>
            <div className="bg-card border border-border/50 rounded-sm px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 items-end border-t border-border/50 pt-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Barry Parker anything..."
          rows={1}
          className="flex-1 bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-primary/50 font-prose"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
      </LockedOverlay>
    </div>
  );
}