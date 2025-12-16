import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/cta.css";

const CTASection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to get started?</h2>
            <p className="cta-description">
              Join thousands of businesses and freelancers who are already working together on our platform.
              Create your account today and start your journey.
            </p>
            <div className="cta-buttons">
              <button className="cta-btn cta-btn-primary" onClick={handleButtonClick}>
                Post a Project
              </button>
              <button className="cta-btn cta-btn-secondary" onClick={handleButtonClick}>
                Find Freelancers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3 className="modal-title">Get Started</h3>
            <p className="modal-description">
              Please sign up or log in to continue
            </p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-signup" onClick={() => { setShowModal(false); navigate('/signup'); }}>Sign Up</button>
              <button className="modal-btn modal-btn-login" onClick={() => { setShowModal(false); navigate('/login'); }}>Log In</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTASection;