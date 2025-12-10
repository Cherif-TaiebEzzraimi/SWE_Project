import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectProgressClientOverview from './pages/project_progress/project_progress_overview/ProjectProgressClientOverview'
import ProjectProgressFreelancerOverview from './pages/project_progress/project_progress_overview/ProjectProgressFreelancerOverview'
import ProjectProgressPhasesAndTasks from './pages/project_progress/project_progress_overview/ProjectProgressPhasesAndTasks'
import ProjectProgressPage from './pages/project_progress/ProjectProgressPage'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Default Route - New Phases Tab System */}
          <Route path="/" element={<ProjectProgressPage />} />
          
          {/* Phases Tab System Route */}
          <Route path="/project/:projectId/progress" element={<ProjectProgressPage />} />

          {/* Client Routes  */}
          <Route path="/project/:projectId/client/overview/upload" element={<ProjectProgressClientOverview />} />
          <Route path="/project/:projectId/client/overview/submitted" element={<ProjectProgressClientOverview />} />
          <Route path="/project/:projectId/client/phases" element={<ProjectProgressPhasesAndTasks />} />

          {/* Freelancer Routes */}
          <Route path="/project/:projectId/freelancer/overview/pending" element={<ProjectProgressFreelancerOverview />} />
          <Route path="/project/:projectId/freelancer/overview/active" element={<ProjectProgressFreelancerOverview />} />
          <Route path="/project/:projectId/freelancer/phases" element={<ProjectProgressPhasesAndTasks />} />

          {/*  will be removed later */}
          <Route path="/client/project-overview" element={<ProjectProgressClientOverview />} />
          <Route path="/freelancer/project-overview" element={<ProjectProgressFreelancerOverview />} />
          <Route path="/freelancer/project-overview/unlocked" element={<ProjectProgressFreelancerOverview />} />

          {/*  testing  */}
          <Route path="/project/:projectId/client/upload" element={<ProjectProgressClientOverview />} />
          <Route path="/project/:projectId/client/submitted" element={<ProjectProgressClientOverview />} />
          <Route path="/project/:projectId/freelancer/pending" element={<ProjectProgressFreelancerOverview />} />
          <Route path="/project/:projectId/freelancer/active" element={<ProjectProgressFreelancerOverview />} />
          <Route path="/project/:projectId/phases" element={<ProjectProgressPhasesAndTasks />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App