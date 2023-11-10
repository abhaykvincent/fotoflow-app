import React, { useEffect, useState } from 'react';
import {Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Project from './features/Project/Project';
import Projects from './features/Projects/Projects';
import Home from './features/Home/Home';
import dummyProjects from './data/projects';
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import { addCollectionToFirestore, deleteProjectFromFirestore, fetchProjects } from './firebase/functions/firestore';

function App() {
  const navigate = useNavigate();
  // Projects
  const [projects, setProjects] = useState();
  useEffect(() => {
    fetchProjects().then((fetchedProjects) => {
      setProjects(fetchedProjects);
    });
  }, []);
  // Breadcrumbs
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  //Alert
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const showAlert = (type, message) => {
    setAlert({ type, message, show: true });
  };

  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);

    navigate(`/project/${newProject.id}`);
  };
  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId)
    const project = projects.find(project => project.id === projectId) || {}
    deleteProjectFromFirestore(projectId).then(()=>{
      setProjects(updatedProjects);
      showAlert('success', `Project <b>${project.name}</b> deleted successfully!`);// Redirect to /projects page
      navigate('/projects');
    })
  };
  const addCollection = (projectId, newCollection) => {
    // Find the project by its id
   

    addCollectionToFirestore(projectId,newCollection).then((id)=>{
      // Update the state with the modified projects
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          // Add the new collection to the project's collections array
          const updatedCollections = [...project.collections, {id,...newCollection}];
          showAlert('success', 'New Collection created!')
          console.log(updatedCollections)
          return { ...project, collections: updatedCollections };
        }
        return project;
  
      });
      setProjects(updatedProjects);
      showAlert('success', `Collection <b>${newCollection.name}</b> added successfully!`);// Redirect to /projects page
      navigate(`/project/${projectId}/${id}`);
    })
  };
  const [isUploading,setIsUploading] = useState(true);
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);
  
  useEffect(() => {
    console.log(projects)
  }, [projects]);

  return (
    <div className="App">
      <Header/>
      <div className="breadcrumbs">
        {
          breadcrumbs.map((crumb, index) => (
            <div className="crumb">
              <div className="back-button"></div>
              {crumb}
            </div>
          ))
        }
        
      </div>
      <Sidebar isUploading={isUploading} totalUploadProgress={totalUploadProgress}/>
  
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/project/:id/:collectionId?" element={<Project {...{ projects,addCollection,deleteProject,setIsUploading,setTotalUploadProgress,setBreadcrumbs }} />}/>
        <Route path="/projects" element={<Projects {...{ projects,addProject,showAlert,setBreadcrumbs }} />}/>
      </Routes>

      <Alert {...alert} setAlert={setAlert} />
      
    </div>
  );
}

export default App;
