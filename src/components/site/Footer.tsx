import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-background border-t border-border/40">
      {/* Marquee */}
      <div className="overflow-hidden border-b border-border/40 py-8">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12">
              <span className="font-display text-5xl md:text-7xl text-foreground/80">Mad Feelms</span>
              <span className="font-display italic text-5xl md:text-7xl text-primary">·</span>
              <span className="font-display text-5xl md:text-7xl text-foreground/80">Available Worldwide</span>
              <span className="font-display italic text-5xl md:text-7xl text-primary">·</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-3xl text-foreground inline-block">
              Mad<span className="text-primary">.</span>Feelms
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm text-sm">
              An Australian-based cinematic production house — capturing the unscripted,
              the considered, and everything between.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Studio</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <Link to="/wedding" className="nav-link inline-block hover:text-primary transition-colors">
                  Wedding Films
                </Link>
              </li>
              <li>
                <Link to="/ad-commercials" className="nav-link inline-block hover:text-primary transition-colors">
                  Ad Commercials
                </Link>
              </li>
              <li>
                <Link to="/fashion-editorial" className="nav-link inline-block hover:text-primary transition-colors">
                  Fashion Editorial
                </Link>
              </li>
              <li>
                <Link to="/media-production" className="nav-link inline-block hover:text-primary transition-colors">
                  Media Production
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Reach Out</p>
            <a href="mailto:hello@madfeelms.com" className="block font-display text-xl text-foreground nav-link mb-3">
              hello@madfeelms.com
            </a>
            <Link to="/#contact" className="eyebrow text-foreground/70 hover:text-primary transition-colors inline-block mt-2">
              Start a Project →
            </Link>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/madfeelms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.25} />
              </a>
              <a
                href="https://youtube.com/@madfeelms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" strokeWidth={1.25} />
              </a>
              <a href="mailto:hello@madfeelms.com" aria-label="Email" className="text-foreground/70 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" strokeWidth={1.25} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <p className="eyebrow text-muted-foreground">© {year} Mad Feelms · Australia</p>
          <p className="eyebrow text-muted-foreground">Crafted with care</p>
        </div>
      </div>
    </footer>
  );
};
