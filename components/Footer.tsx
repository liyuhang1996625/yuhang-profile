
import React from 'react';
import { Mail, Linkedin, Twitter, Lock } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
    lang: Language;
    onOpenAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  return (
    <footer className="bg-white dark:bg-darkbg py-12 px-6 md:px-12 border-t border-tech-200 dark:border-tech-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
                <div className="font-mono text-xs text-tech-400 mb-4">{'//'} {lang === 'zh' ? '联系' : 'CONTACT'}</div>
                <p className="text-xl md:text-3xl font-bold tracking-tight mb-2 text-black dark:text-white">
                  {lang === 'zh' ? '一起来构建些什么。' : "Let's build something."}
                </p>
                <a href="mailto:hello@yuhang.design" className="text-tech-500 hover:text-black dark:text-tech-400 dark:hover:text-neon hover:underline underline-offset-4 decoration-1 transition-all">
                    hello@yuhang.design
                </a>
            </div>
            
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center border border-tech-200 dark:border-tech-800 text-tech-600 dark:text-tech-400 hover:bg-black dark:hover:bg-neon hover:border-black dark:hover:border-neon hover:text-white dark:hover:text-black transition-all duration-300">
                    <Mail size={16} />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center border border-tech-200 dark:border-tech-800 text-tech-600 dark:text-tech-400 hover:bg-black dark:hover:bg-neon hover:border-black dark:hover:border-neon hover:text-white dark:hover:text-black transition-all duration-300">
                    <Linkedin size={16} />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center border border-tech-200 dark:border-tech-800 text-tech-600 dark:text-tech-400 hover:bg-black dark:hover:bg-neon hover:border-black dark:hover:border-neon hover:text-white dark:hover:text-black transition-all duration-300">
                    <Twitter size={16} />
                </a>
            </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-tech-100 dark:border-tech-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-tech-400 dark:text-tech-600 uppercase tracking-wider">
            <div>
                © {new Date().getFullYear()} yuhang profile.
            </div>
            <div className="flex items-center gap-6 mt-2 md:mt-0">
                <span>Designed & Engineered with React</span>
                <button 
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 opacity-50 hover:opacity-100 hover:text-neon transition-opacity"
                >
                  <Lock size={10} />
                  <span>ADMIN_ROOT</span>
                </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
