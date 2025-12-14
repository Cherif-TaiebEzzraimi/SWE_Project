import React, { useState } from "react";
import "../styles/hero.css";

const backgroundImage =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"; // Team collaboration image

const HeroSection: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"find-talent" | "browse-jobs">("find-talent");

  const handleSearch = () => {
    console.log("Searching for:", search, "in tab:", activeTab);
  };

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-overlay">
        <div className="hero-content-wrapper">
          {/* Left side - Title */}
          <div className="hero-text">
            <h1 className="hero-title">
              Connecting clients in need<br />
              to freelancers who deliver
            </h1>
          </div>

          {/* Right side - Search Container */}
          <div className="hero-search-container">
            {/* Tab Buttons */}
            <div className="hero-tabs">
              <button
                className={`tab-btn ${activeTab === "find-talent" ? "active" : ""}`}
                onClick={() => setActiveTab("find-talent")}
              >
                Find talent
              </button>
              <button
                className={`tab-btn ${activeTab === "browse-jobs" ? "active" : ""}`}
                onClick={() => setActiveTab("browse-jobs")}
              >
                Browse jobs
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "find-talent" ? (
              <div className="tab-content">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search by role, skills, or keywords"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="search-btn" onClick={handleSearch}>
                    <span className="search-icon">🔍</span>
                    Search
                  </button>
                </div>
              </div>
            ) : (
              <div className="tab-content browse-jobs-content">
                <h2 className="content-title">
                  Build your freelancing career on Upwork, with thousands of jobs posted every week.
                </h2>
                <button className="explore-btn">
                  Explore recently posted jobs
                </button>
              </div>
            )}
          </div> {/* hero-search-container */}
        </div> {/* hero-content-wrapper */}
      </div> {/* hero-overlay */}
    </section>
  );
};

export default HeroSection;
