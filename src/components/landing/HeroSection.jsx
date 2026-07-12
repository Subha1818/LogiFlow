import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../../hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

// Eager load all 96 frames of the truck animation sequence from src/assets/TruckSequence/
const frameModules = import.meta.glob('../../assets/TruckSequence/*.jpg', { eager: true });

// Sort keys alphabetically to guarantee correct order (00001.jpg to 00096.jpg)
const framePaths = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key].default || frameModules[key]);

export default function HeroSection() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const brandRef = useRef(null);
  const ctaRef = useRef(null);
  const chevronRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const imagesRef = useRef([]);
  const currentFrameIndexRef = useRef(0);

  // Preload all 96 image assets into browser memory
  useEffect(() => {
    let loadedCount = 0;
    const total = framePaths.length;
    const images = [];

    if (total === 0) {
      setIsLoading(false);
      return;
    }

    framePaths.forEach((path, index) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / total) * 100));
        if (loadedCount === total) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        // Safe fallback in case of loading error
        loadedCount++;
        if (loadedCount === total) {
          setIsLoading(false);
        }
      };
      images[index] = img;
    });
    imagesRef.current = images;
  }, []);

  // Canvas cover drawing function
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index];
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (canvasRatio > imgRatio) {
      // Canvas is wider than image (letterbox/crop top/bottom)
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image (letterbox/crop left/right)
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  // Adjust canvas size to fill the screen on window resize
  useEffect(() => {
    if (isLoading) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameIndexRef.current);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoading]);

  // GSAP ScrollTrigger Sequence and Reveals
  useGSAP(() => {
    if (isLoading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const featuresCover = document.querySelector('.features-cover-reveal');

    if (prefersReducedMotion) {
      // Reduced motion fallback: Draw final frame statically, reveal elements immediately
      currentFrameIndexRef.current = framePaths.length - 1;
      drawFrame(framePaths.length - 1);
      
      gsap.set(brandRef.current, { opacity: 1, scale: 1 });
      gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      gsap.set(chevronRef.current, { opacity: 0 });
      if (featuresCover) {
        gsap.set(featuresCover, { y: window.innerHeight });
      }
      return;
    }

    // Set starting state before scroll
    drawFrame(0);

    const totalFrames = framePaths.length;
    const obj = { frame: 0 };
    const landingNavbar = document.querySelector('.landing-navbar');
    const landingNavForeground = Array.from(document.querySelectorAll('.landing-nav-foreground'));
    const landingNavSubtitle = document.querySelector('.landing-nav-subtitle');

    const activeScroll = 2500;
    const getViewportHeight = () => window.innerHeight;
    
    // Active animation takes Da units. The cover reveal scroll pads the timeline by Ds.
    const Da = 8;
    const Ds = Da * (getViewportHeight() / activeScroll);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${activeScroll + getViewportHeight()}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

    if (landingNavbar) {
      gsap.set(landingNavbar, {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderColor: 'rgba(92, 79, 60, 0.18)',
        boxShadow: '0 18px 45px rgba(45, 37, 26, 0.12)',
      });
    }

    if (landingNavForeground.length) {
      gsap.set(landingNavForeground, { color: '#2D251A' });
    }

    if (landingNavSubtitle) {
      gsap.set(landingNavSubtitle, { color: '#8C7C66' });
    }

    if (featuresCover) {
      gsap.set(featuresCover, { y: 0 });
    }

    // 1. Scrub frames from 00001.jpg (0) to 00096.jpg (95) - occupies 0 to Da (first 2500px scroll)
    tl.to(obj, {
      frame: totalFrames - 1,
      ease: 'none',
      duration: Da,
      onUpdate: () => {
        const frameIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.round(obj.frame))
        );
        currentFrameIndexRef.current = frameIndex;
        // Use requestAnimationFrame for jank-free render loop
        requestAnimationFrame(() => {
          drawFrame(frameIndex);
        });
      }
    }, 0);

    // 2. Scroll cue chevron fades out immediately on scroll start
    tl.to(chevronRef.current, {
      opacity: 0,
      y: 20,
      duration: Da * 0.15,
    }, 0);

    // 3. Centered Brand wordmark scales and fades in (starts at 75% of Da)
    tl.fromTo(brandRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, ease: 'power2.out', duration: Da * 0.2 },
      Da * 0.75
    );

    // 4. Launch Dashboard Button slides and fades in below
    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: Da * 0.2 },
      Da * 0.85
    );

    // 5. Sync the floating nav color with the Features cover reveal phase.
    if (landingNavbar) {
      tl.to(landingNavbar, {
        backgroundColor: '#123234',
        borderColor: 'rgba(243, 242, 239, 0.16)',
        boxShadow: '0 20px 50px rgba(18, 50, 52, 0.26)',
        ease: 'none',
        duration: Ds,
      }, Da);
    }

    if (landingNavForeground.length) {
      tl.to(landingNavForeground, {
        color: '#F3F2EF',
        ease: 'none',
        duration: Ds,
      }, Da);
    }

    if (landingNavSubtitle) {
      tl.to(landingNavSubtitle, {
        color: 'rgba(243, 242, 239, 0.68)',
        ease: 'none',
        duration: Ds,
      }, Da);
    }

    // 6. Empty timeline spacer to pad for the slide-up cover reveal transition
    tl.to({}, { duration: Ds }, Da);

  }, { dependencies: [isLoading], scope: containerRef });

  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-[#E7D7BE] flex flex-col items-center justify-center text-[#2D251A]">
        <div className="flex flex-col items-center gap-4">
          {/* Custom Spinner */}
          <div className="w-12 h-12 border-4 border-[#DFCDB2] border-t-cyan-600 rounded-full animate-spin" />
          <p className="text-xs font-bold tracking-widest font-mono uppercase opacity-85">
            Loading Sequence... {loadProgress}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-[#E7D7BE] text-[#2D251A] hero-locked-cream flex flex-col justify-between pt-20 transition-all duration-500 ${
        isDarkMode 
          ? 'rounded-b-[2rem] md:rounded-b-[3.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.55)] z-20 border-b border-[#DFCDB2]/30' 
          : 'z-10'
      }`}
    >
      {/* HTML5 Canvas sequence viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0 pointer-events-none"
      />

      {/* Brand & CTA overlay element */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6 mt-10">
        <div
          ref={brandRef}
          className="opacity-0 scale-[0.85] flex flex-col items-center mb-6 pointer-events-auto"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter select-none text-center drop-shadow-[0_2px_4px_rgba(231,215,190,0.5)]">
            <span className="text-[#2D251A]">Logi</span>
            <span className="text-[#0EA5C4]">Flow</span>
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.25em] text-[#5C4F3C] uppercase mt-1 select-none text-center">
            Logistics Route Optimization
          </p>
        </div>

        <div
          ref={ctaRef}
          className="opacity-0 translate-y-5 pointer-events-auto"
        >
          <Link
            to="/dashboard"
            className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-cyan-900/20 hover:scale-[1.03] active:scale-100 transition-all duration-200 text-center cursor-pointer uppercase border border-cyan-500/20 block"
          >
            Launch Dashboard
          </Link>
        </div>
      </div>

      {/* Animated chevron scroll cue */}
      <div
        ref={chevronRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 text-[#5C4F3C] select-none pointer-events-none animate-bounce"
        style={{ animationDuration: '2s' }}
      >
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-60">Scroll to begin</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
