"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EventCountdownBar from "@/components/EventCountdownBar";
import Hero from "@/components/Hero";
import EventHighlights from "@/components/EventHighlights";
import EventSchedule from "@/components/EventSchedule";
import AboutHours from "@/components/AboutHours";
import FeatureBar from "@/components/FeatureBar";
import Signatures from "@/components/Signatures";
import ThreeDDishExperience from "@/components/ThreeDDishExperience";
import RecipesSpecials from "@/components/RecipesSpecials";
import DiningExperience from "@/components/DiningExperience";
import CelebrationsCatering from "@/components/CelebrationsCatering";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQSection from "@/components/FAQSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import DishModal from "@/components/DishModal";
import Toast from "@/components/Toast";
import ThreeDBackgroundParticles from "@/components/ThreeDBackgroundParticles";

export default function Home({ initialSection }) {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    // 1. Disable browser's erratic scroll restoration so the page doesn't jump on reload
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2. Determine target section
    const currentHash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "").toLowerCase() : "";
    const pathnameSection = typeof window !== "undefined" ? window.location.pathname.replace(/^\//, "").toLowerCase() : "";
    
    // Only scroll if there is an explicit section requested
    const targetSection = initialSection || currentHash || (pathnameSection && pathnameSection !== "home" ? pathnameSection : null);

    if (targetSection && targetSection !== "home") {
      const targetEl = document.getElementById(targetSection);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    } else {
      // Always ensure the page starts cleanly at the top Hero & Announcement banner on load/refresh
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    // 3. Smooth scroll on anchor clicks without breaking page reloads
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#")) {
        const sectionId = href.replace(/^#/, "");
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [initialSection]);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#0c0c0d] text-[#f4ede4] relative overflow-x-hidden">
      {/* 3D Interactive Floating Gold Particle & Ember Field */}
      <ThreeDBackgroundParticles />

      {/* Top Real-time Event Countdown & Urgent Announcement Bar */}
      <EventCountdownBar onOpenReservation={() => setIsReservationOpen(true)} />

      {/* Navigation */}
      <Navbar onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 1. Grand Sunday Event Hero Showcase */}
      <Hero onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 2. Sunday Event Highlights & Festival Features */}
      <EventHighlights onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 3. Sunday Event Program Schedule & Table Options */}
      <EventSchedule onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 4. About Us - A Heritage Worth Savouring */}
      <AboutHours onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 3. Restaurant Highlights - The Art of Authentic Cooking */}
      <FeatureBar />

      {/* 4. Dishes Crafted with Heritage & Care - Signatures Menu */}
      <Signatures onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 5. Interactive 3D Tasting Showcase */}
      <ThreeDDishExperience onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 6. Mahalakshmi Kitchen Secrets - Heritage Recipes & Specials */}
      <RecipesSpecials onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 7. Where Tradition Meets Warmth - Dining Experience & Filmstrip Gallery */}
      <DiningExperience onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 8. Family Celebrations & Catering */}
      <CelebrationsCatering onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 9. Why Choose Us? */}
      <WhyChooseUs />

      {/* 10. Frequently Asked Questions */}
      <FAQSection />

      {/* 11. Loved By Our Guests Testimonials */}
      <Testimonials onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 12. Footer */}
      <Footer onSubscribe={(msg) => showToast(msg)} />

      {/* Interactive Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onBookingSuccess={(msg) => showToast(msg)}
      />

      {/* Interactive Dish Quick View Modal */}
      <DishModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        onOrderDish={(msg) => showToast(msg)}
      />

      {/* Toast Alert */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </main>
  );
}
