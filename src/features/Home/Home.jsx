import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';
function Home() {

    document.title = `FotoFlow | Home`;
    // Replace this with your logic to fetch recent and all projects
    const recentProjects = [
        { id: 'alex-and-mia', name: 'Alex & Mia', type: 'Wedding', pin: 6554 },
        { id: 'ethan-and-emma', name: 'Ethan & Emma', type: 'Wedding', pin: 3365 },
        { id: 'noah-and-olivia', name: 'Noah & Olivia', type: 'Wedding', pin: 6798 },
        { id: 'michael-and-emily', name: 'Michael & Emily', type: 'Anniversary', pin: 5678 },
        { id: 'apeiro-inc', name: 'Apeiro Inc', type: 'Corporate Event', pin: 9876 }
    ]; 
// An array of recent projects
  const reviewedProjects = [
    { id: 'sarah-john', name: 'Sarah John', type: 'Birthday', pin: 1234 },
    { id: 'noah-and-olivia', name: 'Noah & Olivia', type: 'Wedding', pin: 6798 },
    { id: 'daniel-and-sophia', name: 'Daniel & Sophia', type: 'Wedding', pin: 9002 }
]; 
// An array of recent projects
  const pendingApprovalsProjects = [
    { id: 'michael-and-emily', name: 'Michael & Emily', type: 'Anniversary', pin: 5678 },
    { id: 'apeiro-inc', name: 'Apeiro Inc', type: 'Corporate Event', pin: 9876 }
]; 
  

  return (
    <main className="home">
        <div className="welcome-section">
            <h1 className='welcome-message'>Welcome, Canbera Studio</h1>
            <div className="actions">
                <div className="button primary">Create Project</div>
            </div>
        </div>
        
        <div className="section recent">
            <h3 className='section-heading'>Recent Projects</h3>
            <div className="projects">
                {recentProjects.map((project, index) => (
                    <Link className="project" to={`/project/${project.id}`} key={index}>
                        <div className="project-details">
                            <h4 className="project-title">{project.name}</h4>
                            <p className="project-type">{project.type}</p>
                        </div>
                        <div className="project-options">
                            <div className="pin">
                            <p className="pin-label">PIN</p>
                            <p className="pin-number">{project.pin}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        <div className="section  pending-approvals">
            <h3 className='section-heading'>Selection completed</h3>
            <div className="projects completed">
                {reviewedProjects.map((project, index) => (
                <Link className="project" to={`/project/${project.id}`} key={index}>
                    <div className="project-details">
                        <h4 className="project-title">{project.name}</h4>
                        <p className="project-type">{project.type}</p>
                    </div>
                    <div className="project-options">
                        <div className="button secondary">Open Folder</div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>

        <div className="section  approval-pending">
            <h3 className='section-heading'>Approval requests </h3>
            <div className="projects ">
                {pendingApprovalsProjects.map((project, index) => (
                <Link className="project" to={`/project/${project.id}`} key={index}>
                    <div className="project-details">
                        <h4 className="project-title">{project.name}</h4>
                        <p className="project-type">{project.type}</p>
                    </div>
                    <div className="project-options">
                        <div className="button primary">Approve</div>
                        <div className="button secondary">Decline</div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    </main>
  );
}

export default Home;