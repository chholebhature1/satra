import React, { useState, useEffect, useRef } from 'react';

const PageLoader = ({ ready = false }) => {
  const [visible, setVisible]     = useState(true);
  const [fading, setFading]       = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const t1 = setTimeout(() => { if (mounted.current) setLogoReady(true); }, 150);
    const t2 = setTimeout(() => { if (mounted.current && ready) setFading(true); }, 250);
    const t3 = setTimeout(() => { if (mounted.current && ready) setVisible(false); }, 900);
    // hard safety fallback so the app never gets stuck behind the loader
    const t4 = setTimeout(() => { if (mounted.current) setVisible(false); }, 3500);

    return () => {
      mounted.current = false;
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready || !mounted.current) return undefined;

    const fadeTimer = setTimeout(() => {
      if (mounted.current) setFading(true);
    }, 80);
    const hideTimer = setTimeout(() => {
      if (mounted.current) setVisible(false);
    }, 650);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [ready]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.75rem',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.65s ease',
      pointerEvents: fading ? 'none' : 'all',
    }}>
      <img
        src="/satrangi_logo-removebg-preview.png"
        alt="Satrangi Designer Studio"
        style={{
          height: '85px',
          width: 'auto',
          opacity: logoReady ? 1 : 0,
          transform: logoReady ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          filter: 'drop-shadow(0 8px 24px rgba(15,143,100,0.18))',
        }}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.65rem',
        opacity: logoReady ? 1 : 0,
        transition: 'opacity 0.6s ease 0.15s',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          Luxury Ethnic Wear
        </p>

        <div style={{
          width: '110px',
          height: '1px',
          background: 'var(--border-soft)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'var(--accent-gold)',
            animation: 'stl-bar 1.2s ease forwards',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes stl-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
