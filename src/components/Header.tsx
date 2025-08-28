import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMagazineOpen, setIsMagazineOpen] = useState(false); // dropdown state

  // Navigation items
  const navigation: (
    | { name: string; href: string }
    | { name: string; dropdown: { name: string; href: string }[] }
  )[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Kitabghar", href: "/library" },
    { name: "Core Team", href: "/team" },
    {
      name: "Magazine",
      dropdown: [
        {
          name: "Session 2025",
          href: "https://noidainstituteofengtech-my.sharepoint.com/personal/sangrachna_niet_co_in/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fsangrachna%5Fniet%5Fco%5Fin%2FDocuments%2FSangam%20Magazine%2FSangam%20Annual%20MAgazine%2Epdf&parent=%2Fpersonal%2Fsangrachna%5Fniet%5Fco%5Fin%2FDocuments%2FSangam%20Magazine&ga=1",
        },
        {
          name: "Session 2024",
          href: "https://www.niet.co.in/uploads/images/676fadb0734241735372208.pdf",
        },
        {
          name: "Session 2023",
          href: "https://www.niet.co.in/uploads/images/676fad42bfa351735372098.pdf",
        },
      ],
    },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-3">
              <img
                src="/MainLogo.svg"
                alt="Sangrachna Logo"
                className="h-10 w-auto"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 relative">
            {navigation.map((item) =>
              "dropdown" in item ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 hidden w-40 rounded-md shadow-lg bg-background border border-border group-hover:block">
                    <div className="py-1">
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {navigation.map((item) =>
                "dropdown" in item ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsMagazineOpen(!isMagazineOpen)}
                      className="flex w-full items-center justify-between px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
                    >
                      {item.name}
                      <ChevronDown
                        className={`ml-2 h-4 w-4 transform transition-transform ${
                          isMagazineOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isMagazineOpen && (
                      <div className="pl-6 space-y-1">
                        {item.dropdown.map((sub) => (
                          <a
                            key={sub.name}
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `block px-3 py-2 text-base font-medium transition-colors ${
                        isActive
                          ? "text-primary bg-accent"
                          : "text-muted-foreground hover:text-primary hover:bg-accent"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
