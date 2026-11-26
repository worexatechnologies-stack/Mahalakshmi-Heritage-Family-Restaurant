"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PromotionalBanner from "@/components/PromotionalBanner";
import DiningExperience from "@/components/DiningExperience";
import PromotionalEventVideos from "@/components/PromotionalEventVideos";
import EventBookingSection from "@/components/EventBookingSection";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import EventHighlightsModal from "@/components/EventHighlightsModal";
import Toast from "@/components/Toast";

export default function Home({ initialSection }) {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    // 1. Smooth scroll if loaded at /contact, /gallery, /about, /menu, /event, /home
    const targetPath = (
      initialSection ||
      (typeof window !== "undefined" ? window.location.pathname.replace(/^\//, "").toLowerCase() : "")
    );
    if (targetPath) {
      if (targetPath === "menu" || targetPath === "event") {
        // Open the Sunday Event Highlights or scroll
        const targetEl = document.getElementById(targetPath);
        if (targetEl) {
          setTimeout(() => targetEl.scrollIntoView({ behavior: "smooth" }), 250);
        }
      } else {
        const targetEl = document.getElementById(targetPath);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }, 250);
        }
      }
    }

    // 2. Click interceptor to update URL and smooth scroll without full page refresh
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      let sectionId = "";
      let newPath = "";

      if (href.startsWith("#")) {
        sectionId = href.replace(/^#/, "");
        newPath = "/" + sectionId;
      } else if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.includes(".") &&
        !href.startsWith("/api")
      ) {
        sectionId = href.replace(/^\//, "");
        newPath = href;
      }

      if (sectionId) {
        // Allow full navigation to standalone subpages (like /contact)
        if (href === "/contact" || anchor.getAttribute("data-page") === "true") {
          return;
        }

        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          e.preventDefault();
          window.history.pushState(null, "", newPath);
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // 3. Browser Back/Forward navigation support
    const handlePopState = () => {
      const sectionName = window.location.pathname.replace(/^\//, "").toLowerCase();
      const targetEl = document.getElementById(sectionName || "home");
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("popstate", handlePopState);
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
    <main className="min-h-screen bg-[#0c0c0d] text-[#f4ede4] relative overflow-x-hidden selection:bg-[#cba158] selection:text-[#0c0c0d]">
      {/* Top Announcement Bar & Navigation Bar */}
      <Navbar
        onBookTable={() => setIsReservationOpen(true)}
        onOpenHighlights={() => setIsHighlightsOpen(true)}
      />

      {/* 1. Grand Sunday Heritage Feast & Live Music Gala Banner Section */}
      <Hero
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenHighlights={() => setIsHighlightsOpen(true)}
      />

      {/* Special Promotional Sliding Banner: 1+1 Beer & Unlimited Food @ Rs 999/- */}
      <PromotionalBanner onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 2. A Glimpse of Our World Section (Dining Spaces, Cabanas, Palm Walkway) */}
      <DiningExperience onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 3. Promotional Event Video Showcase (FINAL-01.mp4, 1.mp4, 2.mp4, 3.mp4) */}
      <PromotionalEventVideos onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 4. Event Table Reservation In-Page Form Section */}
      <EventBookingSection onBookingSuccess={(msg) => showToast(msg)} />

      {/* 5. Footer */}
      <Footer onSubscribe={(msg) => showToast(msg)} />

      {/* Interactive Book a Seat / Sunday Event Table Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onBookingSuccess={(msg) => showToast(msg)}
      />

      {/* Interactive Sunday Gala Highlights Modal */}
      <EventHighlightsModal
        isOpen={isHighlightsOpen}
        onClose={() => setIsHighlightsOpen(false)}
        onBookTable={() => setIsReservationOpen(true)}
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
