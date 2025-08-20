import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import BookRequestModal from "@/components/BookRequestModal";

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
  created_at: string;
}

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedBook, setSelectedBook] = useState<{id: string; title: string; author: string} | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated: isAdmin } = useAdmin();

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
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookRequest = (book: Book) => {
    setSelectedBook({
      id: book.id,
      title: book.title,
      author: book.author
    });
    setShowRequestModal(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!isAdmin) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Book deleted successfully.",
      });
      
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book.",
        variant: "destructive",
      });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre?.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <AdminIndicator />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
  Kitabghar
</h1>
</div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Sangrachna Kitabghar is our digital library initiative that serves as a bridge between readers and writers, fostering a culture of continuous learning and intellectual growth.
          </p>
        </div>

        {/* Search and Filter */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {isAdmin && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            )}
          </div>
        </section>

        {/* Books Collection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Books Collection</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted"></div>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow group">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                    {book.image_url ? (
                      <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                     {isAdmin && (
                       <div className="absolute top-2 left-2 flex gap-1">
                         <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                           <Edit className="h-3 w-3" />
                         </Button>
                         <Button 
                           size="sm" 
                           variant="destructive" 
                           className="h-6 w-6 p-0"
                           onClick={() => handleDeleteBook(book.id)}
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </div>
                     )}
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
                        Available: {book.available_copies}/{book.total_copies}
                      </span>
                    </div>
                     <Button
                       size="sm"
                       className="w-full"
                       variant={book.available_copies > 0 ? "default" : "secondary"}
                       disabled={book.available_copies === 0}
                       onClick={() => handleBookRequest(book)}
                     >
                       {book.available_copies > 0 ? "Request Book" : "Out of Stock"}
                     </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {filteredBooks.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </section>

      </div>
      
      <BookRequestModal 
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        book={selectedBook}
      />
      
      <Footer />
    </div>
  );
};

export default Library;