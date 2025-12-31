import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { saveAuthFlag, saveRole, saveUserId, saveUserProfile } from '../../lib/auth';
import Input from '../../components/Input';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const errorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const validateField = (name: 'email' | 'password', value: string) => {
    if (name === 'email') {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return undefined;
    }

    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return undefined;
  };

  const scheduleErrorsClear = () => {
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = window.setTimeout(() => {
      setErrors({});
      errorTimerRef.current = null;
    }, 6000);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField('password', formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scheduleErrorsClear();
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email' || name === 'password') {
      const fieldError = validateField(name, value);
      
      if (!fieldError && errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);
      
      // Save auth data
      saveUserId(response.user.id);
      saveRole(response.user.role);
      saveUserProfile(response.user);
      
      
      saveAuthFlag(true);

      // Redirect based on role !!!!!!must be fixedddd
      const role = response.user.role;
      if (role === 'freelancer') {
        navigate('/freelancer/dashboard');
      } else if (role === 'client') {
        navigate('/client/individual/dashboard');
      } else if (role === 'company') {
        navigate('/client/company/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        setApiError(error.response.data.detail);
      } else {
        setApiError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {apiError && (
          <div className={styles.errorAlert}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            disabled={loading}
            withPasswordToggle
          />

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            className={styles.forgotButton}
          >
            Forgot Password?
          </button>
        </form>

        <div className={styles.signupLink}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className={styles.linkButton}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;