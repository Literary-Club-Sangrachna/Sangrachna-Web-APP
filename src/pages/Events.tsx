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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "over":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
              {events.map((event, index) => {
                const upcoming = isTodayOrFuture(event.date);
                const statusLabel = !upcoming && event.status.toLowerCase() === "UPCOMING"
                  ? "OVER"
                  : event.status;

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
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
                          <div>
                            <CardTitle className="text-2xl mb-4">{event.title}</CardTitle>
                          </div>

                          {/* Top-right badge for Approved/Over */}
                          <div className="absolute top-4 right-4">
                            {upcoming ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                UPCOMING
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                OVER
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <CardDescription className="text-base">
                          {event.description}
                        </CardDescription>

                        {/* Show register button for upcoming */}
                        {upcoming && event.registration_link && (
                          <Button
                            size="sm"
                            onClick={() =>
                              window.open(event.registration_link!, "_blank", "noopener,noreferrer")
                            }
                            className="w-full transition-all duration-300 hover:scale-105"
                          >
                            Register Now
                          </Button>
                        )}

                        {/* Show memories button for past events */}
                        {!upcoming && event.registration_link && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                            onClick={() =>
                              window.open(event.registration_link!, "_blank", "noopener,noreferrer")
                            }
                          >
                            Memories
                          </Button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-border">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              {event.date
                                ? new Date(event.date).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short"
                                  })
                                : 'TBA'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{event.location || "Location TBD"}</span>
                          </div>
                        </div>
                      </CardContent>
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
        </div>

        <Footer />
      </div>
    </AnimatedSection>
  );
};

export default Events;