import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import AmenitiesStrip from '../components/AmenitiesStrip';
import PackagesPricing from '../components/PackagesPricing';
import FoodMenu from '../components/FoodMenu';
import BookingCalendar from '../components/BookingCalendar';
import PhotoGallery from '../components/PhotoGallery';
import LocationContact from '../components/LocationContact';
import FloatingWidgets from '../components/FloatingWidgets';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Noise overlay */}
      <div className="noise-texture fixed inset-0 pointer-events-none z-[1]" aria-hidden="true" />

      <Header />

      <main>
        {/* Section 1: Hero */}
        <section id="home">
          <HeroCarousel />
        </section>

        {/* Section 2: Amenities */}
        <section id="amenities">
          <AmenitiesStrip />
        </section>

        {/* Section 3: Packages */}
        <section id="packages">
          <PackagesPricing />
        </section>

        {/* Divider */}
        <div className="section-divider mx-8" />

        {/* Section 4: Food Menu */}
        <section id="menu">
          <FoodMenu />
        </section>

        {/* Divider */}
        <div className="section-divider mx-8" />

        {/* Section 5: Booking Calendar */}
        <section id="booking">
          <BookingCalendar />
        </section>

        {/* Divider */}
        <div className="section-divider mx-8" />

        {/* Section 6: Photo Gallery */}
        <section id="gallery">
          <PhotoGallery />
        </section>

        {/* Divider */}
        <div className="section-divider mx-8" />

        {/* Section 7: Location & Contact */}
        <section id="contact">
          <LocationContact />
        </section>
      </main>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}