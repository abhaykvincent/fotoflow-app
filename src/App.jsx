import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
// Components
import './App.scss';
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
// Features
import Home from './features/Home/Home';
import Project from './features/Project/Project';
import Projects from './features/Projects/Projects';
import LoginModal from './features/Login/Login';
import ShareProject from './features/Share/Share';
// Data and Firebase functions
import dummyProjects from './data/projects';
import { 
  fetchProjects,
  addCollectionToFirestore, 
  deleteProjectFromFirestore, 
  deleteCollectionFromFirestore, 
} from './firebase/functions/firestore';
import UploadImages from './firebase/test/StorageTest';

function App() {
  
  const navigate = useNavigate();
  const [authenticated,setAuthenticated] = useState(true)
  // Breadcrumbs
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  // Alert
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const showAlert = (type, message) => setAlert({ type, message, show: true });

  // Core Data
  const [projects, setProjects] = useState();
  useEffect(() => {
    fetchProjects().then((fetchedProjects) => {
      setProjects(fetchedProjects);
    });
  }, []);
  // Project/Collection CRUD
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
    }
    )
  };
  const addCollection = (projectId, newCollection) => {
    addCollectionToFirestore(projectId,newCollection).then((id)=>{
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
  // update project with uploaded images info into collections

  const updateCollectionImages = (projectId, collectionId, images) => {
    
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        const updatedCollections = project.collections.map((collection) => {
          if (collection.id === collectionId) {
            console.log(images)
            console.log(collection)
            const updatedImages = [...collection.images, ...images];
            return { ...collection, images: updatedImages };
          }
          return collection;
        });
        return { ...project, collections: updatedCollections };
      }
      return project;
    });
    console.log(updatedProjects)
    setProjects(updatedProjects);
  }

  return (
    <div className="App">
      <UploadImages />
      {/* {authenticated && !window.location.href.includes('share') ? (
        <>
          <Header />
          <Sidebar />
          <Alert {...alert} setAlert={setAlert} />
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </>
      ) : (
        <>{ !window.location.href.includes('share') && <LoginModal {...{ setAuthenticated }} />}</>
      )}
      <Routes>
        { authenticated ? 
          <>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/project/:id/:collectionId?" element={<Project {...{ projects, addCollection, deleteCollection, deleteProject,updateCollectionImages, setBreadcrumbs }} />}/>
            <Route path="/projects" element={<Projects {...{ projects, addProject, showAlert, setBreadcrumbs }} />}/>
          </> : ''
        }
        <Route path="/share/:projectId/:collectionId?" element={<ShareProject {...{ projects }} />}/>
      </Routes>
       */}
    </div>
  );
}

export default App;
// line Complexity  146 -> 133 -> 127