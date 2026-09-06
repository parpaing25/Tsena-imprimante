import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Index from "./pages/Index";
import { pageVue, installerSuiviErreurs } from "@/lib/mesure";

// Pages secondaires en code-splitting (chargées à la demande)
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Conseils = lazy(() => import("./pages/Conseils"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Blog = lazy(() => import("./pages/Blog"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Aide = lazy(() => import("./pages/Aide"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-label="Chargement">
    <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
  </div>
);

/**
 * À chaque changement de route : remonter en haut (sauf ancre), compter la page vue.
 * Audit 06/09/2026 : sans cela, /faq s'ouvrait à la position de défilement de la page
 * précédente, et rien ne mesurait l'audience.
 */
const SuiviNavigation = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    installerSuiviErreurs();
  }, []);
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    pageVue(pathname);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SuiviNavigation />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/imprimantes/:id" element={<ProductPage />} />
            <Route path="/conseils" element={<Conseils />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/aide" element={<Aide />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<ArticleDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
