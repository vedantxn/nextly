'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const ComparisonFeature: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { once: true });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Production Ready",
      description: "Clean, optimized Next.js code with TypeScript integration built-in."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Generate complete applications in seconds with optimized performance."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      title: "Fully Responsive",
      description: "Mobile-first design with Tailwind CSS and responsive components."
    }
  ];

  return (
    <section className="px-4">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/1 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Clean Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-3 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full text-primary" />
            <span>See the Difference</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 hover:italic hover:underline">AI that doesn't look AI</h2>
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            For people, who are tired of those same blue-violet AI generated websites that can be smelled by miles away....
          </p>
        </div>

        {/* Professional Container */}
        <motion.div 
          className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-foreground/10 overflow-hidden p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            boxShadow: `
              0 20px 40px -10px rgba(0,0,0,0.08),
              0 0 0 1px rgba(0,0,0,0.03),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `
          }}
        >
          
          {/* Comparison Slider */}
          <div className="flex justify-center">
            <motion.div 
              className="relative w-full max-w-3xl group"
              style={{ aspectRatio: '16/9' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div
                ref={containerRef}
                className="relative w-full h-full bg-background/60 backdrop-blur-sm rounded-xl border border-foreground/20 overflow-hidden cursor-col-resize select-none shadow-lg group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300"
              >
                {/* Before Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src="https://framerusercontent.com/images/Eb9Y1iduWcOd3e4hLSJJtL9Rg.jpg"
                    alt="Other AI Tools Result"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-semibold shadow-lg">
                    Nextly
                  </div>
                </div>

                {/* After Image */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-75 ease-out"
                  style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  }}
                >
                  <Image
                    src="https://framerusercontent.com/images/w2fbgpK5XbA8dcXjol9h7rNB4Lo.png"
                    alt="Nextly Result"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-foreground/90 text-background px-3 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm">
                    Other Tools
                  </div>
                </div>

                {/* Clean Slider */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-primary/50 shadow-sm transition-all duration-75 ease-out z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background rounded-full shadow-lg cursor-col-resize flex items-center justify-center border-2 border-primary/30 hover:border-primary/60 hover:shadow-xl transition-all duration-200"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center space-x-0.5">
                      <div className="w-px h-5 bg-primary/70"></div>
                      <div className="w-px h-5 bg-primary/70"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Simple Connection Lines */}
          <motion.div 
            className="relative h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {/* Center point */}
            <div className="absolute left-1/2 top-0 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2" />
            
            {/* Main line */}
            <div className="absolute left-1/2 top-2 w-px h-6 bg-primary/60 transform -translate-x-1/2" />
            
            {/* Distribution */}
            <div className="absolute top-8 left-0 right-0 h-px bg-primary/30" />
            
            {/* Feature connections */}
            {[16.67, 50, 83.33].map((position, index) => (
              <div key={index}>
                <div
                  className="absolute top-8 w-2 h-2 bg-primary/80 rounded-full transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                />
                <div
                  className="absolute top-10 w-px h-6 bg-primary/40 transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                />
              </div>
            ))}
          </motion.div>

          {/* Clean Features */}
          <motion.div 
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group text-center px-6 py-4 hover:bg-primary/5 rounded-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-xl mb-4 group-hover:bg-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Simple separators */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-6 bottom-6 w-px bg-foreground/10" 
                       style={{ left: `${((index + 1) * 100/3)}%` }} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonFeature;
