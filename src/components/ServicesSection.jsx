import React from 'react';
import { Sparkles, Gem, Scissors, Layers, Star, Ruler, Heart, Lightbulb, Palette } from 'lucide-react';
import './ServicesSection.css';

const signatureServices = [
  {
    id: 1,
    anchorId: 'bridal-couture',
    variant: 'hero',
    kicker: 'Signature couture',
    icon: Sparkles,
    title: 'Bridal Couture',
    desc: 'Custom bridal lehengas, sarees, and heirloom details shaped around your silhouette.',
    points: ['Private fitting guidance', 'Hand-finished embroidery', 'Bespoke and purchase orders'],
    ctaLabel: 'Book bridal consultation',
    bg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    anchorId: 'jewellery-on-rent',
    kicker: 'Rental accents',
    icon: Gem,
    title: 'Jewellery on Rent',
    desc: 'Statement sets for ceremonies, receptions, and festive edits.',
    points: ['Kundan, polki, and temple styles', 'Styled to the outfit palette'],
    ctaLabel: 'See rental options',
    bg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    anchorId: 'customisation',
    kicker: 'Tailored to you',
    icon: Scissors,
    title: 'Customisation',
    desc: 'Bring fabric, inspiration, or an idea. We refine the cut, drape, and finish.',
    points: ['Pattern tweaks', 'Fit refinement', 'Finish consultation'],
    ctaLabel: 'Talk to a stylist',
    bg: 'https://images.unsplash.com/photo-1556905200-279565513a2d?q=80&w=600&auto=format&fit=crop',
  },
];

const wardrobeServices = [
  {
    id: 4,
    anchorId: 'sarees',
    kicker: 'Everyday elegance',
    icon: Layers,
    title: 'Sarees',
    desc: 'Silk, georgette, banarasi, and event-ready drapes.',
    ctaLabel: 'Explore sarees',
    bg: 'https://images.unsplash.com/photo-1610030470298-4156fb116311?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    anchorId: 'lehenga-on-rent',
    kicker: 'Popular rental edit',
    icon: Star,
    title: 'Lehenga on Rent',
    desc: 'Bridal and festive looks with flexible rental value.',
    ctaLabel: 'Explore rentals',
    bg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    anchorId: 'suits',
    kicker: 'Ready-to-wear & fabrics',
    icon: Ruler,
    title: 'Suits (Stitched / Unstitched)',
    desc: 'Stitched and unstitched options for fast, polished dressing.',
    ctaLabel: 'Explore suits',
    bg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
  },
];

const studioSupport = [
  {
    id: 7,
    icon: Heart,
    title: 'Kids Customisation',
    desc: 'Small-scale couture for weddings, birthdays, and festivals.',
  },
  {
    id: 8,
    icon: Lightbulb,
    title: 'Designer Advice',
    desc: 'One-on-one direction on fabric, color, and silhouette.',
  },
  {
    id: 9,
    icon: Palette,
    title: 'Designing',
    desc: 'From mood board to final piece, handled in-house.',
  },
];

const atelierJumpLinks = [
  { label: 'Bridal Couture', href: '#bridal-couture' },
  { label: 'Rentals', href: '#lehenga-on-rent' },
  { label: 'Customisation', href: '#customisation' },
  { label: 'Studio Support', href: '#studio-support' },
];

const editorialNotes = [
  {
    title: 'Fit-first',
    desc: 'Every service is framed around silhouette, drape, and the final occasion.',
  },
  {
    title: 'Rent or buy',
    desc: 'The section makes it obvious which looks are rental-friendly and which are bespoke.',
  },
  {
    title: 'Ask for guidance',
    desc: 'Support items stay close to the cards so customers can move from inspiration to enquiry.',
  },
];

const renderServiceCard = (service, variant = '') => {
  const Icon = service.icon;

  return (
    <article className={`atelier-card ${variant ? `atelier-card--${variant}` : 'atelier-card--standard'}`} key={service.id} id={service.anchorId}>
      <div className="atelier-card__media">
        {service.bg && <div className="atelier-card__media-image" style={{ backgroundImage: `url('${service.bg}')` }} />}
        <div className="atelier-card__media-overlay" />
        <p className="atelier-card__kicker">{service.kicker}</p>
      </div>

      <div className="atelier-card__content">
        <div className="atelier-card__headline-row">
          <div className="service-icon-wrap atelier-card__icon">
            <div className="service-icon-inner-frame">
              <Icon size={20} strokeWidth={1.5} />
            </div>
          </div>
          <span className="atelier-card__eyebrow">{service.kicker}</span>
        </div>

        <h3 className="atelier-card__title">{service.title}</h3>
        <p className="atelier-card__desc">{service.desc}</p>

        {service.points && (
          <ul className="atelier-card__points">
            {service.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}

        <a href="#contact" className="atelier-card__cta">
          {service.ctaLabel || 'Discuss this service'}
        </a>
      </div>
    </article>
  );
};

const ServicesSection = () => {
  return (
    <section className="services-section section-padding" id="services">
      <div className="container services-shell">
        <aside className="services-panel">
          <p className="services-eyebrow">THE ATELIER EDIT</p>
          <h2 className="services-panel-title">Boutique services, edited like a private showroom.</h2>
          <p className="services-panel-copy">
            Choose bridal couture, rental looks, or guided custom work without scanning a noisy catalog.
          </p>

          <div className="services-jump-links" aria-label="Quick service navigation">
            {atelierJumpLinks.map((link) => (
              <a key={link.label} href={link.href} className="services-jump-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="services-notes">
            {editorialNotes.map((note) => (
              <div key={note.title} className="services-note-card">
                <p className="services-note-card__title">{note.title}</p>
                <p className="services-note-card__copy">{note.desc}</p>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn-primary services-panel-cta">
            Book a Consultation
          </a>
        </aside>

        <div className="services-showcase">
          <div className="services-group">
            <div className="services-tier-header services-tier-header--compact">
              <p className="services-tier-eyebrow">Signature services</p>
              <h3 className="services-tier-title">The pieces that define the studio.</h3>
            </div>
            <div className="services-cards services-cards--signature">
              {signatureServices.map((service) => renderServiceCard(service, service.variant || 'standard'))}
            </div>
          </div>

          <div className="services-group">
            <div className="services-tier-header services-tier-header--compact">
              <p className="services-tier-eyebrow">Wardrobe staples</p>
              <h3 className="services-tier-title">Everyday essentials, elevated.</h3>
            </div>
            <div className="services-cards services-cards--wardrobe">
              {wardrobeServices.map((service) => renderServiceCard(service))}
            </div>
          </div>

          <div className="services-support-panel" id="studio-support">
            <div className="services-tier-header services-tier-header--compact">
              <p className="services-tier-eyebrow">Studio support</p>
              <h3 className="services-tier-title">The finishing layer when you need direction.</h3>
            </div>

            <div className="services-support-grid">
              {studioSupport.map((service) => {
                const Icon = service.icon;

                return (
                  <a key={service.id} href="#contact" className="services-support-card">
                    <div className="service-icon-wrap services-support-card__icon">
                      <div className="service-icon-inner-frame">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="services-support-card__content">
                      <h4>{service.title}</h4>
                      <p>{service.desc}</p>
                    </div>
                    <span className="services-support-card__action">Enquire</span>
                  </a>
                );
              })}
            </div>

            <div className="services-support-footer">
              <a href="#contact" className="btn-primary">Book a Consultation</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
