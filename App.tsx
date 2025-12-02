
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Experiments from './components/Experiments';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import AdminDashboard from './components/cms/AdminDashboard';
import AdminLogin from './components/cms/AdminLogin';
import { AnimatePresence } from 'framer-motion';
import { Language, Theme, Project } from './types';
import { PORTFOLIO_PROJECTS, EXPERIMENTAL_PROJECTS } from './constants';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // CMS State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // Data State (initialized from LocalStorage or Constants)
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiments, setExperiments] = useState<Project[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Load data from LocalStorage if available
    const savedData = localStorage.getItem('portfolio_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            setProjects(parsed.projects || PORTFOLIO_PROJECTS);
            setExperiments(parsed.experiments || EXPERIMENTAL_PROJECTS);
        } catch (e) {
            console.error("Failed to load saved data", e);
            setProjects(PORTFOLIO_PROJECTS);
            setExperiments(EXPERIMENTAL_PROJECTS);
        }
    } else {
        setProjects(PORTFOLIO_PROJECTS);
        setExperiments(EXPERIMENTAL_PROJECTS);
    }

    return () => clearTimeout(timer);
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

  const handleCmsSave = (newProjects: Project[], newExperiments: Project[]) => {
      setProjects(newProjects);
      setExperiments(newExperiments);
      
      // Save to local storage for persistence across reloads
      localStorage.setItem('portfolio_data', JSON.stringify({
          projects: newProjects,
          experiments: newExperiments
      }));
      
      setShowAdminDashboard(false);
  };

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} dark:bg-darkbg`}>
      <Navbar lang={lang} theme={theme} toggleTheme={toggleTheme} toggleLang={toggleLang} />
      <main>
        <Hero lang={lang} />
        <Portfolio lang={lang} projects={projects} onSelectProject={setSelectedProject} />
        <Experiments lang={lang} projects={experiments} />
      </main>
      <Footer lang={lang} onOpenAdmin={() => setShowAdminLogin(true)} />

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            lang={lang} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>

      {/* CMS Modals */}
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
            onSave={handleCmsSave}
            onClose={() => setShowAdminDashboard(false)}
            lang={lang}
          />
      )}
    </div>
  );
}

export default App;
