import React from 'react';
import './../styles/aboutus.css';
import Layout from "./Layout";


interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  linkedin: string;
  github: string;
  image : string ; 
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Saighi Dounia",
    role: "Front End Developer",
    email: "dounia.saighi@ensia.edu.dz",
    linkedin: "www.linkedin.com/in/dounia-saighi-7229a4344",
    github: "https://github.com/dounia959" , 
    image : "./../../../public/images/team/saighi.jpg"
  },
  {
    id: 2,
    name: "Rania Mir",
    role: "Front End Developer",
    email: "rania.mir@ensia.edu.dz",
    linkedin: "https://www.linkedin.com/in/rania-mir-58075924b/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BwW3KCnY2RCO2I3%2BBecvQMg%3D%3D",
    github: "https://github.com/raniamir18" , 
    image : "./../../../public/images/team/rania.jpg"

  },
  {
    id: 3,
    name: "Aya Elatra Hezam",
    role: "Front End Developer",
    email: "aya.elatra.hezam@ensia.edu.dz",
    linkedin: "https://www.linkedin.com/in/aya-el-atra-student-hezam-02a22736b",
    github: "https://www.linkedin.com/in/aya-el-atra-student-hezam-02a22736b" , 
    image : "./../../../public/images/team/aya.jpg"
  },
  {
    id: 4,
    name: "Cherif Taieb Ezzraimi",
    role: "Backend Developer",
    email: "cherif.taieb.ezzraimi@ensia.edu.dz",
    linkedin: "https://www.linkedin.com/in/taieb-ezzraimi-cherif-842084331/",
    github: "https://github.com/Cherif-TaiebEzzraimi" , 
    image : "./../../../public/images/team/cherif.jpg"
  },
  {
    id: 5,
    name: "Ahmed Idris Brahmi",
    role: "Backend Developer",
    email: "ahmed.idris.brahmi@ensia.edu.dz",
    linkedin: "www.linkedin.com/in/ahmed-idris-brahmi-872308355",
    github: "https://github.com/ahmedbrm" , 
    image : "./../../../public/images/team/ahmed.jpg"
  }
];

const AboutUs: React.FC = () => {
  return (
     <Layout>
    <div className="about-container">
      <div className="about-hero">
        <h1>About SkilLink</h1>
        <div className="hero-underline"></div>
      </div>

      <section className="about-description">
        <div className="description-content">
          <h2>Connecting Talent with Opportunity</h2>
          <p>
            SkilLink was born from a simple vision: to create a seamless connection 
            between talented professionals and businesses seeking their expertise. We believe that 
            great work happens when the right people come together, regardless of geographical boundaries.
          </p>
          <p>
            Built with cutting-edge technology and a user-first approach, our platform empowers 
            freelancers to showcase their skills and find meaningful projects, while helping clients 
            discover the perfect talent for their needs. We're committed to fostering a community 
            where creativity thrives, collaboration flourishes, and success is mutual.
          </p>
          <p>
            Whether you're a freelancer looking to grow your career or a business seeking top-tier 
            talent, we're here to make that connection simple, secure, and rewarding. Join thousands 
            of professionals who trust us to power their freelance journey.
          </p>
        </div>
      </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            The passionate individuals behind our platform, dedicated to creating the best 
            freelancing experience for our community.
          </p>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="member-avatar-img">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const imgElement = e.currentTarget;
                      const fallbackElement = imgElement.nextElementSibling as HTMLElement;
                      imgElement.style.display = 'none';
                      if (fallbackElement) {
                        fallbackElement.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="member-avatar-fallback">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                
                <div className="contact-info">
                  <a href={`mailto:${member.email}`} className="contact-link email">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Email
                  </a>
                  
                  <a href={`https://${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-link linkedin">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  
                  <a href={`https://${member.github}`} target="_blank" rel="noopener noreferrer" className="contact-link github">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutUs;