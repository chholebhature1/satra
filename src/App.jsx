import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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
  const [heroReady, setHeroReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!heroReady) return undefined;

    const revealTimer = window.setTimeout(() => setContentReady(true), 120);
    return () => window.clearTimeout(revealTimer);
  }, [heroReady]);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setHeroReady(true), 3500);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

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

      <PageLoader ready={heroReady} />
      <div className="app-container">
        <Navbar />
        <main>
          <Hero showCarousel={contentReady} onVideoReady={() => setHeroReady(true)} />
          {contentReady && (
            <>
              <ServicesSection />
              <About />
              <ProductGallery />
              <TestimonialsSection />
              <VideoHighlights />
              <ContactSection />
            </>
          )}
        </main>
        {contentReady && (
          <>
            <Footer />
            <WhatsAppButton />
            <ScrollToTop />
            <CartDrawer />
          </>
        )}
      </div>
    </>
  );
}

export default App;
