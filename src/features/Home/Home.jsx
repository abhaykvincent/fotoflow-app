import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';
import { getProjectsByStatus, getRecentProjects } from '../../utils/projectFilters';
function Home({ projects }) {

    document.title = `FotoFlow | Home`;
    const recentProjects = getRecentProjects(projects, 5);
    const selectionCompletedProjects = getProjectsByStatus(projects, 'selection-completed');
    const requestPendingProjects = getProjectsByStatus(projects, 'request-pending');


    return (
        <main className="home">
            <div className="welcome-section">
                <h1 className='welcome-message'>Welcome, Canbera Studio</h1>
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
                                    <Link className="project" to={`/project/${project.id}`} key={index}>
                                        <div className="project-cover"
                                            style={{ backgroundImage: `url(${project.projectCover})` }}
                                        ></div>
                                        <div className="project-details">
                                            <h4 className="project-title">{project.name}</h4>
                                            <p className="project-type">{project.type}</p>
                                        </div>
                                        <div className="project-options">
                                            {
                                                // if pin available, show pin number
                                                project.pin? (
                                                <div className="pin">
                                                    <p className="pin-label">PIN</p>
                                                    <p className="pin-number">{project.pin}</p>
                                                </div>
                                                ) : ''
                                            }
                                            
                                        </div>
                                    </Link>
                                ))) : (
                                    <p className="message">No recent projects</p>)
                                }
                            </div>
                        </div>
                        <div className="section recent">
                            <h3 className='section-heading'>Recent Projects</h3>
                            <div className="projects">
                            {recentProjects.length !== 0? (
                                recentProjects.map((project, index) => (
                                    <Link className="project" to={`/project/${project.id}`} key={index}>
                                        <div className="project-cover"
                                            style={{ backgroundImage: `url(${project.projectCover})` }}
                                        ></div>
                                        <div className="project-details">
                                            <h4 className="project-title">{project.name}</h4>
                                            <p className="project-type">{project.type}</p>
                                        </div>
                                        <div className="project-options">
                                            {
                                                // if pin available, show pin number
                                                project.pin? (
                                                <div className="pin">
                                                    <p className="pin-label">PIN</p>
                                                    <p className="pin-number">{project.pin}</p>
                                                </div>
                                                ) : ''
                                            }
                                            
                                        </div>
                                    </Link>
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
                                    <Link className="project" to={`/project/${project.id}`} key={index}>
                                        <div className="project-details">
                                            <h4 className="project-title">{project.name}</h4>
                                            <p className="project-type">{project.type}</p>
                                        </div>
                                        <div className="project-options">
                                            <div className="button secondary">Open Folder</div>
                                        </div>
                                    </Link>
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
                ) :
                    (
                        <div className="section">
                            <h3 className='section-heading'>No projects</h3>
                        </div>
                    )
            }
        </main>
    );
}

export default Home;
