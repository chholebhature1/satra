import React from 'react';
import './Hero.css';

const HeroBackgroundVideo = () => {
  return (
    <video
      className="hero-generated-video"
      autoPlay
      loop
      muted
      playsInline
      src="/its_indian_ethnic_wear_focuse.mp4"
    />
  );
};

export default HeroBackgroundVideo;
