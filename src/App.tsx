import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/site/PageTransition";
import Index from "./pages/Index.tsx";
import Wedding from "./pages/Wedding.tsx";
import WeddingPhotos from "./pages/WeddingPhotos.tsx";
import WeddingFilms from "./pages/WeddingFilms.tsx";
import AdCommercials from "./pages/AdCommercials.tsx";
import AdCommercialDetail from "./pages/AdCommercialDetail.tsx";
import FashionEditorial from "./pages/FashionEditorial.tsx";
import FashionEditorialDetail from "./pages/FashionEditorialDetail.tsx";
import MediaProduction from "./pages/MediaProduction.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/wedding" element={<PageTransition><Wedding /></PageTransition>} />
        <Route path="/wedding/photos" element={<PageTransition><WeddingPhotos /></PageTransition>} />
        <Route path="/wedding/films" element={<PageTransition><WeddingFilms /></PageTransition>} />
        <Route path="/ad-commercials" element={<PageTransition><AdCommercials /></PageTransition>} />
        <Route path="/ad-commercials/:slug" element={<PageTransition><AdCommercialDetail /></PageTransition>} />
        <Route path="/fashion-editorial" element={<PageTransition><FashionEditorial /></PageTransition>} />
        <Route path="/fashion-editorial/:slug" element={<PageTransition><FashionEditorialDetail /></PageTransition>} />
        <Route path="/media-production" element={<PageTransition><MediaProduction /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/maddyy/login" element={<AdminLogin />} />
        <Route path="/maddyy" element={<AdminDashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
