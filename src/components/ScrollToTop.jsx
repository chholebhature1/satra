import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '5.5rem',
        right: '2rem',
        zIndex: 9998,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-soft)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(22,54,43,0.12)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      <ArrowUp size={16} strokeWidth={2} />
    </button>
  );
};

export default ScrollToTop;
