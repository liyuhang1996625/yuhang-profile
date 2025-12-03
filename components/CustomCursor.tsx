
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use MotionValues for high-performance updates directly to DOM
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for the trailing outer ring
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver); // Using mouseover for capturing bubbles

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Hide on mobile/touch devices
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      {/* Central Dot - No Delay */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-neon rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Outer Ring - Spring Delay */}
      <motion.div
        className="fixed top-0 left-0 border border-neon rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 40 : 20,
          height: isHovered ? 40 : 20,
          backgroundColor: isHovered ? 'rgba(0, 255, 65, 0.1)' : 'transparent',
          borderColor: isHovered ? '#00FF41' : 'rgba(0, 255, 65, 0.5)',
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28
        }}
      >
        {/* Crosshair accents when hovered */}
        <motion.div 
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute top-1/2 left-[-4px] w-[2px] h-[2px] bg-neon" 
        />
        <motion.div 
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute top-1/2 right-[-4px] w-[2px] h-[2px] bg-neon" 
        />
        <motion.div 
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute top-[-4px] left-1/2 w-[2px] h-[2px] bg-neon" 
        />
        <motion.div 
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute bottom-[-4px] left-1/2 w-[2px] h-[2px] bg-neon" 
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
