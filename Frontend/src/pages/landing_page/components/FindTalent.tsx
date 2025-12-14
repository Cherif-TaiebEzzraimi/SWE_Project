import React, { useState } from 'react';
import './../styles/findtalent.css';
import Layout from './Layout' ; 

interface Freelancer {
  id: number;
  name: string;
  title: string;
  hourlyRate: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  bio: string;
  availability: string;
}

const dummyFreelancers: Freelancer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Full Stack Developer",
    hourlyRate: "$65/hr",
    rating: 4.9,
    completedJobs: 127,
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    bio: "Experienced developer with 8+ years building scalable web applications.",
    availability: "Available"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "UI/UX Designer",
    hourlyRate: "$55/hr",
    rating: 4.8,
    completedJobs: 94,
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    bio: "Creative designer specializing in user-centered design and modern interfaces.",
    availability: "Available"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Content Writer & SEO Expert",
    hourlyRate: "$45/hr",
    rating: 5.0,
    completedJobs: 156,
    skills: ["SEO", "Content Strategy", "Copywriting", "WordPress"],
    bio: "Award-winning writer with expertise in technical and marketing content.",
    availability: "Busy"
  },
  {
    id: 4,
    name: "David Kim",
    title: "Data Scientist",
    hourlyRate: "$80/hr",
    rating: 4.9,
    completedJobs: 73,
    skills: ["Python", "Machine Learning", "TensorFlow", "R"],
    bio: "PhD in Data Science, specialized in predictive analytics and AI solutions.",
    availability: "Available"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "Video Editor",
    hourlyRate: "$50/hr",
    rating: 4.7,
    completedJobs: 118,
    skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics"],
    bio: "Professional editor with experience in commercials and social media content.",
    availability: "Available"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    title: "Mobile App Developer",
    hourlyRate: "$70/hr",
    rating: 4.9,
    completedJobs: 82,
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    bio: "Mobile development expert with 50+ published apps on iOS and Android.",
    availability: "Available"
  },
  {
    id: 7,
    name: "Jessica Martinez",
    title: "Digital Marketing Specialist",
    hourlyRate: "$60/hr",
    rating: 4.8,
    completedJobs: 145,
    skills: ["Google Ads", "Facebook Ads", "Analytics", "Email Marketing"],
    bio: "Results-driven marketer with proven track record of ROI growth.",
    availability: "Busy"
  },
  {
    id: 8,
    name: "Robert Taylor",
    title: "Graphic Designer",
    hourlyRate: "$48/hr",
    rating: 4.6,
    completedJobs: 201,
    skills: ["Illustrator", "Photoshop", "Branding", "Print Design"],
    bio: "Creative designer with 10 years experience in branding and visual identity.",
    availability: "Available"
  },
  {
    id: 9,
    name: "Nina Patel",
    title: "Cybersecurity Consultant",
    hourlyRate: "$90/hr",
    rating: 5.0,
    completedJobs: 45,
    skills: ["Penetration Testing", "Security Audits", "Compliance", "Risk Management"],
    bio: "Certified security expert protecting businesses from cyber threats.",
    availability: "Available"
  },
  {
    id: 10,
    name: "Carlos Mendez",
    title: "WordPress Developer",
    hourlyRate: "$52/hr",
    rating: 4.7,
    completedJobs: 167,
    skills: ["PHP", "WordPress", "WooCommerce", "JavaScript"],
    bio: "WordPress specialist creating custom themes and powerful e-commerce sites.",
    availability: "Available"
  }
];

const FindTalent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const filteredFreelancers = dummyFreelancers
    .filter(freelancer => 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(freelancer => 
      availabilityFilter === "all" || 
      freelancer.availability.toLowerCase() === availabilityFilter.toLowerCase()
    );

  return (
   <Layout>
    <div className="find-talent-container">
      <div className="talent-header">
        <h1>Find Talent</h1>
        <p>Connect with top freelancers and build your dream team</p>
      </div>

      <div className="talent-filters">
        <input 
          type="text" 
          placeholder="Search by name, title, or skills..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="availability-filter"
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="all">All Freelancers</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      <div className="freelancers-grid">
        {filteredFreelancers.length > 0 ? (
          filteredFreelancers.map((freelancer) => (
            <div key={freelancer.id} className="freelancer-card">
              <div className="freelancer-avatar">
                {freelancer.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="freelancer-info">
                <h3>{freelancer.name}</h3>
                <p className="freelancer-title">{freelancer.title}</p>
                
                <div className="freelancer-stats">
                  <div className="stat">
                    <span className="star">★</span>
                    <span>{freelancer.rating}</span>
                  </div>
                  <div className="stat">
                    <span className="jobs-count">{freelancer.completedJobs} jobs</span>
                  </div>
                  <div className="stat">
                    <span className="rate">{freelancer.hourlyRate}</span>
                  </div>
                </div>
                
                <p className="freelancer-bio">{freelancer.bio}</p>
                
                <div className="freelancer-skills">
                  {freelancer.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
                
                <div className="freelancer-footer">
                  <span className={`availability-badge ${freelancer.availability.toLowerCase()}`}>
                    {freelancer.availability}
                  </span>
                  <button className="view-profile-btn">View Profile</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-freelancers">
            <p>No freelancers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default FindTalent;