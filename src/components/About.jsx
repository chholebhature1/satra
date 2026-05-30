import React, { useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="about section-padding" id="about" ref={sectionRef}>
      <div className="container about-container">
        <div className="about-image-wrapper animate-on-scroll slide-up">
          <img 
            src="/gallery-1.jpeg" 
            alt="Satrangi Designer Studio" 
            className="about-image"
          />
          <div className="about-image-accent"></div>
        </div>
        
        <div className="about-content animate-on-scroll fade-in-late">
          <h2 className="heading-lg">Born in Delhi, <br/><span className="text-gold">Made for You</span></h2>
          <div className="about-text">
            <p>
              Satrangi Designer Studio started with a simple idea — that every woman in Delhi should have access to beautiful bridal and ethnic wear, whether she's buying or renting. We believe your outfit should feel as special as the occasion itself.
            </p>
            <p>
              From bridal lehengas to festive sarees, custom suits to kids' outfits — we do it all from our studio in New Delhi. Walk in, share your vision, and we'll make it happen.
            </p>
          </div>
          <div className="about-services-wrap">
            <p className="about-services-label">What We Offer</p>
            <div className="about-service-tags">
              {['Customisation', 'Lehenga on Rent', 'Jewellery on Rent', 'Sarees', 'Suits', 'Kids Wear', 'Designer Advice'].map((tag) => (
                <span key={tag} className="about-service-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="about-signature">
            <img src="/satrangi_logo-removebg-preview.png" alt="Satrangi Signature" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
