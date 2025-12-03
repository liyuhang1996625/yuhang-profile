
import React from 'react';
import { Mail, FileText, Lock, ArrowUpRight } from 'lucide-react';
import { Language, ContactInfo } from '../types';

interface FooterProps {
    lang: Language;
    contactInfo: ContactInfo;
    onOpenAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ lang, contactInfo, onOpenAdmin }) => {
  
  const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const url = contactInfo.resumeUrl;
    
    // Check if it's a Base64 PDF
    if (url && url.startsWith('data:application/pdf')) {
      e.preventDefault(); // Stop default browser behavior which blocks data: URIs
      
      try {
        // Convert Base64 to Blob
        const base64Data = url.split(',')[1];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        // Create Blob URL and open it
        const blobUrl = URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, '_blank');
        
        // Clean up memory after a short delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        
        if (!newWindow) {
          alert(lang === 'zh' ? '请允许弹出窗口以查看简历' : 'Please allow popups to view the resume');
        }
      } catch (err) {
        console.error("Error opening PDF:", err);
        alert(lang === 'zh' ? '无法打开 PDF 文件' : 'Could not open PDF file');
      }
    }
    // If it's a normal URL (http/https), let the <a> tag handle it naturally
  };

  return (
    <footer className="bg-white dark:bg-darkbg py-12 px-6 md:px-12 border-t border-tech-200 dark:border-tech-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
                <div className="font-mono text-xs text-tech-400 mb-4">{'//'} {lang === 'zh' ? '联系' : 'CONTACT'}</div>
                <p className="text-xl md:text-3xl font-bold tracking-tight mb-2 text-black dark:text-white">
                  {lang === 'zh' ? contactInfo.tagline_zh : contactInfo.tagline}
                </p>
                <a href={`mailto:${contactInfo.email}`} className="text-tech-500 hover:text-black dark:text-tech-400 dark:hover:text-neon hover:underline underline-offset-4 decoration-1 transition-all">
                    {contactInfo.email}
                </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <a 
                    href={`mailto:${contactInfo.email}`}
                    className="h-12 px-6 flex items-center justify-center gap-2 border border-tech-200 dark:border-tech-800 text-tech-600 dark:text-tech-400 hover:bg-black dark:hover:bg-neon hover:border-black dark:hover:border-neon hover:text-white dark:hover:text-black transition-all duration-300 font-mono text-xs"
                >
                    <Mail size={14} />
                    <span>{lang === 'zh' ? '发送邮件' : 'SEND_EMAIL'}</span>
                </a>
                
                <a 
                    href={contactInfo.resumeUrl || '#'} 
                    onClick={handleResumeClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group h-12 px-6 flex items-center justify-center gap-2 bg-black dark:bg-tech-900 text-white hover:bg-neon hover:text-black border border-transparent dark:border-tech-700 transition-all duration-300 font-mono text-xs tracking-wider ${!contactInfo.resumeUrl ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                    <FileText size={14} />
                    <span>{lang === 'zh' ? '查看简历' : 'VIEW_RESUME'}</span>
                    <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
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
