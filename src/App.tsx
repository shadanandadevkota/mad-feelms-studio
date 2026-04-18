import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Wedding from "./pages/Wedding.tsx";
import WeddingPhotos from "./pages/WeddingPhotos.tsx";
import AdCommercials from "./pages/AdCommercials.tsx";
import AdCommercialDetail from "./pages/AdCommercialDetail.tsx";
import FashionEditorial from "./pages/FashionEditorial.tsx";
import FashionEditorialDetail from "./pages/FashionEditorialDetail.tsx";
import MediaProduction from "./pages/MediaProduction.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/wedding/photos" element={<WeddingPhotos />} />
          <Route path="/ad-commercials" element={<AdCommercials />} />
          <Route path="/ad-commercials/:slug" element={<AdCommercialDetail />} />
          <Route path="/fashion-editorial" element={<FashionEditorial />} />
          <Route path="/fashion-editorial/:slug" element={<FashionEditorialDetail />} />
          <Route path="/media-production" element={<MediaProduction />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
