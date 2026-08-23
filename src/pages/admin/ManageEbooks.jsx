import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Book, Upload, Download, Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SectionHeader from "../../components/shared/SectionHeader";

export default function ManageEbooks() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const qc = useQueryClient();

  const { data: books = [] } = useQuery({ 
    queryKey: ["admin-ebooks"], 
    queryFn: () => base44.entities.Book.list(),
  });

  const handleFileUpload = async (file) => {
    setUploadingFile(true);
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      const result = await base44.integrations.Core.UploadFile({ file });
      console.log('Upload result:', result);
      // Result is already the parsed data, not wrapped in response.data
      return result.file_url;
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = error.message || 'Unknown error';
      alert(`Failed to upload file: ${errorMessage}\n\nPlease check:\n- File size (must be under 25MB)\n- File format is supported\n- You're not in preview mode (try published app)`);
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = async (formData) => {
    if (editingBook?.id) {
      await base44.entities.Book.update(editingBook.id, formData);
    } else {
      await base44.entities.Book.create(formData);
    }
    qc.invalidateQueries(["admin-ebooks"]);
    setDialogOpen(false);
    setEditingBook(null);
  };

  const handleDelete = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await base44.entities.Book.delete(bookId);
      qc.invalidateQueries(["admin-ebooks"]);
    }
  };

  const togglePublish = async (book) => {
    await base44.entities.Book.update(book.id, { is_published: !book.is_published });
    qc.invalidateQueries(["admin-ebooks"]);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader 
          eyebrow="Admin" 
          title="Manage Anu Narrative" 
          subtitle="Upload and manage your book collection" 
        />
        <Button 
          size="sm" 
          onClick={() => { setEditingBook(null); setDialogOpen(true); }}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Book
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-heading text-xs tracking-widest uppercase">No books yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map((book) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 rounded-sm bg-card border border-border/50"
            >
              {book.cover_image_url ? (
                <img src={book.cover_image_url} alt={book.title} className="w-16 h-20 object-cover rounded-sm" />
              ) : (
                <div className="w-16 h-20 bg-secondary flex items-center justify-center rounded-sm">
                  <Book className="w-8 h-8 text-primary/20" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold">{book.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary border border-border">
                    Book {book.book_number}
                  </span>
                  {book.is_published ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400">Published</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-yellow-500/20 text-yellow-400">Draft</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{book.synopsis?.substring(0, 100)}...</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Price: ${book.ebook_price?.toFixed(2) || 'N/A'}</span>
                  <span>Format: {book.ebook_format || 'PDF'}</span>
                  {book.ebook_file_url && (
                    <a href={book.ebook_file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <Download className="w-3 h-3" /> Download File
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => togglePublish(book)}
                  title={book.is_published ? "Unpublish" : "Publish"}
                >
                  {book.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => { setEditingBook(book); setDialogOpen(true); }}
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(book.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <BookDialog 
        open={dialogOpen} 
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditingBook(null); }} 
        editingBook={editingBook} 
        onSave={handleSave}
        onUploadFile={handleFileUpload}
        uploadingFile={uploadingFile}
      />
    </div>
  );
}

function BookDialog({ open, onOpenChange, editingBook, onSave, onUploadFile, uploadingFile }) {
  const defaultForm = {
    title: "",
    subtitle: "",
    book_number: 1,
    cover_image_url: "",
    synopsis: "",
    themes: [],
    is_published: false,
    release_date: "",
    ebook_price: 9.99,
    ebook_file_url: "",
    ebook_format: "pdf",
  };
  
  const [form, setForm] = useState(editingBook || defaultForm);
  const [themeInput, setThemeInput] = useState("");

  React.useEffect(() => {
    setForm(editingBook || defaultForm);
  }, [editingBook, open]);

  const handleSubmit = () => {
    if (!form.title || !form.book_number) {
      alert('Title and book number are required');
      return;
    }
    onSave(form);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await onUploadFile(file);
      if (url) setForm(p => ({ ...p, cover_image_url: url }));
    }
  };

  const handleEbookUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await onUploadFile(file);
      if (url) setForm(p => ({ ...p, ebook_file_url: url }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{editingBook ? "Edit Book" : "Add Book"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Title *</Label>
              <Input 
                value={form.title} 
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} 
                className="mt-1 bg-secondary border-border" 
              />
            </div>
            <div>
              <Label className="text-xs">Book Number *</Label>
              <Input 
                type="number"
                value={form.book_number} 
                onChange={e => setForm(p => ({ ...p, book_number: parseInt(e.target.value) }))} 
                className="mt-1 bg-secondary border-border" 
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Subtitle</Label>
            <Input 
              value={form.subtitle || ""} 
              onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} 
              className="mt-1 bg-secondary border-border" 
            />
          </div>

          <div>
            <Label className="text-xs">Cover Image</Label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={handleCoverUpload} 
              className="mt-1 bg-secondary border-border" 
            />
            {form.cover_image_url && (
              <img src={form.cover_image_url} alt="Cover" className="w-32 h-48 object-cover mt-2 rounded-sm" />
            )}
          </div>

          <div>
            <Label className="text-xs">Synopsis</Label>
            <Textarea 
              value={form.synopsis || ""} 
              onChange={e => setForm(p => ({ ...p, synopsis: e.target.value }))} 
              className="mt-1 bg-secondary border-border h-24 font-prose" 
            />
          </div>

          <div>
            <Label className="text-xs">Themes (press Enter to add)</Label>
            <Input 
              value={themeInput} 
              onChange={e => setThemeInput(e.target.value)} 
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (themeInput.trim()) {
                    setForm(p => ({ ...p, themes: [...(p.themes || []), themeInput.trim()] }));
                    setThemeInput("");
                  }
                }
              }}
              placeholder="Add theme, press Enter"
              className="mt-1 bg-secondary border-border" 
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {form.themes?.map((theme, i) => (
                <span 
                  key={i} 
                  onClick={() => setForm(p => ({ ...p, themes: p.themes.filter((_, j) => j !== i) }))}
                  className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary border border-border cursor-pointer hover:border-destructive/50"
                >
                  {theme} ×
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Ebook Price ($)</Label>
              <Input 
                type="number"
                step="0.01"
                value={form.ebook_price || ""} 
                onChange={e => setForm(p => ({ ...p, ebook_price: parseFloat(e.target.value) }))} 
                className="mt-1 bg-secondary border-border" 
              />
            </div>
            <div>
              <Label className="text-xs">Format</Label>
              <Select 
                value={form.ebook_format || "pdf"} 
                onValueChange={v => setForm(p => ({ ...p, ebook_format: v }))}
              >
                <SelectTrigger className="mt-1 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Only</SelectItem>
                  <SelectItem value="epub">EPUB Only</SelectItem>
                  <SelectItem value="both">Both PDF & EPUB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Ebook File (PDF/EPUB)</Label>
            <Input 
              type="file" 
              accept=".pdf,.epub,.zip"
              onChange={handleEbookUpload} 
              disabled={uploadingFile}
              className="mt-1 bg-secondary border-border" 
            />
            {uploadingFile && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            {form.ebook_file_url && (
              <a href={form.ebook_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                <Download className="w-3 h-3" /> View uploaded file
              </a>
            )}
          </div>

          <div>
            <Label className="text-xs">Release Date</Label>
            <Input 
              type="date"
              value={form.release_date || ""} 
              onChange={e => setForm(p => ({ ...p, release_date: e.target.value }))} 
              className="mt-1 bg-secondary border-border" 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Published</Label>
            <Switch 
              checked={!!form.is_published} 
              onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} 
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground">
            {editingBook ? "Update Book" : "Add Book"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}