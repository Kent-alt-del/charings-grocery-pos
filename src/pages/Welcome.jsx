import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import BrandLogo from "@/components/BrandLogo";
import { ShoppingCart, Package, BarChart3, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const STORAGE_KEY = "charing_onboarding_complete";

const carouselSlides = [
  {
    icon: ShoppingCart,
    title: "Fast Point-of-Sale",
    desc: "Ring up Filipino groceries in seconds with a smart product grid, live cart, and one-tap cash payment processing.",
    accent: "#2E7D32",
  },
  {
    icon: Package,
    title: "Smart Inventory",
    desc: "Track stock by SKU, category, and supplier. Get low-stock alerts before shelves run empty and keep your store healthy.",
    accent: "#388E3C",
  },
  {
    icon: BarChart3,
    title: "Sales Insights",
    desc: "Review daily revenue, weekly trends, and full transaction logs. Export your history and stay on top of every peso.",
    accent: "#43A047",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [phase, setPhase] = useState("splash"); // splash | loading | carousel
  const [progress, setProgress] = useState(0);
  const [slide, setSlide] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  // If already authenticated, skip onboarding entirely
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  // Phase 1: Splash → Phase 2: Loading (after 1.5s)
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setIsNewUser(true);

    const t = setTimeout(() => setPhase("loading"), 1500);
    return () => clearTimeout(t);
  }, []);

  // Phase 2: Loading progress bar (1.0s) → carousel (new) or login (returning)
  useEffect(() => {
    if (phase !== "loading") return;
    let raf;
    const start = performance.now();
    const duration = 1000;
    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (isNewUser) {
            setPhase("carousel");
          } else {
            navigate("/login", { replace: true });
          }
        }, 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, isNewUser, navigate]);

  const handleGetStarted = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    navigate("/login", { replace: true });
  }, [navigate]);

  const nextSlide = () => setSlide((s) => Math.min(s + 1, carouselSlides.length - 1));
  const prevSlide = () => setSlide((s) => Math.max(s - 1, 0));

  // Authenticated users skip onboarding entirely (redirect handled by effect above)
  if (!isLoadingAuth && isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // ---- Splash Screen ----
  if (phase === "splash") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1b5e20] via-[#2E7D32] to-[#1b5e20] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#66BB6A] rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#43A047] rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <BrandLogo size={96} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-4xl font-extrabold text-white tracking-tight"
          >
            Charing's
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-1 text-sm tracking-[0.3em] text-white/80 font-medium"
          >
            GROCERY POS
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ---- Loading Screen ----
  if (phase === "loading") {
    const statusCopy =
      progress < 25 ? "Initializing store systems…" :
      progress < 50 ? "Loading product catalog…" :
      progress < 75 ? "Syncing inventory data…" :
      progress < 100 ? "Preparing your dashboard…" :
      "Ready!";
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1b5e20] via-[#2E7D32] to-[#1b5e20] flex items-center justify-center">
        <div className="w-full max-w-md px-8 flex flex-col items-center">
          <BrandLogo size={64} />
          <h1 className="mt-5 text-2xl font-bold text-white">Charing's Grocery POS</h1>
          <p className="mt-1 text-sm text-white/70">Web POS & Inventory Suite</p>

          <div className="w-full mt-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/70 font-medium">{statusCopy}</span>
              <span className="text-sm text-white font-bold tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Welcome Carousel ----
  const current = carouselSlides[slide];
  const Icon = current.icon;
  const isLast = slide === carouselSlides.length - 1;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5f7f9] to-[#e8f5e9] flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#A5D6A7]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#66BB6A]/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-2xl px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <BrandLogo size={44} />
          <div>
            <div className="font-bold text-lg text-foreground">Charing's</div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium">GROCERY POS</div>
          </div>
        </div>

        {/* Carousel card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-10 min-h-[340px] flex flex-col items-center text-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: current.accent + "20" }}
              >
                <Icon className="w-10 h-10" style={{ color: current.accent }} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{current.title}</h2>
              <p className="text-muted-foreground text-base max-w-md leading-relaxed">{current.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-2 mt-8">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slide ? "w-8 bg-primary" : "w-2 bg-border"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full mt-8">
            <button
              onClick={prevSlide}
              disabled={slide === 0}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {isLast ? (
              <button
                onClick={handleGetStarted}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={nextSlide}
                className="flex items-center gap-1 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {isLast ? "You're all set — let's get you logged in." : `Step ${slide + 1} of ${carouselSlides.length}`}
        </p>
      </div>
    </div>
  );
}