import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 relative border-b border-tech-200 dark:border-tech-900 bg-grid transition-colors duration-300">
      
      {/* Decorative Technical Elements */}
      <div className="absolute top-32 right-12 font-mono text-[10px] text-tech-400 dark:text-tech-600 hidden md:block text-right leading-relaxed select-none">
        STATUS: ONLINE<br/>
        LOC: SHANGHAI (CN)<br/>
        LAT: 31.2304° N<br/>
        BUILD: V.2.1.0 (DARK_CORE)
      </div>

      <div className="max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-2 h-2 bg-green-500 dark:bg-neon rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)] dark:shadow-[0_0_10px_#00FF41]"></div>
          <span className="font-mono text-xs text-tech-500 dark:text-neon uppercase tracking-widest">
            {lang === 'zh' ? '系统就绪' : 'System Ready'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black dark:text-white leading-[1.1] mb-8"
        >
          {lang === 'zh' ? 'UI 工程师' : 'UI ENGINEER'} <span className="text-tech-300 dark:text-tech-700 font-normal">/</span><br />
          {lang === 'zh' ? '数字工匠' : 'DIGITAL CRAFTSMAN'}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl border-l-2 border-tech-200 dark:border-tech-800 pl-6"
        >
          <p className="font-mono text-xs text-tech-400 dark:text-tech-500 mb-2">{'//'} {lang === 'zh' ? '简介' : 'INTRO'}</p>
          <p className="text-base md:text-lg text-tech-700 dark:text-tech-200 leading-relaxed font-medium">
            {lang === 'zh' 
              ? '将复杂的逻辑转化为极简、实用的界面。我构建的数字产品注重清晰度、精确性和高性能。'
              : 'Translating complex logic into minimal, functional interfaces. I build digital products that prioritize clarity, precision, and performance.'}
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-6 md:left-12 flex items-center gap-4"
      >
        <div className="w-px h-12 bg-tech-300 dark:bg-tech-700"></div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-tech-500 dark:text-tech-500 uppercase tracking-widest">
          <ArrowDown className="w-3 h-3 text-tech-400 dark:text-neon" />
          <span>{lang === 'zh' ? '向下滚动' : 'Scroll_Down'}</span>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;