import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import './TestimonialsSection.css';

const testimonialReels = [
  {
    id: 1,
    label: 'SATRANGI REEL 1',
    src: '/SATRANGI REEL 1 (1).mp4',
    poster: '/testimonial-reel-1-poster.jpg',
    title: 'Bridal moments in motion',
    description: 'A quick look at the studio styling flow, finishing touches, and bridal energy.',
  },
  {
    id: 2,
    label: 'SATRANGI REEL 3',
    src: '/SATRANGI REEL 3.mp4',
    poster: '/testimonial-reel-3-poster.jpg',
    title: 'Detail close-ups',
    description: 'Embroidery, texture, and movement captured from the atelier floor.',
  },
  {
    id: 3,
    label: 'SATRANGI REEL 2',
    src: '/SATRANGI REEL 2.mp4',
    poster: '/testimonial-reel-2-poster.jpg',
    title: 'Festive styling reel',
    description: 'Color, drape, and client-ready looks from the current edit.',
  },
];

const TestimonialsSection = () => {
  const videoRefs = useRef({});
  const [activeVideoId, setActiveVideoId] = useState(null);
  const featuredReel = testimonialReels.find((reel) => reel.label === 'SATRANGI REEL 2') || testimonialReels[0];
  const supportingReels = testimonialReels.filter((reel) => reel.id !== featuredReel.id);

  const handlePlay = async (videoId) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    Object.entries(videoRefs.current).forEach(([key, otherVideo]) => {
      if (Number(key) !== videoId) {
        otherVideo.pause();
      }
    });

    setActiveVideoId(videoId);

    try {
      await video.play();
    } catch (error) {
      console.error(error);
      setActiveVideoId(null);
    }
  };

  const renderReelCard = (reel, variant = 'compact') => {
    const featured = variant === 'featured';

    return (
      <article className={`testimonial-video-card testimonial-video-card--${variant}`} key={reel.id}>
        <div className={`testimonial-video-frame${featured ? ' testimonial-video-frame--featured' : ''}`}>
          <video
            className="testimonial-video"
            ref={(node) => {
              if (node) {
                videoRefs.current[reel.id] = node;
              } else {
                delete videoRefs.current[reel.id];
              }
            }}
            src={encodeURI(reel.src)}
            poster={encodeURI(reel.poster)}
            playsInline
            preload="none"
            aria-label={reel.label}
            onPlay={() => setActiveVideoId(reel.id)}
            onPause={() => setActiveVideoId((current) => (current === reel.id ? null : current))}
            onEnded={() => setActiveVideoId((current) => (current === reel.id ? null : current))}
          />

          <button
            type="button"
            className={`testimonial-video-play-button${activeVideoId === reel.id ? ' testimonial-video-play-button--hidden' : ''}${featured ? ' testimonial-video-play-button--featured' : ''}`}
            onClick={() => handlePlay(reel.id)}
            aria-label={`Play ${reel.label}`}
          >
            <span className={`testimonial-video-play-chip${featured ? ' testimonial-video-play-chip--featured' : ''}`} aria-hidden="true">
              <Play size={featured ? 34 : 30} fill="currentColor" strokeWidth={0} />
            </span>
            <span className="testimonial-video-play-text">Tap to play</span>
          </button>

          {featured && <span className="testimonial-featured-badge">Featured reel</span>}
        </div>

        <div className={`testimonial-video-overlay${featured ? ' testimonial-video-overlay--featured' : ''}`}>
          <p className="testimonial-video-label">{reel.label}</p>
          <h3 className="testimonial-video-title">{reel.title}</h3>
          <p className="testimonial-video-copy">{reel.description}</p>
          {featured && <p className="testimonial-featured-note">The reel we want you to notice first.</p>}
        </div>
      </article>
    );
  };

  return (
    <section className="testimonials-section section-padding" id="testimonials">
      <div className="container">
        <div className="testimonials-header text-center">
          <p className="testimonials-eyebrow">STUDIO REELS</p>
          <h2 className="heading-lg">SATRANGI <span className="text-gold">Reels</span></h2>
          <p className="testimonials-subtitle">
            Three studio reels, with the featured treatment reserved for smaller screens.
          </p>
          <div className="testimonials-gold-rule"></div>
        </div>

        <div className="testimonials-featured-layout">
          {renderReelCard(featuredReel, 'featured')}

          <div className="testimonials-support-grid">
            {supportingReels.map((reel) => renderReelCard(reel, 'compact'))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
