import React, { useEffect, useState } from 'react';
import { addProject } from '../../firebase/functions/firestore';
import { analytics } from '../../firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

function AddProjectModal({ showAlert,visible, onClose, onSubmit }) {

  const [projectData, setProjectData] = useState({
      name: 'Ethan Ross',
      type: 'Birthday',
      email: 'julia.ethan@gmail.com',
      phone: '3656992278',
      collections: [],
      status: 'draft',
      createdAt: new Date(),
      uploadedFilesCount:0,
      selectedFilesCount:0,
      totalFileSize:0,
      lastOpened: new Date(),
      projectCover:''
  });
  const handleInputChange = (event) => {
      const {name,value} = event.target;
      setProjectData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };
  const handleSubmit = () => {
      // Call the API function to add a new project
      addProject(projectData)
          .then((addedProject) => {
              onSubmit(addedProject);
              onClose();
              showAlert('success', 'New Project created!')
              logEvent(analytics,'project_created');

          })
          .catch((error) => {
              console.error('Error creating project:', error);
              showAlert('error', 'error')
              // Handle error scenarios, e.g., show an error message
          });
  };


  if (!visible) {
    return null;
  }

  return (
    <div className="modal-container">
        <div className="modal create-project">
            <div className='modal-header'>
                <div className="modal-controls">
                    <div className="control close" onClick={onClose}></div>
                    <div className="control minimize"></div>
                    <div className="control maximize"></div>
                </div>
                <div className="modal-title">Create Project</div>
            </div>
            <div className='modal-body'>
                <div className="form-section">
                    <div className="field">
                        <label className="" htmlFor="">Project Name</label>
                        <input className="" name="name" value={projectData.name} type="text"
                            onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label className="" htmlFor="">Project Type</label>
                        <input className="" name="type" value={projectData.type} type="text"
                            onChange={handleInputChange} />
                    </div>
                </div>
                <div className="form-section contact">
                    <div className="field">
                        <label className="" htmlFor="">Email</label>
                        <input className="" name="email" value={projectData.email} type="text"
                            onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label className="" htmlFor="">Phone</label>
                        <input className="" name="phone" value={projectData.phone} type="text"
                            onChange={handleInputChange} />
                    </div>
                </div>
            </div>
            <div className="actions">
                <div className="button secondary" onClick={onClose}>Cancel</div>
                <div className="button primary" onClick={handleSubmit}>Create</div>
            </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default AddProjectModal