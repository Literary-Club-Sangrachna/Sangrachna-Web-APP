import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("order_priority", { ascending: true });

      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
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

  const ProfileImage = ({ member, size }: { member: any; size: string }) => {
  // Prefer local image if available, else Supabase, else fallback
  const imageSrc = localImages[member.name] || member.image_url;


  return (
    <div
      className={`${size} rounded-full mx-auto overflow-hidden bg-primary/10 flex items-center justify-center`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-bold text-primary" style={{ fontSize: "1.5rem" }}>
          {member.name.charAt(0)}
        </span>
      )}
    </div>
  );
};



  // Component for reusable member card
  const MemberCard = ({ member, imageSize }: { member: any; imageSize: string }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center space-y-4">
        <ProfileImage member={member} size={imageSize} />
        <div>
          <h4 className="text-lg font-semibold text-foreground">{member.name}</h4>
          <Badge className="bg-primary text-primary-foreground mt-2">{member.position}</Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{member.department}</p>
          <p>{member.year}</p>
        </div>
        {member.bio && <p className="text-sm text-muted-foreground">{member.bio}</p>}
        <div className="flex justify-center space-x-3">
          {member.email && (
            <a href={`mailto:${member.email}`} className="text-primary hover:text-primary/80">
              <Mail className="h-5 w-5" />
            </a>
          )}
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminIndicator />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Core Team</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the dedicated individuals leading Sangrachna Club for the current session
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading team members...</div>
        ) : (
          <div className="space-y-16">
            {/* President Section */}
            {president && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-8">President</h3>
                <div className="max-w-md mx-auto">
                  <MemberCard member={president} imageSize="w-32 h-32" />
                </div>
              </div>
            )}

            {/* Vice Presidents Section */}
            {vicePresidents.length > 0 && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-8">Vice Presidents</h3>
                <div
                  className={`grid gap-8 max-w-4xl mx-auto ${
                    vicePresidents.length === 1
                      ? "grid-cols-1 justify-center"
                      : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  {vicePresidents.map((member) => (
                    <MemberCard key={member.id} member={member} imageSize="w-24 h-24" />
                  ))}
                </div>
              </div>
            )}

            {/* Coordinators Section */}
            {coordinators.length > 0 && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-8">Core Coordinators</h3>
                <div
                  className={`grid gap-8 ${
                    coordinators.length === 1
                      ? "grid-cols-1 justify-center"
                      : coordinators.length === 2
                      ? "grid-cols-1 sm:grid-cols-2 justify-center"
                      : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {coordinators.map((member) => (
                    <MemberCard key={member.id} member={member} imageSize="w-20 h-20" />
                  ))}
                </div>
              </div>
            )}

            {/* Other Team Members Section */}
            {otherMembers.length > 0 && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-8">Team Members</h3>
                <div
                  className={`grid gap-6 ${
                    otherMembers.length === 1
                      ? "grid-cols-1 justify-center"
                      : otherMembers.length === 2
                      ? "grid-cols-1 sm:grid-cols-2 justify-center"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {otherMembers.map((member) => (
                    <MemberCard key={member.id} member={member} imageSize="w-16 h-16" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Team;
