import React, { useEffect, useState } from 'react';
import styles from './FreelancerProfile.module.css';
import WilayaDropdown from '../../components/WilayaDropdown';
import Settings from './Settings';

interface CompanyData {
  user: {
    id: number;
    email: string;
  };
  company_name: string;
  registration_number: string;
  logo_url: string | null;
  phone_number: string;
  description: string;
  city: string;
  wilaya: string;
  social_links: {
    website?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

const ClientCompanyProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyData>>({});

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    const dummy: CompanyData = {
      user: { id: 2, email: 'contact@acme.inc' },
      company_name: 'ACME Innovations',
      registration_number: 'RC-ALG-2020-000123',
      logo_url: null,
      phone_number: '021 123 456',
      description:
        'ACME Innovations is a technology company specializing in AI-driven business solutions and software engineering services.',
      city: 'Algiers',
      wilaya: 'Alger',
      social_links: {
        website: 'https://acme.example.com',
        linkedin: 'https://linkedin.com/company/acme-innovations',
      },
    };
    setCompanyData(dummy);
    setFormData(dummy);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(companyData || {});
  };

  const handleSave = async () => {
    // TODO: PUT /companies/<id>/update
    setCompanyData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        company_name: formData.company_name ?? prev.company_name,
        registration_number: formData.registration_number ?? prev.registration_number,
        phone_number: formData.phone_number ?? prev.phone_number,
        description: formData.description ?? prev.description,
        city: formData.city ?? prev.city,
        wilaya: formData.wilaya ?? prev.wilaya,
        social_links: formData.social_links ?? prev.social_links,
        logo_url: formData.logo_url ?? prev.logo_url,
      };
    });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCompanyData(prev => (prev ? { ...prev, logo_url: previewUrl } : prev));
    setFormData(prev => ({ ...prev, logo_url: previewUrl }));
    // TODO: POST /companies/<id>/upload-logo
  };

  return (
    <>
      <div className={styles.profileContainer}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <button className={activeTab === 'profile' ? styles.active : ''} onClick={() => setActiveTab('profile')}>
              My Profile
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
                  {companyData?.logo_url ? (
                    <img
                      src={companyData.logo_url}
                      alt="Company Logo"
                      className={styles.profileImage}
                      style={{ width: '96px', height: '96px', borderRadius: '12px' }}
                    />
                  ) : (
                    <div
                      className={styles.profileImage}
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '12px',
                        backgroundColor: '#eef2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#7b8794',
                      }}
                      aria-label="Default company logo"
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
                        <path d="M3 17l4-4 4 4 4-4 4 4" />
                      </svg>
                    </div>
                  )}
                  <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <label htmlFor="logoUpload" className={styles.uploadButton} aria-label="Upload logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </label>
                </div>

                <div className={styles.profileInfo}>
                  <h2>{isEditing ? formData.company_name ?? companyData?.company_name : companyData?.company_name}</h2>
                  <p className={styles.role}>Client Company</p>
                  <p className={styles.location}>
                    {isEditing
                      ? `${formData.city ?? companyData?.city ?? ''}, ${formData.wilaya ?? companyData?.wilaya ?? ''}`
                      : `${companyData?.city || ''}, ${companyData?.wilaya || ''}`}
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

              {/* Company Information */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Company Information</h3>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Company Name</label>
                    {isEditing ? (
                      <input type="text" value={formData.company_name || ''} onChange={e => handleChange('company_name', e.target.value)} />
                    ) : (
                      <p>{companyData?.company_name}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Registration Number</label>
                    {isEditing ? (
                      <input type="text" value={formData.registration_number || ''} onChange={e => handleChange('registration_number', e.target.value)} />
                    ) : (
                      <p>{companyData?.registration_number}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <p className={styles.readOnly}>{companyData?.user.email}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    {isEditing ? (
                      <input type="tel" value={formData.phone_number || ''} onChange={e => handleChange('phone_number', e.target.value)} />
                    ) : (
                      <p>{companyData?.phone_number}</p>
                    )}
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label>About Company</label>
                    {isEditing ? (
                      <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 12 }}>
                        <textarea
                          value={formData.description || ''}
                          onChange={e => handleChange('description', e.target.value)}
                          rows={6}
                          placeholder="Describe your mission, services, and notable projects."
                          style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 6, padding: '10px 12px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                          <span style={{ fontSize: 12, color: 'var(--blue-royal)' }}>{(formData.description?.length || 0)} characters</span>
                          <span style={{ fontSize: 12, color: 'var(--text-dark-blue)' }}>Tip: Highlight outcomes and impact.</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: 'var(--card-white)', border: '1px solid var(--teal-strong)', borderRadius: 8, padding: 16 }}>
                        <h4 style={{ margin: 0, color: 'var(--text-dark-blue)' }}>Company Overview</h4>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-dark-blue)', lineHeight: 1.7 }}>{companyData?.description}</p>
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
                    <p>{companyData?.city}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Wilaya</label>
                  {isEditing ? (
                    <WilayaDropdown value={formData.wilaya || ''} onChange={val => handleChange('wilaya', typeof val === 'string' ? val : '')} error={''} disabled={false} />
                  ) : (
                    <p>{companyData?.wilaya}</p>
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
                    <label>Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.social_links?.website || ''}
                        onChange={e => handleChange('social_links', { ...formData.social_links, website: e.target.value })}
                        placeholder="https://company.com"
                      />
                    ) : (
                      <p>{companyData?.social_links?.website || 'Not provided'}</p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>LinkedIn</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.social_links?.linkedin || ''}
                        onChange={e => handleChange('social_links', { ...formData.social_links, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    ) : (
                      <p>{companyData?.social_links?.linkedin || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
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
              <Settings userId={companyData?.user.id || 0} userRole="company" />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ClientCompanyProfile;