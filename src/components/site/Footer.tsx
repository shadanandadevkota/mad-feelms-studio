import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import logoFull from "@/assets/mf-logo-full.png";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Footer = () => {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

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

  // Cinematic ease used across the site
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <footer ref={ref} className="relative isolate overflow-hidden">
      {/* Solid brand-red panel that slides up to overlay the previous section */}
      <motion.div
        aria-hidden="true"
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-0 -z-10 bg-primary"
      />

      {/* Marquee band at the top */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease, delay: 0.6 }}
        className="border-y border-primary-foreground/15 py-6 overflow-hidden"
      >
        <div className="flex animate-marquee whitespace-nowrap text-primary-foreground">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12">
              <span className="font-display text-5xl md:text-7xl">Mad Feelms</span>
              <span className="font-display italic text-5xl md:text-7xl opacity-80">·</span>
              <span className="font-display text-5xl md:text-7xl">Available Worldwide</span>
              <span className="font-display italic text-5xl md:text-7xl opacity-80">·</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="container relative py-16 md:py-24 text-primary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Left: contact / address */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.7 }}
            className="md:col-span-3 space-y-6"
          >
            <div>
              <p className="eyebrow text-primary-foreground/70 mb-2">Studio</p>
              <p className="font-display text-2xl leading-tight">Mad Feelms</p>
              <p className="text-sm text-primary-foreground/85 mt-1">Australia · Worldwide</p>
            </div>
            <div>
              <p className="eyebrow text-primary-foreground/70 mb-2">Email</p>
              <a
                href={`mailto:${footer.email}`}
                className="nav-link font-display text-xl hover:text-primary-foreground/80 transition-colors"
              >
                {footer.email}
              </a>
            </div>
            <p className="text-sm text-primary-foreground/85 max-w-xs">{footer.tagline}</p>
          </motion.div>

          {/* Center: navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.85 }}
            className="md:col-span-4 md:col-start-5"
          >
            <p className="eyebrow text-primary-foreground/70 mb-4">Navigation</p>
            <ul className="grid grid-cols-2 gap-y-2 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Wedding", to: "/wedding" },
                { label: "Ad Commercials", to: "/ad-commercials" },
                { label: "Fashion Editorial", to: "/fashion-editorial" },
                { label: "Media Production", to: "/media-production" },
                { label: "Contact", to: "/#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="nav-link inline-block hover:text-primary-foreground/80 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                to="/#contact"
                className="eyebrow inline-block border border-primary-foreground/40 px-5 py-3 hover:bg-primary-foreground hover:text-primary transition-colors"
              >
                {footer.cta_label}
              </Link>
            </div>
          </motion.div>

          {/* Right: oversized logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, ease, delay: 0.9 }}
            className="md:col-span-4 md:col-start-9 flex md:justify-end"
          >
            <img
              src={logoFull}
              alt="Mad Feelms logo"
              className="h-32 md:h-48 lg:h-56 w-auto select-none"
              style={{ filter: "brightness(0) invert(1)" }}
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Bottom strip: socials + copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease, delay: 1.1 }}
          className="mt-16 pt-6 border-t border-primary-foreground/20 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
        >
          <p className="eyebrow text-primary-foreground/80">© {year} Mad Feelms · Australia</p>

          <div className="flex items-center gap-4">
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-primary-foreground/85 hover:text-primary-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-primary-foreground/85 hover:text-primary-foreground transition-colors"
            >
              <Youtube className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a
              href={`mailto:${socials.email}`}
              aria-label="Email"
              className="text-primary-foreground/85 hover:text-primary-foreground transition-colors"
            >
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>

          <p className="eyebrow text-primary-foreground/80">{footer.copyright_note}</p>
        </motion.div>
      </div>
    </footer>
  );
};
