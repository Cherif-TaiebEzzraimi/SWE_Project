import React from "react";
import "../styles/footer.css"; // adjust path if your styles folder is elsewhere

// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <strong className="footer-logo">SkilLink</strong>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
