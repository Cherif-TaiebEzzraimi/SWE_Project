import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { saveToken, saveRole, saveUserId } from '../../lib/auth.ts';
import Input from '../../components/Input.tsx';
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

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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
      // Backend uses session authentication (cookies), no token returned
      // We save a marker to track authentication state
      saveToken('session-authenticated');

      // Redirect based on role
      const role = response.user.role;
      if (role === 'freelancer') {
        navigate('/freelancer/dashboard');
      } else if (role === 'client') {
        // Client could be individual or company - backend will differentiate
        navigate('/client/dashboard');
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