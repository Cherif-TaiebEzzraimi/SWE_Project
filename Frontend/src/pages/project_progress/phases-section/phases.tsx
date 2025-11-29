import PhaseCard from './components/PhaseCard';
import PhaseDetails from './components/PhaseDetails';
import type { Phase } from './types/project';
import { useState } from 'react';
import './styles/phases_styles.css';


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


const PhasesPage = () => {

    const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
    const handlePhaseClick = (phase: Phase) => {
        setSelectedPhase(phase);
    };

    return(
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
        <div className="h-6" />
        {
          <div className="flex justify-center flex gap-5 ">
            <button className="px-6 py-3 bg-transparent text-red-400 border border-red-400 rounded-lg 
         hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.7)] 
         transition-all duration-500">
              <span className="material-symbols-outlined mr-2 font-bold text-lg">ADD</span>
              Leave a note
            </button>
            <button className="px-6 py-3 bg-transparent text-blue-400 border border-blue-600 rounded-lg 
         hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] 
         transition-all duration-300">
              <span className="material-symbols-outlined mr-2 font-bold text-lg">ADD</span>
                Add a Phase
            </button>
          </div>
        }
        <div className="h-10" />

      </>
  )
  }
export default PhasesPage;