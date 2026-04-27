import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Wedding", href: "/wedding" },
  { label: "Ad Commercials", href: "/ad-commercials" },
  { label: "Fashion Editorial", href: "/fashion-editorial" },
  { label: "Media Production", href: "/media-production" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-7 mix-blend-difference">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="group flex items-center gap-3 text-foreground"
        >
          <Menu className="h-5 w-5 transition-transform group-hover:rotate-180 duration-700" strokeWidth={1.25} />
          <span className="eyebrow hidden sm:inline">Menu</span>
        </button>

        <Link to="/" className="font-display text-lg md:text-xl tracking-tight text-foreground">
          Mad<span className="text-primary">.</span>Feelms
        </Link>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-sm"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
                <span className="eyebrow">Navigation</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" strokeWidth={1.25} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center px-6 md:px-20">
                <ul className="space-y-2 md:space-y-4">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground hover:text-primary transition-colors duration-500 block"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col gap-2 px-6 pb-8 md:flex-row md:items-end md:justify-between md:px-10">
                <div className="eyebrow">Based in Australia · Crafted Worldwide</div>
                <a href="mailto:hello@madfeelms.com" className="font-display italic text-xl text-primary nav-link">
                  hello@madfeelms.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
