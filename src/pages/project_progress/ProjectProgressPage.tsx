// src/pages/project_progress/ProjectProgressPage.tsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import  PhasesPage from './phases-section/phases'
import '../../styles/index.css';

const ProjectProgressPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'notes'>('phases');
  const location = useLocation();
  const projectState = location.state || {};


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
                      <h2 className="text-2xl font-bold mb-4 text-blue-700">Project Details</h2>
                      {projectState.projectId && (
                        <div className="mb-2 text-slate-700 dark:text-slate-200">
                          <div><span className="font-semibold">Project ID:</span> {projectState.projectId}</div>
                          {projectState.applicant && (
                            <div className="mt-2">
                              <span className="font-semibold">Chosen Applicant:</span> {projectState.applicant.name}
                              <img src={projectState.applicant.avatar} alt={projectState.applicant.name} className="inline-block ml-2 w-8 h-8 rounded-full border" />
                            </div>
                          )}
                        </div>
                      )}
                      {!projectState.projectId && (
                        <p className="text-slate-500 dark:text-slate-400">No project details available.</p>
                      )}
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