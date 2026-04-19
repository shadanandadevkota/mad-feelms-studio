import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { PageFlip } from "@/components/site/PageFlip";
import { Work } from "@/components/site/Work";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    // Defer to allow the page to layout first
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <main className="relative bg-background text-foreground">
      <Nav />
      <Hero />
      <PageFlip />
      <Work />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
