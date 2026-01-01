import React from 'react';
import { useLocation } from 'react-router-dom';

const ProjectProgress: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get('projectId');

  if (!projectId) {
    return <div>No project selected. Please select a project from your history.</div>;
  }

  return (
    <div>
      <h2>Project Progress</h2>
      <p>Project ID: {projectId}</p>
      {/* TODO: Implement project progress details here */}
    </div>
  );
};

export default ProjectProgress;
