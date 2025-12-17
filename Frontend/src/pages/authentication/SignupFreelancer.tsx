import React, { useState } from 'react';
import LogoText from '../../assets/logo/LogoText.svg';
import WilayaDropdown from '../../components/WilayaDropdown';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import { registerFreelancer } from '../../api/authApi';
import { saveAuthFlag, saveRole, saveUserId } from '../../lib/auth';
import styles from './SignupFreelancer.module.css';

const SignupFreelancer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    city: '',
    wilaya: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password does not match';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be exactly 10 digits';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.wilaya) {
      newErrors.wilaya = 'Wilaya is required';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and limit to 10 characters
    if (name === 'phone_number') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        setLoading(false);
        return;
      }
      const payload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        freelancer: {
          phone_number: formData.phone_number,
          city: formData.city,
          wilaya: formData.wilaya
        }
      };
      const response = await registerFreelancer(payload);
      saveUserId(response.user.id);
      saveRole(response.user.role);
      saveAuthFlag(true);
      navigate('/freelancer/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.detail) {
        setApiError(error.response.data.detail);
      } else if (error.response?.data) {
        // Handle validation errors from backend
        const backendErrors = error.response.data;
        const formattedErrors: Record<string, string> = {};
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key][0]
            : backendErrors[key];
        });
        setErrors(formattedErrors);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src={LogoText} alt="Skillink Logo" style={{ height: 48 }} />
          </div>
          <div className={styles.headerLinks}>
            <span className={styles.headerText}>Here to hire talent?</span>
            <button
              onClick={() => navigate('/signup/client-type')}
              className={styles.headerLink}
            >
              Join as a Client
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Sign up to find work you love</h1>

        {apiError && (
          <div className={styles.errorAlert}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ flexShrink: 0, marginTop: '2px' }}
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <Input
                label="First name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <Input
                label="Last name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                disabled={loading}
              />
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
          />

          <div className={styles.passwordField}>
            <div className={styles.passwordField}>
              <Input
                label="Password"
                type={showPassword ? 'password' : 'text'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (8 or more characters)"
                error={errors.password}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            <div className={styles.passwordField}>
              <Input
                label="Confirm Password"
                type={showPassword ? 'password' : 'text'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                error={errors.confirmPassword}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {showPassword ? (
                  // Slashed eye (show password is ON/hidden)
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                  </>
                ) : (
                  // Open eye (show password is OFF/visible)
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <Input
            label="Phone Number"
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
            disabled={loading}
          />

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Wilaya</label>
              <WilayaDropdown
                value={formData.wilaya}
                onChange={val => handleChange({
                  target: { name: 'wilaya', value: typeof val === 'string' ? val : '' }
                } as any)}
                error={errors.wilaya}
                disabled={loading}
              />
            </div>
            <div className={styles.formGroup}>
              <Input
                label="City"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={receiveEmails}
                onChange={(e) => setReceiveEmails(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Send me helpful emails to find rewarding work and job leads.</span>
            </label>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className={styles.checkbox}
              />
              <span>
                Yes, I understand and agree to the{' '}
                <a href="#" className={styles.link}>Terms of Service</a>,
                including the{' '}
                <a href="#" className={styles.link}>User Agreement</a> and{' '}
                <a href="#" className={styles.link}>Privacy Policy</a>.
              </span>
            </label>
            {errors.terms && <span className={styles.error}>{errors.terms}</span>}
          </div>

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className={styles.submitButton}
          >
            {loading ? 'Creating account...' : 'Create my account'}
          </button>
          <p className={styles.loginLink}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={styles.linkButton}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupFreelancer;