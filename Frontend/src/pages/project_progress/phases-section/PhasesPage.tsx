// src/pages/project_progress/ProjectProgressPage.tsx
import { useState } from 'react';
import Header from '../../../components/Header';
import TabNavigation from '../../../components/TabNavigation';
import PhaseCard from './components/PhaseCard';
import PhaseDetails from './components/PhaseDetails';
import type { Phase } from './types/project';
import './styles/phases_styles.css';

const ProjectProgressPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'notes'>('phases');
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const phases: Phase[] = [
    {
      id: '1',
      name: 'Discovery',
      status: 'Completed',
      completedDate: 'Oct 28',
      tasks: { completed: 4, total: 4 },
      deliverable: 'Project Brief v1.2.pdf',
      icon: 'folder_managed',
      iconColor: 'text-brand-navy-dark',
      isActive: false,
      description: 'Initial project discovery and requirements gathering phase. This includes stakeholder interviews, competitive analysis, and defining project scope.',
      deadline: 'Oct 28',
      price: '$1,500',
      todos: [
        {
          id: '1',
          title: 'Stakeholder Interviews',
          completed: true,
          date: 'Oct 15'
        },
        {
          id: '2',
          title: 'Competitive Analysis',
          completed: true,
          date: 'Oct 20'
        },
        {
          id: '3',
          title: 'Requirements Documentation',
          completed: true,
          date: 'Oct 25'
        },
        {
          id: '4',
          title: 'Project Brief Finalization',
          completed: true,
          date: 'Oct 28'
        }
      ]
    },
    {
      id: '2',
      name: 'UI Design',
      status: 'In Progress',
      dueDate: 'Nov 12',
      tasks: { completed: 1, total: 3 },
      icon: 'folder_supervised',
      iconColor: 'text-brand-blue',
      isActive: true,
      description: 'This phase involves creating a high-fidelity design of the user interface based on the approved wireframes and project requirements. It includes color schemes, typography, and interactive elements.',
      deadline: 'Nov 12',
      price: '$2,500',
      todos: [
        {
          id: '1',
          title: 'Finalize Color Palette',
          completed: true,
          date: 'Oct 30'
        },
        {
          id: '2',
          title: 'Create Homepage Mockups',
          completed: false,
          date: 'Nov 5'
        },
        {
          id: '3',
          title: 'Design User Profile Page',
          completed: false,
          date: 'Nov 10'
        }
      ]
    },
    {
      id: '3',
      name: 'Development',
      status: 'Not Started',
      startDate: 'Nov 13',
      tasks: { completed: 0, total: 8 },
      icon: 'folder',
      iconColor: 'text-slate-400',
      isActive: false,
      description: 'Implementation phase where the approved designs are coded into a functional website using modern web technologies.',
      deadline: 'Dec 15',
      price: '$5,000',
      todos: [
        {
          id: '1',
          title: 'Set up Development Environment',
          completed: false,
          date: 'Nov 13'
        },
        {
          id: '2',
          title: 'Frontend Development - Homepage',
          completed: false,
          date: 'Nov 20'
        },
        {
          id: '3',
          title: 'Frontend Development - Profile',
          completed: false,
          date: 'Nov 25'
        },
        {
          id: '4',
          title: 'Backend API Integration',
          completed: false,
          date: 'Dec 1'
        },
        {
          id: '5',
          title: 'Database Setup',
          completed: false,
          date: 'Dec 3'
        },
        {
          id: '6',
          title: 'Authentication System',
          completed: false,
          date: 'Dec 8'
        },
        {
          id: '7',
          title: 'Content Management',
          completed: false,
          date: 'Dec 12'
        },
        {
          id: '8',
          title: 'Final Development Review',
          completed: false,
          date: 'Dec 15'
        }
      ]
    },
    {
      id: '4',
      name: 'Testing',
      status: 'Not Started',
      startDate: 'Dec 16',
      tasks: { completed: 0, total: 5 },
      icon: 'folder',
      iconColor: 'text-slate-400',
      isActive: false,
      description: 'Quality assurance and testing phase to ensure everything works correctly across different devices and browsers.',
      deadline: 'Dec 22',
      price: '$1,000',
      todos: [
        {
          id: '1',
          title: 'Cross-browser Testing',
          completed: false,
          date: 'Dec 16'
        },
        {
          id: '2',
          title: 'Mobile Responsiveness Testing',
          completed: false,
          date: 'Dec 18'
        },
        {
          id: '3',
          title: 'Performance Testing',
          completed: false,
          date: 'Dec 19'
        },
        {
          id: '4',
          title: 'Security Audit',
          completed: false,
          date: 'Dec 20'
        },
        {
          id: '5',
          title: 'User Acceptance Testing',
          completed: false,
          date: 'Dec 22'
        }
      ]
    },
    {
      id: '5',
      name: 'Deployment',
      status: 'Not Started',
      startDate: 'Dec 23',
      tasks: { completed: 0, total: 3 },
      icon: 'folder',
      iconColor: 'text-slate-400',
      isActive: false,
      description: 'Final deployment and launch of the website to production servers with monitoring setup.',
      deadline: 'Dec 31',
      price: '$800',
      todos: [
        {
          id: '1',
          title: 'Server Configuration',
          completed: false,
          date: 'Dec 23'
        },
        {
          id: '2',
          title: 'Production Deployment',
          completed: false,
          date: 'Dec 28'
        },
        {
          id: '3',
          title: 'Post-launch Monitoring',
          completed: false,
          date: 'Dec 31'
        }
      ]
    }
  ];

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-container">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
          <div className="max-w-[1200px] mx-auto">
            <Header />
            
            <main className="mt-8">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="tab-content">
                {activeTab === 'phases' && (
                  <>
                    {/* Horizontal scrollable phases list */}
                    <div className="phases-scroll-container">
                      <div className="phases-scroll-content">
                        {phases.map((phase) => (
                          <PhaseCard
                            key={phase.id}
                            phase={phase}
                            onClick={() => handlePhaseClick(phase)}
                            isSelected={selectedPhase?.id === phase.id}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Phase details section */}
                    {selectedPhase && (
                      <PhaseDetails 
                        phase={selectedPhase}
                        onClose={() => setSelectedPhase(null)}
                      />
                    )}
                  </>
                )}

                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <div className="p-6 md:p-8 space-y-8">
                      <div className="space-y-6">
                        <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                          Modern Website Redesign
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
                          A comprehensive overhaul of the Globex Corporation's public-facing website to improve user experience, modernize the UI, and streamline the content architecture for better engagement.
                        </p>
                      </div>
                      
                      <div className="space-y-6 bg-white/50 dark:bg-black/20 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div>
                            <div className="flex justify-between items-baseline mb-1">
                              <p className="font-medium text-slate-600 dark:text-slate-300">Overall Completion</p>
                              <p className="text-xl font-bold text-slate-900 dark:text-white">35%</p>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                              <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 dark:text-slate-300">Current Phase</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="material-symbols-outlined text-brand-blue !text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                folder_supervised
                              </span>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">UI Design</p>
                            </div>
                          </div>
                        </div>
                      </div>
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
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressPage;