import React, { useState, useMemo } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import Layout from './Layout';
import { categoriesWithSkills as allCategoriesWithSkills } from '../../../components/categories';
import { useNavigate } from 'react-router-dom';
// import { usePosts } from '../../../context/PostsContext';

// Dummy data for freelancers (keep local)
const freelancers: Array<{
  id: number;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  avatar: string;
  bio: string;
}> = [
  { id: 1, name: 'Amina Dev', category: 'Development & IT', skills: ['Web Developers', 'Java Engineer'], rating: 4.8, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Experienced React and backend developer. Built 10+ scalable apps. Passionate about clean code, scalable systems, and mentoring junior devs.' },
  { id: 2, name: 'Yacine Design', category: 'Design & Creative', skills: ['Graphic Designers', 'Logo Designers'], rating: 4.6, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'Creative designer with a passion for branding and UI/UX. Has worked with 30+ startups and specializes in minimal, memorable design.' },
  { id: 3, name: 'Sara AI', category: 'AI Services', skills: ['Machine Learning Engineers', 'Data Scientists'], rating: 4.9, avatar: 'https://randomuser.me/api/portraits/women/65.jpg', bio: 'AI/ML expert, Kaggle Grandmaster, loves solving real-world problems. Built models for healthcare, finance, and e-commerce.' },
  { id: 1, name: 'Amina Dev', category: 'Development & IT', skills: ['Web Developers', 'Java Engineer'], rating: 4.8, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Experienced React and backend developer. Built 10+ scalable apps. Passionate about clean code, scalable systems, and mentoring junior devs.' },
  { id: 2, name: 'Yacine Design', category: 'Design & Creative', skills: ['Graphic Designers', 'Logo Designers'], rating: 4.6, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'Creative designer with a passion for branding and UI/UX. Has worked with 30+ startups and specializes in minimal, memorable design.' },
  { id: 3, name: 'Sara AI', category: 'AI Services', skills: ['Machine Learning Engineers', 'Data Scientists'], rating: 4.9, avatar: 'https://randomuser.me/api/portraits/women/65.jpg', bio: 'AI/ML expert, Kaggle Grandmaster, loves solving real-world problems. Built models for healthcare, finance, and e-commerce.' },

];

const FreelancersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState<'client' | 'freelancer'>('client');
  const [modal, setModal] = useState<{ open: boolean; action: null | 'hire'; freelancer?: any }>({ open: false, action: null });
  const navigate = useNavigate();

  // Filter freelancers by category and search
  const filteredFreelancers = useMemo(() => {
    return freelancers.filter(f => {
      if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
      if (search && !(
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.bio.toLowerCase().includes(search.toLowerCase())
      )) return false;
      return true;
    });
  }, [selectedCategory, search]);

  return (
    <>
      {/* <Header /> */}
      <Layout>
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
          className={`w-8 h-8 flex items-center justify-center rounded-md border-2 shadow text-xs font-bold transition-all duration-200 ${userType === 'freelancer' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'}`}
          onClick={() => setUserType('freelancer')}
          aria-label="Freelancer View"
        >
          F
        </button>
      </div>
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
              className="relative group bg-white dark:bg-blue-900/60 border-2 border-blue-100 shadow-[0_0_12px_0_rgba(96,165,250,0.10)] rounded-3xl p-8 flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-[1.015] hover:border-blue-300 hover:shadow-[0_0_16px_2px_rgba(96,165,250,0.18)]"
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
                {f.skills.map((skill: string) => (
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
                    onClick={() => setModal({ open: true, action: 'hire', freelancer: f })}
                  >
                    Hire Now
                  </button>
                )}
                <button className="flex-1 px-5 py-2 rounded-lg border-2 border-blue-200 text-blue-500 font-bold text-sm shadow-sm bg-blue-50 transition-all duration-300 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 hover:shadow-[0_0_0_3px_#bfdbfe] focus:outline-none focus:ring-2 focus:ring-blue-200">View Profile</button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Confirmation Modal */}
      <ConfirmModal
        open={modal.open}
        title={modal.action === 'hire' ? 'Hire Freelancer' : 'Confirmation'}
        message={modal.action === 'hire' ? 'Are you sure you want to hire this freelancer?' : ''}
        confirmText={modal.action === 'hire' ? 'Hire' : 'Confirm'}
        cancelText="Cancel"
        onCancel={() => setModal({ open: false, action: null })}
        onConfirm={() => {
          if (modal.action === 'hire' && modal.freelancer) {
            navigate('/client-dashboard/addPost', { state: { directHire: true, freelancer: modal.freelancer } });
          }
          setModal({ open: false, action: null });
        }}
      />
      </div>
      </Layout>
    </>
  );
};

export default FreelancersPage;
