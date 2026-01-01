import React, { useState, useMemo, useEffect } from 'react';
import { useUserType } from '../../../context/UserTypeContext';
import Layout from './Layout';
import { categoriesWithSkills as allCategoriesWithSkills } from '../../../components/categories';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../../lib/axios';

const FreelancersPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get('category') || 'All';
  const initialSearch = params.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const { userType } = useUserType();
  const [modal, setModal] = useState<{ open: boolean; action: null | 'login'; freelancer?: any }>({ open: false, action: null });
  const navigate = useNavigate();

  // Fetch freelancers from backend with filters
  const [freelancers, setFreelancers] = useState<any[]>([]);
  useEffect(() => {
    // Build query params for filters
    const params: any = {};
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (search) params.skill = search;
    const query = new URLSearchParams(params).toString();
    apiClient.get(`/freelancers${query ? '?' + query : ''}`)
      .then((res: any) => setFreelancers(res.data))
      .catch(() => setFreelancers([]));
  }, [selectedCategory, search]);

  // Update state if URL changes (for navigation/bookmarks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || 'All');
    setSearch(params.get('search') || '');
  }, [location.search]);

  // Filter freelancers by category and search (client-side fallback)
  const filteredFreelancers = useMemo(() => {
    const keywords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return freelancers.filter(f => {
      if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
      if (keywords.length > 0) {
        const text = `${f.name} ${f.bio} ${(f.skills || []).join(' ')}`.toLowerCase();
        if (!keywords.every(kw => text.includes(kw))) return false;
      }
      return true;
    });
  }, [selectedCategory, search, freelancers]);

  return (
    <>
      <Layout>
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-8 relative min-h-screen">
      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-[#1C2A3B] rounded-xl border border-primary/20 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] focus-within:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)] p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative group w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full pl-12 pr-4 h-12 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm transition-all outline-none placeholder:text-slate-400 dark:text-slate-200"
            placeholder="Search by name, skill, or bio..."
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
        </div>
      </div>
      {/* Freelancers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredFreelancers.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">No freelancers found for this category.</div>
        ) : (
          filteredFreelancers.map((f) => (
            <div
              key={f.id}
              className="relative group bg-white dark:bg-blue-900/60 border-2 border-blue-100 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] rounded-3xl p-8 flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-[1.015] hover:border-blue-300 hover:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)] animate-in"
              style={{ minHeight: 420, background: 'white' }}
            >
              {/* Avatar with ring and lighter rating badge */}
              <div className="relative mb-4 z-10">
                <img
                  src={f.avatar}
                  alt={f.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-xl bg-white transition-all duration-300 ease-in-out"
                  style={{ background: '#fff' }}
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/95 text-[var(--teal-main)] text-xs font-semibold px-3 py-1 rounded-full shadow border border-[var(--teal-main)] flex items-center gap-1 transition-all duration-300" style={{ minWidth: 48, justifyContent: 'center', letterSpacing: '0.01em' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 20 20" className="inline-block text-[var(--teal-main)]"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><polygon points="10,4.5 11.45,8.5 15.7,8.5 12.1,11.1 13.55,15.1 10,12.7 6.45,15.1 7.9,11.1 4.3,8.5 8.55,8.5" fill="currentColor" opacity="0.7"/></svg>
                  {f.rating}
                </span>
              </div>
              {/* Name and category */}
              <div className="text-center">
                <div className="font-extrabold text-blue-900 dark:text-white text-xl mb-1 tracking-tight">{f.name}</div>
                <div className="inline-block text-xs font-semibold mb-2 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 shadow-sm">{f.category}</div>
              </div>
              {/* Bio */}
              <div className="text-gray-700 dark:text-gray-200 text-sm mb-2 text-center min-h-[60px] mt-2">{f.bio}</div>
              {/* Skills as pill badges with teal and blue, closer to description */}
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {(f.skills || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--teal-main)] bg-[var(--teal-bg)] text-[var(--teal-main)] shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {/* Action buttons */}
              <div className="flex gap-3 mt-10 justify-center w-full">
                {userType === 'client' && (
                  <button
                    className="flex-1 px-5 py-2 rounded-lg border-2 border-blue-200 text-blue-500 font-bold text-sm shadow-sm bg-blue-50 transition-all duration-300 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 hover:shadow-[0_0_0_3px_#bfdbfe] focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => {
                      setModal({ open: false, action: null });
                      navigate('/client-dashboard/addPost', { state: { directHire: true, freelancer: f } });
                    }}
                  >
                    Hire Now
                  </button>
                )}
                {(userType === 'guest' || userType === 'client' || userType === 'freelancer') && (
                  <button
                    className="flex-1 px-5 py-2 rounded-lg border-2 border-blue-200 text-blue-500 font-bold text-sm shadow-sm bg-blue-50 transition-all duration-300 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 hover:shadow-[0_0_0_3px_#bfdbfe] focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => {
                      if (userType === 'guest') setModal({ open: true, action: 'login', freelancer: f });
                      else navigate(`/profile/freelancer/${f.id}`);
                    }}
                  >
                    View Profile
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Guest Login/Signup Modal (reuse CTASection style) */}
      {modal.open && modal.action === 'login' && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, action: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal({ open: false, action: null })}>×</button>
            <h3 className="modal-title">Get Started</h3>
            <p className="modal-description">Please sign up or log in to continue</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-signup" onClick={() => { setModal({ open: false, action: null }); navigate('/signup'); }}>Sign Up</button>
              <button className="modal-btn modal-btn-login" onClick={() => { setModal({ open: false, action: null }); navigate('/login'); }}>Log In</button>
            </div>
          </div>
        </div>
      )}
      </div>
      </Layout>
    </>
  );
};

export default FreelancersPage;
