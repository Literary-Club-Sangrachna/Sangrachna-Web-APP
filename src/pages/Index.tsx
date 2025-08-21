import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Mic, PenTool, Calendar, ArrowRight, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import PhotoCarousel from "@/components/PhotoCarousel";

// ✅ Moved carousel images array here
const carouselImages = [
  { src: "/IMG_0340.JPG", alt: "Event 1" },
  { src: "/IMG_5618.JPG", alt: "Event 2" },
  { src: "/DSC_0916.JPG", alt: "Event 3" },
  { src: "/DSC_0759.JPG", alt: "Event 4" },
  { src: "/IMG_9385.jpg", alt: "Event 5" },
  { src: "/sang.JPG", alt: "Event 6" },
  { src: "/img2.jpg", alt: "Event 7" },
  { src: "/IMG_9795.jpg", alt: "Event 8" },
  { src: "/IMG_4801.JPG", alt: "Event 9" },
  { src: "/IMG_3758.JPG", alt: "Event 10" },
  { src: "/IMG_2112.jpg", alt: "Event 11" },
  { src: "/IMG_1758.jpg", alt: "Event 12" },
  { src: "/DSC03133.JPG", alt: "Event 13" },
  { src: "/DSC_0991.JPG", alt: "Event 14" },
  { src: "/DSC_0582.JPG", alt: "Event 15" },
  { src: "/DSC_0417.JPG", alt: "Event 16" },
  { src: "/DSC_0230.JPG", alt: "Event 17" },
  { src: "/DSC_0229.JPG", alt: "Event 18" },

];



const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [president, setPresident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch recent events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);

      // Fetch president from team members
      const { data: presidentData } = await supabase
        .from('team_members')
        .select('*')
        .eq('position', 'President')
        .single();

      setEvents(eventsData || []);
      setPresident(presidentData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventRegistration = (registrationLink: string) => {
    if (registrationLink) {
      window.open(registrationLink, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminIndicator />
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                SANGRACHNA
              </h1>
              <p className="text-xl md:text-2xl mb-4 opacity-90">
                Editorial Club of NIET
              </p>
              <p className="text-lg mb-6 opacity-80">
                Nurturing creativity, inspiring voices, and fostering literary excellence among students through workshops, events, and collaborative learning.
              </p>
              <p className="text-base mb-8 opacity-80">
                Sangrachna is a vibrant editorial club at NIET Greater Noida, dedicated to cultivating creativity, critical thinking, and editorial excellence among students. We provide a platform for aspiring writers, poets, and content creators to express their thoughts and ideas.
              </p>
               <Button 
                size="lg" 
                variant="secondary" 
                className="text-primary"
                onClick={() => navigate('/about')}
              >
                Explore Our Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/hero1.svg" 
                alt="Sangrachna Word Cloud" 
                className="max-w-full h-auto rounded-lg "
              />
            </div>
          </div>
        </div>
      </section>


{/*  Photo Carousel Section */}
      <section className="py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Club Activities at a Glance
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our recent events and ongoing initiatives
          </p>
        </div>
        <PhotoCarousel images={carouselImages} />
      </section>


      {/* Highlights Section */}
<section className="py-16 bg-muted/50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Highlights
      </h2>
      <p className="text-lg text-muted-foreground">
        Discover our recent events and ongoing initiatives
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {loading ? (
        <div className="col-span-3 text-center">Loading events...</div>
      ) : events.length > 0 ? (
        events.map((event) => {
          const eventDate = event.date ? new Date(event.date) : null;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize time for comparison
          const isUpcoming = eventDate && eventDate >= today;

          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {event.date
  ? new Date(event.date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    })
  : 'TBA'}

                    </span>
                  </div>
                  <Badge
                    className={`${
                      isUpcoming
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}
                  >
                    {isUpcoming ? 'UPCOMING' : 'OVER'}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {event.description}
                </CardDescription>
                {event.location && (
                  <p className="text-sm text-muted-foreground mb-3">
                    📍 {event.location}
                  </p>
                )}

                {event.registration_link && (
                  <Button
                    size="sm"
                    onClick={() => handleEventRegistration(event.registration_link)}
                    className={`w-full ${
                      isUpcoming
                        ? ''
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isUpcoming ? 'Register Now' : 'Memories'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="col-span-3 text-center text-muted-foreground">
          No events available at the moment.
        </div>
      )}
    </div>
    
    <div className="text-center mt-8">
      <Button 
        variant="outline" 
        size="lg"
        onClick={() => navigate('/events')}
      >
        View All Events
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</section>


      {/* Library Preview */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
  Kitabghar
</h1>
</div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sangrachna Kitabghar is a unique library initiative by the Sangrachna Club. Sangrachna Kitabghar is a platform that aims to promote reading and knowledge-sharing among the community. It serves as a bridge between readers and writers, fostering a culture of continuous learning and intellectual growth. The library of the club also functions as an archive for the club's publications, chronicling the literary journey of its members and preserving their creative contributions for future generations.
            </p>
          </div>
          
           <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/library')}
            >
              Explore Kitabghar
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Poems Preview */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              From the Pen
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover beautiful poetry and creative writing from our talented members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <blockquote className="text-lg italic text-muted-foreground mb-4">
                "हम लिखते हैं तो दुनिया को सुधारने के लिए..."
              </blockquote>
              <cite className="text-sm text-primary font-medium">— A member's reflection</cite>
            </Card>
            
            <Card className="p-6">
              <blockquote className="text-lg italic text-muted-foreground mb-4">
                "शब्दों की शक्ति से हम सपने बुनते हैं..."
              </blockquote>
              <cite className="text-sm text-primary font-medium">— From our poetry collection</cite>
            </Card>
          </div>
          
           {/* <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/poems')}
            >
              Read More Poems
              <PenTool className="ml-2 h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </section>

      {/* Core Team Preview */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our President
            </h2>
            <p className="text-lg text-muted-foreground">
              Leading Sangrachna with vision and dedication
            </p>
          </div>

          {loading ? (
            <div className="text-center">Loading team information...</div>
          ) : president ? (
            <div className="max-w-md mx-auto mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-32 h-32 rounded-full mx-auto overflow-hidden bg-primary/10 flex items-center justify-center">
  {president.image_url ? (
    <img
      src={president.image_url}
      alt={president.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <img
      src="/TEAM/ADITYA.jpg"
      alt="Aditya"
      className="w-full h-full object-cover"
    />
  )}
</div>


                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{president.name}</h3>
                    <Badge className="bg-primary text-primary-foreground mt-2">
                      {president.position}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{president.department}</p>
                    <p>{president.year}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{president.bio}</p>
                  
                  <div className="flex justify-center">
                    <a href={`mailto:${president.email}`} className="text-primary hover:text-primary/80">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Team information coming soon...
            </div>
          )}

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/team')}
            >
              Meet the Full Team
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
