import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import apiClient from '../../lib/axios';
import { clearAuth } from '../../lib/auth';

interface Notification {
  id: number;
  content: string;
  seen: boolean;
  created_at: string;
  receiver?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface SettingsProps {
  userId: number;
  userRole: 'freelancer' | 'client' | 'company';
}

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  minLength?: number;
  name?: string;
  autoComplete?: string;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  required,
  minLength,
  name,
  autoComplete,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          name={name}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow((v) => !v)}
        >
          {show ? (
            
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.69-1.58 1.71-3.03 2.95-4.24M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1.05 2.41-2.76 4.47-4.9 6.06" />
              <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

const Settings: React.FC<SettingsProps> = ({ userId, userRole }) => {
  const [activeSection, setActiveSection] = useState<'password' | 'notifications' | 'help' | 'account'>('password');
  
  // password Change 
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [newPasswordErrors, setNewPasswordErrors] = useState<string[]>([]);

  // notifications 
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');

  // Help Ticket 
  const [helpProblem, setHelpProblem] = useState('');
  const [helpMessage, setHelpMessage] = useState('');

  // account deletion 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  
  useEffect(() => {
    if (activeSection === 'notifications') {
      fetchNotifications();
    }
  }, [activeSection]);

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError('');
    try {
      const res = await apiClient.get<Notification[]>('/notifications/my/');
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      const msg = error?.response?.data?.detail || 'Failed to load notifications.';
      setNotificationsError(msg);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const res = await apiClient.put<Notification>(`/notifications/${notificationId}/`);
      const updated = res.data;
      setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, ...updated } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  
  const getPasswordEndpoint = () => {
    const endpoints = {
      freelancer: `/freelancers/${userId}/password/`,
      client: `/clients/${userId}/password/`,
      company: `/companies/${userId}/password/`,
    };
    return endpoints[userRole];
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');

    // Validate new password
    const errors: string[] = [];
    if (passwordData.new_password.length < 8) errors.push('At least 8 characters');
    if (!/[a-z]/.test(passwordData.new_password)) errors.push('Include a lowercase letter');
    if (!/[0-9]/.test(passwordData.new_password)) errors.push('Include a number');
    if (passwordData.new_password !== passwordData.confirm_password) errors.push('New passwords do not match');
    setNewPasswordErrors(errors);
    if (errors.length > 0) {
      setPasswordMessage('Please fix the validation errors');
      return;
    }

    try {
      await apiClient.put(getPasswordEndpoint(), {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setPasswordMessage('Password updated successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Failed to update password';
      setPasswordMessage(msg);
    }
  };

  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHelpMessage('');

    if (!helpProblem.trim()) {
      setHelpMessage('Please describe your problem');
      return;
    }

    try {
      await apiClient.post('/help/', { problem: helpProblem });
      setHelpMessage('Help ticket submitted successfully.');
      setHelpProblem('');
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Failed to submit help ticket.';
      setHelpMessage(msg);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiClient.delete(`/users/${userId}/`);
      try {
        await apiClient.post('/auth/logout/');
      } catch {
        
      }
      setShowDeleteConfirm(false);
      clearAuth();
      window.location.href = '/login';
    } catch (error) {
      alert('Failed to deactivate account');
    }
  };

  return (
    <div className={styles.settingsContainer}>

      <div className={styles.settingsNav}>
        <button
          className={activeSection === 'password' ? styles.active : ''}
          onClick={() => setActiveSection('password')}
        >
          <span aria-hidden="true" style={{ marginRight: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          Security
        </button>
        <button
          className={activeSection === 'notifications' ? styles.active : ''}
          onClick={() => setActiveSection('notifications')}
        >
          <span aria-hidden="true" style={{ marginRight: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </span>
          Notifications
        </button>
        <button
          className={activeSection === 'help' ? styles.active : ''}
          onClick={() => setActiveSection('help')}
        >
          <span aria-hidden="true" style={{ marginRight: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" /><path d="M12 17h.01" />
            </svg>
          </span>
          Help & Support
        </button>
        <button
          className={activeSection === 'account' ? styles.active : ''}
          onClick={() => setActiveSection('account')}
        >
          <span aria-hidden="true" style={{ marginRight: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .7.27 1.37.76 1.86.49.49 1.16.76 1.86.76H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          Account Management
        </button>
      </div>

      
      <div className={styles.settingsContent}>
        {activeSection === 'password' && (
          <div className={styles.section}>
            <h2>Change Password</h2>
            <p className={styles.sectionDescription}>
              Update your password to keep your account secure.
            </p>

            <form onSubmit={handlePasswordChange} className={styles.form}>
              <PasswordField
                label="Current Password"
                value={passwordData.old_password}
                onChange={(val) => setPasswordData({ ...passwordData, old_password: val })}
                required
                name="currentPassword"
                autoComplete="current-password"
              />

              <PasswordField
                label="New Password"
                value={passwordData.new_password}
                onChange={(val) => setPasswordData({ ...passwordData, new_password: val })}
                required
                minLength={8}
                name="newPassword"
                autoComplete="new-password"
              />
              {newPasswordErrors.length > 0 && (
                <div className={styles.validationMessage}>
                  {newPasswordErrors.join(' • ')}
                </div>
              )}

              <PasswordField
                label="Confirm New Password"
                value={passwordData.confirm_password}
                onChange={(val) => setPasswordData({ ...passwordData, confirm_password: val })}
                required
                name="confirmPassword"
                autoComplete="new-password"
              />

              {passwordMessage && (
                <div className={passwordMessage.includes('success') ? styles.successMessage : styles.errorMessage}>
                  {passwordMessage}
                </div>
              )}

              <button type="submit" className={styles.primaryButton} disabled={newPasswordErrors.length > 0}>
                Update Password
              </button>
            </form>
          </div>
        )}

        
        {activeSection === 'notifications' && (
          <div className={styles.section}>
            <h2>Notifications</h2>
            <p className={styles.sectionDescription}>
              Your notifications:
            </p>
            <div className={styles.notificationsList}>
              {notificationsLoading && (
                <div className={styles.loading}>Loading notifications…</div>
              )}
              {!notificationsLoading && !!notificationsError && (
                <div className={styles.emptyState}>
                  <p>{notificationsError}</p>
                </div>
              )}
              {!notificationsLoading && notifications.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No notifications yet</p>
                  <p className={styles.emptyStateSubtext}>You’ll see updates here as they arrive.</p>
                </div>
              )}
              {!notificationsLoading && notifications.length > 0 && (
                notifications.map((n) => (
                  <div key={n.id} className={`${styles.notificationItem} ${!n.seen ? 'unread' : ''}`}>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationText}>{n.content}</p>
                      <span className={styles.notificationDate}>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <div className={styles.notificationActions}>
                      {!n.seen && (
                        <button className={styles.markReadButton} onClick={() => markAsRead(n.id)} title="Mark as read">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        
        {activeSection === 'help' && (
          <div className={styles.section}>
            <h2>Help & Support</h2>
            <p className={styles.sectionDescription}>
              Having issues? Submit a help ticket and our team will assist you.
            </p>

            <form onSubmit={handleHelpSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Describe Your Problem</label>
                <textarea
                  value={helpProblem}
                  onChange={(e) => setHelpProblem(e.target.value)}
                  rows={6}
                  placeholder="Please provide details about the issue you're experiencing..."
                  required
                />
              </div>

              {helpMessage && (
                <div className={helpMessage.includes('success') ? styles.successMessage : styles.errorMessage}>
                  {helpMessage}
                </div>
              )}

              <button type="submit" className={styles.primaryButton}>
                Submit Help Ticket
              </button>
            </form>

            <div className={styles.helpResources}>
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">FAQ - Frequently Asked Questions</a></li>
                <li><a href="#">Platform Guidelines</a></li>
                <li><a href="#">Contact Support</a></li>
              </ul>
            </div>
          </div>
        )}

        
        {activeSection === 'account' && (
          <div className={styles.section}>
            <h2>Account Management</h2>
            <p className={styles.sectionDescription}>
              Manage your account settings and data.
            </p>

            <div className={styles.notificationItem}>
              <div>
                <h4>Logout</h4>
                <p>Sign out from your account on this device.</p>
              </div>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  (async () => {
                    try {
                      await apiClient.post('/auth/logout/');
                    } catch {
                      
                    } finally {
                      clearAuth();
                      window.location.href = '/login';
                    }
                  })();
                }}
              >
                Logout
              </button>
            </div>

            <div className={styles.dangerZone}>
              
              <div className={styles.dangerItem}>
                <div>
                  <h4>Deactivate Account</h4>
                  <p>
                    Hide your profile and prevent new interactions. You can restore access later.
                  </p>
                </div>
                <button 
                  className={styles.dangerButton}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Deactivate Account
                </button>
              </div>
            </div>

            
            {showDeleteConfirm && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h3>Confirm Account Deactivation</h3>
                  <p>
                    Are you sure you want to deactivate your account? This will:
                  </p>
                  <ul>
                    <li>Hide your profile from others</li>
                    <li>Prevent new interactions</li>
                    
                  </ul>
                  <p className={styles.warning}>You can restore access later.</p>
                  <div className={styles.modalButtons}>
                    <button 
                      className={styles.secondaryButton}
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className={styles.dangerButton}
                      onClick={handleDeleteAccount}
                    >
                      Yes, Deactivate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
