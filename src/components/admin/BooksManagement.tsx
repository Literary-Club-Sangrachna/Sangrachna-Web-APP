import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import BookForm from './BookForm';

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

interface BooksManagementProps {
  onStatsUpdate: () => void;
}

const BooksManagement: React.FC<BooksManagementProps> = ({ onStatsUpdate }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      
      fetchBooks();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
    onStatsUpdate();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading books...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Books Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
              {book.image_url ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {book.is_featured && (
                  <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
                )}
                {book.is_recommended && (
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                )}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-xs">{book.author}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <Badge variant="outline" className="text-xs">
                  {book.genre || "General"}
                </Badge>
                <span>
                  {book.available_copies}/{book.total_copies}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingBook(book);
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(book.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No books found</h3>
          <p className="text-muted-foreground">Start by adding your first book to the library.</p>
        </div>
      )}

      {showForm && (
        <BookForm
          book={editingBook}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
};

export default BooksManagement;