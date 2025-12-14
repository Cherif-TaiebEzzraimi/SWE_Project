import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
 import ExploreJobs from './components/explore';
 import Reviews from './components/Reviews';
 import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
 import FAQSection from './components/FAQ';
import Footer from './components/Footer';

// LandingPage component
const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />       
      <ExploreJobs />
      <HowItWorks />         
      <Reviews />
      <CTASection />         
      <FAQSection />
      <Footer />
      
    </>
  );
};

export default LandingPage;
