import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
// Components
import './App.scss';
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
// Features
import Home from './features/Home/Home';
import Project from './features/Project/Project';
import Projects from './features/Projects/Projects';
import LoginModal from './features/Login/Login';
import ShareProject from './features/Share/Share';
//Firebase functions
import { 
  fetchProjects,
  addCollectionToFirestore, 
  deleteProjectFromFirestore, 
  deleteCollectionFromFirestore, 
} from './firebase/functions/firestore';
import Selection from './features/Selection/Selection';
import Storage from './features/Storage/Storage';

function App() {
  
  const navigate = useNavigate();
  const [authenticated,setAuthenticated] = useState(true)
  // Alert
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const showAlert = (type, message) => setAlert({ type, message, show: true });
  // Core Data
  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch Projects
  useEffect(() => {
    document.title = `FotoFlow`;
    setIsLoading(true);
    fetchProjects()
    .then((fetchedProjects) => {
      setProjects(fetchedProjects)
      setIsLoading(false);
    });
  }, []);

  // Project/Collection Data Logic
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    navigate(`/project/${newProject.id}`);
  };
  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId)
    const project = projects.find(project => project.id === projectId) || {}
    deleteProjectFromFirestore(projectId)
    .then(() => {
      navigate('/projects');
      setTimeout(() => {
        const projectElement = document.querySelector(`.${projectId}`);
        projectElement.classList.add('delete-caution');
      }, 1);
      setTimeout(() => {
        setProjects(updatedProjects);
        showAlert('success', `Project <b>${project.name}</b> deleted successfully!`);// Redirect to /projects page
      }, 700);
    })
    .catch((error) => {
      console.error('Error deleting project:', error);
      showAlert('error', error.message)
    })
  };
  const addCollection = (projectId, newCollection) => {
    addCollectionToFirestore(projectId,newCollection)
    .then((id)=>{
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          const updatedCollections = [...project.collections, {id,...newCollection}];
          showAlert('success', 'New Collection created!')
          return { ...project, collections: updatedCollections };
        }
        return project;
      });
      setProjects(updatedProjects);
      showAlert('success', `Collection <b>${newCollection.name}</b> added successfully!`);// Redirect to /projects page
      navigate(`/project/${projectId}/${id}`);
    })
    .catch((error) => {
      showAlert('error', `Error adding collection: ${error.message}`);
    });
  };
  const deleteCollection = (projectId, collectionId) => {
    deleteCollectionFromFirestore(projectId, collectionId)
    .then(() => {
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
            const updatedCollections = project.collections.filter(
            (collection) => collection.id !== collectionId
          );
          showAlert('success', 'Collection deleted!');
          return { ...project, collections: updatedCollections };
        }
        return project;
      });
      setProjects(updatedProjects);
    })
    .catch((error) => {
      showAlert('error', `Error deleting collection: ${error.message}`);
    });
  };
  
  const shareOrSelection = window.location.href.includes('share') || window.location.href.includes('selection' )
  
  // Render
  return (
    <div className="App">
      {authenticated && (!shareOrSelection)? (
        <>
          <Header />
          <Sidebar />
          <Alert {...alert} setAlert={setAlert} />
        </>
      ) : (
        <>{!shareOrSelection && <LoginModal {...{ setAuthenticated }} />}</>
      )}
      {isLoading ? (
                <div className="loader-wrap">
                    <div className="loader"></div>
                    <p className='loading-message'>loading projects</p>
                </div>
            ) : (
      <Routes>
        { authenticated ? 
          <>
            <Route exact path="/" element={<Home {...{projects}} />}/>
            <Route path="/project/:id/:collectionId?" element={<Project {...{ projects, addCollection, deleteCollection, deleteProject,showAlert }} />}/>
            <Route path="/projects" element={<Projects {...{ projects, addProject, showAlert, isLoading }} />}/>
            <Route path="/storage" element={<Storage/>}/>
          </> 
          
          : ''
        }
        <Route path="/share/:projectId/:collectionId?" element={<ShareProject {...{ projects }} />}/>
        <Route path="/selection/:projectId/:collectionId?" element={<Selection {...{ projects }} />}/>
      </Routes>
            )}
      
    </div>
  );
}

export default App;
// line Complexity  146 -> 133 -> 127 -> 152 -> 132