"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutHours from "@/components/AboutHours";
import FeatureBar from "@/components/FeatureBar";
import Signatures from "@/components/Signatures";
import ThreeDDishExperience from "@/components/ThreeDDishExperience";
import RecipesSpecials from "@/components/RecipesSpecials";
import DiningExperience from "@/components/DiningExperience";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import DishModal from "@/components/DishModal";
import Toast from "@/components/Toast";
import ThreeDBackgroundParticles from "@/components/ThreeDBackgroundParticles";

export default function Home() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

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

      {/* Navigation */}
      <Navbar onOpenReservation={() => setIsReservationOpen(true)} />

      {/* Hero Section with Interactive 3D Gold Medallion */}
      <Hero onOpenReservation={() => setIsReservationOpen(true)} />

      {/* About & Hours Section */}
      <AboutHours onOpenReservation={() => setIsReservationOpen(true)} />

      {/* 4 Feature Badges */}
      <FeatureBar />

      {/* 8 Signatures Grid with 3D Tilt Cards */}
      <Signatures onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* 3D Interactive Tasting Showcase */}
      <ThreeDDishExperience onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* Recipes & Kitchen Specials Search + Mosaic Grid */}
      <RecipesSpecials onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* Dining Experience & Private Dining Hall */}
      <DiningExperience onOpenReservation={() => setIsReservationOpen(true)} />

      {/* Loved By Our Guests Testimonials Carousel */}
      <Testimonials onSelectDish={(dish) => setSelectedDish(dish)} />

      {/* Floating White Card Footer & Huge Watermark */}
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
