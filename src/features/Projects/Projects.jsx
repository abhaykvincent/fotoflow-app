import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import React Router components

import './Projects.scss';
import AddProjectModal from '../../components/Modal/AddProject';


  

function Projects({projects,addProject}) {
    // Modal
    const [modal, setModal] = useState({
        createProject: false
    })
    const openModal = () => setModal({ createProject: true });
    const closeModal = () => setModal({ createProject: false });


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
            <div className="projects-list">
                {projects.map((project, index) => (

                    <Link to={`/project/${project.id}`} className="project" key={index}>
                        <div className="project-details">
                            <h4 className="project-title">{project.name}</h4>
                            <p className="project-type">{project.type}</p>
                        </div>
                        <div className="project-info">
                            <div className="collection-count"><b>{project.collections.length}</b> Collections</div>
                            <div className="photos-count"><b>1209</b> Photos</div>
                            <div className="selected-count"><b>257</b> Selected</div>
                        </div>
                        <div className="project-options">
                            {
                                project.pin?
                                <div className="pin">
                                    <p className='pin-label'>PIN</p>
                                    <p className='pin-number'> {project.pin}</p>
                                </div>:''
                            }
                        </div>
                    </Link>
                
                ))}
            </div>
            <AddProjectModal visible={modal.createProject} onClose={closeModal} onSubmit={addProject} />
        </main>
    );
}

export default Projects;