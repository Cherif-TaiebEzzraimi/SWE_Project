// src/pages/project_progress/ProjectProgressPage.tsx
import { useState } from 'react';
import Header from '../../components/Header';
import TabNavigation from '../../components/TabNavigation';
import  PhasesPage from './phases-section/phases'
import '../../styles/index.css';

const ProjectProgressPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'notes'>('phases');


  return (
    <div className=" w-full bg-background-light dark:bg-background-dark ">
          
            <Header />
            
            <main className="mt-8 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="tab-content">
                {activeTab === 'phases' && <PhasesPage />}

                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <div className="p-6 md:p-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        Overview section - to be implemented
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="notes-content">
                    <div className="p-6 md:p-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        Notes section - to be implemented
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          
        
      
    </div>
  );
};

export default ProjectProgressPage;