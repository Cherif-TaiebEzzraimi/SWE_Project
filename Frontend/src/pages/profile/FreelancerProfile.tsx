import React, { useState, useEffect } from 'react';
import styles from './FreelancerProfile.module.css';
import WilayaDropdown from '../../components/WilayaDropdown';
import { categoriesWithSkills } from '../../lib/categories';
import FreelancerReviews from './FreelancerReviews';
import FreelancerHistory from './FreelancerHistory';
import Settings from './Settings';

interface FreelancerData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_picture: string | null;
  phone_number: string;
  description: string;
  categories: string[];
  skills: string[];
  city: string;
  wilaya: string;
  years_experience: number | null;
  national_id: string;
  social_links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    [key: string]: string | undefined;
  };
  rate: number | null;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  ccp_account: string;
  barid_account: string;
  cvatta: string;
}

const FreelancerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'history' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [freelancerData, setFreelancerData] = useState<FreelancerData | null>(null);
  const [formData, setFormData] = useState<Partial<FreelancerData>>({});
  
  // Education state
  const [educationList, setEducationList] = useState<Array<{ degree: string; institution: string; year: string }>>([]);
  
  // Skills and Categories state
  const [skillInput, setSkillInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  useEffect(() => {
    // TODO: Fetch freelancer data from API
    // GET /freelancers/<id>/
    fetchFreelancerData();
  }, []);

  const fetchFreelancerData = async () => {
    // TODO: Uncomment to connect to backend
    // const userId = localStorage.getItem('userId');
    // const response = await fetch(`http://localhost:8000/freelancers/${userId}/`);
    // const data = await response.json();
    // setFreelancerData(data);
    // setFormData(data);
    // setSkills(data.skills || []);
    // setCategories(data.categories || []);
    // setEducationList(data.education || []);

    // DUMMY DATA for UI testing
    const dummyData: FreelancerData = {
      user: {
        id: 1,
        first_name: 'Ahmed',
        last_name: 'Benali',
        email: 'ahmed.benali@example.com',
      },
      profile_picture: null,
      phone_number: '0555123456',
      description: 'Experienced full-stack developer with 5+ years of expertise in React, Node.js, and Django. Passionate about building scalable web applications and delivering high-quality solutions.',
      categories: ['Development & IT', 'AI Services'],
      skills: ['React', 'TypeScript', 'Node.js', 'Django', 'PostgreSQL', 'Python'],
      city: 'Algiers',
      wilaya: 'Alger',
      years_experience: 5,
      national_id: '1234567890',
      social_links: {
        linkedin: 'https://linkedin.com/in/ahmed-benali',
        github: 'https://github.com/ahmedbenali',
        portfolio: 'https://ahmedbenali.dev',
      },
      rate: 4.8,
      education: [
        {
          degree: 'Master in Computer Science',
          institution: 'University of Science and Technology Houari Boumediene',
          year: '2018',
        },
        {
          degree: 'Bachelor in Software Engineering',
          institution: 'University of Algiers',
          year: '2016',
        },
      ],
      ccp_account: '0012345678901',
      barid_account: '0020123456789',
      cvatta: '/media/cvs/ahmed_benali_cv.pdf',
    };

    setFreelancerData(dummyData);
    setFormData(dummyData);
    setSkills(dummyData.skills || []);
    setCategories(dummyData.categories || []);
    setEducationList(dummyData.education || []);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSkills(freelancerData?.skills || []);
    setCategories(freelancerData?.categories || []);
    setEducationList(freelancerData?.education || []);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(freelancerData || {});
    setSkills(freelancerData?.skills || []);
    setCategories(freelancerData?.categories || []);
    setEducationList(freelancerData?.education || []);
  };

  const handleSave = async () => {
    // TODO: Update freelancer profile
    // PUT /freelancers/<id>/update/
    try {
      // Prepare data with skills, categories, education
      // const updateData = {
      //   ...formData,
      //   skills,
      //   categories,
      //   education: educationList,
      // };
      
      // const userId = localStorage.getItem('userId');
      // const response = await fetch(`http://localhost:8000/freelancers/${userId}/update/`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updateData)
      // });
      // const data = await response.json();
      // setFreelancerData(data);
      // Merge edited form values into displayed profile immediately
      setFreelancerData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            first_name: formData.user?.first_name ?? prev.user.first_name,
            last_name: formData.user?.last_name ?? prev.user.last_name,
            email: prev.user.email, // email read-only
          },
          phone_number: formData.phone_number ?? prev.phone_number,
          description: formData.description ?? prev.description,
          city: formData.city ?? prev.city,
          wilaya: formData.wilaya ?? prev.wilaya,
          years_experience: formData.years_experience ?? prev.years_experience,
          national_id: formData.national_id ?? prev.national_id,
          social_links: formData.social_links ?? prev.social_links,
          ccp_account: formData.ccp_account ?? prev.ccp_account,
          barid_account: formData.barid_account ?? prev.barid_account,
          cvatta: formData.cvatta ?? prev.cvatta,
          skills: skills.length ? skills : prev.skills,
          categories: categories.length ? categories : prev.categories,
          education: educationList.length ? educationList : prev.education,
        };
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Upload photo
    // POST /freelancers/<id>/upload-photo/
    const file = event.target.files?.[0];
    if (!file) return;

    const formDataPhoto = new FormData();
    formDataPhoto.append('photo', file);

    // Local preview until backend upload completes
    const previewUrl = URL.createObjectURL(file);
    setFreelancerData(prev => prev ? { ...prev, profile_picture: previewUrl } : prev);
    setFormData(prev => ({ ...prev, profile_picture: previewUrl }));

    // const userId = localStorage.getItem('userId');
    // await fetch(`http://localhost:8000/freelancers/${userId}/upload-photo/`, {
    //   method: 'POST',
    //   body: formDataPhoto
    // });
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Upload CV
    const file = event.target.files?.[0];
    if (!file) return;

    // This would typically be handled by a media upload endpoint or included in profile update
    // Backend has cvatta field which is a string (likely a path/URL)
  };

  // Skills management
  const addSkill = () => {
    const val = selectedSkill.trim() || skillInput.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setSkillInput('');
      setSelectedSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Categories management
  const addCategory = () => {
    const val = selectedCategory.trim() || categoryInput.trim();
    if (val && !categories.includes(val)) {
      setCategories([...categories, val]);
      setCategoryInput('');
      setSelectedCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(c => c !== categoryToRemove));
  };

  // Education management
  const addEducation = () => {
    setEducationList([...educationList, { degree: '', institution: '', year: '' }]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    setEducationList(updated);
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* ==================== HEADER SECTION - Add Header Component Here ==================== */}
      {/* <Header /> */}
      {/* ================================================================================== */}

      <div className={styles.profileContainer}>
        {/* Sidebar Navigation */}
        <aside className={styles.sidebar}>
        <nav className={styles.navMenu}>
          <button 
            className={activeTab === 'profile' ? styles.active : ''}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button 
            className={activeTab === 'reviews' ? styles.active : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className={activeTab === 'history' ? styles.active : ''}
            onClick={() => setActiveTab('history')}
          >
            Project History
          </button>
          <button 
            className={activeTab === 'settings' ? styles.active : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeTab === 'profile' && (
          <div className={styles.profileSection}>
            

            {/* Profile Header */}
            <div className={styles.profileHeader}>
              <div className={styles.profileImageSection}>
                {freelancerData?.profile_picture ? (
                  <img 
                    src={freelancerData.profile_picture} 
                    alt="Profile" 
                    className={styles.profileImage}
                    style={{ width: '96px', height: '96px', borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    className={styles.profileImage}
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      backgroundColor: '#eef2f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7b8794'
                    }}
                    aria-label="Default avatar"
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <input 
                  type="file" 
                  id="photoUpload" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photoUpload" className={styles.uploadButton} aria-label="Upload photo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </label>
              </div>
              
              <div className={styles.profileInfo}>
                <h2>
                  {isEditing
                    ? `${formData.user?.first_name || freelancerData?.user.first_name || ''} ${formData.user?.last_name || freelancerData?.user.last_name || ''}`
                    : `${freelancerData?.user.first_name || ''} ${freelancerData?.user.last_name || ''}`}
                </h2>
                <p className={styles.role}>Freelancer</p>
                <p className={styles.location}>
                  {isEditing
                    ? `${formData.city ?? freelancerData?.city ?? ''}, ${formData.wilaya ?? freelancerData?.wilaya ?? ''}`
                    : `${freelancerData?.city || ''}, ${freelancerData?.wilaya || ''}`}
                </p>
              </div>

              {!isEditing && (
                <button className={styles.editButton} onClick={handleEdit} aria-label="Edit profile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Personal Information */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Personal Information</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.user?.first_name || ''}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          user: {
                            ...(prev.user || freelancerData?.user || { id: freelancerData?.user.id || 0, first_name: '', last_name: '', email: freelancerData?.user.email || '' }),
                            first_name: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <p>{freelancerData?.user.first_name}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.user?.last_name || ''}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          user: {
                            ...(prev.user || freelancerData?.user || { id: freelancerData?.user.id || 0, first_name: '', last_name: '', email: freelancerData?.user.email || '' }),
                            last_name: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <p>{freelancerData?.user.last_name}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <p className={styles.readOnly}>{freelancerData?.user.email}</p>
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={formData.phone_number || ''}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                    />
                  ) : (
                    <p>{freelancerData?.phone_number}</p>
                  )}
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>About Me</label>
                  {isEditing ? (
                    <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 12 }}>
                      <textarea 
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={6}
                        placeholder="Summarize your experience, specialties, and value proposition."
                        style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 6, padding: '10px 12px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--blue-royal)' }}>
                          {(formData.description?.length || 0)} characters
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-dark-blue)' }}>
                          Tip: Focus on outcomes and notable projects.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'var(--card-white)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 16 }}>
                      <h4 style={{ margin: 0, color: 'var(--text-dark-blue)' }}>Professional Summary</h4>
                      <p style={{ margin: '8px 0 0', color: 'var(--text-dark-blue)', lineHeight: 1.7 }}>
                        {freelancerData?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Skills & Categories */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Skills & Categories</h3>
              </div>

              <div className={styles.formGroup}>
                <label>Categories</label>
                {!isEditing ? (
                  <div className={styles.tagList}>
                    {freelancerData?.categories?.map((cat, idx) => (
                      <span key={idx} className={styles.tag}>{cat}</span>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className={styles.inputWithButton}>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {categoriesWithSkills.map((c) => (
                          <option key={c.category} value={c.category}>{c.category}</option>
                        ))}
                      </select>
                      <button type="button" className={styles.addButton} onClick={addCategory}>
                        + Add
                      </button>
                    </div>
                    <div className={styles.tagList}>
                      {categories.map((cat, idx) => (
                        <span key={idx} className={styles.tag}>
                          {cat}
                          <button
                            type="button"
                            className={styles.removeTag}
                            onClick={() => removeCategory(cat)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Skills</label>
                {!isEditing ? (
                  <div className={styles.tagList}>
                    {freelancerData?.skills?.map((skill, idx) => (
                      <span key={idx} className={styles.tag}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className={styles.inputWithButton}>
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        disabled={!selectedCategory}
                      >
                        <option value="">{selectedCategory ? 'Select a skill' : 'Select a category first'}</option>
                        {categoriesWithSkills
                          .find((c) => c.category === selectedCategory)?.skills
                          .map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                      </select>
                      <button type="button" className={styles.addButton} onClick={addSkill}>
                        + Add
                      </button>
                    </div>
                    <div className={styles.tagList}>
                      {skills.map((skill, idx) => (
                        <span key={idx} className={styles.tag}>
                          {skill}
                          <button
                            type="button"
                            className={styles.removeTag}
                            onClick={() => removeSkill(skill)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>



            {/* Education */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Education</h3>
                {isEditing && (
                  <button type="button" onClick={addEducation} className={styles.addEducationButton}>
                    + Add Education
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className={styles.educationList}>
                  {educationList.map((edu, index) => (
                    <div key={index} className={styles.educationItem}>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label>Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="e.g., Bachelor's in Computer Science"
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            placeholder="e.g., University Name"
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Year</label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            placeholder="e.g., 2020"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className={styles.removeEducationButton}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {educationList.length === 0 && (
                    <p className={styles.emptyState}>No education added yet. Click "Add Education" to start.</p>
                  )}
                </div>
              ) : (
                <div className={styles.educationList}>
                  {freelancerData?.education && freelancerData.education.length > 0 ? (
                    freelancerData.education.map((edu, index) => (
                      <div key={index} className={styles.educationDisplay}>
                        <h4>{edu.degree}</h4>
                        <p>{edu.institution}</p>
                        <p className={styles.year}>{edu.year}</p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyState}>No education information provided</p>
                  )}
                </div>
              )}
            </section>

            {/* CV Upload */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>CV / Resume</h3>
              </div>

              <div className={styles.formGroup}>
                <label>Upload CV</label>
                {freelancerData?.cvatta && !isEditing && (
                  <div className={styles.cvDisplay}>
                    <a href={freelancerData.cvatta} target="_blank" rel="noopener noreferrer">
                      📄 View CV
                    </a>
                  </div>
                )}
                {isEditing && (
                  <div className={styles.fileUpload}>
                    <input
                      type="file"
                      id="cvUpload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                    />
                    <label htmlFor="cvUpload" className={styles.uploadLabel}>
                      Choose CV File (PDF, DOC, DOCX)
                    </label>
                  </div>
                )}
              </div>
            </section>

            {/* Location & Experience */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Location & Experience</h3>
              </div>

              <div className={styles.formGroup}>
                <label>City</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                ) : (
                  <p>{freelancerData?.city}</p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Wilaya</label>
                {isEditing ? (
                  <WilayaDropdown
                    value={formData.wilaya || ''}
                    onChange={(val) => handleChange('wilaya', typeof val === 'string' ? val : '')}
                    error={''}
                    disabled={false}
                  />
                ) : (
                  <p>{freelancerData?.wilaya}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Years of Experience</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={formData.years_experience || ''}
                    onChange={(e) => handleChange('years_experience', parseInt(e.target.value))}
                  />
                ) : (
                  <p>{freelancerData?.years_experience} years</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>National ID</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.national_id || ''}
                    onChange={(e) => handleChange('national_id', e.target.value)}
                  />
                ) : (
                  <p>{freelancerData?.national_id}</p>
                )}
              </div>
            </section>

            {/* Social Links */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Social Links</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.social_links?.linkedin || ''}
                      onChange={(e) =>
                        handleChange('social_links', { ...formData.social_links, linkedin: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : (
                    <p>{freelancerData?.social_links?.linkedin || 'Not provided'}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>GitHub</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.social_links?.github || ''}
                      onChange={(e) =>
                        handleChange('social_links', { ...formData.social_links, github: e.target.value })
                      }
                      placeholder="https://github.com/yourusername"
                    />
                  ) : (
                    <p>{freelancerData?.social_links?.github || 'Not provided'}</p>
                  )}
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Portfolio Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.social_links?.portfolio || ''}
                      onChange={(e) =>
                        handleChange('social_links', { ...formData.social_links, portfolio: e.target.value })
                      }
                      placeholder="https://yourportfolio.com"
                    />
                  ) : (
                    <p>{freelancerData?.social_links?.portfolio || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </section>


            {/* Payment Information */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Payment Information</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>CCP Account</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.ccp_account || ''}
                      onChange={(e) => handleChange('ccp_account', e.target.value)}
                    />
                  ) : (
                    <p>{freelancerData?.ccp_account}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Barid Account</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.barid_account || ''}
                      onChange={(e) => handleChange('barid_account', e.target.value)}
                    />
                  ) : (
                    <p>{freelancerData?.barid_account}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            {isEditing && (
              <div className={styles.actionButtons}>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
                <button className={styles.saveButton} onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className={styles.reviewsSection}>
            <h1 className={styles.pageTitle}>Reviews</h1>
            <FreelancerReviews 
              freelancerId={freelancerData?.user.id || 0}
              overallRating={freelancerData?.rate || null}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.historySection}>
            <h1 className={styles.pageTitle}>Project History</h1>
            <FreelancerHistory userId={freelancerData?.user.id || 0} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsSection}>
            <h1 className={styles.pageTitle}>Settings</h1>
            <Settings userId={freelancerData?.user.id || 0} userRole="freelancer" />
          </div>
        )}
      </main>
    </div>

    {/* ==================== FOOTER SECTION - Add Footer Component Here ==================== */}
    {/* <Footer /> */}
    {/* ================================================================================== */}
    </>
  );
};

export default FreelancerProfile;