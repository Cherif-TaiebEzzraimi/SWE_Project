import React, { useState } from 'react';
import './../styles/jobs.css';
import Layout from './Layout' ; 

interface Job {
  id: number;
  title: string;
  company: string;
  category: string;
  budget: string;
  description: string;
  skills: string[];
  postedDate: Date;
}

const dummyJobs: Job[] = [
  {
    id: 1,
    title: "Full Stack Web Developer",
    company: "TechCorp Solutions",
    category: "Web Development",
    budget: "$3000 - $5000",
    description: "Looking for an experienced full stack developer to build a modern e-commerce platform.",
    skills: ["React", "Node.js", "MongoDB"],
    postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: "Mobile App UI/UX Designer",
    company: "StartupHub",
    category: "Design",
    budget: "$2000 - $3500",
    description: "Need a creative designer for our fitness tracking mobile application.",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    postedDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: "Content Writer for Tech Blog",
    company: "Digital Media Inc",
    category: "Writing",
    budget: "$500 - $1000",
    description: "Seeking a talented writer to create engaging articles about emerging technologies.",
    skills: ["SEO", "Research", "Technical Writing"],
    postedDate: new Date(Date.now() - 48 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: "Python Data Scientist",
    company: "Analytics Pro",
    category: "Data Science",
    budget: "$4000 - $6000",
    description: "Build machine learning models for customer behavior prediction.",
    skills: ["Python", "TensorFlow", "SQL"],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 5,
    title: "Video Editor for YouTube Channel",
    company: "CreativeMinds",
    category: "Video Editing",
    budget: "$800 - $1500",
    description: "Edit weekly vlogs and tutorials for our growing YouTube channel.",
    skills: ["Premiere Pro", "After Effects", "Color Grading"],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 6,
    title: "WordPress Developer",
    company: "WebAgency Plus",
    category: "Web Development",
    budget: "$1500 - $2500",
    description: "Customize WordPress themes and develop custom plugins for client projects.",
    skills: ["PHP", "WordPress", "CSS"],
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 7,
    title: "Social Media Marketing Manager",
    company: "BrandBoost",
    category: "Marketing",
    budget: "$2000 - $3000",
    description: "Manage social media campaigns across multiple platforms for B2B clients.",
    skills: ["Facebook Ads", "Instagram", "Analytics"],
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: 8,
    title: "iOS App Developer",
    company: "MobileFirst",
    category: "Mobile Development",
    budget: "$5000 - $8000",
    description: "Develop a native iOS application for our fintech startup.",
    skills: ["Swift", "UIKit", "Core Data"],
    postedDate: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Design",
  "Writing",
  "Data Science",
  "Video Editing",
  "Marketing"
];

const Jobs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const getTimeLabel = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const filterJobsByTime = (job: Job): boolean => {
    const now = new Date();
    const diff = now.getTime() - job.postedDate.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    switch(timeFilter) {
      case "today":
        return hours < 24;
      case "yesterday":
        return hours >= 24 && hours < 48;
      case "week":
        return hours < 7 * 24;
      case "month":
        return hours < 30 * 24;
      default:
        return true;
    }
  };

  const filteredJobs = dummyJobs
    .filter(job => selectedCategory === "All Categories" || job.category === selectedCategory)
    .filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   job.company.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(filterJobsByTime);

  return (
   <Layout>
    <div className="jobs-container">
      <aside className="jobs-sidebar">
        <h2>Categories</h2>
        <ul className="category-list">
          {categories.map((category) => (
            <li 
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      <main className="jobs-main">
        <div className="jobs-header">
          <h1>Find Jobs</h1>
          <p>Discover opportunities that match your skills</p>
        </div>

        <div className="jobs-filters">
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="time-filter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="jobs-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <span className="posted-time">{getTimeLabel(job.postedDate)}</span>
                </div>
                
                <p className="job-description">{job.description}</p>
                
                <div className="job-details">
                  <span className="category-badge">{job.category}</span>
                  <span className="budget">{job.budget}</span>
                </div>
                
                <div className="job-skills">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                
                <button className="apply-btn">View Details</button>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              <p>No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default Jobs;