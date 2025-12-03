
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpRight, Layers, User, Calendar, ArrowLeft } from 'lucide-react';
import { Project, Language } from '../types';

interface ProjectDetailProps {
  project: Project;
  lang: Language;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, lang, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-darkbg overflow-y-auto no-scrollbar"
    >
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-[101] flex justify-between items-center px-6 py-5 md:px-12 bg-white/90 dark:bg-darkbg/90 backdrop-blur-md border-b border-tech-200 dark:border-tech-800">
        <div className="flex items-center gap-4">
            <button 
                onClick={onClose}
                className="p-1 -ml-1 text-tech-500 dark:text-tech-400 hover:text-black dark:hover:text-neon transition-colors"
                aria-label="Back to Home"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="h-4 w-px bg-tech-200 dark:bg-tech-800 hidden md:block"></div>
            <div className="font-mono text-xs text-tech-500 dark:text-tech-400">
               {lang === 'zh' ? '项目详情' : 'PROJECT_DETAILS'}
               <span className="mx-2 text-tech-300 dark:text-tech-700">/</span>
               <span className="text-black dark:text-neon">{project.id.padStart(2, '0')}</span>
            </div>
        </div>
        
        <button 
          onClick={onClose}
          className="group flex items-center gap-2 font-mono text-xs font-bold text-tech-600 dark:text-tech-400 hover:text-black dark:hover:text-neon transition-colors"
        >
          <span>[ ESC ]</span>
          <span className="group-hover:rotate-90 transition-transform duration-300">
            <X size={16} />
          </span>
        </button>
      </div>

      <div className="pt-24 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Title Section */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
        >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black dark:text-white tracking-tighter">
                {lang === 'zh' ? project.title_zh : project.title}
            </h1>
            <p className="text-xl text-tech-500 dark:text-tech-400 max-w-2xl font-light">
                {lang === 'zh' ? project.description_zh : project.description}
            </p>
        </motion.div>

        {/* Info Grid - Geek Style */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 border-y border-tech-200 dark:border-tech-800 py-8 bg-tech-50/50 dark:bg-tech-900/20"
        >
            <div className="flex flex-col gap-2 p-4 border-l border-tech-200 dark:border-tech-800">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-tech-400 dark:text-tech-500 tracking-wider">
                    <User size={12} /> {lang === 'zh' ? '客户' : 'CLIENT'}
                </span>
                <span className="font-bold text-sm text-black dark:text-white">
                    {project.client || 'Confidential'}
                </span>
            </div>
            
            <div className="flex flex-col gap-2 p-4 border-l border-tech-200 dark:border-tech-800">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-tech-400 dark:text-tech-500 tracking-wider">
                    <Layers size={12} /> {lang === 'zh' ? '角色' : 'ROLE'}
                </span>
                <span className="font-bold text-sm text-black dark:text-white">
                    {lang === 'zh' ? project.role_zh : project.role}
                </span>
            </div>

            <div className="flex flex-col gap-2 p-4 border-l border-tech-200 dark:border-tech-800">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-tech-400 dark:text-tech-500 tracking-wider">
                    <Calendar size={12} /> {lang === 'zh' ? '年份' : 'YEAR'}
                </span>
                <span className="font-bold text-sm text-black dark:text-white">
                    {project.year}
                </span>
            </div>

            <div className="flex flex-col gap-2 p-4 border-l border-tech-200 dark:border-tech-800">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-tech-400 dark:text-tech-500 tracking-wider">
                    <ArrowUpRight size={12} /> {lang === 'zh' ? '链接' : 'LINK'}
                </span>
                <span className="font-bold text-sm text-black dark:text-white cursor-pointer hover:text-neon transition-colors">
                    {project.link ? 'Visit Live' : 'Offline'}
                </span>
            </div>
        </motion.div>

        {/* Main Image */}
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full aspect-video bg-tech-100 dark:bg-tech-900 rounded-sm overflow-hidden mb-12 border border-tech-200 dark:border-tech-800"
        >
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="md:col-span-8"
            >
                <h3 className="font-mono text-xs font-bold uppercase mb-6 text-black dark:text-neon border-b border-tech-200 dark:border-tech-800 pb-2 inline-block">
                    {lang === 'zh' ? '项目背景' : 'CONTEXT'}
                </h3>
                <p className="text-lg md:text-xl leading-relaxed text-tech-700 dark:text-tech-300 font-light">
                    {lang === 'zh' ? project.fullDescription_zh : project.fullDescription}
                </p>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="md:col-span-4"
            >
                <h3 className="font-mono text-xs font-bold uppercase mb-6 text-black dark:text-neon border-b border-tech-200 dark:border-tech-800 pb-2 inline-block">
                    {lang === 'zh' ? '技术栈' : 'TECH_STACK'}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {project.stack?.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-tech-100 dark:bg-tech-900 text-tech-800 dark:text-tech-300 text-xs font-mono border border-tech-200 dark:border-tech-700">
                            {tech}
                        </span>
                    )) || <span className="text-tech-400 text-sm">N/A</span>}
                </div>
            </motion.div>
        </div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-6">
                <div className="font-mono text-xs font-bold uppercase text-tech-400 mb-4">
                    {lang === 'zh' ? '画廊' : 'GALLERY_VIEW'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.gallery.map((img, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx }}
                            className="aspect-[4/3] bg-tech-100 dark:bg-tech-900 border border-tech-200 dark:border-tech-800 overflow-hidden"
                        >
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </motion.div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
