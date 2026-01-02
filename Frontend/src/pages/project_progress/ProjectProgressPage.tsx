console.log('🟠🟠🟠 ProjectProgressPage.tsx FILE LOADED 🟠🟠🟠');

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserType } from '../../context/UserTypeContext';
import TabNavigation from '../../components/TabNavigation';
import PhasesPage from './phases-section/phases';
import ProjectProgressClientOverview from './project_progress_overview/ProjectProgressClientOverview';
import ProjectProgressFreelancerOverview from './project_progress_overview/ProjectProgressFreelancerOverview';
import NotesSection from './notes/NotesSection';
import { PhasesProvider } from './phases-section/context/PhasesContext';
import '../../styles/index.css';

const ProjectProgressPage = () => {
  console.log('🔴🔴🔴 ProjectProgressPage COMPONENT LOADED 🔴🔴🔴');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { userType: contextUserType, setUserType } = useUserType();
  const [effectiveUserType, setEffectiveUserType] = useState<'freelancer' | 'client' | null>(null);
  
  const projectStateRef = useRef<any>(null);
  
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') as 'overview' | 'phases' | 'notes' | null;
  const urlProjectId = searchParams.get('projectId');
  const urlNegotiationId = searchParams.get('negotiationId');
  const urlDirectHire = searchParams.get('directHire');
  const urlSettingsMode = searchParams.get('settingsMode');

  const projectStateFromUrl: any = {
    ...(urlProjectId ? { projectId: Number(urlProjectId) } : {}),
    ...(urlNegotiationId ? { negotiationId: Number(urlNegotiationId) } : {}),
    ...(urlDirectHire != null ? { directHire: urlDirectHire === '1' || urlDirectHire === 'true' } : {}),
    ...(urlSettingsMode != null ? { settingsMode: urlSettingsMode === '1' || urlSettingsMode === 'true' } : {}),
  };

  const incomingState = location.state || {};
  if (incomingState && Object.keys(incomingState).length > 0) {
    projectStateRef.current = incomingState;
  } else if (!projectStateRef.current || Object.keys(projectStateRef.current).length === 0) {
    if (Object.keys(projectStateFromUrl).length > 0) {
      projectStateRef.current = projectStateFromUrl;
    }
  }
  const projectState = projectStateRef.current || {};

  // Track clientFilesSubmitted state centrally
  const [clientFilesSubmitted, setClientFilesSubmitted] = useState<boolean>(
    Boolean(projectState.clientFilesSubmitted)
  );
  const [submittedFiles, setSubmittedFiles] = useState<any[]>(projectState.submittedFiles || []);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Fetch negotiation data to check if client has submitted files
  useEffect(() => {
    const fetchNegotiationData = async () => {
      if (!urlNegotiationId) return;
      
      setIsLoadingFiles(true);
      try {
        const response = await fetch(`/api/negotiations/${urlNegotiationId}/`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('[ProjectProgressPage] Fetched negotiation data:', data);
          
          // Check if client has submitted files
          const hasFiles = data.client_attachments && data.client_attachments.length > 0;
          console.log('[ProjectProgressPage] Has client files:', hasFiles);
          
          setClientFilesSubmitted(hasFiles);
          
          // If has files, fetch the media files
          if (hasFiles) {
            const mediaResponse = await fetch(`/api/media/negotiation/${urlNegotiationId}/`, {
              credentials: 'include'
            });
            if (mediaResponse.ok) {
              const mediaFiles = await mediaResponse.json();
              console.log('[ProjectProgressPage] Fetched media files:', mediaFiles);
              setSubmittedFiles(mediaFiles);
            }
          }
        }
      } catch (error) {
        console.error('[ProjectProgressPage] Error fetching negotiation data:', error);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchNegotiationData();
  }, [urlNegotiationId]);

  // Update clientFilesSubmitted when location.state changes
  useEffect(() => {
    if (typeof location.state?.clientFilesSubmitted === 'boolean') {
      console.log('[ProjectProgressPage] Updating clientFilesSubmitted from location.state:', location.state.clientFilesSubmitted);
      setClientFilesSubmitted(location.state.clientFilesSubmitted);
    }
    if (location.state?.submittedFiles) {
      setSubmittedFiles(location.state.submittedFiles);
    }
  }, [location.state?.clientFilesSubmitted, location.state?.submittedFiles]);

  useEffect(() => {
    console.log('============================================');
    console.log('[ProjectProgressPage] DETAILED DEBUG INFO:');
    console.log('============================================');
    console.log('1. location.state:', location.state);
    console.log('2. location.state?.userType:', location.state?.userType);
    console.log('3. contextUserType:', contextUserType);
    console.log('4. projectId:', urlProjectId);
    console.log('5. negotiationId:', urlNegotiationId);
    console.log('6. clientFilesSubmitted:', clientFilesSubmitted);
    console.log('7. submittedFiles:', submittedFiles);
    console.log('8. location.pathname:', location.pathname);
    console.log('============================================');

    if (location.state?.userType) {
      const stateUserType = location.state.userType;
      console.log('✅ PRIORITY 1: Using userType from location.state:', stateUserType);
      setEffectiveUserType(stateUserType);
      if (stateUserType !== contextUserType) {
        console.log('   → Syncing context userType to:', stateUserType);
        setUserType(stateUserType);
      }
      return;
    }

    console.log('❌ PRIORITY 1 FAILED: No userType in location.state');

    if (contextUserType === 'freelancer' || contextUserType === 'client') {
      console.log('✅ PRIORITY 2: Using userType from context:', contextUserType);
      setEffectiveUserType(contextUserType);
      return;
    }

    console.log('❌ PRIORITY 2 FAILED: contextUserType is not valid:', contextUserType);

    if (urlNegotiationId && urlProjectId) {
      console.log('⚠️ PRIORITY 3 (HEURISTIC): Both IDs present → defaulting to FREELANCER');
      setEffectiveUserType('freelancer');
      setUserType('freelancer');
    } else if (urlProjectId) {
      console.log('⚠️ PRIORITY 3 (HEURISTIC): Only projectId → defaulting to CLIENT');
      setEffectiveUserType('client');
      setUserType('client');
    } else {
      console.log('⚠️ PRIORITY 3 (FALLBACK): No valid params → defaulting to CLIENT');
      setEffectiveUserType('client');
      setUserType('client');
    }
  }, [location.state, contextUserType, urlNegotiationId, urlProjectId, setUserType]);

  const defaultTab = projectState.directHire && projectState.initialLoad ? 'overview' : 'phases';
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'notes'>(initialTab || defaultTab);

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: 'overview' | 'phases' | 'notes') => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(location.search);
    nextParams.set('tab', tab);
    navigate(`?${nextParams.toString()}`, { 
      replace: true,
      state: {
        ...projectState,
        clientFilesSubmitted,
        submittedFiles
      }
    });
  };

  const showTabNavigation = true;

  if (!effectiveUserType || isLoadingFiles) {
    console.log('[ProjectProgressPage] Loading state - waiting for userType or files...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {!effectiveUserType ? 'Loading project progress...' : 'Checking file status...'}
          </p>
        </div>
      </div>
    );
  }

  if (!urlProjectId) {
    console.log('[ProjectProgressPage] ERROR: No projectId provided');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">No Project Selected</h2>
          <p className="text-red-600 dark:text-red-400">Please select a project from your history to view progress.</p>
        </div>
      </div>
    );
  }

  console.log('============================================');
  console.log('[ProjectProgressPage] 🎯 FINAL DECISION:');
  console.log('   effectiveUserType:', effectiveUserType);
  console.log('   projectId:', urlProjectId);
  console.log('   clientFilesSubmitted:', clientFilesSubmitted);
  console.log('   submittedFiles count:', submittedFiles.length);
  console.log('   Rendering overview for:', effectiveUserType === 'freelancer' ? 'FREELANCER' : 'CLIENT');
  console.log('============================================');

  return (
    <PhasesProvider initialPhases={[]}>
      <div className="w-full bg-background-light dark:bg-background-dark">
        <main className="px-4 space-y-0 sm:px-8 md:px-12 lg:px-20 xl:px-40">
          {showTabNavigation && <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />}
          <div className="tab-content">
            {activeTab === 'phases' && (
              <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
                <PhasesPage 
                  projectState={{
                    ...projectState,
                    clientFilesSubmitted: true // Always allow editing for freelancer
                  }} 
                />
              </div>
            )}
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
                  {effectiveUserType === 'freelancer' ? (
                    <ProjectProgressFreelancerOverview
                      clientFilesSubmitted={clientFilesSubmitted}
                      submittedFiles={submittedFiles}
                    />
                  ) : (
                    <ProjectProgressClientOverview projectState={projectState} />
                  )}
                </div>
              </div>
            )}
            {activeTab === 'notes' && (
              <div className="notes-content">
                <div className="border-2 border-blue-500 shadow-[0_0_7px_3px_rgba(30,70,206,0.1)] dark:bg-blue-900 p-6 rounded-lg">
                  <NotesSection projectState={projectState} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PhasesProvider>
  );
};

export default ProjectProgressPage;