
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Project, Language } from '../types';

interface ProjectDetailProps {
  project: Project;
  lang: Language;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, lang, onClose }) => {
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
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-darkbg overflow-y-auto no-scrollbar"
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[101] flex justify-between items-center px-6 py-5 md:px-12 bg-white/90 dark:bg-darkbg/90 backdrop-blur-md border-b border-tech-200 dark:border-tech-800">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-1 text-tech-500 dark:text-tech-400 hover:text-black dark:hover:text-neon transition-colors"><ArrowLeft size={20} /></button>
            <div className="font-mono text-xs text-tech-500 dark:text-tech-400 hidden sm:block">
               {lang === 'zh' ? '作品详情' : 'PROJECT_DETAIL'} <span className="mx-2">/</span>
               <span className="text-black dark:text-white uppercase tracking-tighter">{lang === 'zh' ? project.title_zh : project.title}</span>
            </div>
        </div>
        <button onClick={onClose} className="font-mono text-xs font-bold text-tech-600 dark:text-tech-400 hover:text-black dark:hover:text-neon transition-colors">[ CLOSE ]</button>
      </div>

      <div className="pt-32 pb-32 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Intro */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-16">
            <div className="font-mono text-[10px] text-tech-400 dark:text-neon uppercase tracking-[0.2em] mb-4">
               {lang === 'zh' ? project.category_zh : project.category}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-black dark:text-white tracking-tighter leading-none">
                {lang === 'zh' ? project.title_zh : project.title}
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-tech-100 dark:border-tech-900">
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase text-tech-400 dark:text-tech-600">{lang === 'zh' ? '年份' : 'YEAR'}</span>
                    <span className="text-sm font-medium text-black dark:text-white">{project.year}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase text-tech-400 dark:text-tech-600">{lang === 'zh' ? '角色' : 'ROLE'}</span>
                    <span className="text-sm font-medium text-black dark:text-white">{lang === 'zh' ? project.role_zh || 'UI设计' : project.role || 'UI Design'}</span>
                </div>
                {project.link && (
                    <div className="col-span-2 flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase text-tech-400 dark:text-tech-600">{lang === 'zh' ? '链接' : 'LINK'}</span>
                        <a href={project.link} target="_blank" className="text-sm font-medium text-black dark:text-white hover:text-neon flex items-center gap-1 transition-colors">
                            {project.link.replace(/^https?:\/\//, '')} <ArrowUpRight size={12} />
                        </a>
                    </div>
                )}
            </div>
        </motion.div>

        {/* Flexible Content Blocks */}
        <div className="space-y-20">
            {project.contentBlocks && project.contentBlocks.length > 0 ? (
                project.contentBlocks.map((block, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        {block.type === 'text' ? (
                            <div className="max-w-2xl">
                                <p className="text-lg md:text-xl leading-relaxed text-tech-800 dark:text-tech-200 font-light">
                                    {lang === 'zh' ? block.value_zh : block.value}
                                </p>
                            </div>
                        ) : (
                            <div className="group">
                                <div className="bg-tech-50 dark:bg-tech-900 border border-tech-100 dark:border-tech-800 overflow-hidden">
                                    <img src={block.value} alt={`Block ${idx}`} className="w-full h-auto object-cover" />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <span className="font-mono text-[9px] text-tech-300 dark:text-tech-700 tracking-widest uppercase">{`ASSET_REF_0${idx + 1}`}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-tech-100 dark:border-tech-900 text-tech-400 font-mono text-sm">
                    {lang === 'zh' ? '暂无项目详情内容' : 'CONTENT_NOT_FOUND'}
                </div>
            )}
        </div>

        {/* Bottom Nav */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-40 pt-16 border-t border-tech-100 dark:border-tech-900 text-center">
            <button onClick={onClose} className="group inline-flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-tech-200 dark:border-tech-800 flex items-center justify-center group-hover:bg-neon group-hover:border-neon transition-all duration-300">
                    <ArrowLeft size={18} className="group-hover:text-black transition-colors" />
                </div>
                <span className="font-mono text-[10px] text-tech-400 group-hover:text-neon uppercase tracking-widest">
                   {lang === 'zh' ? '返回列表' : 'BACK_TO_HOME'}
                </span>
            </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
