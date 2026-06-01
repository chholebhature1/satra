import React, { useEffect, useRef } from 'react';
import './Hero.css';

const HeroBackgroundVideo = ({ onReady = () => {} }) => {
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    return () => {
      hasNotifiedRef.current = false;
    };
  }, []);

  const handleReady = () => {
    if (hasNotifiedRef.current) return;
    hasNotifiedRef.current = true;
    onReady();
  };

  return (
    <video
      className="hero-generated-video"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/premium_hero_bg.png"
      src="/its_indian_ethnic_wear_focuse.mp4"
      onLoadedData={handleReady}
      onCanPlay={handleReady}
    />
  );
};

export default HeroBackgroundVideo;
