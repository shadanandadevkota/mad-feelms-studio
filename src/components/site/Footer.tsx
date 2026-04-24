import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";
import logoFull from "@/assets/mf-logo-full.png";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Footer = () => {
  const year = new Date().getFullYear();
  const { value: footer } = useSiteContent("footer", {
    tagline:
      "An Australian-based cinematic production house — capturing the unscripted, the considered, and everything between.",
    email: "hello@madfeelms.com",
    cta_label: "Start a Project →",
    copyright_note: "Crafted with care",
  });
  const { value: socials } = useSiteContent("socials", {
    instagram: "https://instagram.com/madfeelms",
    youtube: "https://youtube.com/@madfeelms",
    email: "hello@madfeelms.com",
  });
  return (
    <footer className="relative isolate overflow-hidden border-t border-border/40 text-foreground">
      {/* Brand video background */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/footer-bg.mp4" type="video/mp4" />
      </video>

      {/* Brand red tint + dark vignette for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.55) 0%, hsl(14 99% 47% / 0.55) 50%, hsl(var(--background) / 0.85) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mix-blend-multiply"
        style={{ background: "hsl(14 99% 47% / 0.35)" }}
      />

      {/* Marquee */}
      <div className="border-b border-foreground/15 py-8 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12">
              <span className="font-display text-5xl md:text-7xl text-foreground">Mad Feelms</span>
              <span className="font-display italic text-5xl md:text-7xl text-foreground/90">·</span>
              <span className="font-display text-5xl md:text-7xl text-foreground">Available Worldwide</span>
              <span className="font-display italic text-5xl md:text-7xl text-foreground/90">·</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Mad Feelms — Home">
              <img
                src={logoFull}
                alt="Mad Feelms logo"
                className="h-14 md:h-16 w-auto select-none"
                style={{ filter: "drop-shadow(0 4px 20px hsl(0 0% 0% / 0.45))" }}
                draggable={false}
              />
            </Link>
            <p className="text-foreground/90 mt-5 max-w-sm text-sm">
              {footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4 text-foreground/80">Studio</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li>
                <Link to="/wedding" className="nav-link inline-block hover:text-foreground/80 transition-colors">
                  Wedding Films
                </Link>
              </li>
              <li>
                <Link to="/ad-commercials" className="nav-link inline-block hover:text-foreground/80 transition-colors">
                  Ad Commercials
                </Link>
              </li>
              <li>
                <Link to="/fashion-editorial" className="nav-link inline-block hover:text-foreground/80 transition-colors">
                  Fashion Editorial
                </Link>
              </li>
              <li>
                <Link to="/media-production" className="nav-link inline-block hover:text-foreground/80 transition-colors">
                  Media Production
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-4 text-foreground/80">Reach Out</p>
            <a href={`mailto:${footer.email}`} className="block font-display text-xl text-foreground nav-link mb-3">
              {footer.email}
            </a>
            <Link to="/#contact" className="eyebrow text-foreground/90 hover:text-foreground transition-colors inline-block mt-2">
              {footer.cta_label}
            </Link>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-foreground/90 hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-foreground/90 hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a href={`mailto:${socials.email}`} aria-label="Email" className="text-foreground/90 hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/15 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <p className="eyebrow text-foreground/80">© {year} Mad Feelms · Australia</p>
          <p className="eyebrow text-foreground/80">{footer.copyright_note}</p>
        </div>
      </div>
    </footer>
  );
};
