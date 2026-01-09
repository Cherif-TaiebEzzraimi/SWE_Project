import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useUserType } from '../../../context/UserTypeContext';
import axios from '../../../lib/axios';

// Header component
const Header: React.FC = () => {
  const { userType, setUserType } = useUserType();
  const navigate = useNavigate();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Determine user type from localStorage/session
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    // If userId is present, use storedUserType if available, else fallback to role in localStorage
    if (!userId) {
      setUserType('guest');
    } else if (storedUserType) {
      setUserType(storedUserType as 'client' | 'freelancer');
    } else {
      // fallback: try to infer from role
      const role = localStorage.getItem('role');
      if (role === 'freelancer') setUserType('freelancer');
      else if (role === 'client' || role === 'company') setUserType('client');
      else setUserType('guest');
    }
  }, [setUserType]);

  // Fetch user's profile photo
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId || userType === 'guest') return;

      setLoading(true);
      try {
        // Fetch the profile data based on user type
        const endpoint = userType === 'client' ? `/clients/${userId}/` : `/freelancers/${userId}/`;
        const response = await axios.get(endpoint);
        
        if (response.data.profile_picture) {
          let photoUrl = response.data.profile_picture;
          // If it's a relative URL, prepend the backend URL
          if (photoUrl && !photoUrl.startsWith('http')) {
            photoUrl = `http://localhost:8000${photoUrl}`;
          }
          setUserAvatar(photoUrl);
        } else {
          // Fallback to placeholder
          const avatar = userType === 'client'
            ? 'https://randomuser.me/api/portraits/men/32.jpg'
            : 'https://randomuser.me/api/portraits/women/44.jpg';
          setUserAvatar(avatar);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Fallback to placeholder
        const avatar = userType === 'client'
          ? 'https://randomuser.me/api/portraits/men/32.jpg'
          : 'https://randomuser.me/api/portraits/women/44.jpg';
        setUserAvatar(avatar);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userType]);

  const user = userType === 'client'
    ? { name: 'Client', avatar: userAvatar || 'https://randomuser.me/api/portraits/men/32.jpg' }
    : userType === 'freelancer'
    ? { name: 'Freelancer', avatar: userAvatar || 'https://randomuser.me/api/portraits/women/44.jpg' }
    : null;

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    
    // Reset user type context
    setUserType('guest');
    setShowDropdown(false);
    
    // Redirect to home
    navigate('/');
  };

  const handleNavigateToProfile = () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    
    setShowDropdown(false);
    if (userType === 'client') {
      navigate(`/profile/client/${userId}`);
    } else if (userType === 'freelancer') {
      navigate(`/profile/freelancer/${userId}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <strong>SkilLink</strong>
        </Link>
      </div>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Jobs</Link>
        <Link to="/freelancersPage">Browse Skills</Link>
        <Link to="/about-us">About Us</Link>
      </nav>
      <div className="navbar-actions">
        {userType === 'guest' ? (
          <>
            <button 
              className="login-btn" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="signup-btn" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div style={{ position: 'relative' }}>
            <button 
              className="profile-btn" 
              title="Profile" 
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer' 
              }} 
              onClick={handleProfileClick}
            >
              <img 
                src={user?.avatar} 
                alt="Profile" 
                style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%' 
                }} 
              />
            </button>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '150px'
              }}>
                <button
                  onClick={handleNavigateToProfile}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #eee'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  View Profile
                </button>
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#e74c3c'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;