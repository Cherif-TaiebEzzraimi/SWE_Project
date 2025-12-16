import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../../lib/axios.ts';
import styles from './Login.module.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password/', { token, new_password: password });
      setMessage('Password reset successful. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Reset Password</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 8 }}>New Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter new password"
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #dddddd', borderRadius: 8, marginBottom: 16 }}
          required
        />
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <div style={{ color: '#15803d', marginTop: 16 }}>{message}</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}
    </div>
  );
};

export default ResetPassword;
