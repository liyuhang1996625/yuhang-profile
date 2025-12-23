
import React, { useState, useRef } from 'react';
import { Project, Language, ContactInfo, ContentBlock } from '../../types';
import { Save, Plus, Trash2, X, Download, RotateCcw, Upload, Image as ImageIcon, ChevronUp, ChevronDown, Settings, Type, Layout, Mail, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clearPortfolioData } from '../../storage';

interface AdminDashboardProps {
  projects: Project[];
  experiments: Project[];
  contactInfo: ContactInfo;
  onSave: (projects: Project[], experiments: Project[], contactInfo: ContactInfo) => void;
  onClose: () => void;
  lang: Language;
}

// --- 辅助组件：输入框 ---
const Input = ({ label, value, onChange, placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
    <div className="flex flex-col gap-1">
        <label className="font-mono text-[9px] text-tech-500 uppercase tracking-widest">{label}</label>
        <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-black border border-tech-800 text-white font-mono text-xs p-2.5 focus:border-neon focus:outline-none transition-colors"
        />
    </div>
);

const TextArea = ({ label, value, onChange, rows = 3, placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, rows?: number, placeholder?: string }) => (
    <div className="flex flex-col gap-1">
        <label className="font-mono text-[9px] text-tech-500 uppercase tracking-widest">{label}</label>
        <textarea 
            rows={rows}
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-black border border-tech-800 text-white font-mono text-xs p-2.5 focus:border-neon focus:outline-none transition-colors resize-y"
        />
    </div>
);

// --- 图片压缩与上传控制 ---
const ImageUploadControl = ({ value, onChange, label = "" }: { value: string, onChange: (val: string) => void, label?: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                onChange(reader.result);
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col gap-2">
            {label && <label className="font-mono text-[9px] text-tech-500 uppercase tracking-widest">{label}</label>}
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={value || ''} 
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="图片 URL 或上传本地文件"
                    className="flex-1 bg-black border border-tech-800 text-white font-mono text-xs p-2.5 focus:border-neon focus:outline-none transition-colors truncate"
                />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <button 
                    disabled={isProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center bg-tech-900 hover:bg-tech-800 text-white px-4 border border-tech-700 transition-colors"
                >
                    {isProcessing ? <div className="animate-spin w-4 h-4 border-t-2 border-neon rounded-full" /> : <Upload size={14} />}
                </button>
            </div>
            {value && (
                <div className="mt-2 bg-tech-900/40 border border-tech-800 p-2">
                    <img src={value} alt="预览" className="max-h-[180px] w-auto mx-auto object-contain" />
                </div>
            )}
        </div>
    );
};

// --- 图文混合编辑器 ---
const ContentBlocksEditor = ({ blocks = [], onChange }: { blocks: ContentBlock[], onChange: (blocks: ContentBlock[]) => void }) => {
    const addBlock = (type: 'text' | 'image') => {
        const newBlock: ContentBlock = type === 'text' 
            ? { type: 'text', value: '', value_zh: '' } 
            : { type: 'image', value: '' };
        onChange([...blocks, newBlock]);
    };

    const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...updates };
        onChange(newBlocks);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= blocks.length) return;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-tech-800 pb-3">
                <span className="font-mono text-[10px] text-neon uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layout size={12} /> 详情页混合排版内容
                </span>
                <div className="flex gap-2">
                    <button onClick={() => addBlock('text')} className="flex items-center gap-1.5 text-[10px] font-bold bg-tech-900 border border-tech-700 px-3 py-1.5 hover:bg-neon hover:text-black transition-all">
                        <Type size={12} /> + 添加文本
                    </button>
                    <button onClick={() => addBlock('image')} className="flex items-center gap-1.5 text-[10px] font-bold bg-tech-900 border border-tech-700 px-3 py-1.5 hover:bg-neon hover:text-black transition-all">
                        <ImageIcon size={12} /> + 添加图片
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {blocks.map((block, i) => (
                    <div key={i} className="group relative bg-tech-900/30 border border-tech-800 p-5 rounded-sm">
                        <div className="absolute -left-10 top-0 bottom-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => moveBlock(i, 'up')} className="p-1 hover:text-neon"><ChevronUp size={16}/></button>
                             <div className="font-mono text-[9px] text-tech-600">{i + 1}</div>
                             <button onClick={() => moveBlock(i, 'down')} className="p-1 hover:text-neon"><ChevronDown size={16}/></button>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[9px] text-tech-500 uppercase border border-tech-800 px-2 py-0.5">
                                {block.type === 'text' ? 'TEXT_BLOCK' : 'IMAGE_BLOCK'}
                            </span>
                            <button onClick={() => onChange(blocks.filter((_, idx) => idx !== i))} className="text-tech-600 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {block.type === 'text' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextArea label="文本 (英文)" value={block.value} onChange={(v) => updateBlock(i, { value: v })} placeholder="Enter English text..." />
                                <TextArea label="文本 (中文)" value={block.value_zh || ''} onChange={(v) => updateBlock(i, { value_zh: v })} placeholder="输入中文内容..." />
                            </div>
                        ) : (
                            <ImageUploadControl value={block.value} onChange={(v) => updateBlock(i, { value: v })} />
                        )}
                    </div>
                ))}
                {blocks.length === 0 && (
                    <div className="py-12 border border-dashed border-tech-800 text-center text-tech-600 font-mono text-xs">
                        目前没有任何内容。点击上方按钮开始构建。
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 项目编辑器条目 ---
const ProjectItemEditor = ({ project, onChange, onDelete }: { project: Project, onChange: (p: Project) => void, onDelete: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const updateField = (field: keyof Project, val: any) => onChange({ ...project, [field]: val });

    return (
        <div className={`border transition-all duration-300 ${isExpanded ? 'border-neon bg-black mb-6' : 'border-tech-800 bg-tech-900/20 mb-3 hover:border-tech-600'}`}>
            <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-neon shadow-[0_0_8px_#00FF41]' : 'bg-tech-700'}`} />
                    <div className="w-10 h-7 bg-tech-800 overflow-hidden border border-tech-700">
                        {project.imageUrl && <img src={project.imageUrl} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div>
                        <div className="font-mono text-xs font-bold text-white">{project.title_zh || project.title || '未命名项目'}</div>
                        <div className="font-mono text-[9px] text-tech-500 uppercase">{project.category_zh} | {project.year}</div>
                    </div>
                </div>
                <div className="text-tech-500 font-mono text-xs">{isExpanded ? '收起 [-]' : '展开 [+]'}</div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-tech-800 overflow-hidden">
                        <div className="p-6 space-y-10">
                            {/* 基础信息 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Input label="项目 ID" value={project.id} onChange={(v) => updateField('id', v)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="中文标题" value={project.title_zh} onChange={(v) => updateField('title_zh', v)} />
                                        <Input label="英文标题" value={project.title} onChange={(v) => updateField('title', v)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="中文分类" value={project.category_zh} onChange={(v) => updateField('category_zh', v)} />
                                        <Input label="英文分类" value={project.category} onChange={(v) => updateField('category', v)} />
                                    </div>
                                    <Input label="发布年份" value={project.year} onChange={(v) => updateField('year', v)} />
                                </div>
                                <div className="space-y-4">
                                    <ImageUploadControl label="列表展示图 (封面)" value={project.imageUrl} onChange={(v) => updateField('imageUrl', v)} />
                                    <Input label="外部链接 (可选)" value={project.link || ''} onChange={(v) => updateField('link', v)} placeholder="https://..." />
                                </div>
                            </div>

                            {/* 核心内容块 */}
                            <ContentBlocksEditor 
                                blocks={project.contentBlocks || []} 
                                onChange={(blocks) => updateField('contentBlocks', blocks)} 
                            />

                            <div className="flex justify-end pt-4 border-t border-tech-800">
                                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-500 text-[10px] font-mono hover:bg-red-500/10 px-4 py-2 border border-red-500/30">
                                    <Trash2 size={12} className="inline mr-2"/> 删除此项目
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- 主控制面板 ---
const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, experiments, contactInfo, onSave, onClose }) => {
    const [localProjects, setLocalProjects] = useState<Project[]>(projects);
    const [localExperiments, setLocalExperiments] = useState<Project[]>(experiments);
    const [localContactInfo, setLocalContactInfo] = useState<ContactInfo>(contactInfo);
    const [activeTab, setActiveTab] = useState<'works' | 'labs' | 'settings'>('works');

    const handleAdd = () => {
        const newItem: Project = {
            id: Date.now().toString(),
            title: 'New Project', title_zh: '新项目',
            category: 'UI/UX Design', category_zh: 'UI/UX 设计',
            description: '', description_zh: '',
            imageUrl: '', year: new Date().getFullYear().toString(),
            contentBlocks: []
        };
        if (activeTab === 'works') setLocalProjects([...localProjects, newItem]);
        else setLocalExperiments([...localExperiments, newItem]);
    };

    const handleContactUpdate = (field: keyof ContactInfo, value: string) => {
        setLocalContactInfo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] text-white flex flex-col font-mono animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-tech-800 flex items-center justify-between px-6 bg-black z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-neon rounded-full animate-pulse shadow-[0_0_12px_#00FF41]" />
                    <span className="font-bold tracking-[0.2em] text-neon text-sm uppercase">YuHang_CMS 2.0</span>
                </div>
                <button onClick={onClose} className="hover:text-neon transition-colors p-2 bg-tech-900 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 border-r border-tech-800 bg-tech-900/10 p-5 space-y-3 shrink-0">
                    <div className="text-[9px] text-tech-500 font-bold uppercase tracking-[0.2em] mb-4">导航控制</div>
                    <button onClick={() => setActiveTab('works')} className={`w-full text-left px-4 py-4 text-xs font-bold border-l-2 transition-all ${activeTab === 'works' ? 'border-neon bg-neon/10 text-white' : 'border-transparent text-tech-400 hover:text-white hover:bg-white/5'}`}>作品集项目</button>
                    <button onClick={() => setActiveTab('labs')} className={`w-full text-left px-4 py-4 text-xs font-bold border-l-2 transition-all ${activeTab === 'labs' ? 'border-neon bg-neon/10 text-white' : 'border-transparent text-tech-400 hover:text-white hover:bg-white/5'}`}>实验室探索</button>
                    <div className="h-px bg-tech-800 my-4" />
                    <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-4 text-xs font-bold border-l-2 transition-all ${activeTab === 'settings' ? 'border-neon bg-neon/10 text-white' : 'border-transparent text-tech-400 hover:text-white hover:bg-white/5'}`}>
                        <span className="flex items-center gap-2"><Settings size={14} /> 全局设置</span>
                    </button>
                    
                    <div className="absolute bottom-24 w-44">
                        <button onClick={async () => { if(confirm('确定要清空所有数据并恢复默认吗？')) { await clearPortfolioData(); window.location.reload(); } }} className="text-[9px] text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                           <RotateCcw size={10} /> 重置所有数据
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-grid p-10">
                    <div className="max-w-4xl mx-auto pb-40">
                        <div className="flex justify-between items-center mb-10 border-b border-tech-800 pb-5 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    {activeTab === 'works' ? '作品管理' : activeTab === 'labs' ? '实验室项目' : '网站全局设置'}
                                </h2>
                                <p className="text-[10px] text-tech-500 font-mono mt-1">
                                    {activeTab === 'settings' ? '配置联系方式、标语及简历文件' : `当前数据库中有 ${activeTab === 'works' ? localProjects.length : localExperiments.length} 个条目`}
                                </p>
                            </div>
                            {activeTab !== 'settings' && (
                                <button onClick={handleAdd} className="flex items-center gap-2 bg-neon text-black px-6 py-2.5 text-xs font-bold hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all">
                                    <Plus size={16}/> 添加新项目
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {activeTab === 'works' && localProjects.map((p, i) => (
                                <ProjectItemEditor key={p.id} project={p} onChange={(updated) => { const l = [...localProjects]; l[i] = updated; setLocalProjects(l); }} onDelete={() => setLocalProjects(localProjects.filter((_, idx) => idx !== i))} />
                            ))}
                            {activeTab === 'labs' && localExperiments.map((p, i) => (
                                <ProjectItemEditor key={p.id} project={p} onChange={(updated) => { const l = [...localExperiments]; l[i] = updated; setLocalExperiments(l); }} onDelete={() => setLocalExperiments(localExperiments.filter((_, idx) => idx !== i))} />
                            ))}

                            {activeTab === 'settings' && (
                                <div className="border border-neon/50 bg-black p-8 rounded-sm shadow-[0_0_40px_rgba(0,255,65,0.05)] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 text-neon font-mono text-xs uppercase tracking-[0.25em] mb-4 border-b border-tech-900 pb-4">
                                        <Mail size={14} /> 联系信息配置
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <TextArea label="页脚标语 (英文)" value={localContactInfo.tagline} onChange={(v) => handleContactUpdate('tagline', v)} rows={2} />
                                            <TextArea label="页脚标语 (中文)" value={localContactInfo.tagline_zh} onChange={(v) => handleContactUpdate('tagline_zh', v)} rows={2} />
                                        </div>
                                        
                                        <div className="h-px bg-tech-900" />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                            <Input label="主要联系邮箱" value={localContactInfo.email} onChange={(v) => handleContactUpdate('email', v)} placeholder="hello@yuhang.design" />
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-tech-400 mb-1">
                                                    <FileText size={12} /> <span className="text-[10px] font-mono">简历文件 (PDF)</span>
                                                </div>
                                                <ImageUploadControl value={localContactInfo.resumeUrl} onChange={(v) => handleContactUpdate('resumeUrl', v)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Bar */}
            <div className="h-20 border-t border-tech-800 bg-black flex items-center justify-between px-10 shrink-0 z-20">
                 <div className="flex items-center gap-3 font-mono text-[10px] text-tech-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    检测到本地更改，请记得保存。
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => {
                        const code = `export const PORTFOLIO_DATA = ${JSON.stringify({ projects: localProjects, experiments: localExperiments, contactInfo: localContactInfo }, null, 2)}`;
                        navigator.clipboard.writeText(code);
                        alert('JSON 结构已复制，可用于备份。');
                    }} className="flex items-center gap-2 px-6 py-3 border border-tech-700 text-tech-400 hover:text-white hover:border-white text-xs font-bold transition-all">
                        <Download size={14} /> 备份数据
                    </button>
                    <button onClick={() => onSave(localProjects, localExperiments, localContactInfo)} className="flex items-center gap-3 px-10 py-3 bg-neon text-black hover:bg-white text-xs font-bold transition-all shadow-[0_0_25px_rgba(0,255,65,0.4)]">
                        <Save size={16}/> 保存所有更改并应用
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
