import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Book, User, Mail, Phone, Calendar } from 'lucide-react';

interface BookRequest {
  id: string;
  user_name: string;
  user_email: string;
  mobile_no: string | null;
  academic_year: string | null;
  roll_no: string | null;
  preferred_due_date: string | null;
  notes: string | null;
  status: string;
  request_date: string;
  book_id: string;
  books?: {
    title: string;
    author: string;
  };
}

interface BookRequestsManagementProps {
  onStatsUpdate: () => void;
}

const BookRequestsManagement: React.FC<BookRequestsManagementProps> = ({ onStatsUpdate }) => {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('book_requests')
        .select(`
          *,
          books (
            title,
            author
          )
        `)
        .order('request_date', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching book requests:', error);
      toast({
        title: "Error",
        description: "Failed to load book requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('book_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      // Send email notification if request is approved
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          try {
            await supabase.functions.invoke('send-book-approval-email', {
              body: {
                userEmail: request.user_email,
                userName: request.user_name,
                bookTitle: request.books?.title,
                bookAuthor: request.books?.author,
                dueDate: request.preferred_due_date
              }
            });
            
            toast({
              title: "Success",
              description: `Request ${status} successfully and email notification sent`,
            });
          } catch (emailError) {
            console.error('Error sending email:', emailError);
            toast({
              title: "Partial Success",
              description: `Request ${status} successfully, but email notification failed`,
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Success",
          description: `Request ${status} successfully`,
        });
      }
      
      fetchRequests();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'returned': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading book requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Book Requests Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{request.books?.title || 'Unknown Book'}</CardTitle>
                  <CardDescription className="mt-1">
                    by {request.books?.author || 'Unknown Author'}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(request.status)} variant="outline">
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{request.user_name}</div>
                    <div className="text-muted-foreground">Roll: {request.roll_no || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{request.user_email}</div>
                    <div className="text-muted-foreground">{request.academic_year || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="font-medium">{request.mobile_no || 'N/A'}</div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Due:</div>
                    <div className="font-medium">{request.preferred_due_date ? new Date(request.preferred_due_date).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </div>

              {request.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Notes:</div>
                  <div className="text-sm text-muted-foreground">{request.notes}</div>
                </div>
              )}

              <div className="flex gap-2">
                {request.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateStatus(request.id, 'approved')}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus(request.id, 'rejected')}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {request.status === 'approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(request.id, 'returned')}
                  >
                    <Book className="h-3 w-3 mr-1" />
                    Mark Returned
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Requested: {new Date(request.request_date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No book requests found</h3>
          <p className="text-muted-foreground">Student requests will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default BookRequestsManagement;