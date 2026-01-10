// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { ProjectCard } from './components/ProjectCard';
// import { FileUploadSection } from './components/FileUploadSection';
// import { FileDisplaySection } from './components/FileDisplaySection';
// import { StatusBadge } from './components/StatusBadge';
// import type { FileForUpload, MediaFile } from './types/projectProgress.types';
// import styles from './styles/projectProgress.module.css';

// export default function ProjectProgressClientOverview() {
//   const location = useLocation();
//   const isSubmittedPath = location.pathname.includes('/submitted');
  
//   const [files, setFiles] = useState<FileForUpload[]>([]);
//   const [submittedFiles, setSubmittedFiles] = useState<MediaFile[]>([]);
//   const [filesSubmitted, setFilesSubmitted] = useState(isSubmittedPath);
//   const [projectStarted] = useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//   const handleFileSelect = (newFiles: FileForUpload[]) => {
//     setFiles([...files, ...newFiles]);
//   };

//   const handleRemoveFile = (id: string) => {
//     setFiles(files.filter(f => f.id !== id));
//   };

//   useEffect(() => {
//     if (showSuccessMessage) {
//       const timer = setTimeout(() => {
//         setShowSuccessMessage(false);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showSuccessMessage]);

//   const handleSubmitFiles = async () => {
//     const uploaded = files.map(f => ({
//       id: f.id,
//       file_url: 'mock',
//       file_type: f.type,
//       file_name: f.name,
//       file_size: f.size,
//       created_at: new Date().toISOString()
//     }));
    
//     setSubmittedFiles(uploaded);
//     setFiles([]);
//     setFilesSubmitted(true);
//     setShowSuccessMessage(true);
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.tabBar}>
//         <button className={`${styles.tab} ${styles.activeTab}`}>
//           <svg className={styles.tabIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//             <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//             <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//             <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//           </svg>
//           Overview
//         </button>
//       </div>

//       <div className={styles.tabContent}>
//         <ProjectCard
//           projectTitle="E-Commerce Website Redesign – Bloom & Co."
//           projectDescription="Design and develop a modern, visually compelling e-commerce platform for our boutique floral business. The website should embody elegance and sophistication while delivering an intuitive shopping experience. Core deliverables include: a visually rich product catalog with professional photography, streamlined cart and checkout flows, secure payment gateway integration, fully responsive mobile-first design, and a user-friendly CMS for content management. The final product must seamlessly blend aesthetic appeal with functional excellence, enabling customers to effortlessly discover, customize, and purchase our premium floral arrangements."
//           submittedOn="October 26, 2023"
//           budget="$2,500"
//           userType="freelancer"
//           userName="Sarah Jenkins"
//           userRole="Lead UI/UX Designer"
//           userPhoto=""
//         >
//           {/* Project files Section */}
//           {!filesSubmitted ? (
//             <FileUploadSection 
//               files={files}
//               onFileSelect={handleFileSelect}
//               onRemoveFile={handleRemoveFile}
//               onSubmit={handleSubmitFiles}
//             />
//           ) : (
//             <FileDisplaySection 
//               files={submittedFiles}
//               title="Project Files"
//               showSuccessMessage={showSuccessMessage}
//             />
//           )}
//         </ProjectCard>

//         {                 }
//         {filesSubmitted && !projectStarted && (
//           <StatusBadge 
//             type="waiting"
//             message="Waiting for freelancer to start"
//           />
//         )}

//         {projectStarted && (
//           <StatusBadge 
//             type="started"
//             message="Freelancer started working on your project"
//           />
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProjectCard } from './components/ProjectCard';
import { FileUploadSection } from './components/FileUploadSection';
import { FileDisplaySection } from './components/FileDisplaySection';
import { StatusBadge } from './components/StatusBadge';
import type { FileForUpload, MediaFile } from './types/projectProgress.types';
import { uploadMedia, listMedia } from '../../../api/mediaApi';
import styles from './styles/projectProgress.module.css';

/* ✅ 1. Props type goes HERE */
type ProjectProgressClientOverviewProps = {
  projectState?: any; // replace `any` later if you know the structure
};

/* ✅ 2. Component now accepts props */
export default function ProjectProgressClientOverview({
  projectState,
}: ProjectProgressClientOverviewProps) {
  const location = useLocation();
  const navigate = useNavigate();

  /* ✅ 3. Safe fallback logic */
  const effectiveProjectState = projectState || location.state || {};
  const directHire = effectiveProjectState.directHire;
  const freelancer = effectiveProjectState.freelancer;
  const postData = effectiveProjectState.post;
  const negotiationId = effectiveProjectState.negotiationId;
  const projectId = effectiveProjectState.projectId;
  const settingsMode = effectiveProjectState.settingsMode || false;
  const initialLoad = effectiveProjectState.initialLoad || false;

  // State for fetched negotiation data
  const [fetchedNegotiation, setFetchedNegotiation] = useState<any>(null);
  const [parsedProjectData, setParsedProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Parse project data from client_description
  const parseProjectData = (description: string) => {
    if (!description) return null;
    
    const titleMatch = description.match(/Project Title:\s*(.+?)(?:\n|$)/i);
    const categoryMatch = description.match(/Category:\s*(.+?)(?:\n|$)/i);
    const budgetMatch = description.match(/Budget:\s*(.+?)\s*-\s*(.+?)\s*DA/i);
    const skillsMatch = description.match(/Required Skills:\s*(.+?)(?:\n\n|$)/i);
    const descMatch = description.match(/Description:\s*(.+)$/is);
    
    const title = titleMatch ? titleMatch[1].trim() : '';
    const category = categoryMatch ? categoryMatch[1].trim() : '';
    const budgetMin = budgetMatch ? budgetMatch[1].trim().replace(/\D/g, '') : '';
    const budgetMax = budgetMatch ? budgetMatch[2].trim().replace(/\D/g, '') : '';
    const skillsStr = skillsMatch ? skillsMatch[1].trim() : '';
    const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s) : [];
    const descriptionText = descMatch ? descMatch[1].trim() : description;
    
    return {
      title,
      category,
      minPrice: budgetMin ? parseInt(budgetMin) : 0,
      maxPrice: budgetMax ? parseInt(budgetMax) : 0,
      requirements: skills,
      description: descriptionText
    };
  };

  // Fetch negotiation data when negotiationId is available
  useEffect(() => {
    const fetchNegotiationData = async () => {
      // Only fetch if we have negotiationId and no postData
      if (negotiationId && !postData) {
        setLoading(true);
        try {
          const { getNegotiation } = await import('../../../api/negotiationApi');
          const negotiation = await getNegotiation(negotiationId);
          console.log('Fetched negotiation:', negotiation);
          setFetchedNegotiation(negotiation);
          
          // Parse project data from client_description or request data
          if (negotiation.client_description) {
            const parsed = parseProjectData(negotiation.client_description);
            console.log('Parsed project data from client_description:', parsed);
            setParsedProjectData(parsed);
          } else if (negotiation.request) {
            // Use request data for projects created from requests
            const parsedFromRequest = {
              title: negotiation.request.title,
              category: negotiation.request.category || '',
              minPrice: negotiation.request.budget_min,
              maxPrice: negotiation.request.budget_max,
              description: negotiation.request.description || '',
              requirements: [] // TODO: Extract from attachments if needed
            };
            console.log('Parsed project data from request:', parsedFromRequest);
            setParsedProjectData(parsedFromRequest);
          } else {
            console.log('No client_description or request data found');
          }
        } catch (error) {
          console.error('Error fetching negotiation:', error);
        } finally {
          setLoading(false);
        }
      } else if (!negotiationId && !postData) {
        // If we have neither, we're probably in a bad state
        console.warn('No negotiationId or postData available');
      }
    };
    
    fetchNegotiationData();
  }, [negotiationId, postData]);

  // Use postData if available, otherwise use parsed data from negotiation
  const effectivePostData = postData || parsedProjectData;
  const effectiveFreelancer = freelancer || (fetchedNegotiation?.freelancer ? {
    name: `${fetchedNegotiation.freelancer.user?.first_name || ''} ${fetchedNegotiation.freelancer.user?.last_name || ''}`.trim(),
    role: 'Freelancer',
    photo: ''
  } : null);

  const freelancerProfileIdRaw =
    freelancer?.id ??
    freelancer?.user_id ??
    freelancer?.user?.id ??
    fetchedNegotiation?.freelancer?.user?.id ??
    fetchedNegotiation?.freelancer?.user_id ??
    fetchedNegotiation?.freelancer?.id;

  const freelancerProfileId =
    freelancerProfileIdRaw !== undefined && freelancerProfileIdRaw !== null
      ? String(freelancerProfileIdRaw)
      : undefined;

  // Debug logging
  useEffect(() => {
    if (negotiationId) {
      console.log('Component state:', {
        negotiationId,
        postData,
        parsedProjectData,
        effectivePostData,
        fetchedNegotiation,
        loading
      });
    }
  }, [negotiationId, postData, parsedProjectData, effectivePostData, fetchedNegotiation, loading]);

  // Form state for settings mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(effectivePostData?.title || '');
  const [editedDescription, setEditedDescription] = useState(effectivePostData?.description || '');
  const [editedBudgetMin, setEditedBudgetMin] = useState(effectivePostData?.minPrice?.toString() || '');
  const [editedBudgetMax, setEditedBudgetMax] = useState(effectivePostData?.maxPrice?.toString() || '');
  const [editedCategory, setEditedCategory] = useState(effectivePostData?.category || '');
  const [editedRequirements, setEditedRequirements] = useState<string[]>(effectivePostData?.requirements || []);

  // Initialize form data when effectivePostData changes
  useEffect(() => {
    if (effectivePostData) {
      setEditedTitle(effectivePostData.title || '');
      setEditedDescription(effectivePostData.description || '');
      setEditedBudgetMin(effectivePostData.minPrice?.toString() || '');
      setEditedBudgetMax(effectivePostData.maxPrice?.toString() || '');
      setEditedCategory(effectivePostData.category || '');
      setEditedRequirements(effectivePostData.requirements || []);
    }
  }, [effectivePostData]);

  const isSubmittedPath = location.pathname.includes('/submitted');

  const [files, setFiles] = useState<FileForUpload[]>([]);
  const [submittedFiles, setSubmittedFiles] = useState<MediaFile[]>([]);
  const [filesSubmitted, setFilesSubmitted] = useState(isSubmittedPath);
  const [projectStarted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing files when negotiationId is available
  useEffect(() => {
    const fetchFiles = async () => {
      if (negotiationId) {
        try {
          const mediaFiles = await listMedia('negotiation_attachment', negotiationId);
          // Transform MediaFile to match the expected format
          const transformedFiles: MediaFile[] = mediaFiles.map(mf => ({
            id: String(mf.id),
            file_url: mf.file_url,
            file_type: mf.file_type,
            file_name: mf.file_url.split('/').pop() || 'file',
            file_size: 0, // Size not available from API
            created_at: mf.created_at,
          }));
          setSubmittedFiles(transformedFiles);
          if (transformedFiles.length > 0) {
            setFilesSubmitted(true);
          }
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      }
    };
    fetchFiles();
  }, [negotiationId]);

  // Format budget for display
  const formatBudget = (min: string | number, max: string | number) => {
    const minVal = typeof min === 'string' ? min : min.toString();
    const maxVal = typeof max === 'string' ? max : max.toString();
    return `${minVal} - ${maxVal} DA`;
  };

  // Get project data (either from postData/parsed data or defaults)
  // Only use defaults if we don't have negotiationId (meaning we're not expecting to fetch data)
  const hasDataToFetch = negotiationId && !postData;
  const shouldShowDefaults = !hasDataToFetch && !effectivePostData;
  
  const projectTitle = isEditing 
    ? editedTitle 
    : (effectivePostData?.title || (shouldShowDefaults ? 'E-Commerce Website Redesign – Bloom & Co.' : ''));
  const projectDescription = isEditing 
    ? editedDescription 
    : (effectivePostData?.description || (shouldShowDefaults ? 'Design and develop a modern, visually compelling e-commerce platform for our boutique floral business...' : ''));
  const projectBudget = isEditing 
    ? formatBudget(editedBudgetMin, editedBudgetMax)
    : (effectivePostData 
        ? formatBudget(effectivePostData.minPrice, effectivePostData.maxPrice) 
        : (shouldShowDefaults ? '$2,500' : ''));
  const submittedDate = fetchedNegotiation?.created_at 
    ? new Date(fetchedNegotiation.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : (effectivePostData ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
  const freelancerName = effectiveFreelancer?.name || (shouldShowDefaults ? 'Sarah Jenkins' : '');
  const freelancerRole = effectiveFreelancer?.role || (shouldShowDefaults ? 'Lead UI/UX Designer' : '');
  const freelancerPhoto = effectiveFreelancer?.photo || '';

  const handleFileSelect = (newFiles: FileForUpload[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    if (!showSuccessMessage) return;

    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  const handleSubmitFiles = async () => {
    console.log('[ProjectProgressClientOverview] 🚀 handleSubmitFiles STARTED');
    console.log(`   - negotiationId: ${negotiationId}`);
    console.log(`   - files to upload: ${files.length}`);
    
    if (!negotiationId || files.length === 0) {
      console.log('[ProjectProgressClientOverview] ❌ Missing negotiationId or files');
      return;
    }

    setIsUploading(true);
    try {
      console.log('[ProjectProgressClientOverview] 📤 Starting file uploads...');
      
      // Upload all files - FileForUpload has a 'file' property with the actual File
      const uploadPromises = files.map(fileForUpload => {
        console.log(`   - Uploading: ${fileForUpload.file.name} (${fileForUpload.file.size} bytes)`);
        return uploadMedia(fileForUpload.file, 'negotiation_attachment', negotiationId);
      });

      console.log('[ProjectProgressClientOverview] ⏳ Waiting for all uploads to complete...');
      const uploadedMediaFiles = await Promise.all(uploadPromises);
      console.log('[ProjectProgressClientOverview] ✅ All uploads completed:', uploadedMediaFiles);
      
      // Transform to match expected format
      const transformedFiles: MediaFile[] = uploadedMediaFiles.map(mf => ({
        id: String(mf.id),
        file_url: mf.file_url,
        file_type: mf.file_type,
        file_name: mf.file_url.split('/').pop() || 'file',
        file_size: 0,
        created_at: mf.created_at,
      }));

      setSubmittedFiles(prev => [...prev, ...transformedFiles]);
      setFiles([]);
      setFilesSubmitted(true);
      setShowSuccessMessage(true);
      
      console.log('[ProjectProgressClientOverview] 🔥 DATABASE-DRIVEN STATE UPDATE');
      console.log(`   - Local state updated with ${transformedFiles.length} files`);
      
      // Force database check after upload to trigger polling detection
      setTimeout(() => {
        console.log('[ProjectProgressClientOverview] 🔔 Triggering immediate database check...');
        
        // Navigate to same page to force ProjectProgressPage to recheck database
        const params = new URLSearchParams(location.search);
        navigate(`?${params.toString()}&refresh=${Date.now()}`, { 
          replace: true,
          state: {
            ...effectiveProjectState,
            forceRefresh: true,
            clientFilesSubmitted: true,
            submittedFiles: [...(effectiveProjectState.submittedFiles || []), ...transformedFiles]
          }
        });
      }, 1000); // Give the backend a moment to save the files
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* <div className={styles.tabBar}>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          <svg
            className={styles.tabIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Overview
        </button>
      </div> */}

      <div className={styles.tabContent}>
        {loading || (negotiationId && !postData && !parsedProjectData) ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading project data...</p>
          </div>
        ) : (
          <>
            {/* Settings Mode Controls */}
            {settingsMode && (
          <div className="mb-4 flex justify-end gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: '18px', verticalAlign: 'middle' }}>edit</span>
                Edit Project Details
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Save changes (you can add API call here later)
                    setIsEditing(false);
                    // Update postData if needed
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: '18px', verticalAlign: 'middle' }}>save</span>
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    // Reset to original values
                    if (effectivePostData) {
                      setEditedTitle(effectivePostData.title || '');
                      setEditedDescription(effectivePostData.description || '');
                      setEditedBudgetMin(effectivePostData.minPrice?.toString() || '');
                      setEditedBudgetMax(effectivePostData.maxPrice?.toString() || '');
                      setEditedCategory(effectivePostData.category || '');
                      setEditedRequirements(effectivePostData.requirements || []);
                    }
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: '18px', verticalAlign: 'middle' }}>close</span>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Editable Project Details Form (when in edit mode) */}
        {isEditing ? (
          <div className="bg-white dark:bg-[#1C2A3B] rounded-xl border border-[#0a66f0]/20 shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-[#0a66f0] dark:text-white mb-6">Edit Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0a66f0] dark:text-white mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-3"
                  placeholder="Project title..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0a66f0] dark:text-white mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={editedCategory}
                  disabled
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-[#101722] text-[#425466] dark:text-slate-400 p-3 opacity-60"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#0a66f0] dark:text-white mb-2">
                    Budget Min (DA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editedBudgetMin}
                    onChange={(e) => setEditedBudgetMin(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-3"
                    placeholder="Minimum budget"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#0a66f0] dark:text-white mb-2">
                    Budget Max (DA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editedBudgetMax}
                    onChange={(e) => setEditedBudgetMax(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-3"
                    placeholder="Maximum budget"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0a66f0] dark:text-white mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-[#f5f7f8] dark:bg-[#101722] text-[#425466] dark:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none p-3"
                  placeholder="Project description..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0a66f0] dark:text-white mb-2">
                  Required Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {editedRequirements.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Only render ProjectCard if we have data or are not waiting for data */}
        {(effectivePostData || !hasDataToFetch) && (
          <>
            <ProjectCard
              projectTitle={projectTitle}
              projectDescription={projectDescription}
              submittedOn={submittedDate}
              budget={projectBudget}
              userType="freelancer"
              userName={freelancerName}
              userRole={freelancerRole}
              userPhoto={freelancerPhoto}
              userId={freelancerProfileId}
            >
              {!filesSubmitted ? (
                <FileUploadSection
                  files={files}
                  onFileSelect={handleFileSelect}
                  onRemoveFile={handleRemoveFile}
                  onSubmit={handleSubmitFiles}
                />
              ) : (
                <FileDisplaySection
                  files={submittedFiles}
                  title="Project Files"
                  showSuccessMessage={showSuccessMessage}
                />
              )}
            </ProjectCard>

            {filesSubmitted && !projectStarted && (
              <StatusBadge
                type="waiting"
                message="Waiting for freelancer to start"
              />
            )}

            {projectStarted && (
              <StatusBadge
                type="started"
                message="Freelancer started working on your project"
              />
            )}
          </>
        )}
          </>
        )}
      </div>
    </div>
  );
}
