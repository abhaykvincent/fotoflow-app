import React, { useEffect, useState } from 'react';
import {Route, Routes } from 'react-router-dom';
import './App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Project from './features/Project/Project';
import Projects from './features/Projects/Projects';
import Home from './features/Home/Home';
import dummyProjects from './data/projects';
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';

function App() {
  // Projects
  const [projects, setProjects] = useState(dummyProjects);
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const showAlert = (type, message) => {
    setAlert({ type, message, show: true });
  };
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    showAlert('success', 'New Project created!')
  };
  const addCollection = (projectId, newCollection) => {
    // Find the project by its id
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        // Add the new collection to the project's collections array
        const updatedCollections = [...project.collections, newCollection];
        showAlert('success', 'New Collection created!')
        return { ...project, collections: updatedCollections };
      }
      return project;

    });
    // Update the state with the modified projects
    setProjects(updatedProjects);
  };
  const [isUploading,setIsUploading] = useState(true);
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);
  
  return (
    <div className="App">
      <Header/>
      <Sidebar isUploading={isUploading} totalUploadProgress={totalUploadProgress}/>
  
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/project/:id/:collectionId?" element={<Project {...{ projects,addCollection,setIsUploading,setTotalUploadProgress }} />}/>
        <Route path="/projects" element={<Projects {...{ projects,addProject }} />}/>
      </Routes>

      <Alert {...alert} setAlert={setAlert} />
      
    </div>
  );
}

export default App;
