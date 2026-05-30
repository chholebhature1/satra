import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopTheLookCarousel from './components/ShopTheLookCarousel';
import AnnouncementBar from './components/AnnouncementBar';
import ServicesSection from './components/ServicesSection';
import About from './components/About';
import ProductGallery from './components/ProductGallery';
import LookbookLightbox from './components/LookbookLightbox';
import CartDrawer from './components/CartDrawer';
import VideoHighlights from './components/VideoHighlights';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';
import { SHOPIFY_PUBLIC_ACCESS_TOKEN } from './lib/shopifyConfig';
import './App.css';

/* eslint-disable react/no-unknown-property */
function App() {
  return (
    <>
      <AnnouncementBar onVisibilityChange={() => {}} />
      <LookbookLightbox />

      {/* Shopify store config — must be present before any shopify-context elements */}
      <shopify-store
        store-domain="satrangi-boutique-2.myshopify.com"
        public-access-token={SHOPIFY_PUBLIC_ACCESS_TOKEN}
        country="IN"
        language="en"
      ></shopify-store>

      <PageLoader />
      <div className="app-container">
        <Navbar />
        <main>
          <Hero />
          {/* Carousel is shown as desktop overlay inside Hero; this renders it for mobile only */}
          <div className="mobile-carousel-section">
            <ShopTheLookCarousel />
          </div>
          <VideoHighlights />
          <ServicesSection />
          <About />
          <ProductGallery />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
        <CartDrawer />
      </div>
    </>
  );
}

export default App;
