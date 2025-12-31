import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../../api/authApi';
import styles from './Login.module.css';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }

      try {
        const res = await verifyEmail(token);
        if (!isMounted) return;
        setStatus('success');
        setMessage(res.detail || 'Email verified successfully.');
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setMessage(err?.response?.data?.detail || 'Email verification failed.');
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Verify Email</h1>

      {status === 'loading' && <p>Verifying your email…</p>}

      {status !== 'loading' && (
        <div style={{ marginTop: 12 }}>
          <div className={status === 'error' ? styles.errorAlert : undefined}>
            {message}
          </div>

          <button
            type="button"
            className={styles.submitButton}
            style={{ marginTop: 16 }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
