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
          

            
            <main className="px-4 space-y-0 sm:px-8 md:px-12 lg:px-20 xl:px-40">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="tab-content">
                {activeTab === 'phases' && (
                  <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
                    <PhasesPage />
                  </div>
                )}
                

                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
                      <p className="text-slate-500 dark:text-slate-400">
                        Overview section - to be implemented
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="notes-content">
                    <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
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