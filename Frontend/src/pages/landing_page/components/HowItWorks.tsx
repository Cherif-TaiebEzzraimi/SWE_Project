import React, { useState } from "react";
import "../styles/howitworks.css";

const clientSteps = [
  {
    id: 1,
    number: "01",
    title: "Post your project",
    description: "Tell us what you need done. It's free to post and you'll get proposals within minutes.",
    icon: "📝",
  },
  {
    id: 2,
    number: "02",
    title: "Choose your freelancer",
    description: "Browse profiles, reviews, and proposals. Interview your favorites and select the best fit.",
    icon: "👥",
  },
  {
    id: 3,
    number: "03",
    title: "Collaborate with ease",
    description: "Use our platform to chat, share files, and track progress. Your work is protected with secure payments.",
    icon: "💼",
  },
  {
    id: 4,
    number: "04",
    title: "Pay when satisfied",
    description: "Only pay when you're 100% satisfied with the work. Your money is protected until you approve.",
    icon: "✅",
  },
];

const freelancerSteps = [
  {
    id: 1,
    number: "01",
    title: "Create your profile",
    description: "Showcase your skills, experience, and portfolio. Set your rates and availability.",
    icon: "👤",
  },
  {
    id: 2,
    number: "02",
    title: "Find projects",
    description: "Browse thousands of projects posted daily. Filter by skills, budget, and timeline.",
    icon: "🔍",
  },
  {
    id: 3,
    number: "03",
    title: "Submit proposals",
    description: "Send personalized proposals to clients. Highlight your expertise and stand out from the crowd.",
    icon: "📨",
  },
  {
    id: 4,
    number: "04",
    title: "Get paid securely",
    description: "Complete the work and get paid through our secure payment system. Build your reputation with reviews.",
    icon: "💰",
  },
];

const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"client" | "freelancer">("client");

  const steps = activeTab === "client" ? clientSteps : freelancerSteps;

  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">How it works</h2>
          <p className="how-it-works-subtitle">
            Getting started is simple. Choose your path and follow these easy steps.
          </p>
          
          {/* Tab Switcher */}
          <div className="how-it-works-tabs">
            <button
              className={`tab-switch ${activeTab === "client" ? "active" : ""}`}
              onClick={() => setActiveTab("client")}
            >
              For Clients
            </button>
            <button
              className={`tab-switch ${activeTab === "freelancer" ? "active" : ""}`}
              onClick={() => setActiveTab("freelancer")}
            >
              For Freelancers
            </button>
          </div>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.id} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;