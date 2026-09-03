import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShoppingCart, Archive, History, Settings } from "lucide-react";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route
              path="/pos"
              element={
                <Placeholder
                  title="Point of Sale"
                  description="Ring up items, apply discounts, and take payments from this screen."
                  icon={ShoppingCart}
                />
              }
            />
            <Route
              path="/inventory"
              element={
                <Placeholder
                  title="Inventory"
                  description="Track stock levels, manage products, and get low-stock alerts."
                  icon={Archive}
                />
              }
            />
            <Route
              path="/sales-history"
              element={
                <Placeholder
                  title="Sales History"
                  description="Browse and search past transactions and sales reports."
                  icon={History}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Placeholder
                  title="Settings"
                  description="Manage store details, cashiers, and app preferences."
                  icon={Settings}
                />
              }
            />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
