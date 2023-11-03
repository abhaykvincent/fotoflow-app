import React, { useEffect, useState } from 'react';

function AddProjectModal({ visible, onClose, onSubmit }) {

  const [projectData, setProjectData] = useState({
    id:'abhay-vincent',
    name: 'Abhay Vincent',
    type: 'Birthday',
    email: 'abhaykvincent@gmail.com',
    phone: '9495505112',
    collections:[]
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };
  const handleSubmit = () => {
    // Pass the project data to the onSubmit function in the App component
    onSubmit(projectData);
    onClose()
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
              <input className="" name="name" value={projectData.name} type="text" onChange={handleInputChange}/>
            </div>
            <div className="field">
              <label className="" htmlFor="">Project Type</label>
              <input className="" name="type" value={projectData.type} type="text" onChange={handleInputChange}/>
            </div>
          </div>
          <div className="form-section contact">
            <div className="field">
              <label className="" htmlFor="">Email</label>
              <input className="" name="email" value={projectData.email} type="text" onChange={handleInputChange}/>
            </div>
            <div className="field">
              <label className="" htmlFor="">Phone</label>
              <input className="" name="phone" value={projectData.phone} type="text" onChange={handleInputChange}/>
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