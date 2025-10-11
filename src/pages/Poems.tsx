import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, BookOpen, User, Calendar, PenTool } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import PenDownSubmissionModal from "@/components/PenDownSubmissionModal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Poems = () => {
  const { toast } = useToast();
  const [poems, setPoems] = useState<any[]>([]);
  const [featuredPoems, setFeaturedPoems] = useState<any[]>([]);
  const [recentPoems, setRecentPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPoems, setLikedPoems] = useState<Set<string>>(new Set());
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    fetchPoems();
    loadLikedPoems();
  }, []);

  const fetchPoems = async () => {
    try {
      // Fetch approved poems from the poems table
      const { data: poemsData } = await supabase
        .from('poems')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Fetch approved pen down posts
      const { data: pendownData } = await supabase
        .from('pendown_posts')
        .select('*')
        .eq('status', 'approved')
        .order('published_at', { ascending: false });

      // Combine both data sources
      const allPoems = [
        ...(poemsData || []),
        ...(pendownData || []).map(post => ({
          ...post,
          // Add likes_count for compatibility
          likes_count: 0
        }))
      ].sort((a, b) => new Date(b.created_at || b.published_at).getTime() - new Date(a.created_at || a.published_at).getTime());

      if (allPoems.length > 0) {
        setPoems(allPoems);
        setFeaturedPoems(allPoems.slice(0, 2)); // First 2 as featured
        setRecentPoems(allPoems.slice(2)); // Rest as recent
      }
    } catch (error) {
      console.error('Error fetching poems:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikedPoems = () => {
    const liked = localStorage.getItem('likedPoems');
    if (liked) {
      setLikedPoems(new Set(JSON.parse(liked)));
    }
  };

  const saveLikedPoems = (liked: Set<string>) => {
    localStorage.setItem('likedPoems', JSON.stringify(Array.from(liked)));
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'anonymous';
    }
  };

  const handleLike = async (poemId: string) => {
    try {
      const ip = await getClientIP();
      
      const { data, error } = await supabase.rpc('toggle_poem_like', {
        poem_id_param: poemId,
        ip_address_param: ip
      });

      if (error) throw error;

      if (data && typeof data === 'object') {
        const responseData = data as { user_liked: boolean; likes_count: number };
        const newLikedPoems = new Set(likedPoems);
        if (responseData.user_liked) {
          newLikedPoems.add(poemId);
          toast({
            title: "Liked!",
            description: "You liked this poem.",
          });
        } else {
          newLikedPoems.delete(poemId);
          toast({
            title: "Unliked",
            description: "You removed your like from this poem.",
          });
        }
        
        setLikedPoems(newLikedPoems);
        saveLikedPoems(newLikedPoems);

        // Update poem like count in state
        const updatePoemLikes = (poems: any[]) => 
          poems.map(poem => 
            poem.id === poemId 
              ? { ...poem, likes_count: responseData.likes_count }
              : poem
          );

        setPoems(updatePoemLikes);
        setFeaturedPoems(updatePoemLikes);
        setRecentPoems(updatePoemLikes);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminIndicator />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Pen Down
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            A collection of beautiful poetry and creative writing from our talented members. Every poem tells a story, every verse carries an emotion.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowSubmissionModal(true)}
          >
            Submit Your Poem
            <PenTool className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Featured Poems */}
        {featuredPoems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary" />
              Featured Poems
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPoems.map((poem) => (
                <Card key={poem.id} className="hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      <Badge variant="outline">{poem.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{poem.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{poem.author}</span>
                      </div>
                       <div className="flex items-center space-x-1">
                         <Calendar className="h-4 w-4" />
                         <span>{new Date(poem.created_at).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <CardDescription className="text-base italic">
                       "{poem.content.substring(0, 100)}..."
                     </CardDescription>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-medium leading-relaxed">
                        {poem.content}
                      </pre>
                    </div>
                    
                     <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(poem.id)}
                        className={`flex items-center space-x-1 ${
                          likedPoems.has(poem.id) ? 'text-red-500' : 'text-muted-foreground'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedPoems.has(poem.id) ? 'fill-current' : ''}`} />
                        <span>{poem.likes_count || 0} likes</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recent Poems */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <PenTool className="h-6 w-6 mr-2 text-primary" />
            Recent Contributions
          </h2>
          <div className="space-y-6">
            {recentPoems.map((poem) => (
              <Card key={poem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                    <div className="flex-1 space-y-3">
                         <div className="flex items-center space-x-3">
                           <h3 className="text-xl font-semibold text-foreground">{poem.title}</h3>
                           <Badge variant="outline" className="text-xs">Recent</Badge>
                         </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{poem.author}</span>
                        </div>
                         <div className="flex items-center space-x-1">
                           <Calendar className="h-4 w-4" />
                           <span>{new Date(poem.created_at).toLocaleDateString()}</span>
                         </div>
                      </div>
                      
                      <p className="text-muted-foreground italic">"{poem.content.substring(0, 100)}..."</p>
                      
                       <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm">
                          Read Full Poem
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(poem.id)}
                          className={`flex items-center space-x-1 ${
                            likedPoems.has(poem.id) ? 'text-red-500' : 'text-muted-foreground'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${likedPoems.has(poem.id) ? 'fill-current' : ''}`} />
                          <span>{poem.likes_count || 0} likes</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center bg-muted/50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">Share Your Voice</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have a poem or creative writing piece you'd like to share? Join our community of writers and let your voice be heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowSubmissionModal(true)}
            >
              Submit Your Work
            </Button>
          </div>
        </section>
      </div>
      
      <PenDownSubmissionModal 
        open={showSubmissionModal}
        onOpenChange={setShowSubmissionModal}
      />
      
      <Footer />
    </div>
  );
};

export default Poems;