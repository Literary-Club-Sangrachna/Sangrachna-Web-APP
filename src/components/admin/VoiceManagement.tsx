import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Check, X, Heart } from 'lucide-react';

interface Poem {
  id: string;
  title: string;
  content: string;
  author: string;
  likes_count: number;
  status: string;
  submitted_by_email: string | null;
  created_at: string;
  published_at: string | null;
}

interface VoiceManagementProps {
  onStatsUpdate: () => void;
}

const VoiceManagement: React.FC<VoiceManagementProps> = ({ onStatsUpdate }) => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPoems();
  }, []);

  const fetchPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPoems(data || []);
    } catch (error) {
      console.error('Error fetching poems:', error);
      toast({
        title: "Error",
        description: "Failed to load poems",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (poemId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'approved' && !poems.find(p => p.id === poemId)?.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('poems')
        .update(updateData)
        .eq('id', poemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Poem ${status} successfully`,
      });
      
      fetchPoems();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating poem status:', error);
      toast({
        title: "Error",
        description: "Failed to update poem status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (poemId: string) => {
    if (!confirm('Are you sure you want to delete this poem?')) return;

    try {
      const { error } = await supabase
        .from('poems')
        .delete()
        .eq('id', poemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Poem deleted successfully",
      });
      
      fetchPoems();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting poem:', error);
      toast({
        title: "Error",
        description: "Failed to delete poem",
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
    return <div className="flex justify-center p-8">Loading poems...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Share Your Voice Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {poems.map((poem) => (
          <Card key={poem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{poem.title}</CardTitle>
                  <CardDescription className="mt-1">
                    By {poem.author}
                    {poem.submitted_by_email && (
                      <span className="text-xs ml-2">({poem.submitted_by_email})</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(poem.status)} variant="outline">
                    {poem.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 mr-1" />
                    {poem.likes_count}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                {poem.content}
              </div>

              <div className="flex gap-2">
                {poem.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateStatus(poem.id, 'approved')}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus(poem.id, 'rejected')}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(poem.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(poem.created_at).toLocaleDateString()}
                {poem.published_at && (
                  <span className="ml-4">
                    Published: {new Date(poem.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {poems.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No poems found</h3>
          <p className="text-muted-foreground">User submissions will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default VoiceManagement;