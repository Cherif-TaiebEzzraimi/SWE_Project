import React, { useState } from "react";
import "../styles/faq.css";

const faqs = [
  {
    id: 1,
    question: "What is SkilLink ?",
    answer: (
      <>
        <p>
          SkilLink is a global work marketplace that connects businesses, agencies, and freelancers. 
          It's free for anyone to sign up and get started.
        </p>
        <p>
          Businesses and teams use SkilLink to flex their capacity, accelerate key projects, and 
          access specialized expertise in AI, Machine Learning, Design, Marketing, Software Development, and more.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "How does SklLink work?",
    answer: (
      <>
        <p>
          Clients browse for freelancers, post projects, review proposals, and conduct interviews on the platform. 
          Freelancers browse projects, submit proposals, or can be invited directly by clients.
        </p>
        <p>
          Freelancers and clients can collaborate on SkilLink's trusted platform, which offers features like 
          messaging, file sharing, time tracking. With millions of work opportunities 
          posted across hundreds of categories, Upwork helps people and companies work together seamlessly, 
          no matter where they are.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question: "Who uses SkilLink",
    answer: (
      <>
        <p>
          SkilLink is used by millions of businesses worldwide, from startups to Fortune 500 companies, 
          as well as individual entrepreneurs and freelancers across various industries.
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: "How do I get started?",
    answer: (
      <>
        <p>
          Getting started is simple! Create a free account, complete your profile, and you can 
          start browsing jobs (if you're a freelancer) or posting projects (if you're a client).
        </p>
      </>
    ),
  },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-layout">
          <div className="faq-sidebar">
            <h2 className="faq-title">Frequently Asked Questions</h2>
          </div>
          
          <div className="faq-content">
            {faqs.map((faq) => (
              <div key={faq.id} className={`faq-item ${openId === faq.id ? "open" : ""}`}>
                <button className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">{openId === faq.id ? "−" : "+"}</span>
                </button>
                
                {openId === faq.id && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;