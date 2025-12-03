
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import { Project, Language } from '../types';

interface ProjectRowProps {
    project: Project;
    index: number;
    lang: Language;
    onSelect: (project: Project) => void;
}

// A technical row component
const ProjectRow: React.FC<ProjectRowProps> = ({ project, index, lang, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(project)}
      className="group relative border-b border-tech-200 dark:border-tech-800 last:border-0 hover:bg-white dark:hover:bg-tech-900 transition-colors duration-300"
    >
      {/* Decorative left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neon transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center py-8 px-4 md:px-6 cursor-pointer">
        
        {/* ID Column */}
        <div className="hidden md:block w-16 font-mono text-xs text-tech-400 dark:text-tech-600 group-hover:text-black dark:group-hover:text-neon transition-colors">
          {`0${index + 1}`}
        </div>

        {/* Thumbnail - Small & Technical */}
        <div className="w-full md:w-48 shrink-0 mb-4 md:mb-0 md:mr-8 overflow-hidden bg-tech-100 dark:bg-tech-900 border border-tech-200 dark:border-tech-800 group-hover:border-black dark:group-hover:border-neon/50 transition-colors">
           <div className="aspect-[3/2] relative">
              <motion.img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-black/10 dark:bg-black/40 group-hover:bg-transparent transition-colors" />
           </div>
        </div>

        {/* Info Column */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-center">
            <div className="md:col-span-5">
                <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-tech-600 dark:group-hover:text-neon transition-colors flex items-center gap-2">
                    {lang === 'zh' ? project.title_zh : project.title}
                </h3>
            </div>
            
            <div className="md:col-span-3">
                <span className="inline-block px-2 py-1 border border-tech-300 dark:border-tech-700 rounded-none font-mono text-[10px] uppercase text-tech-600 dark:text-tech-400 group-hover:border-black dark:group-hover:border-neon group-hover:text-black dark:group-hover:text-neon transition-colors">
                    {lang === 'zh' ? project.category_zh : project.category}
                </span>
            </div>

            <div className="md:col-span-3 md:text-right">
                <span className="font-mono text-xs text-tech-400 dark:text-tech-600">{project.year}</span>
            </div>

            <div className="md:col-span-1 flex justify-end">
                <div className="p-2 border border-transparent group-hover:border-tech-200 dark:group-hover:border-tech-700 rounded-full transition-all">
                    <ArrowUpRight className="w-5 h-5 text-tech-300 dark:text-tech-700 group-hover:text-black dark:group-hover:text-neon transition-colors transform group-hover:-translate-y-1 group-hover:translate-x-1 duration-300" />
                </div>
            </div>
        </div>
      </div>
      
      {/* Description Reveal on Hover (Desktop) */}
      <AnimatePresence>
        {isHovered && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="hidden md:block overflow-hidden bg-tech-50 dark:bg-black/50"
            >
                <div className="py-4 pl-[calc(12rem+4rem)] pr-12 grid grid-cols-12">
                    <p className="col-span-8 font-mono text-xs text-tech-500 dark:text-tech-400 leading-relaxed">
                        <span className="text-tech-400 dark:text-neon mr-2">{'>'}</span>
                        {lang === 'zh' ? project.description_zh : project.description}
                        <span className="ml-2 text-tech-300 dark:text-tech-600 underline decoration-dotted cursor-pointer hover:text-black dark:hover:text-white">
                            [{lang === 'zh' ? '点击查看详情' : 'CLICK_FOR_DETAILS'}]
                        </span>
                    </p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface PortfolioProps {
    lang: Language;
    projects: Project[];
    onSelectProject: (p: Project) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ lang, projects, onSelectProject }) => {
  return (
    <section id="works" className="py-24 px-6 md:px-12 bg-[#F8F8F8] dark:bg-darkbg transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                 <div className="inline-flex items-center gap-2 border border-black/10 dark:border-neon/30 px-3 py-1 rounded-full mb-4 bg-white dark:bg-neon/10 shadow-sm">
                    <Briefcase size={12} className="text-black dark:text-neon" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-black dark:text-neon">
                      {lang === 'zh' ? '商业项目' : 'Commercial_Projects'}
                    </span>
                </div>
                
                <div className="flex items-end justify-between pb-4 border-b-2 border-black dark:border-white/20">
                     <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-black dark:text-white">
                        {lang === 'zh' ? '精选作品' : 'SELECTED WORKS'}
                    </h2>
                    <div className="font-mono text-[10px] text-tech-400 dark:text-tech-600 hidden md:block">
                        INDEX: DIR_ROOT/WORKS
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectRow 
                key={project.id} 
                project={project} 
                index={index} 
                lang={lang} 
                onSelect={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
