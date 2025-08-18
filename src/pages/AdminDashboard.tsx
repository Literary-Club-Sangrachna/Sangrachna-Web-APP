import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Book, FileText, Calendar, Heart, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import BooksManagement from '@/components/admin/BooksManagement';
import PendownManagement from '@/components/admin/PendownManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import VoiceManagement from '@/components/admin/VoiceManagement';
import BookRequestsManagement from '@/components/admin/BookRequestsManagement';

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdmin();
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingPosts: 0,
    pendingPoems: 0,
    totalEvents: 0,
    bookRequests: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const [booksRes, postsRes, poemsRes, eventsRes, requestsRes] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact' }),
        supabase.from('pendown_posts').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('poems').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('book_requests').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      setStats({
        totalBooks: booksRes.count || 0,
        pendingPosts: postsRes.count || 0,
        pendingPoems: poemsRes.count || 0,
        totalEvents: eventsRes.count || 0,
        bookRequests: requestsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Sangrachna Content Management</p>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBooks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPosts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Poems</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPoems}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Book Requests</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bookRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="books" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="pendown">Pendown</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="voice">Share Voice</TabsTrigger>
            <TabsTrigger value="requests">Book Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books">
            <BooksManagement onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="pendown">
            <PendownManagement onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsManagement onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="voice">
            <VoiceManagement onStatsUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="requests">
            <BookRequestsManagement onStatsUpdate={fetchStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;