import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';
import { getProjectsByStatus, getRecentProjects } from '../../utils/projectFilters';
import ProjectCard from '../../components/Project/ProjectCard/ProjectCard';
function Home({ projects }) {

    document.title = `FotoFlow | Home`;
    const recentProjects = getRecentProjects(projects, 5);
    const selectionCompletedProjects = getProjectsByStatus(projects, 'selection-completed');
    const requestPendingProjects = getProjectsByStatus(projects, 'request-pending');


    return (
        <main className="home">
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className='welcome-message-top user-name'>
                        <h1 className='welcome-message '>Hello,</h1>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            {/* Define the linear gradient */}
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#30d158', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#136a29', stopOpacity: 1 }} />
                            </linearGradient>
                            {/* Apply the gradient to the text */}
                            <text x="128px" y="46px" fontFamily="Arial" fontSize="3rem" font-fontWeight="800" fill="url(#textGradient)" textAnchor="middle">
                                Monalisa ✨
                            </text>
                        </svg>
                    </div>
                    <h1 className='welcome-message'>Let's manage your Snaps </h1>
                </div>
                <div className="actions">
                    <div className="button primary">Create Project</div>
                </div>
            </div>
            {
                projects.length > 0 ? (
                    <>
                        <div className="section recent">
                            <h3 className='section-heading'>Recent Projects</h3>
                            <div className="projects">
                            {recentProjects.length !== 0? (
                                recentProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    /> 
                                ))) : (
                                    <p className="message">No recent projects</p>)
                                }
                            </div>
                        </div>

                        <div className="section  pending-approvals">
                            <h3 className='section-heading'>Selection completed</h3>
                            <div className="projects completed">
                            {selectionCompletedProjects.length !== 0? (
                                selectionCompletedProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    /> 
                                )))
                                 : (
                                    <p className="message">No selection completed projects</p>
                                    )
                                }
                            </div>
                        </div>

                        <div className="section  approval-pending">
                            <h3 className='section-heading'>Approval requests </h3>
                            <div className="projects ">
                            {requestPendingProjects.length !== 0 ? (
                            requestPendingProjects.map((project, index) => (
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
                                )))
                                : (
                                    <p className="message">No approval requests</p>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )
                : (
                    <>
                    <div className="section recent">
            <h3 className='section-heading'>You dont have any projects cerated</h3>
                    </div>
                    <div className="projects-list">

                    <Link className="project new" to={`/projects`} >
                        <div className="project-cover"
                        ></div>
                        <div className="project-details">
                            <div className="details-top">

                                <h4 className="project-title">Create Your First Project</h4>
                                <p className="project-type"></p>
                            </div>
                        </div>
                        <div className="project-options">
                            
                        </div>
                    </Link>
                    </div>
                    </>
                )
            }
        </main>
    );
}

export default Home;
