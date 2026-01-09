import React, { useState, useMemo, useEffect } from 'react';
import { useUserType } from '../../../context/UserTypeContext';
import ConfirmModal from '../../../components/ConfirmModal';
import { categoriesWithSkills as allCategoriesWithSkills } from '../../../components/categories';
import { useNavigate } from 'react-router-dom';
import { getRequests, applyToRequest } from '../../../api/requestApi';
import { getNegotiations, declineNegotiation, agreeNegotiation, acceptApplicant } from '../../../api/negotiationApi';
import { getUserId, getUserProfile } from '../../../lib/auth';

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showOwnOnly, setShowOwnOnly] = useState(false);
  const { userType } = useUserType();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // Get from auth context
  const [currentUserRole, setCurrentUserRole] = useState<string>('guest'); // Will be fetched from auth
  const navigate = useNavigate();
  
  // State for requests and negotiations
  const [requests, setRequests] = useState<any[]>([]);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [modal, setModal] = useState<{ 
    open: boolean; 
    action: null | 'refuse' | 'accept' | 'apply' | 'login' | 'cancel_application' | 'view_applicants'; 
    request?: any; 
    negotiation?: any;
    negotiations?: any[];
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
    // Get current user ID from auth
    const userId = getUserId();
    setCurrentUserId(userId);
    
    // Set user role based on userType context
    if (userType === 'freelancer') {
      setCurrentUserRole('freelancer');
    } else if (userType === 'client') {
      setCurrentUserRole('client');
    } else {
      setCurrentUserRole('guest');
    }
    
    fetchData();
  }, [userType]);
  
  // Refetch data when showOwnOnly changes (for clients)
  useEffect(() => {
    if (currentUserRole === 'client') {
      fetchData();
    }
  }, [showOwnOnly]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch requests - backend will return appropriate requests based on user role
      // Add own_only parameter for clients if needed
      let requestsData;
      if (currentUserRole === 'client') {
        requestsData = await getRequests({ own_only: showOwnOnly ? 'true' : 'false' });
      } else {
        requestsData = await getRequests();
      }
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
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      console.error('User type:', userType);
      console.error('Current user role:', currentUserRole);
      setError(err.response?.data?.detail || err.message || 'Failed to load requests');
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
  
  // Get negotiation for a request if exists (return the most recent one)
  const getNegotiationForRequest = (requestId: number) => {
    const relevantNegotiations = negotiations.filter(
      neg => neg.request?.id === requestId && 
             neg.freelancer?.user?.id === currentUserId
    );
    
    if (relevantNegotiations.length === 0) return null;
    
    // Sort by created_at descending and return the most recent
    const mostRecent = relevantNegotiations.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    // Debug log for the most recent negotiation
    console.log(`Most recent negotiation for request ${requestId}:`, {
      id: mostRecent.id,
      status: mostRecent.status,
      client_agreed: mostRecent.client_agreed,
      freelancer_agreed: mostRecent.freelancer_agreed,
      created_at: mostRecent.created_at
    });
    
    return mostRecent;
  };

  // Get the button text and style for freelancer's application status
  const getFreelancerButtonInfo = (requestId: number) => {
    const negotiation = getNegotiationForRequest(requestId);
    if (!negotiation) {
      console.log(`No negotiation found for request ${requestId} - showing Apply Now`);
      return { text: 'Apply Now', className: 'border-blue-600 text-blue-700 hover:bg-blue-50', action: 'apply' };
    }

    console.log(`Getting button info for request ${requestId}:`, {
      negotiationId: negotiation.id,
      status: negotiation.status,
      client_agreed: negotiation.client_agreed,
      freelancer_agreed: negotiation.freelancer_agreed
    });

    switch (negotiation.status) {
      case 'agreed':
        return { 
          text: `${negotiation.client?.user?.first_name || 'Client'} approved your application`, 
          className: 'border-green-600 text-green-700 bg-green-50 cursor-default',
          action: null 
        };
      case 'completed':
        return { 
          text: 'Project Completed', 
          className: 'border-gray-600 text-gray-700 bg-gray-50 cursor-default',
          action: null 
        };
      case 'declined':
        return { 
          text: 'Application Declined', 
          className: 'border-gray-400 text-gray-600 bg-gray-50 cursor-default',
          action: null 
        };
      case 'in_progress':
        // For job applications: freelancer already agreed when applying
        // So check if client has agreed yet
        if (negotiation.client_agreed && negotiation.freelancer_agreed) {
          return { 
            text: 'Both parties agreed - Project starting', 
            className: 'border-green-600 text-green-700 bg-green-50 cursor-default',
            action: null 
          };
        } else if (!negotiation.client_agreed && negotiation.freelancer_agreed) {
          // Freelancer applied (agreed) but waiting for client to accept
          return { 
            text: 'Waiting for client response', 
            className: 'border-yellow-600 text-yellow-700 bg-yellow-50 cursor-default',
            action: null 
          };
        }
        // If freelancer hasn't agreed (shouldn't happen for job applications)
        return { 
          text: 'Cancel Application', 
          className: 'border-red-600 text-red-700 hover:bg-red-50',
          action: 'cancel_application' 
        };
      default:
        return { 
          text: 'Cancel Application', 
          className: 'border-red-600 text-red-700 hover:bg-red-50',
          action: 'cancel_application' 
        };
    }
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
  
  // Handle cancel application (freelancer)
  const handleCancelApplication = async (negotiationId: number) => {
    try {
      await declineNegotiation(negotiationId, 'Freelancer cancelled application');
      await fetchData();
      setModal({ open: false, action: null });
    } catch (err: any) {
      alert(err.message || 'Failed to cancel application');
    }
  };

  // Handle refuse applicant (client)
  const handleRefuseApplicant = async (negotiationId: number) => {
    try {
      console.log('Refusing applicant with negotiation ID:', negotiationId);
      await declineNegotiation(negotiationId, 'Client refused application');
      console.log('Successfully refused applicant, refreshing data');
      await fetchData();
      setModal({ open: false, action: null });
    } catch (err: any) {
      console.error('Error refusing applicant:', err);
      alert(err.message || 'Failed to refuse applicant');
    }
  };
  
  // Handle accept applicant (client accepts freelancer)
  const handleAcceptApplicant = async (negotiationId: number) => {
    try {
      console.log('Accepting applicant with negotiation ID:', negotiationId);
      
      // Use the new accept_applicant endpoint that handles the complete flow
      await acceptApplicant(negotiationId);
      console.log('Successfully accepted applicant, refreshing data');
      
      // Refresh data to get updated negotiations
      await fetchData();
      
      console.log('Data refreshed, navigating to project progress');
      // Navigate to project progress with negotiation
      navigate(`/project-progress?negotiationId=${negotiationId}`, { 
        state: { negotiationId } 
      });
      setModal({ open: false, action: null });
    } catch (err: any) {
      console.error('Error accepting applicant:', err);
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
            {currentUserRole === 'client' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ownOnly"
                  checked={showOwnOnly}
                  onChange={e => setShowOwnOnly(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="ownOnly" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                  My Posts Only
                </label>
              </div>
            )}
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
                      
                      {/* View Applicants button for request owners */}
                      {isOwner && applicantsCount > 0 && (
                        <button
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          onClick={() => setModal({ 
                            open: true, 
                            action: 'view_applicants', 
                            request: r,
                            negotiations: requestNegotiations 
                          })}
                        >
                          View Applicants
                        </button>
                      )}
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
                      <button
                        onClick={() => {
                          const clientUser = r.client?.user;
                          if (clientUser) {
                            if (currentUserRole === 'guest') {
                              setModal({ open: true, action: 'login' });
                            } else {
                              if (clientUser.role === 'company') {
                                navigate(`/profile/company/${clientUser.id}`);
                              } else {
                                navigate(`/profile/client/${clientUser.id}`);
                              }
                            }
                          }
                        }}
                        className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                        title={currentUserRole === 'guest' ? 'Login to view client profile' : 'View client profile'}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold">
                          {r.client?.user?.first_name?.[0] || 'C'}
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-300 hover:text-primary">
                          {r.client?.user?.first_name && r.client?.user?.last_name 
                            ? `${r.client.user.first_name} ${r.client.user.last_name}` 
                            : r.client?.user?.first_name || 'Client'}
                        </span>
                        <span className="material-symbols-outlined text-[12px] text-slate-400">open_in_new</span>
                      </button>
                      
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
                        
                        {/* Freelancer view - Apply/Status button */}
                        {userType === 'freelancer' && !isOwner && (
                          (() => {
                            const buttonInfo = getFreelancerButtonInfo(r.id);
                            return (
                              <button
                                className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs shadow-sm bg-white transition-all duration-300 ${buttonInfo.className}`}
                                onClick={() => {
                                  if (buttonInfo.action === 'apply') {
                                    setModal({ open: true, action: 'apply', request: r });
                                  } else if (buttonInfo.action === 'cancel_application') {
                                    setModal({ open: true, action: 'cancel_application', negotiation });
                                  }
                                }}
                                disabled={!buttonInfo.action}
                              >
                                {buttonInfo.text}
                              </button>
                            );
                          })()
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
                                src={neg.freelancer?.profile_picture ? `http://localhost:8000${neg.freelancer.profile_picture}` : 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                                alt={neg.freelancer?.user?.first_name || 'Freelancer'} 
                                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 shadow" 
                              />
                              <button
                                className="text-xs text-slate-700 dark:text-slate-200 font-medium mr-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                onClick={() => {
                                  if (neg.freelancer?.user?.id) {
                                    navigate(`/profile/freelancer/${neg.freelancer.user.id}`);
                                  }
                                }}
                              >
                                {neg.freelancer?.user?.first_name} {neg.freelancer?.user?.last_name}
                              </button>
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
        {modal.open && modal.action === 'view_applicants' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20" onClick={() => setModal({ open: false, action: null })}>
            <div className="bg-white dark:bg-[#1C2A3B] rounded-xl p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Applicants for "{modal.request?.title}"</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {modal.negotiations?.length || 0} applicant{(modal.negotiations?.length || 0) !== 1 ? 's' : ''}
              </p>
              
              <div className="space-y-4">
                {modal.negotiations?.map((neg: any) => (
                  <div key={neg.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={neg.freelancer?.profile_picture ? `http://localhost:8000${neg.freelancer.profile_picture}` : 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                        alt={neg.freelancer?.user?.first_name || 'Freelancer'} 
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow"
                      />
                      <div>
                        <button
                          className="font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => {
                            if (neg.freelancer?.user?.id) {
                              navigate(`/profile/freelancer/${neg.freelancer.user.id}`);
                            }
                          }}
                        >
                          {neg.freelancer?.user?.first_name} {neg.freelancer?.user?.last_name}
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {neg.freelancer?.user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => handleAcceptApplicant(neg.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => handleRefuseApplicant(neg.id)}
                      >
                        Refuse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setModal({ open: false, action: null })}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
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
            modal.action === 'view_applicants' ? 'View Applicants' :
            'Confirmation'
          }
          message={
            modal.action === 'apply' ? 'Are you sure you want to apply for this request?' :
            modal.action === 'cancel_application' ? 'Are you sure you want to cancel your application?' :
            modal.action === 'accept' ? 'This will create a project with this freelancer.' :
            modal.action === 'refuse' ? 'This will remove the applicant from this request.' :
            modal.action === 'view_applicants' ? 'Here are all the applicants for this request.' :
            ''
          }
          confirmText={
            modal.action === 'apply' ? 'Apply' :
            modal.action === 'cancel_application' ? 'Cancel Application' :
            modal.action === 'accept' ? 'Accept' :
            modal.action === 'refuse' ? 'Refuse' :
            modal.action === 'view_applicants' ? 'Close' :
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
              await handleRefuseApplicant(modal.negotiation.id);
            }
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;