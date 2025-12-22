import React, { useState, useEffect } from 'react';
import styles from './FreelancerProfile.module.css';
import WilayaDropdown from '../../components/WilayaDropdown';
import { categoriesWithSkills } from '../../lib/categories';
import FreelancerReviews from './FreelancerReviews';
import FreelancerHistory from './FreelancerHistory';
import Settings from './Settings';
import apiClient from '../../lib/axios';
import { useParams } from 'react-router-dom';
import {
  getFreelancerProfile,
  type FreelancerProfile as FreelancerProfileDTO,
  type MediaFile,
  updateFreelancerProfile,
  uploadFreelancerPhoto,
  uploadFreelancerCV,
  listFreelancerMedia,
  deleteMedia,
} from '../../api/freelancerApi';
import { getUserId } from '../../lib/auth';

const FreelancerProfile: React.FC = () => {
  console.log('FreelancerProfile REAL FILE');

  const params = useParams<{ id: string }>();
  const routeId = params.id ? Number.parseInt(params.id, 10) : null;
  const viewerUserId = getUserId();

  // Public-view mode: user is logged in but viewing someone else's profile via URL.
  const isPublicView = !!(routeId && viewerUserId && routeId !== viewerUserId);
  const profileIdToLoad = isPublicView ? routeId : viewerUserId ?? routeId;

  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'history' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [freelancerData, setFreelancerData] = useState<FreelancerProfileDTO | null>(null);
  const [formData, setFormData] = useState<Partial<FreelancerProfileDTO>>({});
  
  // Education state
  const [educationList, setEducationList] = useState<Array<{ degree: string; institution: string; year: string }>>([]);

  // Media state (CVs, profile photo fallback)
  const [cvFiles, setCvFiles] = useState<MediaFile[]>([]);

  const resolveMediaUrl = (url?: string | null) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('//')) return `${window.location.protocol}${trimmed}`;

    const base = (apiClient.defaults.baseURL || '').toString().replace(/\/$/, '');
    if (!base) return trimmed;

    if (trimmed.startsWith('/')) return `${base}${trimmed}`;
    return `${base}/${trimmed}`;
  };

  const isCvFileType = (fileType?: string | null) => {
    const t = (fileType || '').toLowerCase();
    return (
      t === 'application/pdf' ||
      t === 'application/msword' ||
      t === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  };

  const dedupeByFileUrl = (files: MediaFile[]) => {
    const seen = new Set<string>();
    const unique: MediaFile[] = [];
    for (const f of files) {
      if (!f.file_url) continue;
      if (seen.has(f.file_url)) continue;
      seen.add(f.file_url);
      unique.push(f);
    }
    return unique;
  };
  
  // Skills and Categories state
  const [skillInput, setSkillInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  useEffect(() => {
    // When switching into public view, force-safe UI state.
    if (isPublicView) {
      setIsEditing(false);
      setActiveTab('profile');
    }
    fetchFreelancerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIdToLoad, isPublicView]);

  const fetchFreelancerData = async () => {
    if (!profileIdToLoad) return;

    try {
      const profile = await getFreelancerProfile(profileIdToLoad);
      const media = await listFreelancerMedia(profileIdToLoad);

      const latestImage = media
        .filter((m) => (m.file_type || '').startsWith('image/'))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      const resolvedProfilePicture = resolveMediaUrl(profile.profile_picture || latestImage?.file_url || null);

      const mergedProfile: FreelancerProfileDTO = {
        ...profile,
        profile_picture: resolvedProfilePicture,
      };

      setFreelancerData(mergedProfile);
      setFormData(mergedProfile);
      setSkills(mergedProfile.skills ?? []);
      setCategories(mergedProfile.categories ?? []);
      setEducationList(mergedProfile.education ?? []);

      const cvs = dedupeByFileUrl(media.filter((m) => isCvFileType(m.file_type)));
      setCvFiles(cvs);
    } catch (error) {
      console.error('Failed to load freelancer profile', error);
    }
  };

  const handleEdit = () => {
    if (isPublicView) return;
    setIsEditing(true);
    setSkills(freelancerData?.skills ?? []);
    setCategories(freelancerData?.categories ?? []);
    setEducationList(freelancerData?.education ?? []);
  };

  const handleCancel = () => {
    if (isPublicView) return;
    setIsEditing(false);
    setFormData(freelancerData || {});
    setSkills(freelancerData?.skills ?? []);
    setCategories(freelancerData?.categories ?? []);
    setEducationList(freelancerData?.education ?? []);
  };

  const handleSave = async () => {
    if (isPublicView) return;
    const userId = getUserId();
    if (!userId) return;

    try {
      const updated = await updateFreelancerProfile(userId, {
        first_name: formData.user?.first_name,
        last_name: formData.user?.last_name,
        phone_number: formData.phone_number ?? null,
        description: formData.description ?? null,
        city: formData.city ?? null,
        wilaya: formData.wilaya ?? null,
        years_experience: formData.years_experience ?? null,
        national_id: formData.national_id ?? null,
        social_links: formData.social_links ?? null,
        ccp_account: formData.ccp_account ?? null,
        barid_account: formData.barid_account ?? null,
        skills,
        categories,
        education: educationList,
      });

      // The update endpoint may not return `profile_picture` (or may return it as a relative URL).
      // Preserve the currently displayed resolved picture so it doesn't disappear after Save.
      setFreelancerData((prev) => {
        const preservedPicture = prev?.profile_picture || resolveMediaUrl(updated.profile_picture);
        return { ...updated, profile_picture: preservedPicture };
      });

      setFormData((prev) => {
        const preservedPicture =
          (prev as FreelancerProfileDTO | null)?.profile_picture ||
          freelancerData?.profile_picture ||
          resolveMediaUrl(updated.profile_picture);
        return { ...updated, profile_picture: preservedPicture };
      });

      setSkills(updated.skills ?? []);
      setCategories(updated.categories ?? []);
      setEducationList(updated.education ?? []);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPublicView) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      await uploadFreelancerPhoto(userId, file);
      await fetchFreelancerData();
    } catch (error) {
      console.error('Failed to upload photo', error);
    }
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPublicView) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      // 1) Upload CV file to generic media endpoint
      const media = await uploadFreelancerCV(userId, file);

      // 2) Persist CV URL into freelancer profile (cvatta is a string field)
      const updated = await updateFreelancerProfile(userId, {
        cvatta: media.file_url,
      });

      setFreelancerData((prev) => (prev ? { ...updated, profile_picture: prev.profile_picture } : updated));
      setFormData(updated);
      // Refresh media list (so user can immediately see/remove uploaded CV)
      const allMedia = await listFreelancerMedia(userId);
      setCvFiles(dedupeByFileUrl(allMedia.filter((m) => isCvFileType(m.file_type))));
    } catch (error) {
      console.error('Failed to upload CV', error);
    }
  };

  const handleDeleteCV = async (mediaId: number) => {
    if (isPublicView) return;
    const userId = getUserId();
    if (!userId) return;

    try {
      const deleted = cvFiles.find((f) => f.id === mediaId);
      await deleteMedia(mediaId);

      // If the deleted file was the one referenced by cvatta, clear it.
      if (deleted?.file_url && freelancerData?.cvatta === deleted.file_url) {
        const updated = await updateFreelancerProfile(userId, { cvatta: null });
        setFreelancerData((prev) => (prev ? { ...updated, profile_picture: prev.profile_picture } : updated));
        setFormData(updated);
      }

      const allMedia = await listFreelancerMedia(userId);
      setCvFiles(dedupeByFileUrl(allMedia.filter((m) => isCvFileType(m.file_type))));
    } catch (error) {
      console.error('Failed to delete CV', error);
    }
  };

  const cvViewItems = (() => {
    const items = dedupeByFileUrl(cvFiles);
    if (freelancerData?.cvatta) {
      const alreadyListed = items.some((f) => f.file_url === freelancerData.cvatta);
      if (!alreadyListed) {
        items.push({
          id: 0,
          file_url: freelancerData.cvatta,
          file_type: 'application/pdf',
          created_at: new Date(0).toISOString(),
        } as MediaFile);
      }
    }
    return items;
  })();

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

  if (!freelancerData) {
    return <div>Loading profile...</div>;
  }

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
          {!isPublicView && (
            <button 
              className={activeTab === 'history' ? styles.active : ''}
              onClick={() => setActiveTab('history')}
            >
              Project History
            </button>
          )}
          {!isPublicView && (
            <button 
              className={activeTab === 'settings' ? styles.active : ''}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          )}
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
                    onError={() =>
                      setFreelancerData((prev) => (prev ? { ...prev, profile_picture: null } : prev))
                    }
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
                {!isPublicView && (
                  <>
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
                  </>
                )}
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

              {!isEditing && !isPublicView && (
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
                      value={formData.phone_number ?? ''}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                    />
                  ) : (
                    <p>{freelancerData.phone_number ?? ''}</p>
                  )}
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>About Me</label>
                  {isEditing ? (
                    <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 12 }}>
                      <textarea 
                        value={formData.description ?? ''}
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
                        {freelancerData.description ?? ''}
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
                    {freelancerData.categories?.map((cat, idx) => (
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
                    {freelancerData.skills?.map((skill, idx) => (
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
                  {freelancerData.education && freelancerData.education.length > 0 ? (
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

            {!isPublicView && (
              <>
                {/* CV Upload */}
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3>CV / Resume</h3>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Upload CV</label>

                    {cvViewItems.length > 0 && (
                      <div className={styles.cvDisplay}>
                        <div className={styles.cvList}>
                          {cvViewItems.map((cv) => {
                            const isDeletable = isEditing && cv.id && cv.id > 0;
                            const href = resolveMediaUrl(cv.file_url) || cv.file_url;
                            return (
                              <div key={`${cv.id}-${cv.file_url}`} className={styles.cvRow}>
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.cvLink}
                                >
                                  <span className={styles.cvLinkContent}>
                                    <svg
                                      className={styles.cvLinkIcon}
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M14 2v6h6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span>View CV</span>
                                  </span>
                                </a>

                                {isDeletable && (
                                  <button
                                    type="button"
                                    className={styles.cvRemoveButton}
                                    onClick={() => handleDeleteCV(cv.id)}
                                    aria-label="Remove CV"
                                    title="Remove"
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M18 6 6 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M6 6l12 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
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
                          <span className={styles.uploadLabelContent}>
                            <svg
                              className={styles.uploadLabelIcon}
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M12 16V4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="m7 9 5-5 5 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M20 20H4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Upload CV (PDF, DOC, DOCX)</span>
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

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
                    value={formData.city ?? ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                ) : (
                  <p>{freelancerData.city ?? ''}</p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Wilaya</label>
                {isEditing ? (
                  <WilayaDropdown
                    value={formData.wilaya ?? ''}
                    onChange={(val) => handleChange('wilaya', typeof val === 'string' ? val : '')}
                    error={''}
                    disabled={false}
                  />
                ) : (
                  <p>{freelancerData.wilaya ?? ''}</p>
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
                  <p>{freelancerData.years_experience ?? 0} years</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>National ID</label>
                {!isPublicView && (
                  <>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.national_id ?? ''}
                        onChange={(e) => handleChange('national_id', e.target.value)}
                      />
                    ) : (
                      <p>{freelancerData.national_id ?? ''}</p>
                    )}
                  </>
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
                      value={formData.social_links?.linkedin ?? ''}
                      onChange={(e) =>
                        handleChange('social_links', { ...formData.social_links, linkedin: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : (
                    <p>{freelancerData.social_links?.linkedin || 'Not provided'}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>GitHub</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.social_links?.github ?? ''}
                      onChange={(e) =>
                        handleChange('social_links', { ...formData.social_links, github: e.target.value })
                      }
                      placeholder="https://github.com/yourusername"
                    />
                  ) : (
                    <p>{freelancerData.social_links?.github || 'Not provided'}</p>
                  )}
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Portfolio Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.social_links?.portfolio ?? ''}
                      onChange={(e) =>
                        handleChange('social_links', { ...formData.social_links, portfolio: e.target.value })
                      }
                      placeholder="https://yourportfolio.com"
                    />
                  ) : (
                    <p>{freelancerData.social_links?.portfolio || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </section>


            {!isPublicView && (
              <>
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
                          value={formData.ccp_account ?? ''}
                          onChange={(e) => handleChange('ccp_account', e.target.value)}
                        />
                      ) : (
                        <p>{freelancerData.ccp_account ?? ''}</p>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Barid Account</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={formData.barid_account ?? ''}
                          onChange={(e) => handleChange('barid_account', e.target.value)}
                        />
                      ) : (
                        <p>{freelancerData.barid_account ?? ''}</p>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}

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

        {!isPublicView && activeTab === 'history' && (
          <div className={styles.historySection}>
            <h1 className={styles.pageTitle}>Project History</h1>
            <FreelancerHistory userId={freelancerData?.user.id || 0} />
          </div>
        )}

        {!isPublicView && activeTab === 'settings' && (
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