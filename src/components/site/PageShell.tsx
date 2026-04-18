import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const PageShell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <Nav />
      {children}
      <Footer />
    </main>
  );
};
