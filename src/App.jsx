import React, { useEffect, useState } from 'react';
import {Route, Routes, useNavigate, } from 'react-router-dom';
import './App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Project from './features/Project/Project';
import Projects from './features/Projects/Projects';
import Home from './features/Home/Home';
import dummyProjects from './data/projects';
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import { addCollectionToFirestore, deleteCollectionFromFirestore, deleteProjectFromFirestore, fetchProjects } from './firebase/functions/firestore';
import ShareProject from './features/Share/Share';
import LoginModal from './features/Login/Login';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';

function App() {
  const navigate = useNavigate();

  // console url from use params
  console.log(window.location.href)
  //check if the url has "share"
  const isShareUrl = window.location.href.includes('share')
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
      navigate('/projects');
      setTimeout(() => {
        const projectElement = document.querySelector(`.${projectId}`);
        console.log(projectElement)
        projectElement.classList.add('delete-caution');
      }, 1);
      setTimeout(() => {
        setProjects(updatedProjects);
        showAlert('success', `Project <b>${project.name}</b> deleted successfully!`);// Redirect to /projects page
      }, 700);
    })
    .catch((error)=>{
      console.error('Error deleting project:', error);
      showAlert('error', error.message)
      // Handle error scenarios, e.g., show an error message
    }
    )
  };
  const addCollection = (projectId, newCollection) => {
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
  const deleteCollection = (projectId, collectionId) => {
    // Remove the collection from Firestore
    deleteCollectionFromFirestore(projectId, collectionId).then(() => {
        // Update the state to reflect the removed collection
        const updatedProjects = projects.map((project) => {
            if (project.id === projectId) {
                // Filter out the deleted collection from the project's collections array
                const updatedCollections = project.collections.filter(
                    (collection) => collection.id !== collectionId
                );
                showAlert('success', 'Collection deleted!');
                return { ...project, collections: updatedCollections };
            }
            return project;
        });
        setProjects(updatedProjects);
    }).catch((error) => {
        showAlert('error', `Error deleting collection: ${error.message}`);
    });
};

// Assume this function is for handling the delete action in the UI
const handleDeleteCollection = (projectId, collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
        deleteCollection(projectId, collectionId);
    }
};

  const [isUploading,setIsUploading] = useState(true);
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);
  
  useEffect(() => {
    console.log(projects)
  }, [projects]);
  const [authenticated,setAuthenticated] = useState(false)

  return (
    <div className="App">
      { !authenticated && !isShareUrl ? <LoginModal {...{setAuthenticated}}/> : ''}
      { authenticated ?
        <>
          <Header/>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <Sidebar isUploading={isUploading} totalUploadProgress={totalUploadProgress}/>
        </> : ''
      }
      <Routes>
        { authenticated ? 
          <>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/project/:id/:collectionId?" element={<Project {...{ projects,addCollection,handleDeleteCollection,deleteProject,setIsUploading,setTotalUploadProgress,setBreadcrumbs }} />}/>
            <Route path="/projects" element={<Projects {...{ projects,addProject,showAlert,setBreadcrumbs }} />}/>
          </> : ''
        }
        <Route path="/share/:projectId/:collectionId?" element={<ShareProject {...{ projects }} />}/>
      </Routes>

      <Alert {...alert} setAlert={setAlert} />
      
    </div>
  );
}

export default App;
