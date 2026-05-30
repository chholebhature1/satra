import React, { useEffect, useRef } from 'react';
import './VideoHighlights.css';

const VideoHighlights = () => {
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

    const elements = sectionRef.current.querySelectorAll('.highlight-video-wrapper');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="video-highlights section-padding" id="studio" ref={sectionRef}>
      <div className="container">
        <div className="gallery-header text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="heading-lg">Behind the Seams</h2>
          <p className="gallery-subtitle">Experience the craftsmanship in motion.</p>
        </div>

        <div className="highlights-grid">
          <div className="highlight-video-wrapper">
            <video 
              className="highlight-video"
              autoPlay 
              muted 
              loop 
              playsInline
              src="/craftsmanship.mp4"
            >
            </video>
            <div className="video-overlay">
              <span className="video-label">The Studio</span>
            </div>
          </div>
          
          <div className="highlight-video-wrapper" style={{ transitionDelay: '0.2s' }}>
            <video 
              className="highlight-video"
              autoPlay 
              muted 
              loop 
              playsInline
              src="/collection.mp4"
            >
            </video>
            <div className="video-overlay">
              <span className="video-label">Craftsmanship</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHighlights;
