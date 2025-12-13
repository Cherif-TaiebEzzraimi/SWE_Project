


import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProjectProgressPage from './pages/project_progress/ProjectProgressPage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AddPostPage from './pages/addPost.tsx';
import Header from './components/Header';
import { useState } from 'react';

function App() {
  // Single-page tab logic for main sections
  // Section state is now derived from the URL

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/addPost"
          element={
            <div className="w-full flex justify-center">
              <div className="w-full max-w-5xl">
                <AddPostPage />
              </div>
            </div>
          }
        />
        <Route path="/" element={<MainAppSections section="project-progress" />} />
        <Route path="/client-dashboard" element={<MainAppSections section="client-dashboard" />} />
        <Route path="/freelancer-dashboard" element={<MainAppSections section="freelancer-dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainAppSections({ section }: { section: 'project-progress' | 'client-dashboard' | 'freelancer-dashboard' }) {
  const navigate = useNavigate();
  let content = null;
  if (section === 'project-progress') {
    content = <ProjectProgressPage />;
  } else if (section === 'client-dashboard') {
    content = <ClientDashboard />;
  } else if (section === 'freelancer-dashboard') {
    content = <FreelancerDashboard />;
  }

  return (
    <div className="app min-h-screen bg-background-light dark:bg-background-dark">
      <Header
        section={section}
        onSectionChange={(s: string) => {
          if (s === 'project-progress') navigate('/');
          else if (s === 'client-dashboard') navigate('/client-dashboard');
          else if (s === 'freelancer-dashboard') navigate('/freelancer-dashboard');
        }}
      />
      <main>
        {content}
      </main>
    </div>
  );
}

export default App;

