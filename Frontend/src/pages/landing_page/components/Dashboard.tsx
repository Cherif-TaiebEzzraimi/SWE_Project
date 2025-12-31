import React, { useState, useMemo } from 'react';
import { useUserType } from '../../../context/UserTypeContext';
import ConfirmModal from '../../../components/ConfirmModal';
import { categoriesWithSkills as allCategoriesWithSkills } from '../../../components/categories';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../../context/PostsContext';




const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { userType, setUserType } = useUserType();
  const [userId] = useState<number>(1); // Simulate logged-in user ID
  const { posts, startEdit, updatePost } = usePosts();
  const navigate = useNavigate();
  // Modal state for confirmation dialogs
  const [modal, setModal] = useState<{ open: boolean; action: null | 'refuse' | 'accept' | 'hire' | 'apply' | 'login'; post?: any; applicant?: any; freelancer?: any }>({ open: false, action: null });


  // Remove price range options, use min/max DZD

  // Category icon mapping (Material Symbols)
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

  // Filtered posts with search, category, and price
  const filteredPosts = useMemo(() => {
    // Split search into keywords, ignore order, match all
    const keywords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return posts.filter(p => {
      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      // Search: all keywords must be present in title or description
      if (keywords.length > 0) {
        const text = `${p.title} ${p.description}`.toLowerCase();
        if (!keywords.every(kw => text.includes(kw))) return false;
      }
      // Price: filter by min/max DZD
      if (minPrice && p.maxPrice < parseInt(minPrice)) return false;
      if (maxPrice && p.minPrice > parseInt(maxPrice)) return false;
      return true;
    });
  }, [posts, selectedCategory, search, minPrice, maxPrice]);


  // Filter freelancers by category and search


  return (
    <>
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-8 relative min-h-screen">
        {/* Toggle user type for testing - move to left margin */}
        <div className="fixed left-0 top-1/4 z-30 flex flex-col gap-2 pl-2">
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-md border-2 mb-1 shadow text-xs font-bold transition-all duration-200 ${userType === 'client' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'}`}
            onClick={() => setUserType('client')}
            aria-label="Client View"
          >
            C
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-md border-2 mb-1 shadow text-xs font-bold transition-all duration-200 ${userType === 'freelancer' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'}`}
            onClick={() => setUserType('freelancer')}
            aria-label="Freelancer View"
          >
            F
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-md border-2 shadow text-xs font-bold transition-all duration-200 ${userType === 'guest' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'}`}
            onClick={() => setUserType('guest')}
            aria-label="Guest View"
          >
            G
          </button>
        </div>                                                                                      
        {/* Floating Add Post Button (client only, not visible in freelancers view) */}
  {/* Add Post button for client or guest */}
  {(userType === 'client' || userType === 'guest') && (
    <button                                                                                                                                                
      className="fixed bottom-8 right-8 z-40 w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 text-3xl"
      onClick={() => {
        if (userType === 'guest') setModal({ open: true, action: 'login' });
        else {
          // Clear editing state before navigating to add post
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('editingPost');
          }
          window.location.href = '/client-dashboard/addPost';
        }
      }}
      aria-label="Offer a Job"
    >
      <span className="material-symbols-outlined font-bold">add</span>
    </button>
  )}
        {/* Search and Filters Bar */}
  {/* Jobs/posts view only, no view toggle needed */}
          <div className="bg-white dark:bg-[#1C2A3B] rounded-xl border border-primary/20 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] focus-within:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)] p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative group w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input
                className="w-full pl-12 pr-4 h-12 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm transition-all outline-none placeholder:text-slate-400 dark:text-slate-200"
                placeholder="Search by title, keyword, or client..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-4 items-center w-full lg:w-auto">
              {/* Category Filter */}
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
              {/* Price Filter: Min/Max DZD */}
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
              <button className="h-12 w-12 flex items-center justify-center bg-background-light dark:bg-background-dark rounded-lg text-slate-500 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>


        {/* Content area - Modern Jobs Board Grid */}
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
          {filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full">No posts found for this category.</div>
          ) : (
            filteredPosts.map(p => (
                <div key={p.id} className="group bg-white dark:bg-[#1C2A3B] rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] hover:border-blue-300 hover:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)] transition-all duration-300 flex flex-col h-full relative overflow-hidden animate-in">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${p.category in categoryIcons ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                      <span className="material-symbols-outlined">
                        {categoryIcons[p.category] || 'work'}
                      </span>
                    </div>
                    {/* You can add status/label here if needed */}
                  </div>
                  <h3 className="text-lg font-bold text-[#0A2540] dark:text-white mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 flex-grow">{p.description}</p>
                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">payments</span>
                      <span className="font-medium">{p.minPrice} - {p.maxPrice} DZD</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold">
                          {p.userId === 1 ? 'JD' : 'CL'}
                        </div>
                        <span className="text-xs text-slate-500">Client</span>
                      </div>
                      <div className="flex gap-2">
                        {/* Hide edit button for guest */}
                        {userType === 'client' && userId === (p as any).userId && (
                          <button
                            className="px-3 py-1.5 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 hover:shadow-[0_0_0_3px_#e0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() => {
                              startEdit(p);
                              navigate('/client-dashboard/addPost');
                            }}
                          >
                            Edit
                          </button>
                        )}
      {/* Guest Login/Signup Modal (reuse CTASection style) */}
      {modal.open && modal.action === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20" onClick={() => setModal({ open: false, action: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal({ open: false, action: null })}>×</button>
            <h3 className="modal-title">Get Started</h3>
            <p className="modal-description">Please sign up or log in to continue</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-signup">Sign Up</button>
              <button className="modal-btn modal-btn-login">Log In</button>
            </div>
          </div>
        </div>
      )}
                        {userType === 'freelancer' && (
                          (() => {
                            // Simulate logged-in freelancer
                            const freelancer = { id: 999, name: 'Current Freelancer', avatar: 'https://randomuser.me/api/portraits/men/99.jpg' };
                            const alreadyApplied = (p.applicants || []).some((a: any) => a.id === freelancer.id);
                            if (alreadyApplied) {
                              return (
                                <button
                                  className="px-3 py-1.5 rounded-lg border-2 border-red-600 text-red-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-red-50 hover:text-red-800 hover:border-red-700 hover:shadow-[0_0_0_3px_#fee2e2] focus:outline-none focus:ring-2 focus:ring-red-300"
                                  title="Cancel Application"
                                  onClick={() => setModal({ open: true, action: 'refuse', post: p, applicant: freelancer })}
                                >
                                  × Cancel Application
                                </button>
                              );
                            } else {
                              return (
                                <button
                                  className="px-3 py-1.5 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-xs shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 hover:shadow-[0_0_0_3px_#e0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  onClick={() => setModal({ open: true, action: 'apply', post: p, applicant: freelancer })}
                                >
                                  Apply Now
                                </button>
                              );
                            }
                          })()
                        )}
                      </div>
                    </div>
                    {/* Applicants section */}
                    {p.applicants && p.applicants.length > 0 && (
                      <div className="mt-2 border-t border-blue-100 pt-2">
                        <div className="flex flex-col gap-2">
                          {p.applicants.map((app: any) => (
                            <div key={app.id} className="flex items-center gap-2 group/applicant">
                              <img src={app.avatar} alt={app.name} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 shadow" title={app.name} />
                              <span className="text-xs text-slate-700 dark:text-slate-200 font-medium mr-2">{app.name}</span>
                              {userType === 'client' && userId === (p as any).userId && (
                                <>
                                  <button
                                    className="ml-1 w-6 h-6 flex items-center justify-center border border-blue-400 text-blue-500 rounded-full hover:bg-blue-50 transition-colors text-base focus:outline-none"
                                    title="Accept"
                                    onClick={() => setModal({ open: true, action: 'accept', post: p, applicant: app })}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                  </button>
                                  <button
                                    className="ml-1 w-6 h-6 flex items-center justify-center border border-red-400 text-red-500 rounded-full hover:bg-red-50 transition-colors text-base focus:outline-none"
                                    title="Refuse"
                                    onClick={() => setModal({ open: true, action: 'refuse', post: p, applicant: app })}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
        </div>

        {/* Confirmation Modal - only show if not login */}
        <ConfirmModal
          open={modal.open && modal.action !== 'login'}
          title={
            modal.action === 'refuse' ? 'Cancel Application'
            : modal.action === 'accept' ? 'Accept Applicant'
            : modal.action === 'hire' ? 'Hire Freelancer'
            : modal.action === 'apply' ? 'Apply for Job'
            : 'Confirmation'}
          message={
            modal.action === 'refuse' ? 'Are you sure you want to cancel your application?'
            : modal.action === 'accept' ? 'Are you sure you want to accept this applicant?'
            : modal.action === 'hire' ? 'Are you sure you want to hire this freelancer?'
            : modal.action === 'apply' ? 'Are you sure you want to apply for this job?'
            : ''
          }
          confirmText={
            modal.action === 'refuse' ? 'Cancel'
            : modal.action === 'accept' ? 'Accept'
            : modal.action === 'hire' ? 'Hire'
            : modal.action === 'apply' ? 'Apply'
            : 'Confirm'}
          cancelText="Back"
          onCancel={() => setModal({ open: false, action: null })}
          onConfirm={() => {
            if (modal.action === 'refuse' && modal.post && modal.applicant) {
              const updatedApplicants = (modal.post.applicants || []).filter((a: any) => a.id !== modal.applicant.id);
              updatePost(modal.post.id, { ...modal.post, applicants: updatedApplicants });
            }
            if (modal.action === 'accept' && modal.post && modal.applicant) {
              navigate('/project-progress', { state: { projectId: modal.post.id, applicant: modal.applicant } });
            }
            if (modal.action === 'hire' && modal.freelancer) {
              navigate('/client-dashboard/addPost', { state: { directHire: true, freelancer: modal.freelancer } });
            }
            if (modal.action === 'apply' && modal.post && modal.applicant) {
              const applicants = modal.post.applicants || [];
              if (!applicants.some((a: any) => a.id === modal.applicant.id)) {
                updatePost(modal.post.id, { ...modal.post, applicants: [...applicants, modal.applicant] });
              }
            }
            setModal({ open: false, action: null });
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;