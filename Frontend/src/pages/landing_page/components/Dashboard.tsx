import React, { useState, useMemo, useEffect } from 'react';
import { useUserType } from '../../../context/UserTypeContext';
import ConfirmModal from '../../../components/ConfirmModal';
import { categoriesWithSkills as allCategoriesWithSkills } from '../../../components/categories';
import { useNavigate } from 'react-router-dom';
import { getRequests, applyToRequest } from '../../../api/requestApi';
import { getNegotiations } from '../../../api/negotiationApi';

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { userType } = useUserType();
  const [currentUserId] = useState<number>(1); // Get from auth context
  const [currentUserRole, setCurrentUserRole] = useState<string>('client'); // Will be fetched from auth
  const navigate = useNavigate();
  
  // State for requests and negotiations
  const [requests, setRequests] = useState<any[]>([]);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [modal, setModal] = useState<{ 
    open: boolean; 
    action: null | 'refuse' | 'accept' | 'apply' | 'login' | 'cancel_application'; 
    request?: any; 
    negotiation?: any;
  }>({ open: false, action: null });
  
  // Category icon mapping
  const categoryIcons: Record<string, string> = {
    'Development & IT': 'code',
    'Design & Creative': 'palette',
    'AI Services': 'smart_toy',
    'Sales & Marketing': 'campaign',
    'Writing & Translation': 'draw',
    'Admin & Customer Support': 'support_agent',
    'Finance & Accounting': 'payments',
    'Legal': 'gavel',
    'HR & Training': 'group',
    'Engineering & Architecture': 'apartment',
  };
  
  // Fetch requests and negotiations on mount
  useEffect(() => {
    // Set user role based on userType context
    if (userType === 'freelancer') {
      setCurrentUserRole('freelancer');
    } else if (userType === 'client') {
      setCurrentUserRole('client');
    }
    
    fetchData();
  }, [userType]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch requests - backend will return appropriate requests based on user role
      const requestsData = await getRequests();
      setRequests(requestsData || []);
      
      // Fetch negotiations - only if user is client or freelancer
      if (userType !== 'guest') {
        try {
          const negotiationsData = await getNegotiations();
          setNegotiations(negotiationsData || []);
        } catch (negError) {
          console.warn('Could not fetch negotiations:', negError);
          setNegotiations([]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if current user (freelancer) has applied to a request
  const hasApplied = (requestId: number) => {
    return negotiations.some(
      neg => neg.request?.id === requestId && 
             neg.freelancer?.user?.id === currentUserId &&
             neg.status !== 'declined'
    );
  };
  
  // Get negotiation for a request if exists
  const getNegotiationForRequest = (requestId: number) => {
    return negotiations.find(
      neg => neg.request?.id === requestId && 
             neg.freelancer?.user?.id === currentUserId
    );
  };
  
  // Get count of applicants (negotiations) for a request
  const getApplicantsCount = (requestId: number) => {
    return negotiations.filter(
      neg => neg.request?.id === requestId && neg.status !== 'declined'
    ).length;
  };
  
  // Get negotiations for a request (for client view)
  const getRequestNegotiations = (requestId: number) => {
    return negotiations.filter(
      neg => neg.request?.id === requestId && neg.status !== 'declined'
    );
  };
  
  // Filtered requests
  const filteredRequests = useMemo(() => {
    const keywords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return requests.filter(r => {
      // Only show active requests (not cancelled or completed)
      if (r.status === 'cancelled' || r.status === 'completed') return false;
      
      // Category filter
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
      
      // Search filter
      if (keywords.length > 0) {
        const text = `${r.title} ${r.description || ''}`.toLowerCase();
        if (!keywords.every(kw => text.includes(kw))) return false;
      }
      
      // Price filter
      if (minPrice && r.budget_max < parseInt(minPrice)) return false;
      if (maxPrice && r.budget_min > parseInt(maxPrice)) return false;
      
      return true;
    });
  }, [requests, selectedCategory, search, minPrice, maxPrice]);
  
  // Handle freelancer application
  const handleApply = async (requestId: number) => {
    try {
      await applyToRequest(requestId, currentUserId);
      await fetchData(); // Refresh data
      setModal({ open: false, action: null });
    } catch (err: any) {
      alert(err.message || 'Failed to apply to request');
    }
  };
  
  // Handle cancel application
  const handleCancelApplication = async (negotiationId: number) => {
    try {
      // You'll need to implement declineNegotiation in negotiationApi
      // await declineNegotiation(negotiationId, 'Freelancer cancelled application');
      await fetchData();
      setModal({ open: false, action: null });
    } catch (err: any) {
      alert(err.message || 'Failed to cancel application');
    }
  };
  
  // Handle accept applicant (client accepts freelancer)
  const handleAcceptApplicant = async (negotiationId: number) => {
    try {
      // Navigate to project progress with negotiation
      navigate(`/project-progress?negotiationId=${negotiationId}`, { 
        state: { negotiationId } 
      });
      setModal({ open: false, action: null });
    } catch (err: any) {
      alert(err.message || 'Failed to accept applicant');
    }
  };
  
  // Handle edit request
  const handleEditRequest = (request: any) => {
    navigate('/client-dashboard/addPost', { state: { editingRequest: request } });
  };
  
  // Extract skills from attachments (temporary until backend adds requirements field)
  const getRequestSkills = (request: any): string[] => {
    if (!request.attachments || !Array.isArray(request.attachments)) return [];
    const requirementsItem = request.attachments.find((att: any) => att.type === 'requirements');
    return requirementsItem?.data || [];
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-blue-500 animate-spin">progress_activity</span>
          <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <span className="material-symbols-outlined text-5xl text-red-500">error</span>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-8 relative min-h-screen">
        {/* Floating Add Post Button */}
        {(userType === 'client' || userType === 'guest') && (
          <button
            className="fixed bottom-8 right-8 z-40 w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 text-3xl"
            onClick={() => {
              if (userType === 'guest') {
                setModal({ open: true, action: 'login' });
              } else {
                navigate('/client-dashboard/addPost');
              }
            }}
            aria-label="Post a Request"
          >
            <span className="material-symbols-outlined font-bold">add</span>
          </button>
        )}
        
        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-[#1C2A3B] rounded-xl border border-primary/20 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] focus-within:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)] p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative group w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full pl-12 pr-4 h-12 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm transition-all outline-none placeholder:text-slate-400 dark:text-slate-200"
              placeholder="Search requests by title or description..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-4 items-center w-full lg:w-auto">
            <div className="relative min-w-[140px]">
              <select
                className="w-full h-12 pl-4 pr-10 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm appearance-none cursor-pointer text-slate-600 dark:text-slate-300"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {allCategoriesWithSkills.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                placeholder="Min DZD"
                className="w-24 h-12 pl-4 pr-2 bg-background-light dark:bg-background-dark border border-slate-200 rounded-lg text-sm text-slate-600 dark:text-slate-300 focus:border-primary focus:ring-0"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max DZD"
                className="w-24 h-12 pl-4 pr-2 bg-background-light dark:bg-background-dark border border-slate-200 rounded-lg text-sm text-slate-600 dark:text-slate-300 focus:border-primary focus:ring-0"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
              <span className="text-xs text-slate-500 ml-1">DZD</span>
            </div>
          </div>
        </div>
        
        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full py-12">
              <span className="material-symbols-outlined text-6xl mb-4 block text-gray-300">search_off</span>
              <p>No requests found</p>
            </div>
          ) : (
            filteredRequests.map(r => {
              const skills = getRequestSkills(r);
              const applicantsCount = getApplicantsCount(r.id);
              const requestNegotiations = getRequestNegotiations(r.id);
              const applied = hasApplied(r.id);
              const negotiation = getNegotiationForRequest(r.id);
              const isOwner = r.client?.user?.id === currentUserId;
              
              return (
                <div key={r.id} className="group bg-white dark:bg-[#1C2A3B] rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] hover:border-blue-300 hover:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)] transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${r.category in categoryIcons ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                      <span className="material-symbols-outlined">
                        {categoryIcons[r.category] || 'work'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      <span>{applicantsCount} applicant{applicantsCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#0A2540] dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                    {r.description || 'No description provided'}
                  </p>
                  
                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-xs text-slate-400">+{skills.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">payments</span>
                      <span className="font-medium">{r.budget_min} - {r.budget_max} DZD</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold">
                          {r.client?.user?.first_name?.[0] || 'C'}
                        </div>
                        <span className="text-xs text-slate-500">Client</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Client view - Edit button */}
                        {userType === 'client' && isOwner && (
                          <button
                            className="px-3 py-1.5 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700"
                            onClick={() => handleEditRequest(r)}
                          >
                            Edit
                          </button>
                        )}
                        
                        {/* Freelancer view - Apply/Cancel button */}
                        {userType === 'freelancer' && !isOwner && (
                          applied ? (
                            <button
                              className="px-3 py-1.5 rounded-lg border-2 border-red-600 text-red-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-red-50"
                              onClick={() => setModal({ open: true, action: 'cancel_application', negotiation })}
                            >
                              Cancel Application
                            </button>
                          ) : (
                            <button
                              className="px-3 py-1.5 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-blue-50"
                              onClick={() => setModal({ open: true, action: 'apply', request: r })}
                            >
                              Apply Now
                            </button>
                          )
                        )}
                        
                        {/* Guest view - Login prompt */}
                        {userType === 'guest' && (
                          <button
                            className="px-3 py-1.5 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-blue-50"
                            onClick={() => setModal({ open: true, action: 'login' })}
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Applicants section (client view only) */}
                    {userType === 'client' && isOwner && requestNegotiations.length > 0 && (
                      <div className="mt-2 border-t border-blue-100 pt-2">
                        <p className="text-xs text-slate-500 mb-2">Applicants:</p>
                        <div className="flex flex-col gap-2">
                          {requestNegotiations.map((neg: any) => (
                            <div key={neg.id} className="flex items-center gap-2 group/applicant">
                              <img 
                                src={neg.freelancer?.profile_picture || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                                alt={neg.freelancer?.user?.first_name || 'Freelancer'} 
                                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 shadow" 
                              />
                              <span className="text-xs text-slate-700 dark:text-slate-200 font-medium mr-2">
                                {neg.freelancer?.user?.first_name} {neg.freelancer?.user?.last_name}
                              </span>
                              <button
                                className="ml-auto w-6 h-6 flex items-center justify-center border border-blue-400 text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                                title="Accept"
                                onClick={() => setModal({ open: true, action: 'accept', negotiation: neg })}
                              >
                                <span className="material-symbols-outlined text-[18px]">check</span>
                              </button>
                              <button
                                className="w-6 h-6 flex items-center justify-center border border-red-400 text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                title="Refuse"
                                onClick={() => setModal({ open: true, action: 'refuse', negotiation: neg })}
                              >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Modals */}
        {modal.open && modal.action === 'login' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20" onClick={() => setModal({ open: false, action: null })}>
            <div className="bg-white dark:bg-[#1C2A3B] rounded-xl p-8 max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Get Started</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign up or log in to continue</p>
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  onClick={() => { setModal({ open: false, action: null }); navigate('/signup'); }}
                >
                  Sign Up
                </button>
                <button 
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  onClick={() => { setModal({ open: false, action: null }); navigate('/login'); }}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        )}
        
        <ConfirmModal
          open={modal.open && modal.action !== 'login'}
          title={
            modal.action === 'apply' ? 'Apply for Request' :
            modal.action === 'cancel_application' ? 'Cancel Application' :
            modal.action === 'accept' ? 'Accept Applicant' :
            modal.action === 'refuse' ? 'Refuse Applicant' :
            'Confirmation'
          }
          message={
            modal.action === 'apply' ? 'Are you sure you want to apply for this request?' :
            modal.action === 'cancel_application' ? 'Are you sure you want to cancel your application?' :
            modal.action === 'accept' ? 'This will create a project with this freelancer.' :
            modal.action === 'refuse' ? 'This will remove the applicant from this request.' :
            ''
          }
          confirmText={
            modal.action === 'apply' ? 'Apply' :
            modal.action === 'cancel_application' ? 'Cancel Application' :
            modal.action === 'accept' ? 'Accept' :
            modal.action === 'refuse' ? 'Refuse' :
            'Confirm'
          }
          cancelText="Back"
          onCancel={() => setModal({ open: false, action: null })}
          onConfirm={async () => {
            if (modal.action === 'apply' && modal.request) {
              await handleApply(modal.request.id);
            } else if (modal.action === 'cancel_application' && modal.negotiation) {
              await handleCancelApplication(modal.negotiation.id);
            } else if (modal.action === 'accept' && modal.negotiation) {
              await handleAcceptApplicant(modal.negotiation.id);
            } else if (modal.action === 'refuse' && modal.negotiation) {
              await handleCancelApplication(modal.negotiation.id);
            }
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;