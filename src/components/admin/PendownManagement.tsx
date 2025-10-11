import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Check, X, FileText } from 'lucide-react';

interface PendownPost {
  id: string;
  title: string;
  content: string;
  author: string;
  excerpt: string | null;
  image_url: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  tags: string[] | null;
}

interface PendownManagementProps {
  onStatsUpdate: () => void;
}

const PendownManagement: React.FC<PendownManagementProps> = ({ onStatsUpdate }) => {
  const [posts, setPosts] = useState<PendownPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('pendown_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (postId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'approved') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('pendown_posts')
        .update(updateData)
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${status} successfully`,
      });
      
      fetchPosts();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('pendown_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      fetchPosts();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pendown Posts Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="mt-1">By {post.author}</CardDescription>
                </div>
                <Badge className={getStatusColor(post.status)} variant="outline">
                  {post.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {post.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateStatus(post.id, 'approved')}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus(post.id, 'rejected')}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(post.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
          <p className="text-muted-foreground">User submissions will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PendownManagement;