import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { PageFlip } from "@/components/site/PageFlip";
import { Work } from "@/components/site/Work";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

const Index = () => {
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
