import React, { useState } from 'react';
import apiClient from '../../lib/axios';
import styles from './Login.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setBackendError('');
    // Frontend validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password/', { email });
      setMessage('If that email exists, a reset link was sent.');
    } catch (err: any) {
      setBackendError(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Forgot Password</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 8 }}>Email</label>
        <input
          type="text"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setError('');
            setBackendError('');
          }}
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: (error || backendError) ? '2px solid #dc2626' : '1px solid #dddddd',
            borderRadius: 8,
            marginBottom: 4,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#dc2626',
            marginBottom: 12
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {!error && backendError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#dc2626',
            marginBottom: 12
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{backendError}</span>
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && <div style={{ color: '#15803d', marginTop: 16 }}>{message}</div>}
      
    </div>
  );
};

export default ForgotPassword;
