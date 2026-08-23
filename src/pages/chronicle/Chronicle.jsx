import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, ChevronLeft, Clock, MapPin, User, Eye, EyeOff, Pencil, Trash2, X, Headphones, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "../../components/shared/SectionHeader";

export default function Chronicle() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [editChapter, setEditChapter] = useState(null);
  const qc = useQueryClient();

  const { data: books = [] } = useQuery({ queryKey: ["books"], queryFn: () => base44.entities.Book.list("book_number") });
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", selectedBook?.id],
    queryFn: () => selectedBook ? base44.entities.Chapter.filter({ book_id: selectedBook.id }, "chapter_number") : Promise.resolve([]),
    enabled: !!selectedBook,
  });

  const deleteBook = useMutation({ mutationFn: (id) => base44.entities.Book.delete(id), onSuccess: () => { qc.invalidateQueries(["books"]); setSelectedBook(null); } });
  const deleteChapter = useMutation({ mutationFn: (id) => base44.entities.Chapter.delete(id), onSuccess: () => { qc.invalidateQueries(["chapters", selectedBook?.id]); setSelectedChapter(null); } });

  // Reading view
  if (selectedChapter) {
    return <ChapterReader chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />;
  }

  // Chapter list view
  if (selectedBook) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedBook(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Books
          </button>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase">Book {selectedBook.book_number}</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mt-1">{selectedBook.title}</h2>
            {selectedBook.subtitle && <p className="text-muted-foreground text-sm mt-1 italic">{selectedBook.subtitle}</p>}
            {selectedBook.synopsis && <p className="font-prose text-base text-muted-foreground mt-3 max-w-xl leading-relaxed">{selectedBook.synopsis}</p>}
          </div>
          <Button size="sm" onClick={() => setAddChapterOpen(true)} className="bg-primary text-primary-foreground shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Chapter
          </Button>
        </div>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent" />
        {chapters.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-heading text-xs tracking-widest uppercase">No chapters yet</p>
            <p className="text-sm mt-1">Add the first chapter to begin the story.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((ch, i) => (
              <motion.div key={ch.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="group flex items-center gap-4 p-4 rounded-sm bg-card border border-border/50 hover:border-primary/30 cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading text-xs text-primary font-bold">{ch.chapter_number}</span>
                </div>
                <div className="flex-1 min-w-0" onClick={() => setSelectedChapter(ch)}>
                  <p className="font-heading text-sm tracking-wide text-foreground">{ch.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {ch.pov_character && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><User className="w-3 h-3" />{ch.pov_character}</span>}
                    {ch.location && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="w-3 h-3" />{ch.location}</span>}
                    {ch.word_count && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="w-3 h-3" />{Math.ceil(ch.word_count / 250)} min</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {ch.is_published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  <button onClick={() => { setEditChapter(ch); setAddChapterOpen(true); }} className="p-1.5 hover:text-primary text-muted-foreground rounded transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteChapter.mutate(ch.id)} className="p-1.5 hover:text-destructive text-muted-foreground rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <ChapterDialog open={addChapterOpen} onOpenChange={(v) => { setAddChapterOpen(v); if (!v) setEditChapter(null); }} bookId={selectedBook.id} editChapter={editChapter} onSuccess={() => qc.invalidateQueries(["chapters", selectedBook.id])} />
      </div>
    );
  }

  // Book list
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-start justify-between">
        <SectionHeader eyebrow="The Archive" title="Read the Chronicle" subtitle="Each book is a chapter in the empire. Enter when ready." />
        <Button size="sm" onClick={() => setAddBookOpen(true)} className="bg-primary text-primary-foreground shrink-0 mt-1">
          <Plus className="w-4 h-4 mr-1" /> Add Book
        </Button>
      </div>

      {/* Featured Audio Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-sm overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-card border border-primary/20 p-6"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Headphones className="w-5 h-5 text-primary" />
            <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase">Listen to the Chronicles</p>
          </div>
          <h3 className="font-heading text-xl font-bold">Experience the Saga in Audio</h3>
          <p className="font-prose text-base text-muted-foreground mt-2 max-w-xl">
            Immerse yourself in the Heavens Gates universe with cinematic audio narration. Feel the weight of every word, the tension of every scene.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button onClick={() => window.location.href = "/audiobook"} className="bg-primary text-primary-foreground">
              <Play className="w-4 h-4 mr-2" />
              Go to Audiobook Page
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Full narration available</span>
            </div>
          </div>
        </div>
      </motion.div>

      {books.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground">The archive awaits</p>
          <p className="text-sm text-muted-foreground mt-2">Add the first book to begin building the chronicle.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold">Books</h3>
            <Button size="sm" onClick={() => setAddBookOpen(true)} className="bg-primary text-primary-foreground shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Book
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book, i) => (
              <motion.div key={book.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-sm bg-card border border-border/50 hover:border-primary/40 cursor-pointer transition-all duration-300 gold-glow"
                onClick={() => setSelectedBook(book)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
                <div className="p-6 pl-8">
                  <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase mb-1">Book {book.book_number}</p>
                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">{book.title}</h3>
                  {book.subtitle && <p className="text-sm text-muted-foreground italic mt-0.5">{book.subtitle}</p>}
                  {book.synopsis && <p className="font-prose text-base text-muted-foreground mt-3 leading-relaxed line-clamp-3">{book.synopsis}</p>}
                  {book.themes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {book.themes.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); deleteBook.mutate(book.id); }} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <BookDialog open={addBookOpen} onOpenChange={setAddBookOpen} onSuccess={() => qc.invalidateQueries(["books"])} />
    </div>
  );
}

function ChapterReader({ chapter, onBack }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto pb-16">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Chapters
      </button>
      {chapter.opening_quote && (
        <div className="mb-8 p-6 border-l-2 border-primary/40 bg-primary/5 rounded-r-sm">
          <p className="font-prose text-lg italic text-foreground">"{chapter.opening_quote}"</p>
          {chapter.quote_author && <p className="font-heading text-[10px] tracking-widest text-primary mt-2 uppercase">— {chapter.quote_author}</p>}
        </div>
      )}
      <p className="font-heading text-[10px] tracking-[0.3em] text-primary uppercase mb-2">Chapter {chapter.chapter_number}</p>
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">{chapter.title}</h2>
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
        {chapter.pov_character && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="w-3.5 h-3.5 text-primary" /> POV: {chapter.pov_character}</span>}
        {chapter.location && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5 text-primary" /> {chapter.location}</span>}
      </div>
      {chapter.content ? (
        <div className="prose-chronicle chapter-drop">{chapter.content}</div>
      ) : (
        <p className="text-muted-foreground italic font-prose text-lg">This chapter has no content yet.</p>
      )}
    </motion.div>
  );
}

function BookDialog({ open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState({ title: "", subtitle: "", book_number: 1, synopsis: "", themes: [], is_published: false });
  const [themeInput, setThemeInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Book.create(form);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader><DialogTitle className="font-heading">Add New Book</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Book Number</Label><Input type="number" value={form.book_number} onChange={e => setForm(p => ({ ...p, book_number: +e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          </div>
          <div><Label className="text-xs">Subtitle</Label><Input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Synopsis</Label><Textarea value={form.synopsis} onChange={e => setForm(p => ({ ...p, synopsis: e.target.value }))} className="mt-1 bg-secondary border-border h-24 font-prose" /></div>
          <div>
            <Label className="text-xs">Themes</Label>
            <Input value={themeInput} onChange={e => setThemeInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setForm(p => ({ ...p, themes: [...p.themes, themeInput.trim()] })); setThemeInput(""); }}} placeholder="Enter theme, press Enter" className="mt-1 bg-secondary border-border" />
            <div className="flex flex-wrap gap-1 mt-2">{form.themes.map((t, i) => <span key={i} onClick={() => setForm(p => ({ ...p, themes: p.themes.filter((_, j) => j !== i) }))} className="text-[10px] px-2 py-0.5 rounded-sm bg-primary/10 text-primary cursor-pointer hover:bg-destructive/20">{t} ×</span>)}</div>
          </div>
          <div className="flex items-center justify-between"><Label className="text-xs">Published</Label><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /></div>
          <Button onClick={handleSave} disabled={!form.title || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : "Add Book"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChapterDialog({ open, onOpenChange, bookId, editChapter, onSuccess }) {
  const [form, setForm] = useState(editChapter || { title: "", chapter_number: 1, content: "", opening_quote: "", quote_author: "", pov_character: "", location: "", is_published: false });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { if (editChapter) setForm(editChapter); else setForm({ title: "", chapter_number: 1, content: "", opening_quote: "", quote_author: "", pov_character: "", location: "", is_published: false }); }, [editChapter, open]);

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, book_id: bookId, word_count: form.content?.split(/\s+/).length || 0 };
    if (editChapter?.id) await base44.entities.Chapter.update(editChapter.id, data);
    else await base44.entities.Chapter.create(data);
    setSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{editChapter ? "Edit Chapter" : "Add Chapter"}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Chapter #</Label><Input type="number" value={form.chapter_number} onChange={e => setForm(p => ({ ...p, chapter_number: +e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">POV Character</Label><Input value={form.pov_character} onChange={e => setForm(p => ({ ...p, pov_character: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
            <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          </div>
          <div><Label className="text-xs">Opening Quote</Label><Input value={form.opening_quote} onChange={e => setForm(p => ({ ...p, opening_quote: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Quote Author</Label><Input value={form.quote_author} onChange={e => setForm(p => ({ ...p, quote_author: e.target.value }))} className="mt-1 bg-secondary border-border" /></div>
          <div><Label className="text-xs">Chapter Content</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="mt-1 bg-secondary border-border h-64 font-prose text-base" placeholder="Write the chapter here..." /></div>
          <div className="flex items-center justify-between"><Label className="text-xs">Published</Label><Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} /></div>
          <Button onClick={handleSave} disabled={!form.title || saving} className="w-full bg-primary text-primary-foreground">{saving ? "Saving..." : editChapter ? "Update Chapter" : "Add Chapter"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}