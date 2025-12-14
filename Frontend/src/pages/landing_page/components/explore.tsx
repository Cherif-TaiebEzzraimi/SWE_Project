import React from "react";
import "../styles/explore.css";

const categories = [
  {
    id: 1,
    icon: "⚙️",
    title: "AI Services",
  },
  {
    id: 2,
    icon: "<//>",
    title: "Development & IT",
  },
  {
    id: 3,
    icon: "🎨",
    title: "Design & Creative",
  },
  {
    id: 4,
    icon: "🤝",
    title: "Sales & Marketing",
  },
  {
    id: 5,
    icon: "✍️",
    title: "Writing & Translation",
  },
  {
    id: 6,
    icon: "👨‍💼",
    title: "Admin & Support",
  },
  {
    id: 7,
    icon: "🏛️",
    title: "Finance & Accounting",
  },
  {
    id: 8,
    icon: "⚖️",
    title: "Legal",
  },
  {
    id: 9,
    icon: "👥",
    title: "HR & Training",
  },
  {
    id: 10,
    icon: "🔧",
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
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-title">{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;