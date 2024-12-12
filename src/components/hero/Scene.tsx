"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !glowRef.current) return;

    // Smooth fade-in animation
    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
      }
    );

    // Subtle neon pulse
    gsap.to(textRef.current, {
      textShadow: `
        0 0 7px rgba(255,255,255,0.7),
        0 0 10px rgba(255,255,255,0.7),
        0 0 21px rgba(255,255,255,0.7),
        0 0 42px rgba(88,199,250,0.8),
        0 0 82px rgba(88,199,250,0.7),
        0 0 92px rgba(88,199,250,0.6),
        0 0 102px rgba(88,199,250,0.5),
        0 0 151px rgba(88,199,250,0.4)
      `,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Gentle glow animation
    gsap.to(glowRef.current, {
      opacity: 0.4,
      scale: 1.2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-600/50 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/50 rounded-full blur-[120px] animate-pulse-slow delay-300" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-violet-500/50 rounded-full blur-[120px] animate-pulse-slow delay-700" />
      </div>

      {/* Subtle glow effect */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] mix-blend-screen"
      />

      {/* Text with neon effect */}
      <h1
        ref={textRef}
        className="relative text-[20rem] font-bold gothic-font select-none"
        style={{
          color: "rgba(255, 255, 255, 0.95)",
          textShadow: `
            0 0 7px rgba(255,255,255,0.7),
            0 0 10px rgba(255,255,255,0.7),
            0 0 21px rgba(255,255,255,0.7),
            0 0 42px rgba(88,199,250,0.7),
            0 0 82px rgba(88,199,250,0.6),
            0 0 92px rgba(88,199,250,0.5),
            0 0 102px rgba(88,199,250,0.4),
            0 0 151px rgba(88,199,250,0.3)
          `,
        }}
      >
        XO
      </h1>
    </div>
  );
}
