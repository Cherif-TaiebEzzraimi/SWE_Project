import React from "react";
import "../styles/reviews.css";

const reviews = [
  {
    id: 1,
    category: "AI SERVICES",
    categoryIcon: "⚙️",
    text: "Rick is a fantastic AI/ML engineer with specialization in LLMs, delivering end-to-end solutions. We had a few concepts when we started the work; ultimately, he delivered a working solution. Looking forward to working with him again.",
    rating: 5,
    author: "Richard C.",
    projectTitle: "LLM/RAG agent system development",
    date: "Mar 28, 2025",
    avatar: "https://i.pravatar.cc/150?img=12",
    accentColor: "#0a65f1",
  },
  {
    id: 2,
    category: "DEV & IT",
    categoryIcon: "<//>",
    text: "Haris came in and helped us transfer knowledge from our departing developer, meeting a serious deadline, without fail. His knowledge and experience are exceptional.",
    rating: 5,
    author: "Haris S.",
    projectTitle: "Full-Stack Developer",
    date: "Apr 7, 2025",
    avatar: "https://i.pravatar.cc/150?img=33",
    accentColor: "#49cfe0",
  },
  {
    id: 3,
    category: "DESIGN & CREATIVE",
    categoryIcon: "🎨",
    text: "Ezzan did an amazing job editing my videos—fast turnaround, great attention to detail, and very easy to work with. He follows directions well and delivers high-quality work consistently. Highly recommend him!",
    rating: 5,
    author: "Ezzan S.",
    projectTitle: "Short form and long form video editor needed!",
    date: "Mar 14, 2025",
    avatar: "https://i.pravatar.cc/150?img=68",
    accentColor: "#49cfe0",
  },
  {
    id: 4,
    category: "WRITING & TRANSLATION",
    categoryIcon: "✍️",
    text: "Sarah delivered exceptional content writing for our blog. Her ability to capture our brand voice and engage readers was impressive. Every article was well-researched and delivered on time. A true professional!",
    rating: 5,
    author: "Sarah M.",
    projectTitle: "Content Writer for Tech Blog",
    date: "Feb 18, 2025",
    avatar: "https://i.pravatar.cc/150?img=45",
    accentColor: "#0a65f1",
  },
  {
    id: 5,
    category: "SALES & MARKETING",
    categoryIcon: "🤝",
    text: "Marcus transformed our digital marketing strategy completely. His data-driven approach increased our conversions by 250% in just three months. Highly strategic and results-oriented.",
    rating: 5,
    author: "Marcus L.",
    projectTitle: "Digital Marketing Strategist",
    date: "Jan 30, 2025",
    avatar: "https://i.pravatar.cc/150?img=56",
    accentColor: "#0a65f1",
  },
  {
    id: 6,
    category: "FINANCE & ACCOUNTING",
    categoryIcon: "🏛️",
    text: "Jennifer managed our quarterly financial reports flawlessly. Her attention to detail and understanding of complex accounting principles saved us countless hours. Extremely reliable and professional.",
    rating: 5,
    author: "Jennifer K.",
    projectTitle: "Financial Reporting Specialist",
    date: "Mar 5, 2025",
    avatar: "https://i.pravatar.cc/150?img=27",
    accentColor: "#0a65f1",
  },
];

const Reviews: React.FC = () => {
  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">Real results from clients</h2>
        
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card" style={{ borderBottomColor: review.accentColor }}>
              <div className="review-header">
                <span className="review-category-icon">{review.categoryIcon}</span>
                <span className="review-category">{review.category}</span>
              </div>
              
              <p className="review-text">{review.text}</p>
              
              <div className="review-rating">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              
              <div className="review-footer">
                <div className="review-info">
                  <p className="review-author">Work done by {review.author}</p>
                  <p className="review-project">{review.projectTitle}</p>
                  <p className="review-date">{review.date}</p>
                </div>
                <img src={review.avatar} alt={review.author} className="review-avatar" />
              </div>

              <div className="review-accent" style={{ backgroundColor: review.accentColor }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;