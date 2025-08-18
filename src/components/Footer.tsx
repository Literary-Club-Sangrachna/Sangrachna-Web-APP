import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Settings } from "lucide-react";
import { useState } from "react";
import AdminLogin from "./AdminLogin";

const Footer = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex flex-col items-center space-y-1">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">NIET Greater Noida, Uttar Pradesh</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Mail className="h-5 w-5" />
                <span className="text-sm">sangrachna@niet.co.in</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Phone className="h-5 w-5" />
                <span className="text-sm">+91 XXX XXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/events" className="block text-sm hover:text-accent transition-colors">
                Events
              </a>
              <a href="/library" className="block text-sm hover:text-accent transition-colors">
                Kitabghar
              </a>
              <a href="/poems" className="block text-sm hover:text-accent transition-colors">
                Pen Down
              </a>
              <a href="/about" className="block text-sm hover:text-accent transition-colors">
                About Us
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-center">
  © {new Date().getFullYear()} Sangrachna Editorial Club, NIET Greater Noida. All rights reserved.
</p>

            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-xs opacity-30 hover:opacity-60 transition-opacity p-1"
              title="Admin Login"
            >
              <Settings className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <AdminLogin 
        open={showAdminLogin} 
        onOpenChange={setShowAdminLogin} 
      />
    </footer>
  );
};

export default Footer;
