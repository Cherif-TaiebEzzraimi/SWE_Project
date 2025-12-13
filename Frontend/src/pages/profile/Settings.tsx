import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import apiClient from '../../lib/axios';

interface Notification {
  id: number;
  content: string;
  seen: boolean;
  created_at: string;
  receiver: {
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

const Settings: React.FC<SettingsProps> = ({ userId, userRole }) => {
  const [activeSection, setActiveSection] = useState<'password' | 'notifications' | 'help' | 'account'>('password');
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPasswordErrors, setNewPasswordErrors] = useState<string[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Help Ticket State
  const [helpProblem, setHelpProblem] = useState('');
  const [helpMessage, setHelpMessage] = useState('');

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch notifications when section becomes active
  useEffect(() => {
    if (activeSection === 'notifications') {
      fetchNotifications();
    }
  }, [activeSection]);

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      // Dummy data for UI preview
      const demo: Notification[] = [
        {
          id: 101,
          content: 'Your proposal was accepted by Client A.',
          seen: false,
          created_at: new Date().toISOString(),
          receiver: { id: userId, first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' },
        },
        {
          id: 102,
          content: 'Phase 1 deliverable approved.',
          seen: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          receiver: { id: userId, first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' },
        },
        {
          id: 103,
          content: 'New message from Client B regarding project timeline.',
          seen: false,
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          receiver: { id: userId, first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' },
        },
      ];
      setNotifications(demo);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/`, { seen: true });
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, seen: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}/`);
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get the correct API endpoint based on user role
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
    if (!/[A-Z]/.test(passwordData.new_password)) errors.push('Include an uppercase letter');
    if (!/[a-z]/.test(passwordData.new_password)) errors.push('Include a lowercase letter');
    if (!/[0-9]/.test(passwordData.new_password)) errors.push('Include a number');
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(passwordData.new_password)) errors.push('Include a special character');
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
      await apiClient.post('/help/', {
        user_id: userId,
        problem: helpProblem,
      });
      setHelpMessage('Help ticket submitted successfully');
      setHelpProblem('');
    } catch (error) {
      setHelpMessage('Failed to submit help ticket');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiClient.delete(`/users/${userId}/`);
      setShowDeleteConfirm(false);
      // Clear and redirect
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Settings Navigation */}
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

      {/* Settings Content */}
      <div className={styles.settingsContent}>
        {/* Password Section */}
        {activeSection === 'password' && (
          <div className={styles.section}>
            <h2>Change Password</h2>
            <p className={styles.sectionDescription}>
              Update your password to keep your account secure.
            </p>

            <form onSubmit={handlePasswordChange} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    aria-label={showOld ? 'Hide password' : 'Show password'}
                    onClick={() => setShowOld((v) => !v)}
                  >
                    {showOld ? (
                      // Visible state: show open eye icon
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      // Hidden state: show eye-off icon
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.69-1.58 1.71-3.03 2.95-4.24M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1.05 2.41-2.76 4.47-4.9 6.06" />
                        <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                        <path d="M1 1l22 22" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>New Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                    onClick={() => setShowNew((v) => !v)}
                  >
                    {showNew ? (
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
                {newPasswordErrors.length > 0 && (
                  <div className={styles.validationMessage}>
                    {newPasswordErrors.join(' • ')}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? (
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

        {/* Notifications Section */}
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
                      <button className={styles.deleteButton} onClick={() => deleteNotification(n.id)} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6l1-3h4l1 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
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

        {/* Account Management Section */}
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
                  try {
                    // Optional: call backend logout
                    // await fetch('http://localhost:8000/auth/logout/', { method: 'POST', credentials: 'include' });
                  } catch {}
                  localStorage.clear();
                  window.location.href = '/';
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

            {/* Delete Confirmation Modal */}
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
                    <li>Keep your data for reactivation</li>
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
