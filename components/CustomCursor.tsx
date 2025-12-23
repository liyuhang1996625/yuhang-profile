
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // 极高响应性的弹簧配置：质量极小，刚度极大，阻尼适中
  // 这会产生一种既有物理柔顺感又极度贴合鼠标轨迹的效果
  const springConfig = { damping: 40, stiffness: 1500, mass: 0.05 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Use !! to ensure isPointer is a boolean, as .closest() returns an Element or null
      const isPointer = !!(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );
      
      setIsHovered(isPointer);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  // 移动端不渲染自定义鼠标
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      {/* 核心原点：直接使用 MotionValue，不经过弹簧，实现 0 延迟绝对跟手 */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-neon rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* 外部光圈：使用极速弹簧，提供敏捷的视觉反馈 */}
      <motion.div
        className="fixed top-0 left-0 border border-neon/40 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
        }}
        animate={{
          backgroundColor: isHovered ? 'rgba(0, 255, 65, 0.1)' : 'rgba(0, 255, 65, 0)',
          borderColor: isHovered ? 'rgba(0, 255, 65, 0.8)' : 'rgba(0, 255, 65, 0.3)',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;
