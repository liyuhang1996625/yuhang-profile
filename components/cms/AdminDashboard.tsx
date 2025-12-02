
import React, { useState } from 'react';
import { Project, Language } from '../../types';
import { Save, Plus, Trash2, X, Download, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  projects: Project[];
  experiments: Project[];
  onSave: (projects: Project[], experiments: Project[]) => void;
  onClose: () => void;
  lang: Language;
}

const ProjectEditor: React.FC<{ 
    project: Project; 
    onChange: (p: Project) => void; 
    onDelete: () => void 
}> = ({ project, onChange, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (field: keyof Project, value: any) => {
        onChange({ ...project, [field]: value });
    };

    const handleArrayChange = (field: 'stack' | 'gallery', value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        onChange({ ...project, [field]: arr });
    };

    return (
        <div className="border border-tech-800 bg-tech-900/50 mb-4 rounded-sm overflow-hidden">
            <div 
                className="flex items-center justify-between p-3 bg-tech-900 cursor-pointer hover:bg-tech-800 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neon"></div>
                    <span className="font-mono text-xs font-bold text-white">{project.title || 'UNTITLED_PROJECT'}</span>
                    <span className="font-mono text-[10px] text-tech-500 uppercase">{project.id}</span>
                </div>
                <div className="text-tech-500 text-xs font-mono">{expanded ? '[-]' : '[+]'}</div>
            </div>

            {expanded && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-1 md:col-span-2 flex justify-end">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="text-red-500 text-xs font-mono hover:underline flex items-center gap-1"
                        >
                            <Trash2 size={12} /> DELETE_ENTRY
                        </button>
                    </div>

                    <Input label="ID" value={project.id} onChange={(v) => handleChange('id', v)} />
                    <Input label="Year" value={project.year} onChange={(v) => handleChange('year', v)} />
                    
                    <Input label="Title (EN)" value={project.title} onChange={(v) => handleChange('title', v)} />
                    <Input label="Title (ZH)" value={project.title_zh} onChange={(v) => handleChange('title_zh', v)} />
                    
                    <Input label="Category (EN)" value={project.category} onChange={(v) => handleChange('category', v)} />
                    <Input label="Category (ZH)" value={project.category_zh} onChange={(v) => handleChange('category_zh', v)} />

                    <div className="col-span-1 md:col-span-2">
                        <Input label="Image URL" value={project.imageUrl} onChange={(v) => handleChange('imageUrl', v)} />
                    </div>

                    <TextArea label="Short Desc (EN)" value={project.description} onChange={(v) => handleChange('description', v)} />
                    <TextArea label="Short Desc (ZH)" value={project.description_zh} onChange={(v) => handleChange('description_zh', v)} />

                    {/* Extended Details */}
                    <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-tech-800">
                        <span className="text-neon font-mono text-xs mb-4 block">{'// EXTENDED_DETAILS'}</span>
                    </div>

                    <Input label="Role (EN)" value={project.role || ''} onChange={(v) => handleChange('role', v)} />
                    <Input label="Role (ZH)" value={project.role_zh || ''} onChange={(v) => handleChange('role_zh', v)} />
                    
                    <Input label="Client" value={project.client || ''} onChange={(v) => handleChange('client', v)} />
                    <Input label="Link" value={project.link || ''} onChange={(v) => handleChange('link', v)} />

                    <div className="col-span-1 md:col-span-2">
                         <Input 
                            label="Tech Stack (comma separated)" 
                            value={project.stack?.join(', ') || ''} 
                            onChange={(v) => handleArrayChange('stack', v)} 
                        />
                    </div>

                    <TextArea label="Full Desc (EN)" value={project.fullDescription || ''} onChange={(v) => handleChange('fullDescription', v)} />
                    <TextArea label="Full Desc (ZH)" value={project.fullDescription_zh || ''} onChange={(v) => handleChange('fullDescription_zh', v)} />
                    
                    <div className="col-span-1 md:col-span-2">
                        <TextArea 
                             label="Gallery URLs (comma separated)" 
                             value={project.gallery?.join(',\n') || ''} 
                             onChange={(v) => handleArrayChange('gallery', v)} 
                             rows={4}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] text-tech-500 uppercase">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="bg-black border border-tech-700 text-white font-mono text-xs p-2 focus:border-neon focus:outline-none transition-colors"
        />
    </div>
);

const TextArea = ({ label, value, onChange, rows = 2 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) => (
    <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] text-tech-500 uppercase">{label}</label>
        <textarea 
            rows={rows}
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="bg-black border border-tech-700 text-white font-mono text-xs p-2 focus:border-neon focus:outline-none transition-colors resize-y"
        />
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, experiments, onSave, onClose }) => {
    const [localProjects, setLocalProjects] = useState<Project[]>(projects);
    const [localExperiments, setLocalExperiments] = useState<Project[]>(experiments);
    const [activeTab, setActiveTab] = useState<'works' | 'labs'>('works');

    const handleProjectChange = (index: number, newData: Project) => {
        const updated = [...localProjects];
        updated[index] = newData;
        setLocalProjects(updated);
    };

    const handleDeleteProject = (index: number) => {
        if(window.confirm('CONFIRM DELETION?')) {
            const updated = localProjects.filter((_, i) => i !== index);
            setLocalProjects(updated);
        }
    };

    const handleAddProject = () => {
        const newProject: Project = {
            id: (localProjects.length + 1).toString(),
            title: 'New Project',
            title_zh: '新项目',
            category: 'Category',
            category_zh: '类别',
            description: 'Description',
            description_zh: '描述',
            imageUrl: 'https://picsum.photos/800/600',
            year: new Date().getFullYear().toString()
        };
        setLocalProjects([...localProjects, newProject]);
    };

    // Similar handlers for experiments (simplified for brevity, assume similar logic or share component)
     const handleExpChange = (index: number, newData: Project) => {
        const updated = [...localExperiments];
        updated[index] = newData;
        setLocalExperiments(updated);
    };

    const handleDeleteExp = (index: number) => {
         if(window.confirm('CONFIRM DELETION?')) {
            const updated = localExperiments.filter((_, i) => i !== index);
            setLocalExperiments(updated);
         }
    };
    
    const handleAddExp = () => {
        const newExp: Project = {
            id: `e${localExperiments.length + 1}`,
            title: 'New Experiment',
            title_zh: '新实验',
            category: 'Experiment',
            category_zh: '实验',
            description: 'Description',
            description_zh: '描述',
            imageUrl: 'https://picsum.photos/600/600',
            year: new Date().getFullYear().toString()
        };
        setLocalExperiments([...localExperiments, newExp]);
    };


    const generateCode = () => {
        const code = `
import { Project, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', label_zh: '关于', href: '#about' },
  { id: 'works', label: 'Works', label_zh: '作品', href: '#works' },
  { id: 'playground', label: 'Playground', label_zh: '实验', href: '#playground' },
];

export const PORTFOLIO_PROJECTS: Project[] = ${JSON.stringify(localProjects, null, 2)};

export const EXPERIMENTAL_PROJECTS: Project[] = ${JSON.stringify(localExperiments, null, 2)};
        `;
        
        navigator.clipboard.writeText(code);
        alert('CODE COPIED TO CLIPBOARD. \nPaste into constants.ts to deploy.');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] text-white overflow-hidden flex flex-col font-mono">
            {/* Header */}
            <div className="h-14 border-b border-tech-800 flex items-center justify-between px-6 bg-black">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-neon rounded-full animate-pulse"></div>
                    <span className="font-bold tracking-widest text-neon">YUHANG_CMS</span>
                    <span className="text-tech-600 text-xs">V.1.0</span>
                </div>
                <div className="flex items-center gap-4">
                     <button 
                        onClick={() => {
                            if(window.confirm('Reset all changes to default?')) {
                                localStorage.removeItem('portfolio_data');
                                window.location.reload();
                            }
                        }}
                        className="flex items-center gap-2 text-xs text-tech-500 hover:text-red-500 transition-colors mr-4"
                    >
                        <RotateCcw size={14} /> RESET_DB
                    </button>
                    <button 
                        onClick={() => onClose()}
                        className="hover:text-neon transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r border-tech-800 bg-tech-900/20 p-4 flex flex-col gap-2">
                    <div className="text-[10px] text-tech-600 uppercase mb-2 font-bold">Tables</div>
                    <button 
                        onClick={() => setActiveTab('works')}
                        className={`text-left px-3 py-2 text-xs border-l-2 ${activeTab === 'works' ? 'border-neon bg-neon/10 text-white' : 'border-transparent text-tech-500 hover:text-white'} transition-all`}
                    >
                        TBL_WORKS
                    </button>
                    <button 
                         onClick={() => setActiveTab('labs')}
                         className={`text-left px-3 py-2 text-xs border-l-2 ${activeTab === 'labs' ? 'border-neon bg-neon/10 text-white' : 'border-transparent text-tech-500 hover:text-white'} transition-all`}
                    >
                        TBL_LABS
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-grid">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-neon">{'>'}</span> 
                                {activeTab === 'works' ? 'EDITING: PORTFOLIO_PROJECTS' : 'EDITING: EXPERIMENTAL_PROJECTS'}
                             </h2>
                             <button 
                                onClick={activeTab === 'works' ? handleAddProject : handleAddExp}
                                className="flex items-center gap-2 bg-tech-800 hover:bg-neon hover:text-black px-4 py-2 text-xs font-bold transition-colors border border-tech-700"
                             >
                                <Plus size={14} /> ADD_ENTRY
                             </button>
                        </div>

                        <div>
                            {activeTab === 'works' ? (
                                localProjects.map((p, i) => (
                                    <ProjectEditor 
                                        key={p.id + i} 
                                        project={p} 
                                        onChange={(newData) => handleProjectChange(i, newData)}
                                        onDelete={() => handleDeleteProject(i)}
                                    />
                                ))
                            ) : (
                                localExperiments.map((p, i) => (
                                    <ProjectEditor 
                                        key={p.id + i} 
                                        project={p} 
                                        onChange={(newData) => handleExpChange(i, newData)}
                                        onDelete={() => handleDeleteExp(i)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="h-16 border-t border-tech-800 bg-black flex items-center justify-between px-8">
                 <div className="text-[10px] text-tech-500">
                    STATUS: UNCOMMITTED CHANGES PRESENT
                 </div>
                 <div className="flex gap-4">
                    <button 
                        onClick={generateCode}
                        className="flex items-center gap-2 px-6 py-2 border border-tech-600 text-tech-400 hover:border-white hover:text-white text-xs font-bold transition-all"
                    >
                        <Download size={14} /> EXPORT CODE (CONSTANTS.TS)
                    </button>
                    
                    <button 
                        onClick={() => onSave(localProjects, localExperiments)}
                        className="flex items-center gap-2 px-6 py-2 bg-neon text-black hover:bg-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                    >
                        <Save size={14} /> SAVE & APPLY LOCAL
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
