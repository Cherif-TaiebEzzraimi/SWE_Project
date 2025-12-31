import React, { useEffect, useState } from 'react';
import styles from './FreelancerProfile.module.css';
import Settings from './Settings';
import { BUSINESS_TYPES } from '../../lib/businessTypes';
<<<<<<< HEAD
import { updateUser } from '../../api/userApi';

interface CompanyData {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  registration_number: string;
  logo: string | null;
  description: string;
=======
import { useParams } from 'react-router-dom';
import apiClient from '../../lib/axios';
import { getUserId, getUserProfile } from '../../lib/auth';
import { getCompany, type Company as CompanyDTO, updateCompanyProfile, uploadCompanyLogo } from '../../api/companyApi';

interface CompanyData {
  user: number;
  registration_number: string;
  logo: string | null;
  description: string | null;
>>>>>>> feature/authentication
  business_type?: string | null;
  tax_id?: string | null;
  representative?: string | null;
  industry?: string | null;
  is_verified: boolean;
}

const ClientCompanyProfile: React.FC = () => {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyData>>({});
  // Business type selection follows company signup: plain select with list
=======
  const params = useParams<{ id: string }>();
  const routeId = params.id ? Number.parseInt(params.id, 10) : null;
  const viewerUserId = getUserId();

  
  const isPublicView = !!(routeId && routeId !== viewerUserId);
  const profileIdToLoad = isPublicView ? routeId : viewerUserId ?? routeId;

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

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyData>>({}); 
>>>>>>> feature/authentication
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
<<<<<<< HEAD

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    const dummy: CompanyData = {
      user: { id: 2, email: 'contact@acme.inc', first_name: 'Ahmed', last_name: 'Benali' },
      registration_number: 'RC-ALG-2020-000123',
      logo: null,
      description:
        'ACME Innovations is a technology company specializing in AI-driven business solutions and software engineering services.',
      business_type: 'Software Company',
      tax_id: null,
      representative: null,
      industry: null,
      is_verified: false,
    };
    setCompanyData(dummy);
    setFormData(dummy);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
=======
  const [updateDisabled, setUpdateDisabled] = useState(false);
  const [updateDisabledReason, setUpdateDisabledReason] = useState('');

  useEffect(() => {
    if (isPublicView) {
      setIsEditing(false);
      setActiveTab('profile');
    }
    fetchCompanyData();
    
  }, [profileIdToLoad, isPublicView]);

  const fetchCompanyData = async () => {
    if (!profileIdToLoad) return;
    try {
      const profile = await getCompany(profileIdToLoad);
      const merged: CompanyData = {
        ...(profile as CompanyDTO),
        logo: resolveMediaUrl(profile.logo),
      };
      setCompanyData(merged);
      setFormData(merged);
    } catch (error) {
      console.error('Failed to load company profile', error);
    }
  };

  const handleEdit = () => {
    if (isPublicView) return;
    if (updateDisabled) {
      setSaveSuccess('');
      setSaveError(updateDisabledReason || 'Editing is temporarily unavailable.');
      return;
    }
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (isPublicView) return;
>>>>>>> feature/authentication
    setIsEditing(false);
    setFormData(companyData || {});
    setSaveError('');
    setSaveSuccess('');
  };

<<<<<<< HEAD
  const handleSave = async () => {
    setSaveError('');
    setSaveSuccess('');
    setSaveLoading(true);
    // TODO: PUT /companies/<id>/update
    const resolvedBusinessType = (formData.business_type === 'Other' ? (customBusinessType.trim() || formData.business_type) : formData.business_type) || companyData?.business_type || null;
    // Update user fields if changed
    if (companyData?.user.id) {
      const userPayload: any = {};
      const newFirst = formData.user?.first_name;
      const newLast = formData.user?.last_name;
      if (typeof newFirst === 'string' && newFirst !== companyData.user.first_name) userPayload.first_name = newFirst;
      if (typeof newLast === 'string' && newLast !== companyData.user.last_name) userPayload.last_name = newLast;
      if (Object.keys(userPayload).length > 0) {
        try {
          const updated = await updateUser(companyData.user.id, userPayload);
          setCompanyData(prev => (prev ? { ...prev, user: { ...prev.user, first_name: updated.first_name, last_name: updated.last_name } } : prev));
        } catch (e) {
          const err: any = e as any;
          const msg = err?.response?.data?.detail || 'Failed to update account information.';
          setSaveError(msg);
          setSaveLoading(false);
          return;
        }
      }
    }

    setCompanyData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        // registration_number is read-only
        registration_number: prev.registration_number,
        description: formData.description ?? prev.description,
        business_type: resolvedBusinessType,
        tax_id: formData.tax_id ?? prev.tax_id ?? null,
        representative: formData.representative ?? prev.representative ?? null,
        industry: formData.industry ?? prev.industry ?? null,
        logo: formData.logo ?? prev.logo,
      };
    });
    setIsEditing(false);
    setSaveSuccess('Profile updated successfully.');
    setSaveLoading(false);
=======
  const getFriendlyApiError = (
    e: unknown,
    fallback: string,
    server500Message: string
  ) => {
    const err: any = e as any;
    const status = err?.response?.status;
    const detail = err?.response?.data?.detail;

    if (typeof detail === 'string' && detail.trim()) return detail;
    if (status === 500) return server500Message;
    if (status === 403) return 'You are not allowed to perform this action.';
    if (status === 404) return 'Resource not found.';
    return fallback;
  };

  const handleSave = async () => {
    if (isPublicView) return;
    if (updateDisabled) {
      setSaveSuccess('');
      setSaveError(updateDisabledReason || 'Editing is temporarily unavailable.');
      return;
    }
    setSaveError('');
    setSaveSuccess('');
    const userId = getUserId();
    if (!userId) {
      setSaveError('You must be logged in to update this profile.');
      return;
    }
    if (!companyData?.user) {
      setSaveError('Company profile is missing an owner user id.');
      return;
    }
    if (companyData.user !== userId) {
      setSaveError('You can only update your own company profile.');
      return;
    }

    setSaveLoading(true);
    const resolvedBusinessType = (formData.business_type === 'Other' ? (customBusinessType.trim() || formData.business_type) : formData.business_type) || companyData?.business_type || null;

    
    try {
      const updated = await updateCompanyProfile(userId, {
        description: formData.description ?? companyData.description,
        business_type: resolvedBusinessType,
        tax_id: (formData.tax_id ?? companyData.tax_id ?? null) as any,
        representative: (formData.representative ?? companyData.representative ?? null) as any,
        industry: (formData.industry ?? companyData.industry ?? null) as any,
      });

      const preservedLogo = companyData.logo || resolveMediaUrl(updated.logo);
      const merged: CompanyData = { ...(updated as CompanyData), logo: preservedLogo };
      setCompanyData(merged);
      setFormData(merged);
      setIsEditing(false);
      setSaveSuccess('Profile updated successfully.');
    } catch (e) {
      const errAny: any = e as any;
      const status = errAny?.response?.status;
      if (status === 500) {
        setUpdateDisabled(true);
        setUpdateDisabledReason('Server error (500). Company profile update is failing on the backend.');
        setIsEditing(false);
      }
      setSaveError(
        getFriendlyApiError(
          e,
          'Failed to update company profile.',
          'Server error (500). Company profile update is failing on the backend.'
        )
      );
    } finally {
      setSaveLoading(false);
    }
>>>>>>> feature/authentication
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

<<<<<<< HEAD
  const handleUserChange = (field: 'first_name' | 'last_name', value: string) => {
    setFormData(prev => ({
      ...prev,
      user: {
        id: companyData?.user.id || prev.user?.id || 0,
        email: companyData?.user.email || prev.user?.email || '',
        first_name: field === 'first_name' ? value : (prev.user?.first_name ?? companyData?.user.first_name ?? ''),
        last_name: field === 'last_name' ? value : (prev.user?.last_name ?? companyData?.user.last_name ?? ''),
      },
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCompanyData(prev => (prev ? { ...prev, logo: previewUrl } : prev));
    setFormData(prev => ({ ...prev, logo: previewUrl }));
    // TODO: POST /companies/<id>/upload-logo
  };

=======
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPublicView) return;
    if (updateDisabled) {
      setSaveSuccess('');
      setSaveError(updateDisabledReason || 'Logo upload is temporarily unavailable.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    const userId = getUserId();
    if (!userId) return;

    setSaveError('');
    setSaveSuccess('');
    setSaveLoading(true);

    try {
      
      const updated = await uploadCompanyLogo(userId, file);

     
      const resolvedLogo = resolveMediaUrl(updated.logo);
      const merged: CompanyData = { ...(updated as CompanyData), logo: resolvedLogo };
      setCompanyData(merged);
      setFormData(merged);
      setSaveSuccess('Logo updated successfully.');
    } catch (e) {
      const errAny: any = e as any;
      const status = errAny?.response?.status;
      if (status === 500) {
        setUpdateDisabled(true);
        setUpdateDisabledReason('Server error (500). Company profile update is failing on the backend.');
      }
      setSaveError(
        getFriendlyApiError(
          e,
          'Failed to upload company logo.',
          'Server error (500). Company logo upload is failing on the backend.'
        )
      );
    } finally {
      setSaveLoading(false);
    }
  };

  if (!companyData) {
    return <div>Loading profile...</div>;
  }

  const storedUser = getUserProfile();
  const ownerUser = !isPublicView && storedUser?.id === companyData.user ? storedUser : null;
  const ownerDisplayName = ownerUser
    ? [ownerUser.first_name, ownerUser.last_name].filter(Boolean).join(' ').trim()
    : '';

>>>>>>> feature/authentication
  return (
    <>
      <div className={styles.profileContainer}>
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            <button className={activeTab === 'profile' ? styles.active : ''} onClick={() => setActiveTab('profile')}>
              My Profile
            </button>
<<<<<<< HEAD
            <button className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </button>
=======
            {!isPublicView && (
              <button className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
                Settings
              </button>
            )}
>>>>>>> feature/authentication
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              {saveError && (
                <div className={`${styles.alert} ${styles.alertError}`}>{saveError}</div>
              )}
              {saveSuccess && (
                <div className={`${styles.alert} ${styles.alertSuccess}`}>{saveSuccess}</div>
              )}
              {/* Header */}
              <div className={styles.profileHeader}>
                <div className={styles.profileImageSection}>
                  {companyData?.logo ? (
                    <img
                      src={companyData.logo}
                      alt="Company Logo"
                      className={styles.profileImage}
                      style={{ width: '96px', height: '96px', borderRadius: '12px' }}
<<<<<<< HEAD
=======
                      onError={() => setCompanyData((prev) => (prev ? { ...prev, logo: null } : prev))}
>>>>>>> feature/authentication
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
<<<<<<< HEAD
                  <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <label htmlFor="logoUpload" className={styles.uploadButton} aria-label="Upload logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </label>
                </div>

                <div className={styles.profileInfo}>
                  <h2>{(`${companyData?.user.first_name || ''} ${companyData?.user.last_name || ''}`).trim() || companyData?.registration_number || 'Company Account'}</h2>
                  <p className={styles.role}>Client Company</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={styles.readOnly}>{companyData?.user.email}</span>
=======
                  {!isPublicView && (
                    <>
                      <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                      <label htmlFor="logoUpload" className={styles.uploadButton} aria-label="Upload logo">
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
                    {ownerDisplayName
                      ? ownerDisplayName
                      : (isPublicView
                        ? (companyData?.business_type || 'Client Company')
                        : 'Client Company')}
                  </h2>
                  <p className={styles.role}>Client Company</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
>>>>>>> feature/authentication
                    {companyData?.is_verified ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 8px',
                        borderRadius: 12,
                        background: 'var(--teal-light)',
                        color: 'var(--blue-royal)',
                        fontSize: 12
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 8px',
                        borderRadius: 12,
                        background: '#fff4e5',
                        color: '#a35b00',
                        fontSize: 12,
                        border: '1px solid #ffd8a8'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

<<<<<<< HEAD
                {!isEditing && (
=======
                {!isEditing && !isPublicView && (
>>>>>>> feature/authentication
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
                  <h3>Company Information:</h3>
                </div>

                <div className={styles.formGrid}>
<<<<<<< HEAD
                  <div className={styles.formGroup}>
                    <label> First Name: </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.user?.first_name ?? companyData?.user.first_name ?? ''}
                        onChange={e => handleUserChange('first_name', e.target.value)}
                      />
                    ) : (
                      <p>{companyData?.user.first_name}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Last Name: </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.user?.last_name ?? companyData?.user.last_name ?? ''}
                        onChange={e => handleUserChange('last_name', e.target.value)}
                      />
                    ) : (
                      <p>{companyData?.user.last_name}</p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Registration Number:</label>
                    <p className={styles.readOnly}>{companyData?.registration_number}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address:</label>
                    <p className={styles.readOnly}>{companyData?.user.email}</p>
                  </div>
=======
                  {!isPublicView && (
                    <div className={styles.formGroup}>
                      <label>First Name:</label>
                      <p className={styles.readOnly}>{ownerUser?.first_name || '—'}</p>
                    </div>
                  )}

                  {!isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Last Name: </label>
                      <p className={styles.readOnly}>{ownerUser?.last_name || '—'}</p>
                    </div>
                  )}

                  {isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Business Type:</label>
                      <p className={styles.readOnly}>{companyData?.business_type || 'Not provided'}</p>
                    </div>
                  )}

                  {isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Industry:</label>
                      <p className={styles.readOnly}>{companyData?.industry || 'Not provided'}</p>
                    </div>
                  )}

                  {isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Representative:</label>
                      <p className={styles.readOnly}>{companyData?.representative || 'Not provided'}</p>
                    </div>
                  )}
                  {!isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Registration Number:</label>
                      <p className={styles.readOnly}>{companyData?.registration_number}</p>
                    </div>
                  )}

                  {!isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Email Address:</label>
                      <p className={styles.readOnly}>{ownerUser?.email || '—'}</p>
                    </div>
                  )}
>>>>>>> feature/authentication

                  <div className={styles.formGroup}>
                    {/* Phone is not part of Company model */}
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
<<<<<<< HEAD
                        <p style={{ margin: '8px 0 0', color: 'var(--text-dark-blue)', lineHeight: 1.7 }}>{companyData?.description}</p>
=======
                        <p style={{ margin: '8px 0 0', color: 'var(--text-dark-blue)', lineHeight: 1.7 }}>
                          {companyData?.description || 'Not provided'}
                        </p>
>>>>>>> feature/authentication
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Company Details */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Company Details:</h3>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Business Type:</label>
                    {isEditing ? (
                      <div>
                        <select
                          value={formData.business_type || ''}
                          onChange={e => handleChange('business_type', e.target.value)}
                          className={styles.select}
                          aria-label="Select business type"
                        >
                          <option value="">Select business type</option>
                          {BUSINESS_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {(formData.business_type === 'Other') && (
                          <input
                            type="text"
                            placeholder="Specify business type"
                            value={customBusinessType}
                            onChange={e => setCustomBusinessType(e.target.value)}
                            style={{ marginTop: 8, padding: '10px 12px', border: '1px solid #dddddd', borderRadius: 8 }}
                          />
                        )}
                      </div>
                    ) : (
                      <p>{companyData?.business_type || 'Not provided'}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tax ID:</label>
<<<<<<< HEAD
                    {isEditing ? (
=======
                    {isPublicView ? (
                      <p className={styles.readOnly}>Hidden</p>
                    ) : isEditing ? (
>>>>>>> feature/authentication
                      <input type="text" value={formData.tax_id || ''} onChange={e => handleChange('tax_id', e.target.value)} />
                    ) : (
                      <p>{companyData?.tax_id || 'Not provided'}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Representative:</label>
                    {isEditing ? (
                      <input type="text" value={formData.representative || ''} onChange={e => handleChange('representative', e.target.value)} />
                    ) : (
                      <p>{companyData?.representative || 'Not provided'}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Industry:</label>
                    {isEditing ? (
                      <input type="text" value={formData.industry || ''} onChange={e => handleChange('industry', e.target.value)} />
                    ) : (
                      <p>{companyData?.industry || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </section>

              

             

              {/* Action Buttons */}
              {isEditing && (
                <div className={styles.actionButtons}>
                  <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                  <button className={styles.saveButton} onClick={handleSave} disabled={saveLoading}>
                    {saveLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          

<<<<<<< HEAD
          {activeTab === 'settings' && (
            <div className={styles.settingsSection}>
              <h1 className={styles.pageTitle}>Settings</h1>
              <Settings userId={companyData?.user.id || 0} userRole="company" />
=======
          {!isPublicView && activeTab === 'settings' && (
            <div className={styles.settingsSection}>
              <h1 className={styles.pageTitle}>Settings</h1>
              <Settings userId={companyData?.user || 0} userRole="company" />
>>>>>>> feature/authentication
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ClientCompanyProfile;