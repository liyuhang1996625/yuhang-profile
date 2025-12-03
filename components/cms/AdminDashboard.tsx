
import React, { useState, useRef } from 'react';
import { Project, Language, ContactInfo } from '../../types';
import { Save, Plus, Trash2, X, Download, RotateCcw, Upload, Image as ImageIcon, ChevronUp, ChevronDown, Eye, Settings, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  projects: Project[];
  experiments: Project[];
  contactInfo: ContactInfo;
  onSave: (projects: Project[], experiments: Project[], contactInfo: ContactInfo) => void;
  onClose: () => void;
  lang: Language;
}

// --- Helper Components ---

const ImageUploadControl = ({ 
    label, 
    value, 
    onChange 
}: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (limit to ~1MB for performance check)
            if (file.size > 1024 * 1024) {
                alert("WARNING: Image is larger than 1MB. This might slow down your editor since data is stored locally. Recommend compressing first.");
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onChange(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-tech-500 uppercase">{label}</label>
            <div className="flex gap-2 items-start">
                <div className="flex-1 relative group">
                    <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://... or data:image/..."
                        className="w-full bg-black border border-tech-700 text-white font-mono text-xs p-2 pl-8 focus:border-neon focus:outline-none transition-colors truncate"
                    />
                    <div className="absolute left-2 top-2 text-tech-500">
                        <ImageIcon size={14} />
                    </div>
                    {/* Hover Preview for URL text input */}
                    {value && (
                         <div className="absolute right-2 top-2 z-10 hidden group-hover:block">
                            <div className="fixed w-48 h-auto bg-black border border-tech-600 p-1 shadow-2xl translate-y-2 -translate-x-full pointer-events-none">
                                <img src={value} alt="Preview" className="w-full h-auto" />
                            </div>
                         </div>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 bg-tech-800 hover:bg-tech-700 text-white px-3 py-2 border border-tech-600 transition-colors"
                    title="Upload Local Image"
                >
                    <Upload size={14} />
                </button>
            </div>
            {value && (
                <div className="mt-2 w-full bg-tech-900/50 border border-tech-800 relative group">
                    <img 
                        src={value} 
                        alt="Preview" 
                        className="w-full h-auto max-h-[500px] object-contain block mx-auto" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-white pointer-events-none">
                        PREVIEW (ORIGINAL RATIO)
                    </div>
                </div>
            )}
        </div>
    );
};

const FileUploadControl = ({ 
    label, 
    value, 
    onChange 
}: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        // 3MB limit for PDF to avoid immediate localStorage crash (though 5MB is total limit)
        if (file.size > 3 * 1024 * 1024) {
            alert("WARNING: File is larger than 3MB. Browser LocalStorage has a strict 5MB limit. Please compress your PDF or use an external URL.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                onChange(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-tech-500 uppercase">{label}</label>
            <div 
                className={`flex gap-2 items-start p-2 border border-dashed transition-colors ${
                    isDragging ? 'border-neon bg-neon/10' : 'border-transparent'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex-1 relative group">
                    <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://... or Drag PDF here"
                        className="w-full bg-black border border-tech-700 text-white font-mono text-xs p-2 pl-8 focus:border-neon focus:outline-none transition-colors truncate"
                    />
                    <div className="absolute left-2 top-2 text-tech-500">
                        <FileText size={14} />
                    </div>
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="application/pdf" 
                    onChange={handleFileChange} 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 bg-tech-800 hover:bg-tech-700 text-white px-3 py-2 border border-tech-600 transition-colors shrink-0"
                    title="Upload Local PDF"
                >
                    <Upload size={14} />
                </button>
            </div>
            {value.startsWith('data:application/pdf') && (
                 <div className="text-[10px] text-neon font-mono flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-neon rounded-full animate-pulse"></div>
                    PDF LOADED (Base64)
                 </div>
            )}
        </div>
    );
};

const GalleryEditor = ({ 
    images, 
    onChange 
}: { 
    images: string[], 
    onChange: (imgs: string[]) => void 
}) => {
    const handleAdd = () => onChange([...images, '']);
    const handleUpdate = (idx: number, val: string) => {
        const newImages = [...images];
        newImages[idx] = val;
        onChange(newImages);
    };
    const handleRemove = (idx: number) => {
        const newImages = [...images];
        newImages.splice(idx, 1);
        onChange(newImages);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] text-tech-500 uppercase flex justify-between items-center">
                <span>GALLERY IMAGES ({images.length})</span>
                <button onClick={handleAdd} className="text-neon hover:underline flex items-center gap-1">
                    <Plus size={10} /> ADD IMAGE
                </button>
            </label>
            <div className="space-y-3">
                {images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-start animate-in fade-in duration-200">
                        <div className="font-mono text-xs text-tech-600 py-2 w-4">#{idx+1}</div>
                        <div className="flex-1">
                             <ImageUploadControl 
                                label="" 
                                value={img} 
                                onChange={(val) => handleUpdate(idx, val)} 
                             />
                        </div>
                        <button 
                            onClick={() => handleRemove(idx)}
                            className="mt-2 p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                {images.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-tech-800 text-tech-600 text-xs font-mono">
                        NO IMAGES IN GALLERY
                    </div>
                )}
            </div>
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

// --- Main Editor Component ---

const ProjectEditor: React.FC<{ 
    project: Project; 
    onChange: (p: Project) => void; 
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}> = ({ project, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (field: keyof Project, value: any) => {
        onChange({ ...project, [field]: value });
    };

    const handleStackChange = (value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        onChange({ ...project, stack: arr });
    };

    return (
        <div className={`border mb-4 rounded-sm overflow-hidden transition-all duration-300 ${expanded ? 'border-neon bg-black' : 'border-tech-800 bg-tech-900/30'}`}>
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-tech-800/50 transition-colors select-none"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${expanded ? 'bg-neon shadow-[0_0_8px_#00FF41]' : 'bg-tech-600'}`}></div>
                    
                    {/* Thumbnail Preview in Header */}
                    <div className="w-8 h-6 bg-tech-800 overflow-hidden border border-tech-700">
                        {project.imageUrl ? (
                             <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-[8px] text-tech-600">NO IMG</div>
                        )}
                    </div>

                    <div>
                        <div className="font-mono text-xs font-bold text-white">{project.title || 'UNTITLED'}</div>
                        <div className="font-mono text-[10px] text-tech-500 uppercase">{project.id} | {project.category}</div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={onMoveUp} 
                        disabled={isFirst}
                        className="p-1 hover:text-neon disabled:opacity-30 disabled:hover:text-current transition-colors"
                    >
                        <ChevronUp size={14} />
                    </button>
                    <button 
                        onClick={onMoveDown} 
                        disabled={isLast}
                        className="p-1 hover:text-neon disabled:opacity-30 disabled:hover:text-current transition-colors"
                    >
                        <ChevronDown size={14} />
                    </button>
                    <div className="w-px h-4 bg-tech-700 mx-1"></div>
                    <div className="text-tech-500 text-xs font-mono w-4 text-center">{expanded ? '-' : '+'}</div>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-tech-800"
                    >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Action Bar */}
                            <div className="col-span-1 md:col-span-2 flex justify-between items-center border-b border-tech-800 pb-4 mb-2">
                                <span className="text-neon font-mono text-xs">{'// EDIT_MODE'}</span>
                                <button 
                                    onClick={onDelete}
                                    className="text-red-500 text-xs font-mono hover:bg-red-500/10 px-2 py-1 rounded flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={12} /> DELETE_ENTRY
                                </button>
                            </div>

                            {/* Basic Info */}
                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                                <Input label="ID" value={project.id} onChange={(v) => handleChange('id', v)} />
                                <Input label="Year" value={project.year} onChange={(v) => handleChange('year', v)} />
                            </div>
                            
                            <Input label="Title (English)" value={project.title} onChange={(v) => handleChange('title', v)} />
                            <Input label="Title (Chinese)" value={project.title_zh} onChange={(v) => handleChange('title_zh', v)} />
                            
                            <Input label="Category (EN)" value={project.category} onChange={(v) => handleChange('category', v)} />
                            <Input label="Category (ZH)" value={project.category_zh} onChange={(v) => handleChange('category_zh', v)} />

                            {/* Cover Image */}
                            <div className="col-span-1 md:col-span-2 p-4 border border-dashed border-tech-700 rounded bg-tech-900/20">
                                <div className="mb-2 font-bold text-xs text-white">COVER IMAGE</div>
                                <ImageUploadControl 
                                    label="Cover Image URL or Upload" 
                                    value={project.imageUrl} 
                                    onChange={(v) => handleChange('imageUrl', v)} 
                                />
                            </div>

                            <TextArea label="Short Description (EN)" value={project.description} onChange={(v) => handleChange('description', v)} />
                            <TextArea label="Short Description (ZH)" value={project.description_zh} onChange={(v) => handleChange('description_zh', v)} />

                            {/* Details Section */}
                            <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-tech-800">
                                <span className="text-neon font-mono text-xs mb-4 block flex items-center gap-2">
                                    <Eye size={12} /> {'// EXTENDED_DETAILS (Detail View)'}
                                </span>
                            </div>

                            <Input label="Role (EN)" value={project.role || ''} onChange={(v) => handleChange('role', v)} />
                            <Input label="Role (ZH)" value={project.role_zh || ''} onChange={(v) => handleChange('role_zh', v)} />
                            
                            <Input label="Client" value={project.client || ''} onChange={(v) => handleChange('client', v)} />
                            <Input label="External Link" value={project.link || ''} onChange={(v) => handleChange('link', v)} />

                            <div className="col-span-1 md:col-span-2">
                                 <Input 
                                    label="Tech Stack (comma separated, e.g. React, Figma)" 
                                    value={project.stack?.join(', ') || ''} 
                                    onChange={(v) => handleStackChange(v)} 
                                />
                            </div>

                            <TextArea label="Full Description (EN)" value={project.fullDescription || ''} onChange={(v) => handleChange('fullDescription', v)} rows={4} />
                            <TextArea label="Full Description (ZH)" value={project.fullDescription_zh || ''} onChange={(v) => handleChange('fullDescription_zh', v)} rows={4} />
                            
                            {/* Gallery Editor */}
                            <div className="col-span-1 md:col-span-2 p-4 border border-tech-800 bg-tech-900/20 mt-2">
                                <GalleryEditor 
                                    images={project.gallery || []} 
                                    onChange={(imgs) => handleChange('gallery', imgs)} 
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, experiments, contactInfo, onSave, onClose }) => {
    const [localProjects, setLocalProjects] = useState<Project[]>(projects);
    const [localExperiments, setLocalExperiments] = useState<Project[]>(experiments);
    const [localContactInfo, setLocalContactInfo] = useState<ContactInfo>(contactInfo);
    const [activeTab, setActiveTab] = useState<'works' | 'labs' | 'settings'>('works');

    // Generic Handlers
    const updateList = (list: Project[], index: number, newData: Project) => {
        const updated = [...list];
        updated[index] = newData;
        return updated;
    };

    const moveItem = (list: Project[], index: number, direction: 'up' | 'down') => {
        const updated = [...list];
        if (direction === 'up' && index > 0) {
            [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
        } else if (direction === 'down' && index < list.length - 1) {
            [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        }
        return updated;
    };

    // Projects Handlers
    const handleProjectChange = (index: number, newData: Project) => setLocalProjects(updateList(localProjects, index, newData));
    const handleProjectMove = (index: number, dir: 'up' | 'down') => setLocalProjects(moveItem(localProjects, index, dir));
    const handleDeleteProject = (index: number) => {
        if(window.confirm('CONFIRM DELETION?')) {
            setLocalProjects(localProjects.filter((_, i) => i !== index));
        }
    };
    const handleAddProject = () => {
        const newProject: Project = {
            id: (localProjects.length + 1).toString(),
            title: 'New Project',
            title_zh: '新项目',
            category: 'Category',
            category_zh: '类别',
            description: 'Short description goes here.',
            description_zh: '简短描述。',
            imageUrl: '',
            year: new Date().getFullYear().toString(),
            gallery: []
        };
        setLocalProjects([...localProjects, newProject]);
    };

    // Experiments Handlers
    const handleExpChange = (index: number, newData: Project) => setLocalExperiments(updateList(localExperiments, index, newData));
    const handleExpMove = (index: number, dir: 'up' | 'down') => setLocalExperiments(moveItem(localExperiments, index, dir));
    const handleDeleteExp = (index: number) => {
        if(window.confirm('CONFIRM DELETION?')) {
            setLocalExperiments(localExperiments.filter((_, i) => i !== index));
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
            imageUrl: '',
            year: new Date().getFullYear().toString(),
            gallery: []
        };
        setLocalExperiments([...localExperiments, newExp]);
    };

    // Contact Info Handlers
    const handleContactChange = (field: keyof ContactInfo, value: string) => {
        setLocalContactInfo({ ...localContactInfo, [field]: value });
    };

    const generateCode = () => {
        const code = `
import { Project, NavItem, ContactInfo } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', label_zh: '关于', href: '#about' },
  { id: 'works', label: 'Works', label_zh: '作品', href: '#works' },
  { id: 'playground', label: 'Playground', label_zh: '实验', href: '#playground' },
];

export const CONTACT_INFO: ContactInfo = ${JSON.stringify(localContactInfo, null, 2)};

export const PORTFOLIO_PROJECTS: Project[] = ${JSON.stringify(localProjects, null, 2)};

export const EXPERIMENTAL_PROJECTS: Project[] = ${JSON.stringify(localExperiments, null, 2)};
        `;
        
        navigator.clipboard.writeText(code);
        alert('CODE COPIED TO CLIPBOARD. \n\n1. Open "constants.ts" in your codebase.\n2. Paste the code to update your website permanently.');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] text-white overflow-hidden flex flex-col font-mono animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-14 border-b border-tech-800 flex items-center justify-between px-6 bg-black shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-neon rounded-full animate-pulse shadow-[0_0_10px_#00FF41]"></div>
                    <div>
                        <span className="font-bold tracking-widest text-neon block leading-none">YUHANG_CMS</span>
                        <span className="text-tech-600 text-[9px] tracking-widest">LOCAL_STORAGE_MODE</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <button 
                        onClick={() => {
                            if(window.confirm('Reset all changes to default? This clears local storage.')) {
                                localStorage.removeItem('portfolio_data');
                                window.location.reload();
                            }
                        }}
                        className="flex items-center gap-2 text-[10px] text-tech-500 hover:text-red-500 transition-colors mr-4 border border-transparent hover:border-red-900 px-2 py-1"
                    >
                        <RotateCcw size={12} /> RESET_DB
                    </button>
                    <button 
                        onClick={() => onClose()}
                        className="hover:text-neon transition-colors p-2 hover:bg-white/5 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r border-tech-800 bg-tech-900/20 p-4 flex flex-col gap-2 shrink-0">
                    <div className="text-[10px] text-tech-500 uppercase mb-2 font-bold tracking-wider opacity-50">Database Tables</div>
                    <button 
                        onClick={() => setActiveTab('works')}
                        className={`text-left px-3 py-3 text-xs border-l-2 flex justify-between items-center group transition-all ${
                            activeTab === 'works' 
                            ? 'border-neon bg-neon/10 text-white' 
                            : 'border-transparent text-tech-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span>TBL_WORKS</span>
                        <span className="text-[10px] opacity-50 bg-black px-1 rounded border border-tech-800">{localProjects.length}</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('labs')}
                         className={`text-left px-3 py-3 text-xs border-l-2 flex justify-between items-center group transition-all ${
                            activeTab === 'labs' 
                            ? 'border-neon bg-neon/10 text-white' 
                            : 'border-transparent text-tech-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span>TBL_LABS</span>
                        <span className="text-[10px] opacity-50 bg-black px-1 rounded border border-tech-800">{localExperiments.length}</span>
                    </button>
                    
                    <div className="my-2 border-t border-tech-800 opacity-50"></div>
                    
                    <button 
                         onClick={() => setActiveTab('settings')}
                         className={`text-left px-3 py-3 text-xs border-l-2 flex justify-between items-center group transition-all ${
                            activeTab === 'settings' 
                            ? 'border-neon bg-neon/10 text-white' 
                            : 'border-transparent text-tech-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span className="flex items-center gap-2"><Settings size={12} /> TBL_GLOBAL</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-grid relative scroll-smooth">
                    <div className="max-w-4xl mx-auto p-8 pb-32">
                        <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#050505]/95 backdrop-blur z-20 py-4 border-b border-tech-800">
                             <div>
                                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="text-neon">{'>'}</span> 
                                    {activeTab === 'works' && 'PORTFOLIO_PROJECTS'}
                                    {activeTab === 'labs' && 'EXPERIMENTAL_PROJECTS'}
                                    {activeTab === 'settings' && 'GLOBAL_SETTINGS'}
                                 </h2>
                                 <p className="text-[10px] text-tech-500 mt-1 font-mono">
                                     {activeTab === 'settings' ? 'Configure site-wide parameters.' : 'Drag & Drop not supported. Use arrows to reorder.'}
                                 </p>
                             </div>
                             {activeTab !== 'settings' && (
                                <button 
                                    onClick={activeTab === 'works' ? handleAddProject : handleAddExp}
                                    className="flex items-center gap-2 bg-tech-800 hover:bg-neon hover:text-black px-4 py-2 text-xs font-bold transition-all border border-tech-700 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]"
                                >
                                    <Plus size={14} /> ADD_ENTRY
                                </button>
                             )}
                        </div>

                        <div className="space-y-4">
                            {activeTab === 'works' && (
                                localProjects.map((p, i) => (
                                    <ProjectEditor 
                                        key={p.id + '_' + i} 
                                        project={p} 
                                        onChange={(newData) => handleProjectChange(i, newData)}
                                        onDelete={() => handleDeleteProject(i)}
                                        onMoveUp={() => handleProjectMove(i, 'up')}
                                        onMoveDown={() => handleProjectMove(i, 'down')}
                                        isFirst={i === 0}
                                        isLast={i === localProjects.length - 1}
                                    />
                                ))
                            )}

                            {activeTab === 'labs' && (
                                localExperiments.map((p, i) => (
                                    <ProjectEditor 
                                        key={p.id + '_' + i}
                                        project={p} 
                                        onChange={(newData) => handleExpChange(i, newData)}
                                        onDelete={() => handleDeleteExp(i)}
                                        onMoveUp={() => handleExpMove(i, 'up')}
                                        onMoveDown={() => handleExpMove(i, 'down')}
                                        isFirst={i === 0}
                                        isLast={i === localExperiments.length - 1}
                                    />
                                ))
                            )}

                            {activeTab === 'settings' && (
                                <div className="border border-neon bg-black p-6 rounded-sm">
                                    <h3 className="text-neon font-mono text-xs mb-6 border-b border-tech-800 pb-2">CONTACT_CONFIGURATION</h3>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <TextArea 
                                            label="Footer Tagline (EN)" 
                                            value={localContactInfo.tagline} 
                                            onChange={(v) => handleContactChange('tagline', v)} 
                                            rows={1}
                                        />
                                        <TextArea 
                                            label="Footer Tagline (ZH)" 
                                            value={localContactInfo.tagline_zh} 
                                            onChange={(v) => handleContactChange('tagline_zh', v)} 
                                            rows={1}
                                        />
                                        
                                        <div className="border-t border-tech-800 my-2"></div>
                                        
                                        <Input 
                                            label="Primary Email Address" 
                                            value={localContactInfo.email} 
                                            onChange={(v) => handleContactChange('email', v)} 
                                        />
                                        
                                        <FileUploadControl 
                                            label="Resume / CV File (Upload PDF)" 
                                            value={localContactInfo.resumeUrl} 
                                            onChange={(v) => handleContactChange('resumeUrl', v)} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="h-16 border-t border-tech-800 bg-black flex items-center justify-between px-8 shrink-0 z-30">
                 <div className="text-[10px] text-tech-500 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    UNSAVED_CHANGES
                 </div>
                 <div className="flex gap-4">
                    <button 
                        onClick={generateCode}
                        className="flex items-center gap-2 px-6 py-2 border border-tech-600 text-tech-400 hover:border-white hover:text-white text-xs font-bold transition-all"
                        title="Download constants.ts file content"
                    >
                        <Download size={14} /> EXPORT CODE
                    </button>
                    
                    <button 
                        onClick={() => onSave(localProjects, localExperiments, localContactInfo)}
                        className="flex items-center gap-2 px-6 py-2 bg-neon text-black hover:bg-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                        <Save size={14} /> SAVE & APPLY
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
