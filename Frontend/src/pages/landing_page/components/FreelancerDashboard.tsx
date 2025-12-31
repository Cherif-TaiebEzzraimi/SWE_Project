import React, { useState } from 'react';
import { categoriesWithSkills } from '../../../components/categories';

// Dummy data for jobs and works
const jobOffers = [
  { id: 1, title: 'React App Needed', category: 'Development & IT', description: 'Build a modern React app for our startup.', price: 400, status: 'open' },
  { id: 2, title: 'Logo Design', category: 'Design & Creative', description: 'Design a logo for a new brand.', price: 120, status: 'open' },
 
];

const works = [
  { id: 1, title: 'Landing Page', status: 'done', price: 200 },
  { id: 2, title: 'E-commerce App', status: 'in progress', price: 800 },
  { id: 3, title: 'Branding Project', status: 'in negotiation', price: 150 },
  
];

const statusColors = {
  'done': 'bg-green-100 text-green-800',
  'in progress': 'bg-blue-100 text-blue-800',
  'in negotiation': 'bg-yellow-100 text-yellow-800',
};

const FreelancerDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [view, setView] = useState<'jobs' | 'works'>('jobs');

  const filteredJobs = selectedCategory === 'All'
    ? jobOffers
    : jobOffers.filter(j => j.category === selectedCategory);

  return (
    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-8">
      {/* Horizontal scrollable categories */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent pb-2">
        <span className="font-semibold text-brand-navy-dark dark:text-white mr-2 flex-shrink-0">Filter by Category:</span>
        <span
          className={`px-3 py-1 rounded-full cursor-pointer text-xs font-medium min-w-[80px] text-center ${selectedCategory === 'All' ? 'bg-brand-blue text-white shadow-[0_0_8px_2px_rgba(30,70,206,0.12)]' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </span>
        {categoriesWithSkills.map(cat => (
          <span
            key={cat.category}
            className={`px-3 py-1 rounded-full cursor-pointer text-xs font-medium min-w-[120px] text-center ${selectedCategory === cat.category ? 'bg-brand-blue text-white shadow-[0_0_8px_2px_rgba(30,70,206,0.12)]' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
            onClick={() => setSelectedCategory(cat.category)}
          >
            {cat.category}
          </span>
        ))}
      </div>
      {/* Elegant tab buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-[0_0_6px_1px_rgba(30,70,206,0.08)] border-2 ${view === 'jobs' ? 'bg-brand-blue text-white border-blue-500' : 'bg-white dark:bg-slate-800 text-brand-navy-dark dark:text-white border-slate-200 dark:border-slate-700 hover:bg-blue-50'}`}
          onClick={() => setView('jobs')}
        >
          Job Offers
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-[0_0_6px_1px_rgba(30,70,206,0.08)] border-2 ${view === 'works' ? 'bg-brand-blue text-white border-blue-500' : 'bg-white dark:bg-slate-800 text-brand-navy-dark dark:text-white border-slate-200 dark:border-slate-700 hover:bg-blue-50'}`}
          onClick={() => setView('works')}
        >
          My Works
        </button>
      </div>
      {/* Stacked/expanded cards with glowy borders */}
      <div className="space-y-6">
        {view === 'jobs' ? (
          filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500">No job offers found for this category.</div>
          ) : (
            filteredJobs.map(j => (
              <div key={j.id} className="bg-white dark:bg-blue-900/60 border-2 border-blue-500 shadow-[0_0_12px_3px_rgba(30,70,206,0.10)] rounded-xl p-6 flex flex-col gap-2 animate-in">
                <div className="font-semibold text-brand-navy-dark dark:text-white text-xl mb-1">{j.title}</div>
                <div className="text-xs text-gray-500 mb-2">{j.category}</div>
                <div className="text-gray-700 dark:text-gray-200 text-sm mb-2 line-clamp-3">{j.description}</div>
                <div className="text-xs text-gray-500 mb-2">Price: <span className="font-semibold">${j.price}</span></div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 px-3 py-1 rounded bg-brand-blue text-white font-semibold text-xs shadow hover:bg-brand-navy-dark transition">Apply</button>
                  <button className="flex-1 px-3 py-1 rounded border border-brand-blue text-brand-blue font-semibold text-xs shadow hover:bg-brand-blue hover:text-white transition">View Details</button>
                </div>
              </div>
            ))
          )
        ) : (
          works.length === 0 ? (
            <div className="text-center text-gray-500">No works found.</div>
          ) : (
            works.map(w => (
              <div key={w.id} className="bg-white dark:bg-blue-900/60 border-2 border-blue-500 shadow-[0_0_12px_3px_rgba(30,70,206,0.10)] rounded-xl p-6 flex flex-col gap-2 animate-in">
                <div className="font-semibold text-brand-navy-dark dark:text-white text-xl mb-1">{w.title}</div>
                <div className={`text-xs font-semibold mb-2 rounded px-2 py-1 inline-block ${statusColors[w.status as keyof typeof statusColors]}`}>{w.status}</div>
                <div className="text-xs text-gray-500 mb-2">Price: <span className="font-semibold">${w.price}</span></div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
