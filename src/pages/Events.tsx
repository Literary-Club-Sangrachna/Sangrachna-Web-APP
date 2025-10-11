import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import { motion, Variants } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  image_url?: string;
  registration_link?: string;
  created_at: string;
}

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const { data } = supabase.storage.from("public").getPublicUrl(url);
    return data?.publicUrl || url;
  };

  const isTodayOrFuture = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    const eventDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Animation variants
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const eventCardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const loadingVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const emptyStateVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Pagination variables
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Slice events for current page
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  return (
    <AnimatedSection>
      <div className="min-h-screen bg-background">
        <AdminIndicator />
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={headerVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Events
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join us in our journey of literary excellence through workshops,
              competitions, and cultural events designed to nurture creativity and
              intellectual growth.
            </p>
          </motion.div>

          {loading ? (
            <motion.div 
              className="flex justify-center p-8"
              initial="hidden"
              animate="visible"
              variants={loadingVariants}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="ml-4 text-muted-foreground">Loading events...</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {paginatedEvents.map((event, index) => {
                const upcoming = isTodayOrFuture(event.date);
                const eventImageUrl = getEventImageUrl(event.image_url);

                return (
                  <motion.div
                    key={event.id}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ 
                      once: false,
                      amount: 0.2,
                      margin: "-100px"
                    }}
                    variants={eventCardVariants}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="grid gap-0 md:gap-4 grid-cols-1 md:grid-cols-3 items-stretch md:items-center">
                        {/* Text Content */}
                        <div className="md:col-span-2 flex flex-col h-full p-5 md:p-8">
                          <div className="flex-1 flex flex-col">
                            <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                            <CardDescription className="text-base mb-4">{event.description}</CardDescription>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mb-4 mt-2">
                            {upcoming && event.registration_link && (
                              <Button
                                size="sm"
                                onClick={() => window.open(event.registration_link!, "_blank", "noopener,noreferrer")}
                                className="w-auto"
                              >
                                Register Now
                              </Button>
                            )}
                            {!upcoming && event.registration_link && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => window.open(event.registration_link!, "_blank", "noopener,noreferrer")}
                                className="w-auto"
                              >
                                Memories
                              </Button>
                            )}
                            <Badge className={`ml-auto ${upcoming ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}>
                              {upcoming ? "UPCOMING" : "OVER"}
                            </Badge>
                          </div>
                          <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center space-x-2 mt-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{event.date ? new Date(event.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "TBA"}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{event.location || "Location TBD"}</span>
                            </div>
                          </div>
                        </div>
                        {/* Image */}
                        {eventImageUrl && (
                          <div className="md:col-span-1 flex items-center justify-center h-52 md:h-full p-4">
                            <div className="w-full max-w-xs aspect-video rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                              <img 
                                src={eventImageUrl} 
                                alt={event.title}
                                className="object-contain w-full h-full"
                                onError={e => { e.currentTarget.src = "/placeholder.svg"; }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {events.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  variants={emptyStateVariants}
                >
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No events found
                  </h3>
                  <p className="text-muted-foreground">
                    Events will appear here when they are added.
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Pagination controls */}
          {!loading && events.length > eventsPerPage && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </AnimatedSection>
  );
};

export default Events;
