import React, { useEffect, useState } from 'react';
import styles from './FreelancerProfile.module.css';
import WilayaDropdown from '../../components/WilayaDropdown';
import Settings from './Settings';
<<<<<<< HEAD
import ClientHistory from './ClientHistory';

interface ClientData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  profile_picture: string | null;
  phone_number: string;
  city: string;
  wilaya: string;
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
      city: 'Oran',
      wilaya: 'Oran',
    };
    setClientData(dummy);
    setFormData(dummy);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
=======
import { useParams } from 'react-router-dom';
import apiClient from '../../lib/axios';
import { getUserId } from '../../lib/auth';
import { getClient, type Client as ClientDTO, updateClientProfile, uploadClientPhoto } from '../../api/clientApi';
import ClientHistory from './ClientHistory';

const ClientIndividualProfile: React.FC = () => {
  const params = useParams<{ id: string }>();
  const routeId = params.id ? Number.parseInt(params.id, 10) : null;
  const viewerUserId = getUserId();

  const isPublicView = !!(routeId && viewerUserId && routeId !== viewerUserId);
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

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [clientData, setClientData] = useState<ClientDTO | null>(null);
  const [formData, setFormData] = useState<Partial<ClientDTO>>({});

  useEffect(() => {
    if (isPublicView) {
      setIsEditing(false);
      setActiveTab('profile');
    }
    fetchClientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIdToLoad, isPublicView]);

  const fetchClientData = async () => {
    if (!profileIdToLoad) return;
    try {
      const profile = await getClient(profileIdToLoad);
      const merged: ClientDTO = {
        ...profile,
        profile_picture: resolveMediaUrl(profile.profile_picture),
      };
      setClientData(merged);
      setFormData(merged);
    } catch (error) {
      console.error('Failed to load client profile', error);
    }
  };

  const handleEdit = () => {
    if (isPublicView) return;
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (isPublicView) return;
>>>>>>> feature/authentication
    setIsEditing(false);
    setFormData(clientData || {});
  };

  const handleSave = async () => {
<<<<<<< HEAD
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
        city: formData.city ?? prev.city,
        wilaya: formData.wilaya ?? prev.wilaya,
        profile_picture: formData.profile_picture ?? prev.profile_picture,
      };
    });
    setIsEditing(false);
=======
    if (isPublicView) return;
    const userId = getUserId();
    if (!userId) return;

    try {
      const updated = await updateClientProfile(userId, {
        first_name: formData.user?.first_name,
        last_name: formData.user?.last_name,
        phone_number: formData.phone_number ?? null,
        city: formData.city ?? null,
        wilaya: formData.wilaya ?? null,
      });

      const preservedPicture = clientData?.profile_picture || resolveMediaUrl(updated.profile_picture);
      const merged: ClientDTO = { ...updated, profile_picture: preservedPicture };
      setClientData(merged);
      setFormData(merged);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client profile:', error);
    }
>>>>>>> feature/authentication
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

<<<<<<< HEAD
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setClientData(prev => (prev ? { ...prev, profile_picture: previewUrl } : prev));
    setFormData(prev => ({ ...prev, profile_picture: previewUrl }));
    // TODO: POST /clients/<id>/upload-photo
  };

=======
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPublicView) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      await uploadClientPhoto(userId, file);
      await fetchClientData();
    } catch (error) {
      console.error('Failed to upload client photo', error);
    }
  };

  if (!clientData) {
    return <div>Loading profile...</div>;
  }

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
            <button className={activeTab === 'history' ? styles.active : ''} onClick={() => setActiveTab('history')}>
              Project History
            </button>
            <button className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </button>
=======
            {!isPublicView && (
              <>
                <button className={activeTab === 'history' ? styles.active : ''} onClick={() => setActiveTab('history')}>
                  History
                </button>
                <button className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
                  Settings
                </button>
              </>
            )}
>>>>>>> feature/authentication
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
<<<<<<< HEAD
=======
                      onError={() => setClientData((prev) => (prev ? { ...prev, profile_picture: null } : prev))}
>>>>>>> feature/authentication
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
<<<<<<< HEAD
                  <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <label htmlFor="photoUpload" className={styles.uploadButton} aria-label="Upload photo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </label>
=======
                  {!isPublicView && (
                    <>
                      <input
                        type="file"
                        id="clientPhotoUpload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="clientPhotoUpload" className={styles.uploadButton} aria-label="Upload photo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </label>
                    </>
                  )}
>>>>>>> feature/authentication
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

              {/* Personal Information */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Personal Information</h3>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
<<<<<<< HEAD
                    {isEditing ? (
=======
                    {isEditing && !isPublicView ? (
>>>>>>> feature/authentication
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
<<<<<<< HEAD
                    {isEditing ? (
=======
                    {isEditing && !isPublicView ? (
>>>>>>> feature/authentication
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

<<<<<<< HEAD
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    {isEditing ? (
                      <input type="tel" value={formData.phone_number || ''} onChange={e => handleChange('phone_number', e.target.value)} />
                    ) : (
                      <p>{clientData?.phone_number}</p>
                    )}
                  </div>
=======
                  {!isPublicView && (
                    <div className={styles.formGroup}>
                      <label>Phone</label>
                      {isEditing ? (
                        <input type="tel" value={formData.phone_number || ''} onChange={e => handleChange('phone_number', e.target.value)} />
                      ) : (
                        <p>{clientData?.phone_number}</p>
                      )}
                    </div>
                  )}
>>>>>>> feature/authentication
                </div>
              </section>

              {/* Location */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Location</h3>
                </div>
                <div className={styles.formGroup}>
                  <label>City</label>
<<<<<<< HEAD
                  {isEditing ? (
=======
                  {isEditing && !isPublicView ? (
>>>>>>> feature/authentication
                    <input type="text" value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
                  ) : (
                    <p>{clientData?.city}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Wilaya</label>
<<<<<<< HEAD
                  {isEditing ? (
=======
                  {isEditing && !isPublicView ? (
>>>>>>> feature/authentication
                    <WilayaDropdown value={formData.wilaya || ''} onChange={val => handleChange('wilaya', typeof val === 'string' ? val : '')} error={''} disabled={false} />
                  ) : (
                    <p>{clientData?.wilaya}</p>
                  )}
                </div>
              </section>

              

<<<<<<< HEAD
              {isEditing && (
=======
              {isEditing && !isPublicView && (
>>>>>>> feature/authentication
                <div className={styles.actionButtons}>
                  <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                  <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </div>
          )}

<<<<<<< HEAD
          {activeTab === 'settings' && (
=======
          {!isPublicView && activeTab === 'settings' && (
>>>>>>> feature/authentication
            <div className={styles.settingsSection}>
              <h1 className={styles.pageTitle}>Settings</h1>
              <Settings userId={clientData?.user.id || 0} userRole="client" />
            </div>
          )}
<<<<<<< HEAD
          {activeTab === 'history' && (
            <div className={styles.historySection}>
              <h1 className={styles.pageTitle}>Project History</h1>
=======

          {!isPublicView && activeTab === 'history' && (
            <div className={styles.historySection}>
              <h1 className={styles.pageTitle}>History</h1>
>>>>>>> feature/authentication
              <ClientHistory userId={clientData?.user.id || 0} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ClientIndividualProfile;