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
import apiClient from '../../lib/axios';
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

  // Fetch negotiation data to check if client has submitted files using new database-driven approach
  useEffect(() => {
    const checkNegotiationFiles = async () => {
      if (!urlNegotiationId) return;
      
      const refreshParam = searchParams.get('refresh');
      console.log('[ProjectProgressPage] 🔍 DATABASE-DRIVEN FILE CHECK STARTING');
      console.log(`   - Negotiation ID: ${urlNegotiationId}`);
      console.log(`   - Force refresh: ${refreshParam ? 'YES' : 'NO'}`);
      console.log(`   - Current clientFilesSubmitted state: ${clientFilesSubmitted}`);
      
      setIsLoadingFiles(true);
      try {
        // Use the new endpoint to check if negotiation has files
        const checkEndpoint = `/media/check_negotiation/${urlNegotiationId}/`;
        console.log(`   - Checking endpoint: ${checkEndpoint}`);
        
        const response = await apiClient.get(checkEndpoint);
        
        console.log('[ProjectProgressPage] 📊 CHECK RESPONSE:', {
          status: response.status,
          statusText: response.statusText
        });
        
        if (response.status === 200) {
          const data = response.data;
          console.log('[ProjectProgressPage] ✅ DATABASE CHECK RESULT:', data);
          
          const hasFiles = data.has_files;
          const fileCount = data.file_count;
          const files = data.files;
          
          console.log('[ProjectProgressPage] 🎯 FILE STATUS DETERMINED:');
          console.log(`   - Has files: ${hasFiles}`);
          console.log(`   - File count: ${fileCount}`);
          console.log(`   - Files:`, files);
          console.log(`   - Setting clientFilesSubmitted to: ${hasFiles}`);
          
          setClientFilesSubmitted(hasFiles);
          setSubmittedFiles(files);
          
          console.log('[ProjectProgressPage] ✅ State updated successfully');
        } else {
          console.error('[ProjectProgressPage] ❌ FAILED - Check response:', await response.text());
          setClientFilesSubmitted(false);
          setSubmittedFiles([]);
        }
      } catch (error) {
        console.error('[ProjectProgressPage] ❌ ERROR checking negotiation files:', error);
        setClientFilesSubmitted(false);
        setSubmittedFiles([]);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    checkNegotiationFiles();
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
    console.log('[ProjectProgressPage] 🎯 FINAL RENDERING DECISION:');
    console.log('   - effectiveUserType:', effectiveUserType);
    console.log('   - projectId:', urlProjectId);
    console.log('   - negotiationId:', urlNegotiationId);
    console.log('   - clientFilesSubmitted state:', clientFilesSubmitted);
    console.log('   - submittedFiles array:', submittedFiles);
    console.log('   - submittedFiles count:', submittedFiles.length);
    console.log('   - Rendering for:', effectiveUserType === 'freelancer' ? 'FREELANCER' : 'CLIENT');
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

  // Poll for file updates every 5 seconds when on overview tab
  useEffect(() => {
    if (!urlNegotiationId || activeTab !== 'overview') return;
    
    console.log('[ProjectProgressPage] 🔄 Starting file status polling');
    
    const interval = setInterval(async () => {
      console.log('[ProjectProgressPage] 🔄 Polling for file updates...');
       try {
        const checkEndpoint = `/media/check_negotiation/${urlNegotiationId}/`;
        const response = await apiClient.get(checkEndpoint);
        
        if (response.status === 200) {
          const data = response.data;
          const hasFiles = data.has_files;
          const files = data.files;
          
          console.log('[ProjectProgressPage] 🔄 POLL RESULT:', {
            hasFiles,
            fileCount: data.file_count,
            currentState: clientFilesSubmitted
          });
          
          // Update state if files status changed
          if (hasFiles !== clientFilesSubmitted) {
            console.log('[ProjectProgressPage] 🔄 FILE STATUS CHANGED - Updating state');
            setClientFilesSubmitted(hasFiles);
            setSubmittedFiles(files);
          }
        }
      } catch (error) {
        console.error('[ProjectProgressPage] 🔄 ERROR polling for updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      console.log('[ProjectProgressPage] 🔄 Stopping file status polling');
      clearInterval(interval);
    };
  }, [urlNegotiationId, activeTab, clientFilesSubmitted]);

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
                    clientFilesSubmitted: clientFilesSubmitted // Use actual file submission status
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