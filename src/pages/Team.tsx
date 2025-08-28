import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import { motion, Variants } from "framer-motion";

// Define proper types for team member
interface TeamMember {
  id: string;
  name: string;
  position: string;
  department?: string;
  year?: string;
  bio?: string;
  email?: string;
  linkedin_url?: string;
  image_url?: string;
  order_priority?: number;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("team_members")
        .select("*")
        .order("order_priority", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const localImages: Record<string, string> = {
    "शुभम मिश्रा": "/TEAM/SHUBHAM.jpg",
    "ओम सिंह": "/TEAM/OM.jpg",
    "माधवी द्विवेदी": "/TEAM/Madhavi.jpg",
    "तुषार तेवतिया": "/TEAM/TUSHAR.jpg",
    "प्रत्यक्ष शुक्ला": "/TEAM/PRATYKSH.jpg",
    "आरुषि बडगल": "/TEAM/AARUSHI.jpg",
    "उर्वशी दीक्षित": "/TEAM/URVASHI.jpg",
    "पायल सेंगर": "/TEAM/PAYAL.jpg",
    "मानस शर्मा": "/TEAM/MANAS.jpg",
    "दक्षित झा": "/TEAM/DAKSHIT.jpg",
    "शिवानी राय": "/TEAM/SHIVANI.jpg",
    "आदित्य जुयाल": "/TEAM/ADITYA.jpg",
    "अविनाश वर्मा": "/TEAM/AVINASH.jpg",
    "भूमि वर्मा": "/TEAM/BHOOMI.jpg",
  };

  // Group team members by hierarchy
  const president = teamMembers.find((member) => member.position === "President");
  const vicePresidents = teamMembers.filter((member) => member.position === "Vice President");
  const coordinators = teamMembers.filter((member) =>
    ["Head Coordinator", "Content Manager", "Anchoring Manager"].includes(member.position)
  );
  const otherMembers = teamMembers.filter(
    (member) =>
      !["President", "Vice President", "Head Coordinator", "Content Manager", "Anchoring Manager"].includes(
        member.position
      )
  );

  const ProfileImage = ({ member, size }: { member: TeamMember; size: string }) => {
    const imageSrc = localImages[member.name] || member.image_url;
    const [imageError, setImageError] = useState(false);

    return (
      <div
        className={`${size} rounded-full mx-auto overflow-hidden bg-primary/10 flex items-center justify-center`}
      >
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-bold text-primary" style={{ fontSize: "1.5rem" }}>
            {member.name.charAt(0)}
          </span>
        )}
      </div>
    );
  };

  // Animation variants for staggered cards - fixed to repeat on scroll
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  // Component for reusable member card with animation
  const MemberCard = ({ member, imageSize, index }: { member: TeamMember; imageSize: string; index: number }) => (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: false, // Changed from true to false to allow repeated animations
        amount: 0.2,
        margin: "-100px" // Adds margin to trigger animation slightly before element is visible
      }}
      variants={cardVariants}
      className="w-full"
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center space-y-4">
          <ProfileImage member={member} size={imageSize} />
          <div>
            <h4 className="text-lg font-semibold text-foreground">{member.name}</h4>
            <Badge className="bg-primary text-primary-foreground mt-2">{member.position}</Badge>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            {member.department && <p>{member.department}</p>}
            {member.year && <p>{member.year}</p>}
          </div>
          {member.bio && <p className="text-sm text-muted-foreground">{member.bio}</p>}
          <div className="flex justify-center space-x-3">
            {member.email && (
              <a 
                href={`mailto:${member.email}`} 
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label={`LinkedIn profile of ${member.name}`}
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Section animation variants
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
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
            variants={sectionVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Core Team</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated individuals leading Sangrachna Club for the current session
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchTeamMembers}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {/* President Section */}
              {president && (
                <motion.div 
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={sectionVariants}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-8">President</h3>
                  <div className="max-w-md mx-auto">
                    <MemberCard member={president} imageSize="w-32 h-32" index={0} />
                  </div>
                </motion.div>
              )}

              {/* Vice Presidents Section */}
              {vicePresidents.length > 0 && (
                <motion.div 
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={sectionVariants}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-8">Vice Presidents</h3>
                  <div
                    className={`grid gap-8 max-w-4xl mx-auto ${
                      vicePresidents.length === 1
                        ? "grid-cols-1 justify-items-center"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {vicePresidents.map((member, i) => (
                      <MemberCard key={member.id} member={member} imageSize="w-24 h-24" index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Coordinators Section */}
              {coordinators.length > 0 && (
                <motion.div 
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={sectionVariants}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-8">Core Coordinators</h3>
                  <div
                    className={`grid gap-8 max-w-6xl mx-auto ${
                      coordinators.length === 1
                        ? "grid-cols-1 justify-items-center"
                        : coordinators.length === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {coordinators.map((member, i) => (
                      <MemberCard key={member.id} member={member} imageSize="w-20 h-20" index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Other Team Members Section */}
              {otherMembers.length > 0 && (
                <motion.div 
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={sectionVariants}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-8">Team Members</h3>
                  <div
                    className={`grid gap-6 max-w-6xl mx-auto ${
                      otherMembers.length === 1
                        ? "grid-cols-1 justify-items-center"
                        : otherMembers.length === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }`}
                  >
                    {otherMembers.map((member, i) => (
                      <MemberCard key={member.id} member={member} imageSize="w-16 h-16" index={i} />
                    ))}
                  </div>
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

export default Team;