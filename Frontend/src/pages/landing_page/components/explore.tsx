import React from "react";
import "../styles/explore.css";

const categories = [
  {
    id: 1,
    icon: "smart_toy",
    title: "AI Services",
  },
  {
    id: 2,
    icon: "code",
    title: "Development & IT",
  },
  {
    id: 3,
    icon: "palette",
    title: "Design & Creative",
  },
  {
    id: 4,
    icon: "campaign",
    title: "Sales & Marketing",
  },
  {
    id: 5,
    icon: "draw",
    title: "Writing & Translation",
  },
  {
    id: 6,
    icon: "support_agent",
    title: "Admin & Customer Support",
  },
  {
    id: 7,
    icon: "payments",
    title: "Finance & Accounting",
  },
  {
    id: 8,
    icon: "gavel",
    title: "Legal",
  },
  {
    id: 9,
    icon: "group",
    title: "HR & Training",
  },
  {
    id: 10,
    icon: "apartment",
    title: "Engineering & Architecture",
  },
];

const Explore: React.FC = () => {
  return (
    <section className="explore-section">
      <div className="explore-container">
        <h2 className="explore-title">Explore millions of pros</h2>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon">
                <span className="material-symbols-outlined text-blue-600 text-3xl">{category.icon}</span>
              </div>
              <h3 className="category-title">{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;