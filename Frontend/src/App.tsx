import { BrowserRouter as Router, Routes , Route } from 'react-router-dom' ; 
import './styles/App.css' ; 
import LandingPage from './pages/landing_page/LandingPage' ;
import Header from "./../src/pages/landing_page/components/Header";
import Jobs from "./../src/pages/landing_page/components/Jobs";
import FindTalent from "./../src/pages/landing_page/components/FindTalent";
import AboutUs from "./../src/pages/landing_page/components/AboutUs";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Routes will be added here */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/find-talent" element={<FindTalent />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
