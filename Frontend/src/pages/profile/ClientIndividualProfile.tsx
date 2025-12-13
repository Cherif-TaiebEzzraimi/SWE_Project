import React, { useEffect, useState } from 'react';
import styles from './FreelancerProfile.module.css';
import WilayaDropdown from '../../components/WilayaDropdown';
import Settings from './Settings';
import FreelancerHistory from './FreelancerHistory';

interface ClientData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_picture: string | null;
  phone_number: string;
  description: string;
  city: string;
  wilaya: string;
  social_links: {
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

const ClientIndividualProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [formData, setFormData] = useState<Partial<ClientData>>({});

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    // Dummy aligned with backend fields
    const dummy: ClientData = {
      user: { id: 3, first_name: 'Sara', last_name: 'Kaci', email: 'sara.kaci@example.com' },
      profile_picture: null,
      phone_number: '0555 987 654',
      description: 'Individual client interested in hiring top freelancers for web and mobile projects.',
      city: 'Oran',
      wilaya: 'Oran',
      social_links: { linkedin: 'https://linkedin.com/in/sarakaci' },
    };
    setClientData(dummy);
    setFormData(dummy);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(clientData || {});
  };

  const handleSave = async () => {
    // TODO: PUT /clients/<id>/update
    setClientData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          first_name: formData.user?.first_name ?? prev.user.first_name,
          last_name: formData.user?.last_name ?? prev.user.last_name,
          email: prev.user.email, // read-only
        },
        phone_number: formData.phone_number ?? prev.phone_number,
        description: formData.description ?? prev.description,
        city: formData.city ?? prev.city,
        wilaya: formData.wilaya ?? prev.wilaya,
        social_links: formData.social_links ?? prev.social_links,
        profile_picture: formData.profile_picture ?? prev.profile_picture,
      };
    });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setClientData(prev => (prev ? { ...prev, profile_picture: previewUrl } : prev));
    setFormData(prev => ({ ...prev, profile_picture: previewUrl }));
    // TODO: POST /clients/<id>/upload-photo
  };

  return (
    <>
      <div className={styles.profileContainer}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <button className={activeTab === 'profile' ? styles.active : ''} onClick={() => setActiveTab('profile')}>
              My Profile
            </button>
            <button className={activeTab === 'history' ? styles.active : ''} onClick={() => setActiveTab('history')}>
              Project History
            </button>
            <button className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </button>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              {/* Header */}
              <div className={styles.profileHeader}>
                <div className={styles.profileImageSection}>
                  {clientData?.profile_picture ? (
                    <img
                      src={clientData.profile_picture}
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
                        color: '#7b8794',
                      }}
                      aria-label="Default avatar"
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                  <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
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
                      ? `${formData.user?.first_name || clientData?.user.first_name || ''} ${formData.user?.last_name || clientData?.user.last_name || ''}`
                      : `${clientData?.user.first_name || ''} ${clientData?.user.last_name || ''}`}
                  </h2>
                  <p className={styles.role}>Client</p>
                  <p className={styles.location}>
                    {isEditing
                      ? `${formData.city ?? clientData?.city ?? ''}, ${formData.wilaya ?? clientData?.wilaya ?? ''}`
                      : `${clientData?.city || ''}, ${clientData?.wilaya || ''}`}
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
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            user: {
                              ...(prev.user || clientData?.user || { id: clientData?.user.id || 0, first_name: '', last_name: '', email: clientData?.user.email || '' }),
                              first_name: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <p>{clientData?.user.first_name}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.user?.last_name || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            user: {
                              ...(prev.user || clientData?.user || { id: clientData?.user.id || 0, first_name: '', last_name: '', email: clientData?.user.email || '' }),
                              last_name: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <p>{clientData?.user.last_name}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <p className={styles.readOnly}>{clientData?.user.email}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    {isEditing ? (
                      <input type="tel" value={formData.phone_number || ''} onChange={e => handleChange('phone_number', e.target.value)} />
                    ) : (
                      <p>{clientData?.phone_number}</p>
                    )}
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label>About Me</label>
                    {isEditing ? (
                      <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 12 }}>
                        <textarea
                          value={formData.description || ''}
                          onChange={e => handleChange('description', e.target.value)}
                          rows={6}
                          placeholder="Briefly describe your interests and what projects you hire for."
                          style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 6, padding: '10px 12px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                          <span style={{ fontSize: 12, color: 'var(--blue-royal)' }}>{(formData.description?.length || 0)} characters</span>
                          <span style={{ fontSize: 12, color: 'var(--text-dark-blue)' }}>Tip: Share relevant context for freelancers.</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: 'var(--card-white)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 16 }}>
                        <h4 style={{ margin: 0, color: 'var(--text-dark-blue)' }}>Overview</h4>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-dark-blue)', lineHeight: 1.7 }}>{clientData?.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Location</h3>
                </div>
                <div className={styles.formGroup}>
                  <label>City</label>
                  {isEditing ? (
                    <input type="text" value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
                  ) : (
                    <p>{clientData?.city}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Wilaya</label>
                  {isEditing ? (
                    <WilayaDropdown value={formData.wilaya || ''} onChange={val => handleChange('wilaya', typeof val === 'string' ? val : '')} error={''} disabled={false} />
                  ) : (
                    <p>{clientData?.wilaya}</p>
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
                        onChange={e => handleChange('social_links', { ...formData.social_links, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : (
                      <p>{clientData?.social_links?.linkedin || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </section>

              {isEditing && (
                <div className={styles.actionButtons}>
                  <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                  <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsSection}>
              <h1 className={styles.pageTitle}>Settings</h1>
              <Settings userId={clientData?.user.id || 0} userRole="client" />
            </div>
          )}
          {activeTab === 'history' && (
            <div className={styles.historySection}>
              <h1 className={styles.pageTitle}>Project History</h1>
              <FreelancerHistory userId={clientData?.user.id || 0} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ClientIndividualProfile;