import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Target, Award, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const About = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const milestones = [
    {
      year: "2020",
      event: "Foundation of Sangrachna Club",
      details: "This was the year Sangrachna Club was born, laying the foundation for creative expression at NIET.",
      memoriesLink: "https://www.instagram.com/p/example1/",
      photo: "/img3.jpg",
    },
    {
      year: "2021",
      event: "First Poetry Collection Published",
      details: "Our first poetry collection brought together voices from across the campus, celebrating creativity.",
      memoriesLink: "https://www.instagram.com/p/example2/",
      photo: "/img2.jpg",
    },
    {
      year: "2022",
      event: "Annual Literary Festival Launched",
      details: "The festival became a platform for budding writers, poets, and speakers to showcase their skills.",
      memoriesLink: "https://www.instagram.com/p/example3/",
      photo: "/images/journey3.jpg",
    },
    {
      year: "2023",
      event: "Digital Library Initiative Started",
      details: "We built a digital library to make literary works accessible to students and alumni alike.",
      memoriesLink: "https://www.instagram.com/p/example4/",
      photo: "/images/journey4.jpg",
    },
    {
      year: "2024",
      event: "100+ Active Members Milestone",
      details: "Crossing 100 active members marked a new era of growth and inclusivity for Sangrachna.",
      memoriesLink: "https://www.instagram.com/p/example5/",
      photo: "/images/journey5.jpg",
    },
  ];

  const values = [
    {
      icon: BookOpen,
      title: "Literary Excellence",
      description:
        "Promoting high standards in creative writing, editing, and literary appreciation among students.",
    },
    {
      icon: Users,
      title: "Community Building",
      description:
        "Creating a supportive environment where writers and readers can connect, collaborate, and grow together.",
    },
    {
      icon: Target,
      title: "Skill Development",
      description:
        "Providing workshops, training sessions, and mentorship to enhance writing and communication skills.",
    },
    {
      icon: Award,
      title: "Recognition",
      description:
        "Celebrating and showcasing the creative talents of students through publications and competitions.",
    },
  ];

  const toggleJourney = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Sangrachna
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The Editorial Club of NIET Greater Noida
          </p>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground text-center md:text-left">
  Our Story
</h2>

              <div className="space-y-4 text-muted-foreground text-center md:text-left">
                <p> 
                  Sangrachna, meaning "creation" or "composition" in Sanskrit,
                  embodies our commitment to nurturing the creative spirit within
                  every student. Founded in 2020 at NIET Greater Noida, our
                  editorial club has grown into a vibrant community of writers,
                  poets, and creative thinkers.
                </p>
                <p>
                  We believe that every individual has a unique voice and story
                  to tell. Through our various initiatives, workshops, and
                  events, we provide a platform for students to explore their
                  creativity, improve their writing skills, and express their
                  thoughts and ideas with confidence.
                </p>
                <p>
                  Our club serves as a bridge between traditional literary
                  values and contemporary expression, encouraging members to
                  experiment with different forms of writing while maintaining
                  the essence of good storytelling and effective communication.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <a
  href="https://maps.app.goo.gl/YYQWcGJsxL3ySiiT9"
  target="_blank"
  rel="noopener noreferrer"
  className="block"
>
  <Card className="p-6 bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer">
    <div className="flex items-center space-x-3 mb-4">
      <MapPin className="h-6 w-6 text-primary" />
      <h3 className="text-xl font-semibold">Our Location</h3>
    </div>

    {/* Google Maps Preview */}
    <div className="rounded-lg overflow-hidden border border-border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.5938966129876!2d77.4902418750926!3d28.581416075692423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceffd0b13269b%3A0x76ec4c22958491b1!2sNIET%20Greater%20Noida!5e0!3m2!1sen!2sin!4v1691920196715!5m2!1sen!2sin"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

    <p className="text-muted-foreground mt-3">
      NIET Greater Noida, Uttar Pradesh
    </p>
  </Card>
</a>


              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Established</h3>
                </div>
                <p className="text-muted-foreground">
                  2020 - 4 years of literary excellence
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <value.icon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To foster a culture of creative expression and literary
                excellence among students by providing platforms for writing,
                publishing, and intellectual discourse. We aim to develop
                confident communicators who can articulate their thoughts
                effectively and contribute meaningfully to society.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground">
                To be recognized as the premier literary and editorial club that
                transforms students into skilled writers, critical thinkers, and
                effective communicators who will lead positive change in their
                respective fields and communities.
              </p>
            </Card>
          </div>
        </section>

        {/* Milestones / Our Journey */}
<section className="mb-16"> 
  <h2 className="text-3xl font-bold text-foreground text-center mb-12">
    Our Journey
  </h2>
  <div className="space-y-4">
    {milestones.map((milestone, index) => (
      <Card
        key={index}
        className="overflow-hidden border border-border"
      >
        <button
          onClick={() => toggleJourney(index)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <div className="flex items-center space-x-4">
            <Badge className="bg-primary text-primary-foreground px-3 py-1">
              {milestone.year}
            </Badge>
            <p className="text-foreground font-medium">
              {milestone.event}
            </p>
          </div>
          {openIndex === index ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {openIndex === index && (
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left side: details + button */}
              <div className="space-y-4">
                <p className="text-muted-foreground line-clamp-4">
                  {milestone.details}
                </p>
                <a
                  href={milestone.memoriesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
                >
                  View Memories
                </a>
              </div>

              {/* Right side: photo */}
              <div className="flex justify-center">
                <img
                  src={milestone.photo}
                  alt={milestone.event}
                  className="rounded-xl shadow-md object-cover max-h-64 w-auto hover:shadow-xl transition"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    ))}
  </div>
</section>


        {/* What We Do */}
        <section className="mb-16 bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Workshops & Training</h3>
              <p className="text-sm text-muted-foreground">
                Regular workshops on writing, editing, anchoring, and public
                speaking
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Publications</h3>
              <p className="text-sm text-muted-foreground">
                Publishing student works through our digital library and print
                editions
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Competitions</h3>
              <p className="text-sm text-muted-foreground">
                Organizing literary competitions and cultural events throughout
                the year
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
