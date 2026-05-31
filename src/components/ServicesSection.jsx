import React from 'react';
import { Sparkles, Gem, Scissors, Layers, Star, Ruler, Heart, Lightbulb, Palette } from 'lucide-react';
import './ServicesSection.css';

const signatureServices = [
  {
    id: 1,
    icon: Sparkles,
    title: 'Bridal Couture',
    desc: 'Exquisite custom-crafted bridal lehengas, hand-embroidered wedding sarees, and magnificent luxury designer ensembles tailored to make your big day unforgettable.',
    bg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    icon: Gem,
    title: 'Jewellery on Rent',
    desc: 'Statement bridal & occasion jewellery on rent — kundan, polki & gold-plated sets.',
    bg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    icon: Scissors,
    title: 'Customisation',
    desc: 'Your fabric, your vision, our craft. Every stitch tailored exclusively for you.',
    bg: 'https://images.unsplash.com/photo-1556905200-279565513a2d?q=80&w=600&auto=format&fit=crop',
  },
];

const wardrobeServices = [
  {
    id: 4,
    icon: Layers,
    title: 'Sarees',
    desc: 'Silk, georgette, banarasi & designer sarees curated for every occasion.',
    bg: 'https://images.unsplash.com/photo-1610030470298-4156fb116311?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    icon: Star,
    title: 'Lehenga on Rent',
    desc: 'Bridal & party lehengas available on rent. Wear luxury without the full price.',
    bg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    icon: Ruler,
    title: 'Suits (Stitched / Unstitched)',
    desc: 'Designer suits in ready-to-wear and fabric form — festive, casual & formal.',
    bg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
  },
];

const studioSupport = [
  {
    id: 7,
    icon: Heart,
    title: 'Kids Customisation',
    desc: 'Adorable custom ethnic outfits for your little ones — weddings, festivals & beyond.',
  },
  {
    id: 8,
    icon: Lightbulb,
    title: 'Designer Advice',
    desc: 'One-on-one styling consultation — fabric selection, colour matching & outfit planning.',
  },
  {
    id: 9,
    icon: Palette,
    title: 'Designing',
    desc: 'From mood board to masterpiece — in-house designers craft exclusive pieces for you.',
  },
];

const renderServiceCard = (service, variant = '') => {
  const Icon = service.icon;

  return (
    <div className={`service-card${variant ? ` service-card--${variant}` : ''}`} key={service.id}>
      {/* Background fabric image overlay */}
      {service.bg && (
        <div 
          className="service-card__bg-image" 
          style={{ backgroundImage: `url('${service.bg}')` }}
        />
      )}
      <div className="service-card__glow-overlay"></div>

      <div className="service-icon-wrap">
        <div className="service-icon-inner-frame">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="service-title">{service.title}</h3>
      <p className="service-desc">{service.desc}</p>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section className="services-section section-padding" id="services">
      <div className="container">
        <div className="services-header text-center">
          <p className="services-eyebrow">WHAT WE OFFER</p>
          <h2 className="heading-lg">Our <span className="text-gold">Services</span></h2>
          <p className="services-subtitle">
            Bridal wear, rentals, customisation, and more — all from one studio in Delhi.
          </p>
          <div className="services-gold-rule"></div>
        </div>

        <div className="services-tier">
          <div className="services-tier-header">
            <p className="services-tier-eyebrow">Signature services</p>
            <h3 className="services-tier-title">The pieces that define the studio.</h3>
          </div>
          <div className="services-grid services-grid--featured">
            {signatureServices.map((service) => renderServiceCard(service, 'featured'))}
          </div>
        </div>

        <div className="services-tier services-tier--secondary">
          <div className="services-tier-header">
            <p className="services-tier-eyebrow">Wardrobe staples</p>
            <h3 className="services-tier-title">Everyday essentials, elevated.</h3>
          </div>
          <div className="services-grid">
            {wardrobeServices.map((service) => renderServiceCard(service))}
          </div>
        </div>

        <div className="services-links-panel">
          <p className="services-tier-eyebrow">Studio support</p>
          <div className="services-links-row">
            {studioSupport.map((service) => (
              <a key={service.id} href="#contact" className="service-link-pill">
                {service.title}
              </a>
            ))}
          </div>
        </div>

        <div className="services-cta text-center">
          <a href="#contact" className="btn-primary">Book a Consultation</a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
