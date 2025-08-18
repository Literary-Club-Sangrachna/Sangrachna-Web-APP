import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string | null;
  description: string | null;
  image_url: string | null;
  available_copies: number;
  total_copies: number;
  is_featured: boolean;
  is_recommended: boolean;
  isbn: string | null;
  publication_year: number | null;
}

interface BookFormProps {
  book?: Book | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    image_url: '',
    available_copies: 1,
    total_copies: 1,
    is_featured: false,
    is_recommended: false,
    isbn: '',
    publication_year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre || '',
        description: book.description || '',
        image_url: book.image_url || '',
        available_copies: book.available_copies,
        total_copies: book.total_copies,
        is_featured: book.is_featured,
        is_recommended: book.is_recommended,
        isbn: book.isbn || '',
        publication_year: book.publication_year || new Date().getFullYear()
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookData = {
        ...formData,
        genre: formData.genre || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        isbn: formData.isbn || null,
        publication_year: formData.publication_year || null
      };

      if (book) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', book.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Book added successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{book ? 'Edit Book' : 'Add New Book'}</CardTitle>
          <CardDescription>
            {book ? 'Update book information' : 'Add a new book to the library'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_copies">Total Copies</Label>
                <Input
                  id="total_copies"
                  type="number"
                  min="1"
                  value={formData.total_copies}
                  onChange={(e) => setFormData({ ...formData, total_copies: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_copies">Available Copies</Label>
                <Input
                  id="available_copies"
                  type="number"
                  min="0"
                  max={formData.total_copies}
                  value={formData.available_copies}
                  onChange={(e) => setFormData({ ...formData, available_copies: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publication_year">Publication Year</Label>
                <Input
                  id="publication_year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear() + 5}
                  value={formData.publication_year}
                  onChange={(e) => setFormData({ ...formData, publication_year: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recommended"
                  checked={formData.is_recommended}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_recommended: checked as boolean })}
                />
                <Label htmlFor="is_recommended">Recommended</Label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookForm;