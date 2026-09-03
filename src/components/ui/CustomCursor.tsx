// ============================================================================
// components/ui/CustomCursor.tsx
// ============================================================================
'use client';

import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch-only devices to avoid interference with mobile UX
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    const delay = 8;
    let _x = window.innerWidth / 2;
    let _y = window.innerHeight / 2;
    let endX = window.innerWidth / 2;
    let endY = window.innerHeight / 2;
    let isEnlarged = false;
    let animationFrameId: number;

    // Toggle cursor scaling on hover & click
    const toggleCursorSize = () => {
      if (isEnlarged) {
        dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      } else {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    };

    // Physics loop: Outer outline lags smoothly behind the dot
    const animateDotOutline = () => {
      _x += (endX - _x) / delay;
      _y += (endY - _y) / delay;

      outline.style.top = `${_y}px`;
      outline.style.left = `${_x}px`;

      animationFrameId = requestAnimationFrame(animateDotOutline);
    };

    // Position dot immediately under pointer
    const handleMouseMove = (e: MouseEvent) => {
      endX = e.clientX;
      endY = e.clientY;

      dot.style.top = `${endY}px`;
      dot.style.left = `${endX}px`;
      dot.style.opacity = '1';
      outline.style.opacity = '1';
    };

    // Enlarged trigger for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover]'
      );

      if (isInteractive) {
        isEnlarged = true;
        toggleCursorSize();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover]'
      );

      if (isInteractive) {
        isEnlarged = false;
        toggleCursorSize();
      }
    };

    // Click feedback
    const handleMouseDown = () => {
      isEnlarged = true;
      toggleCursorSize();
    };

    const handleMouseUp = () => {
      isEnlarged = false;
      toggleCursorSize();
    };

    // Hide when exiting document window
    const handleMouseEnter = () => {
      dot.style.opacity = '1';
      outline.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      dot.style.opacity = '0';
      outline.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId = requestAnimationFrame(animateDotOutline);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 
        Outer Dot Outline (Lagging follower)
        Color customized to semi-transparent Warm Terracotta (#D4A373 with 45% alpha)
      */}
      <div
        ref={outlineRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[9998] opacity-0 transition-[opacity,transform] duration-300 ease-in-out will-change-transform"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(212, 163, 115, 0.45)',
        }}
      />

      {/* 
        Inner Center Dot (Direct mouse follower)
        Color customized to Matte Charcoal (#2C302E)
      */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[9999] opacity-0 transition-[opacity,transform] duration-300 ease-in-out will-change-transform"
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#2C302E',
        }}
      />
    </>
  );
};