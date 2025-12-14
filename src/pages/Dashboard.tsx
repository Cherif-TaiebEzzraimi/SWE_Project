import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { categoriesWithSkills as allCategoriesWithSkills } from '../components/categories';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';


// Dummy data for freelancers (keep local)
const freelancers = [
  { id: 1, name: 'Amina Dev', category: 'Development & IT', skills: ['Web Developers', 'Java Engineer'], rating: 4.8, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Experienced React and backend developer. Built 10+ scalable apps. Passionate about clean code, scalable systems, and mentoring junior devs.' },
  { id: 2, name: 'Yacine Design', category: 'Design & Creative', skills: ['Graphic Designers', 'Logo Designers'], rating: 4.6, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'Creative designer with a passion for branding and UI/UX. Has worked with 30+ startups and specializes in minimal, memorable design.' },
  { id: 3, name: 'Sara AI', category: 'AI Services', skills: ['Machine Learning Engineers', 'Data Scientists'], rating: 4.9, avatar: 'https://randomuser.me/api/portraits/women/65.jpg', bio: 'AI/ML expert, Kaggle Grandmaster, loves solving real-world problems. Built models for healthcare, finance, and e-commerce.' },
];


const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [view, setView] = useState<'freelancers' | 'posts'>('posts');
  const [userType, setUserType] = useState<'client' | 'freelancer'>('client');
  const [userId] = useState<number>(1); // Simulate logged-in user ID
  const { posts, startEdit, updatePost } = usePosts();
  const navigate = useNavigate();
  // Modal state for confirmation dialogs
  const [modal, setModal] = useState<{ open: boolean; action: null | 'refuse' | 'accept' | 'hire' | 'apply'; post?: any; applicant?: any; freelancer?: any }>({ open: false, action: null });

  const filteredFreelancers = selectedCategory === 'All'
    ? freelancers
    : freelancers.filter(f => f.category === selectedCategory);
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
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
      {/* Floating Add Post Button (client only, not visible in freelancers view) */}
      {userType === 'client' && view !== 'freelancers' && (
        <button
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-24 h-24 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
          onClick={() => navigate('/client-dashboard/addPost')}
          aria-label="Offer a Job"
        >
          <span className="material-symbols-outlined text-6xl font-bold">add</span>
        </button>
      )}
      {/* Horizontal scrollable categories */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent pb-2">
        <span className="font-semibold text-slate-900 dark:text-white mr-2 flex-shrink-0">Filter by Category:</span>
        <span
          className={`px-3 py-1 rounded-full cursor-pointer text-xs font-medium min-w-[80px] text-center ${selectedCategory === 'All' ? 'bg-blue-700 text-white shadow-lg' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </span>
        {allCategoriesWithSkills.map(cat => (
          <span
            key={cat.category}
            className={`px-3 py-1 rounded-full cursor-pointer text-xs font-medium min-w-[120px] text-center ${selectedCategory === cat.category ? 'bg-blue-700 text-white shadow-lg' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
            onClick={() => setSelectedCategory(cat.category)}
          >
            {cat.category}
          </span>
        ))}
      </div>

      {/* Elegant tab buttons (show freelancers tab only for client) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-center">
        <button
          className={`px-3 py-1.5 rounded-md font-semibold text-xs shadow border-2 transition-all duration-200 ${view === 'freelancers' ? 'bg-blue-700 text-white border-blue-500 shadow-lg' : 'bg-white dark:bg-blue-900/60 text-blue-700 border-blue-200 dark:border-blue-700 hover:bg-blue-50'}`}
          onClick={() => setView('freelancers')}
        >
          Freelancers
        </button>
        <button
          className={`px-3 py-1.5 rounded-md font-semibold text-xs shadow border-2 transition-all duration-200 ${view === 'posts' ? 'bg-blue-700 text-white border-blue-500 shadow-lg' : 'bg-white dark:bg-blue-900/60 text-blue-700 border-blue-200 dark:border-blue-700 hover:bg-blue-50'}`}
          onClick={() => setView('posts')}
        >
          Posts
        </button>
      </div>

      {/* Content area */}
      <div className={view === 'freelancers' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10' : 'space-y-8'}>
        {view === 'freelancers' ? (
          filteredFreelancers.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full">No freelancers found for this category.</div>
          ) : (
            filteredFreelancers.map(f => (
              <div
                key={f.id}
                className="relative group bg-white dark:bg-blue-900/60 border-2 border-blue-100 shadow-xl rounded-3xl p-8 flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-[1.025] hover:border-blue-600 hover:shadow-[0_0_32px_0_#60a5fa]"
                style={{ minHeight: 420, background: 'white' }}
              >
                {/* Avatar with ring and lighter rating badge */}
                <div className="relative mb-4 z-10">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-44 h-44 rounded-full object-cover border-4 border-blue-300 shadow-xl bg-white transition-all duration-300 ease-in-out"
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
                  {f.skills.map(skill => (
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
                      className="flex-1 px-5 py-2 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-sm shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 hover:shadow-[0_0_0_3px_#e0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => setModal({ open: true, action: 'hire', freelancer: f })}
                    >
                      Hire Now
                    </button>
                  )}
                  <button className="flex-1 px-5 py-2 rounded-lg text-blue-700 font-bold text-sm shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:shadow-[0_0_0_3px_#e0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-300">View Profile</button>
                </div>
              </div>
            ))
          )
        ) : (
          filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500">No posts found for this category.</div>
          ) : (
            filteredPosts.map(p => (
              <div key={p.id} className="bg-white dark:bg-blue-900/60 border-2 border-blue-600 shadow-lg rounded-2xl p-10 flex flex-col gap-6" style={{ boxShadow: '0 4px 32px 0 #e0f8fb22' }}>
                <div className="flex flex-col gap-2 mb-2">
                  <div className="font-extrabold text-blue-900 dark:text-white text-3xl mb-4 px-6 py-2 border-l-8 border-blue-600 bg-[var(--teal-bg)] shadow-sm tracking-tight w-full" style={{width: '100%'}}>{p.title}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-red-100 bg-red-100 text-red-700">{p.category}</span>
                    {p.requirements && p.requirements.map((req: string) => (
                      <span key={req} className="px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--teal-main)] bg-[var(--teal-bg)] text-[var(--teal-main)]">{req}</span>
                    ))}
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 text-lg mb-4 leading-relaxed" style={{ minHeight: '3.5em' }}>{p.description}</div>
                  <div className="text-xs text-gray-500 mb-4">Price Range: <span className="font-semibold">${p.minPrice} - ${p.maxPrice}</span></div>
                  {p.attachments && p.attachments.length > 0 && (
                    <div className="flex items-center gap-2 mt-1 mb-4">
                      <span className="text-blue-700">📎</span>
                      {p.attachments.map((file: string) => (
                        <a key={file} href="#" className="text-xs text-blue-700 underline hover:text-blue-900 transition">{file}</a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-2 justify-end w-full">
                  {/* Edit button only for post owner */}
                  {userType === 'client' && userId === (p as any).userId && (
                    <button
                      className="px-5 py-2 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-sm shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 hover:shadow-[0_0_0_3px_#e0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => {
                        startEdit(p);
                        navigate('/client-dashboard/addPost');
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {/* Apply Now only for freelancers */}
                  {userType === 'freelancer' && (
                    (() => {
                      // Simulate logged-in freelancer
                      const freelancer = { id: 999, name: 'Current Freelancer', avatar: 'https://randomuser.me/api/portraits/men/99.jpg' };
                      const alreadyApplied = (p.applicants || []).some((a: any) => a.id === freelancer.id);
                      if (alreadyApplied) {
                        return (
                          <button
                            className="px-5 py-2 rounded-lg border-2 border-red-600 text-red-700 font-bold text-sm shadow-sm bg-white transition-all duration-300 hover:bg-red-50 hover:text-red-800 hover:border-red-700 hover:shadow-[0_0_0_3px_#fee2e2] focus:outline-none focus:ring-2 focus:ring-red-300"
                            title="Cancel Application"
                            onClick={() => setModal({ open: true, action: 'refuse', post: p, applicant: freelancer })}
                          >
                            × Cancel Application
                          </button>
                        );
                      } else {
                        return (
                          <button
                            className="px-5 py-2 rounded-lg border-2 border-blue-600 text-blue-700 font-bold text-sm shadow-sm bg-white transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 hover:shadow-[0_0_0_3px_#e0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() => setModal({ open: true, action: 'apply', post: p, applicant: freelancer })}
                          >
                            Apply Now
                          </button>
                        );
                      }
                    })()
                  )}
                </div>
                {/* Applicants section */}
                {p.applicants && p.applicants.length > 0 && (
                  <div className="mt-2 border-t border-blue-100 pt-2">
                    <div className="font-semibold text-xs text-blue-700 mb-1">Applicants:</div>
                    <div className="flex flex-wrap gap-3">
                      {p.applicants.map((app: any) => (
                        <div key={app.id} className="flex items-center gap-2 bg-[#e0f8fb] border border-[#49cfe0] rounded-full px-3 py-1">
                          <img src={app.avatar} alt={app.name} className="w-8 h-8 rounded-full object-cover border-2 border-[#b91c1c]" />
                          <span className="text-xs font-semibold text-[#172554]">{app.name}</span>
                          {/* Accept button for post owner */}
                          {userType === 'client' && userId === (p as any).userId && (
                            <>
                              <button
                                className="ml-2 px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition"
                                onClick={() => setModal({ open: true, action: 'accept', post: p, applicant: app })}
                              >
                                Accept
                              </button>
                              <button
                                className="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-bold shadow hover:bg-red-700 transition"
                                title="Refuse applicant"
                                onClick={() => setModal({ open: true, action: 'refuse', post: p, applicant: app })}
                              >
                                ×
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={modal.open}
        title={
          modal.action === 'refuse' ? 'Refuse Applicant'
          : modal.action === 'accept' ? 'Accept Applicant'
          : modal.action === 'hire' ? 'Hire Freelancer'
          : modal.action === 'apply' ? 'Apply for Job'
          : 'Confirmation'}
        message={
          modal.action === 'refuse' ? 'Are you sure you want to refuse this freelancer?'
          : modal.action === 'accept' ? 'Are you sure you want to accept this applicant?'
          : modal.action === 'hire' ? 'Are you sure you want to hire this freelancer?'
          : modal.action === 'apply' ? 'Are you sure you want to apply for this job?'
          : ''
        }
        confirmText={
          modal.action === 'refuse' ? 'Refuse'
          : modal.action === 'accept' ? 'Accept'
          : modal.action === 'hire' ? 'Hire'
          : modal.action === 'apply' ? 'Apply'
          : 'Confirm'}
        cancelText="Cancel"
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
  );
};

export default Dashboard;