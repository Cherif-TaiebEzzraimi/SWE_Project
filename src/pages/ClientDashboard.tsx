
import React, { useState } from 'react';
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
  const { posts, startEdit } = usePosts();
  const navigate = useNavigate();

  const filteredFreelancers = selectedCategory === 'All'
    ? freelancers
    : freelancers.filter(f => f.category === selectedCategory);
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-8">
      {/* Toggle user type for testing */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-bold text-base border-2 mr-2 ${userType === 'client' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700'}`}
          onClick={() => setUserType('client')}
        >
          Client View
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-bold text-base border-2 ${userType === 'freelancer' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700'}`}
          onClick={() => setUserType('freelancer')}
        >
          Freelancer View
        </button>
      </div>
      {/* Add Post Button Top Right (client only) */}
      {userType === 'client' && (
        <div className="flex justify-end mb-4">
          <button
            className="px-6 py-3 bg-transparent text-blue-400 border border-blue-600 rounded-lg hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 flex items-center gap-2 font-bold text-base"
            onClick={() => navigate('/client-dashboard/addPost')}
          >
            <span className="material-symbols-outlined mr-2 font-bold text-lg">add</span>
            Add a Post
          </button>
        </div>
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
        {userType === 'client' && (
          <button
            className={`px-3 py-1.5 rounded-md font-semibold text-xs shadow border-2 transition-all duration-200 ${view === 'freelancers' ? 'bg-blue-700 text-white border-blue-500 shadow-lg' : 'bg-white dark:bg-blue-900/60 text-blue-700 border-blue-200 dark:border-blue-700 hover:bg-blue-50'}`}
            onClick={() => setView('freelancers')}
          >
            Freelancers
          </button>
        )}
        <button
          className={`px-3 py-1.5 rounded-md font-semibold text-xs shadow border-2 transition-all duration-200 ${view === 'posts' ? 'bg-blue-700 text-white border-blue-500 shadow-lg' : 'bg-white dark:bg-blue-900/60 text-blue-700 border-blue-200 dark:border-blue-700 hover:bg-blue-50'}`}
          onClick={() => setView('posts')}
        >
          Posts
        </button>
      </div>

      {/* Content area */}
      <div className={view === 'freelancers' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-8'}>
        {view === 'freelancers' ? (
          filteredFreelancers.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full">No freelancers found for this category.</div>
          ) : (
            filteredFreelancers.map(f => (
              <div key={f.id} className="bg-white dark:bg-blue-900/60 border-2 border-blue-100 shadow-lg rounded-2xl p-10 flex flex-col gap-4">
                <div className="flex items-center gap-8">
                  <img src={f.avatar} alt={f.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg" />
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 dark:text-white text-2xl mb-1">{f.name}</div>
                    <div className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-100 inline-block w-fit">{f.category}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-1 mt-2">{f.bio}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {f.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-full text-xs font-medium shadow-sm border border-blue-100 bg-blue-100 text-blue-700">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col items-center">
                    <span className="text-yellow-400 text-3xl">★</span>
                    <span className="text-lg font-semibold text-blue-900 dark:text-white">{f.rating}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 justify-center">
                  {userType === 'client' && (
                    <button className="px-5 py-1.5 rounded-md bg-blue-700 text-white font-semibold text-xs shadow hover:bg-blue-900 transition-all duration-200">Hire Now</button>
                  )}
                  <button className="px-5 py-1.5 rounded-md border border-blue-700 text-blue-700 font-semibold text-xs shadow hover:bg-blue-700 hover:text-white transition-all duration-200">View Profile</button>
                </div>
              </div>
            ))
          )
        ) : (
          filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500">No posts found for this category.</div>
          ) : (
            filteredPosts.map(p => (
              <div key={p.id} className="bg-white dark:bg-blue-900/60 border-2 border-blue-700 shadow-lg rounded-2xl p-8 flex flex-col gap-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 dark:text-white text-xl mb-1">{p.title}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-red-100 bg-red-100 text-red-700">{p.category}</span>
                      {p.requirements && p.requirements.map((req: string) => (
                        <span key={req} className="px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100 bg-blue-100 text-blue-700">{req}</span>
                      ))}
                    </div>
                    <div className="text-gray-700 dark:text-gray-200 text-sm mb-2" style={{ minHeight: '3.5em' }}>{p.description}</div>
                    <div className="text-xs text-gray-500 mb-2">Price Range: <span className="font-semibold">${p.minPrice} - ${p.maxPrice}</span></div>
                    {p.attachments && p.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-blue-700">📎</span>
                        {p.attachments.map((file: string) => (
                          <a key={file} href="#" className="text-xs text-blue-700 underline hover:text-blue-900 transition">{file}</a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px] h-full justify-end items-end">
                    {/* Edit button only for post owner */}
                    {userType === 'client' && userId === (p as any).userId && (
                      <button
                        className="px-4 py-1 rounded-md border border-blue-700 text-blue-700 font-semibold text-xs shadow hover:bg-blue-700 hover:text-white transition-all duration-200"
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
                      <button className="px-4 py-1 rounded-md bg-blue-700 text-white font-semibold text-xs shadow hover:bg-blue-900 transition-all duration-200 mt-4">Apply Now</button>
                    )}
                  </div>
                </div>
                {/* Applicants section */}
                {p.applicants && p.applicants.length > 0 && (
                  <div className="mt-2 border-t border-blue-100 pt-2">
                    <div className="font-semibold text-xs text-blue-700 mb-1">Applicants:</div>
                    <div className="flex flex-wrap gap-3">
                      {p.applicants.map((app: any) => (
                        <div key={app.id} className="flex items-center gap-2 bg-blue-100 border border-blue-100 rounded-full px-3 py-1">
                          <img src={app.avatar} alt={app.name} className="w-8 h-8 rounded-full object-cover border-2 border-blue-100" />
                          <span className="text-xs font-semibold text-blue-900">{app.name}</span>
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

      {/* Add Offer Modal removed: now handled as a full page */}
    </div>
  );
};

export default Dashboard;