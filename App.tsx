
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Experiments from './components/Experiments';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import AdminDashboard from './components/cms/AdminDashboard';
import AdminLogin from './components/cms/AdminLogin';
import CustomCursor from './components/CustomCursor';
import { AnimatePresence } from 'framer-motion';
import { Language, Theme, Project, ContactInfo } from './types';
import { PORTFOLIO_PROJECTS, EXPERIMENTAL_PROJECTS, CONTACT_INFO } from './constants';
import { getPortfolioData, savePortfolioData } from './storage';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('en'); 
  const [theme, setTheme] = useState<Theme>('dark');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // CMS State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiments, setExperiments] = useState<Project[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(CONTACT_INFO);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await getPortfolioData();
        if (savedData) {
          setProjects(savedData.projects || PORTFOLIO_PROJECTS);
          setExperiments(savedData.experiments || EXPERIMENTAL_PROJECTS);
          setContactInfo(savedData.contactInfo || CONTACT_INFO);
        } else {
          // Fallback to constants if no DB record
          setProjects(PORTFOLIO_PROJECTS);
          setExperiments(EXPERIMENTAL_PROJECTS);
          setContactInfo(CONTACT_INFO);
        }
      } catch (e) {
        console.error("Failed to load IndexedDB data", e);
        setProjects(PORTFOLIO_PROJECTS);
        setExperiments(EXPERIMENTAL_PROJECTS);
        setContactInfo(CONTACT_INFO);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleCmsSave = async (newProjects: Project[], newExperiments: Project[], newContact: ContactInfo) => {
      try {
          await savePortfolioData({
              projects: newProjects,
              experiments: newExperiments,
              contactInfo: newContact
          });
          
          setProjects(newProjects);
          setExperiments(newExperiments);
          setContactInfo(newContact);
          setShowAdminDashboard(false);
          
          alert(lang === 'zh' ? '保存成功！' : 'DATA SAVED SUCCESSFULLY!');
      } catch (e: any) {
          console.error("Error saving to IndexedDB:", e);
          alert(lang === 'zh' ? "保存失败: " + e.message : "Error saving data: " + e.message);
      }
  };

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} dark:bg-darkbg`}>
      <CustomCursor />
      <Navbar lang={lang} theme={theme} toggleTheme={toggleTheme} toggleLang={toggleLang} />
      <main>
        <Hero lang={lang} theme={theme} />
        <Portfolio lang={lang} projects={projects} onSelectProject={setSelectedProject} />
        <Experiments lang={lang} projects={experiments} onSelectProject={setSelectedProject} />
      </main>
      <Footer lang={lang} contactInfo={contactInfo} onOpenAdmin={() => setShowAdminLogin(true)} />

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            lang={lang} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>

      {showAdminLogin && (
          <AdminLogin 
            onLogin={() => {
                setShowAdminLogin(false);
                setShowAdminDashboard(true);
            }} 
            onClose={() => setShowAdminLogin(false)} 
          />
      )}

      {showAdminDashboard && (
          <AdminDashboard 
            projects={projects}
            experiments={experiments}
            contactInfo={contactInfo}
            onSave={handleCmsSave}
            onClose={() => setShowAdminDashboard(false)}
            lang={lang}
          />
      )}
    </div>
  );
}

export default App;
