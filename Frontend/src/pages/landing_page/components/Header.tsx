import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useUserType } from '../../../context/UserTypeContext';

// Header component
const Header: React.FC = () => {
  const { userType } = useUserType();
  const navigate = useNavigate();
  
  // just a dummy pfp for now
  const user = userType === 'client' 
    ? { name: 'Client', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
    : userType === 'freelancer' 
    ? { name: 'Freelancer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
    : null;

  const handleProfileClick = () => {
    const userId = localStorage.getItem('userId'); // Get the actual logged-in user's ID
    
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    
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
        )}
      </div>
    </header>
  );
};

export default Header;