import React, { useEffect, useRef, useState } from 'react';
import './VideoHighlights.css';

const VideoHighlights = () => {
  const sectionRef = useRef(null);
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideos(true);
            sectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = section.querySelectorAll('.highlight-video-wrapper');
    elements.forEach((el) => itemObserver.observe(el));
    sectionObserver.observe(section);

    return () => {
      elements.forEach((el) => itemObserver.unobserve(el));
      sectionObserver.disconnect();
      itemObserver.disconnect();
    };
  }, []);

  return (
    <section className="video-highlights section-padding" id="studio" ref={sectionRef}>
      <div className="container">
        <div className="gallery-header text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="heading-lg">Behind the Seens</h2>
          <p className="gallery-subtitle">Experience the craftsmanship in motion.</p>
        </div>

        <div className="highlights-grid">
          <div className="highlight-video-wrapper">
            <video
              key={`craftsmanship-${shouldLoadVideos ? 'loaded' : 'placeholder'}`}
              className="highlight-video"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/highlight-craftsmanship-poster.jpg"
              src={shouldLoadVideos ? '/craftsmanship.mp4' : undefined}
            />
            <div className="video-overlay">
              <span className="video-label">The Studio</span>
            </div>
          </div>
          
          <div className="highlight-video-wrapper" style={{ transitionDelay: '0.2s' }}>
            <video
              key={`collection-${shouldLoadVideos ? 'loaded' : 'placeholder'}`}
              className="highlight-video"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/highlight-collection-poster.jpg"
              src={shouldLoadVideos ? '/collection.mp4' : undefined}
            />
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
