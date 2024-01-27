import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import React Router components
import AddProjectModal from '../../components/Modal/AddProject';
import './Projects.scss';

function Projects({ projects, addProject, showAlert, isLoading }) {


    // Modal
    const [modal, setModal] = useState({ createProject: false })

    const openModal = () => setModal({ createProject: true });

    const closeModal = () => setModal({ createProject: false });

    //Project's selected photos count
    const getProjectSelectedPhotosCount = (project) => {
        return project.collections.flatMap(collection => collection.uploadedFiles)
            .filter(image => image?.status === 'selected')
            .length;
    }

    return (
        <main className="projects">
            <div className="projects-header">
                <h1>Projects</h1>
                <div className="actions">
                    <div className="button primary"
                        onClick={openModal}
                    >Create Project</div>
                </div>
            </div>
            {isLoading ? (
                <div className="loader-wrap">
                    <div className="loader"></div>
                    <p className='loading-message'>loading projects</p>
                </div>
            ) : (
                <>
                    {projects?.length > 0 ?
                        <div className="projects-list">
                            {projects.map((project, index) => (
                                <Link to={`/project/${project.id}`} className={`project ${project.id}`} key={index}>
                                    <div className="project-details">
                                        <h4 className="project-title">{project.name}</h4>
                                        <p className="project-type">{project.type}</p>
                                    </div>
                                    {
                                        project.collections.length === 0 ?
                                            <div className="empty-message">
                                                <p>No collections created</p>
                                            </div> :
                                            <div className="project-info">
                                                <div className="collection-count"><b>{project.collections.length}</b> Collections</div>
                                                <div className="photos-count"><b>{project.uploadedFilesCount}</b> Photos</div>
                                                <div className="selected-count"><b>{getProjectSelectedPhotosCount(project)} </b> Selected</div>
                                            </div>
                                    }
                                    <div className="project-options">
                                        {
                                            project.pin ?
                                                <div className="pin">
                                                    <p className='pin-label'>PIN</p>
                                                    <p className='pin-number'> {project.pin}</p>
                                                </div> : ''
                                        }
                                    </div>
                                </Link>

                            ))}
                        </div>
                        : <div className="no-items">Create a project</div>}
                </>
            )}

            <AddProjectModal visible={modal.createProject} onClose={closeModal} onSubmit={addProject} showAlert={showAlert} />
        </main>
    );

}

export default Projects;
