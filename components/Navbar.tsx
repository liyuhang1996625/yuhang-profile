import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Language, Theme } from '../types';
import { Sun, Moon, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  lang: Language;
  theme: Theme;
  toggleTheme: () => void;
  toggleLang: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, theme, toggleTheme, toggleLang }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 md:px-12 backdrop-blur-md bg-white/70 dark:bg-darkbg/80 border-b border-tech-200 dark:border-tech-800 transition-colors duration-300">
      <div 
        className="font-mono text-xs font-bold uppercase tracking-wider cursor-pointer select-none text-black dark:text-white hover:text-neon transition-colors" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        [ yuhang profile ]
      </div>
      
      <div className="flex items-center gap-8">
        <ul className="hidden md:flex gap-8">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a 
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="font-mono text-xs text-tech-500 dark:text-tech-400 hover:text-black dark:hover:text-neon transition-colors relative group"
              >
                <span className="opacity-0 group-hover:opacity-100 mr-1 transition-opacity duration-200 text-tech-400 dark:text-neon">{'//'}</span>
                {`0${i+1}_${lang === 'zh' ? item.label_zh : item.label}`}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 pl-4 border-l border-tech-200 dark:border-tech-800">
          <button 
            onClick={toggleLang}
            className="font-mono text-[10px] font-bold text-tech-600 dark:text-tech-400 hover:text-black dark:hover:text-neon flex items-center gap-1 transition-colors"
          >
            <Globe size={12} />
            <span>{lang === 'en' ? 'EN' : '中'}</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="text-tech-600 dark:text-tech-400 hover:text-black dark:hover:text-neon transition-colors"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;