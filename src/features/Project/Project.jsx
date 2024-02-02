import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findCollectionById } from '../../utils/CollectionQuery';
import AddCollectionModal from '../../components/Modal/AddCollection';
import DeleteConfirmationModal from '../../components/Modal/DeleteProject';
import CollectionsPanel from '../../components/Project/Collections/CollectionsPanel';
import CollectionImages from '../../components/Project/Collections/CollectionImages';

export default function Project({ projects,  addCollection, deleteCollection, deleteProject,showAlert}) {
  const navigate = useNavigate();
  // Route Params
  let { id,collectionId } = useParams();
  // Modal
  const [modal, setModal] = useState({createCollection: false})
  const openModal = () => setModal({ createCollection: true });
  const closeModal = () => setModal({ createCollection: false });
  // Delete Project Modal
  const[confirmDeleteProject,setConfirmDeleteProject] = useState(false)
  const onDeleteConfirmClose = () => setConfirmDeleteProject(false)
  const onDeleteConfirm = () => deleteProject(id);

  // If no projects are available, return early
  if (!projects) return;

  // Find the project with the given id
  const project = projects.find((p) => p.id === id);
  console.log(!project)
  // If the project is not found, redirect to the projects page and return
  if (!project) {
    setTimeout(()=>{
      navigate('/projects');
    },100)
    return;
  }
  else{
  document.title = `${project.name}'s ${project.type}`
  }


  // Determine the collectionId to use
  const defaultCollectionId = project.collections.length > 0 ? project.collections[0].id : null;
  const targetCollectionId = collectionId || defaultCollectionId;
  if(!collectionId){
    setTimeout(()=>{
    navigate(`/project/${id}/${targetCollectionId}`);
    },100)
    return
  }

  // Find the collection by id
  let collection = findCollectionById(project, targetCollectionId);
  console.log(collection)
  // If the collection is not found, redirect to the project page and return
  if (collection==='Collection not found') {
    setTimeout(()=>{
    navigate(`/project/${id}`);
    },100)
    return;
  }



  return (
    <main className='project-page'>
      <div className="project-info">
        <div className="client">
          <h1>{project.name}</h1>
          <div className="type">{project.type}</div>
        </div>
        <div className="project-options">
          <a className="button primary share" href={`/share/${id}`} target="_blank">Share</a>
          <a className="button primary selection" href={`/selection/${id}`} target="_blank">Selection</a>
          <div className="button warnning" onClick={()=>{
            setConfirmDeleteProject(true)
          }}>Delete</div>
        </div>
        <div className="client-contact">
          <p className="client-phone">{project.phone}</p>
          <p className="client-email">{project.email}</p>
        </div>
        <div className="project-options">
        </div>
      </div>
      {project.collections.length === 0 ? (
        <>  
          <div className="button secondary add-collection"
                onClick={openModal}
                >Add Collection</div>
        <div className="no-items no-collections">Create a collection</div>
        </>
      ) : (
        <div className="project-collections">
          <CollectionsPanel {...{project, collectionId:targetCollectionId, deleteCollection, openModal}}/>
          <CollectionImages  {...{ id, collectionId:targetCollectionId,collection,showAlert}} />
        </div>
      )}
      <AddCollectionModal project={project} visible={modal.createCollection} onClose={closeModal} onSubmit={addCollection}  />
      {confirmDeleteProject ? <DeleteConfirmationModal onDeleteConfirm={onDeleteConfirm} onClose={onDeleteConfirmClose}/>:''}
    </main>
  )
  }