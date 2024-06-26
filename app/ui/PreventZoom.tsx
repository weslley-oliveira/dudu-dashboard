'use client';

import React, { useEffect } from 'react';

const PreventZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if ((now - lastTouchEnd) <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    let lastTouchEnd = 0;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return <>{children}</>;
};

export default PreventZoom;