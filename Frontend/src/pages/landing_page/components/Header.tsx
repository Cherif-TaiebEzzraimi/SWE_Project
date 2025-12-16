// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/header.css";

// // Header component
// const Header: React.FC = () => {
//   return (
//     <header className="navbar">
//       <div className="navbar-logo">
//         <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
//           <strong>SkilLink</strong>
//         </Link>
//       </div>
//       <nav className="navbar-links">
//         <Link to="/">Home</Link>
//         <Link to="/dashboard">Jobs</Link>
//         <Link to="/freelancerPage">Skill Browse</Link>
//         <Link to="/about-us">About Us</Link>
//       </nav>
//       <div className="navbar-actions">
//         <button className="login-btn">Login</button>
//         <button className="signup-btn">Sign Up</button>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

// Header component
const Header: React.FC = () => {
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
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;