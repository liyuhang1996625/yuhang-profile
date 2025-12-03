
import React from 'react';
import { motion } from 'framer-motion';
import { Project, Language } from '../types';
import { Terminal, Cpu } from 'lucide-react';

interface ExperimentCardProps {
    project: Project;
    index: number;
    lang: Language;
    onClick: () => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({ project, index, lang, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative bg-[#111] dark:bg-tech-900/40 border border-white/10 dark:border-tech-800 p-4 hover:border-white/30 dark:hover:border-neon/50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-2">
        <div className="font-mono text-[10px] text-white/40 dark:text-tech-500">{`EXP_${project.id.toUpperCase()}`}</div>
        <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-green-500 dark:group-hover:bg-neon transition-colors shadow-[0_0_0_0_rgba(255,255,255,0)] dark:group-hover:shadow-[0_0_8px_#00FF41]"></div>
      </div>
      
      <div className="aspect-square bg-black overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/5">
        <img 
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
        />
      </div>

      <div>
        <h4 className="text-white font-mono text-sm font-bold truncate group-hover:text-white dark:group-hover:text-neon transition-colors">
          {lang === 'zh' ? project.title_zh : project.title}
        </h4>
        <p className="text-white/40 text-xs mt-2 font-mono h-8 leading-tight overflow-hidden">
            {`> ${lang === 'zh' ? project.description_zh : project.description}`}
        </p>
      </div>
    </motion.div>
  );
};

interface ExperimentsProps {
    lang: Language;
    projects: Project[];
    onSelectProject: (p: Project) => void;
}

const Experiments: React.FC<ExperimentsProps> = ({ lang, projects, onSelectProject }) => {
  return (
    <section id="playground" className="py-24 px-6 md:px-12 bg-black dark:bg-[#0a0a0a] text-white border-t border-tech-800 dark:border-tech-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="inline-flex items-center gap-2 border border-white/20 dark:border-neon/30 px-3 py-1 rounded-full mb-4 bg-white/5 dark:bg-neon/10">
                    <Terminal size={12} className="text-white dark:text-neon" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white dark:text-neon">
                      {lang === 'zh' ? '实验性项目' : 'Playground'}
                    </span>
                </div>
                
                <div className="flex items-end justify-between pb-4 border-b-2 border-white/20 dark:border-white/20">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                        {lang === 'zh' ? '想法与探索' : 'LABS & PROTOTYPES'}
                    </h2>
                    <div className="font-mono text-[10px] text-white/40 dark:text-tech-600 hidden md:block text-right">
                        INDEX: DIR_ROOT/LABS
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {projects.map((project, index) => (
                <ExperimentCard 
                    key={project.id} 
                    project={project} 
                    index={index} 
                    lang={lang} 
                    onClick={() => onSelectProject(project)}
                />
            ))}
            
            {/* Placeholder for "Coming Soon" to complete the grid */}
            <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="group flex flex-col items-center justify-center border border-white/5 border-dashed bg-white/[0.02] hover:bg-white/[0.05] dark:hover:bg-neon/5 dark:hover:border-neon/50 transition-all cursor-pointer min-h-[200px]"
            >
                <Cpu 
                    size={24} 
                    className="text-white/20 dark:text-neon/50 mb-2 group-hover:text-white dark:group-hover:text-neon transition-all duration-500 group-hover:rotate-180" 
                />
                <span className="font-mono text-xs text-white/30 dark:text-neon/50 group-hover:text-white dark:group-hover:text-neon group-hover:tracking-[0.2em] transition-all duration-300">
                  {lang === 'zh' ? '敬请期待' : 'COMING_SOON'}
                </span>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experiments;
