import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findCollectionById } from '../../utils/CollectionQuery';
import { fetchImageUrls,handleUpload } from '../../utils/storageOperations';

import AddCollectionModal from '../../components/Modal/AddCollection';
import ImageGallery from '../../components/ImageGallery/ImageGallery';

export default function Project({ projects,  addCollection, deleteProject,setBreadcrumbs, setIsUploading, setTotalUploadProgress}) {
  // Route Params
  let { id,collectionId } = useParams();// Modal
  const [modal, setModal] = useState({createCollection: false})
  const openModal = () => setModal({ createCollection: true });
  const closeModal = () => setModal({ createCollection: false });
  // Files
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isPhotosImported, setIsPhotosImported] = useState(false);
  const handleFileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setIsPhotosImported(true)
    setFiles(selectedFiles);
    setImageUrls(selectedFiles)
  };

  // Fetch Images
  useEffect(() => {
      fetchImageUrls(id, collectionId, setImageUrls);
  }, [collectionId]);

  useEffect(()=>{
    setBreadcrumbs(['Projects'])
},[setBreadcrumbs])
  
  if(!projects) return
  // Data
  const project = projects.find((p) => p.id === id);
  let collection = findCollectionById( project, project.collections.length > 0 ? collectionId || project.collections[0].id:null);
  
// Components
  const RenderCollectionsPanel = () => {
    return (
      <div className="collections-panel">
        {
          project.collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`collection-tab ${collection.id === collectionId || (!collectionId && index === 0) ? 'active' : ''}`}
            >
              <Link to={`/project/${project.id}/${collection.id}`}>{collection.name}</Link>
            </div>
          ))
        }
      </div>
    );
  };
  const RenderProjectCollection = () => {
    return (
      <div className="project-collection">
        <div className="header">
          <div className="label"><h3>{collection.name}</h3></div>
    
                {
                  imageUrls.length>0?
                  <div className="view-control">
                    <div className="control-label label-all-photos">569 Photos</div>
                    <div className="control-wrap">
                      <div className="controls">
                        <div className="control active">All photos</div>
                        <div className="control">Selected </div>
                      </div>
                      <div className={`active`}></div>
                    </div>
                    <div className="control-label label-selected-photos">247 Photos</div>
                  </div>:
                  <div className="empty-message">
                    <p>Import shoot photos to upload </p>
                  </div>
                }
    
                <div className="options">
                  <label htmlFor="fileInput" className={`button ${isPhotosImported ? 'secondary' : 'primary'}`} 
  
                  >Import Images</label>
                  <input id='fileInput' type="file" multiple onChange={handleFileInputChange} />
                  <div className={`button ${isPhotosImported ? 'primary' : 'secondary disabled'}`} 
                    onClick={()=>{
                      setIsPhotosImported(false);
                      handleUpload();
                    }}
                    >Upload Images</div>
                </div>

        </div>
        {
          imageUrls.length > 0?
          <ImageGallery isPhotosImported={isPhotosImported} imageUrls={imageUrls} />:''
        }
      </div>
    );
  };

  return (
    <main>
      <div className="project-info">
        <div className="client">
          <h1>{project.name}</h1>
          <div className="type">{project.type}</div>
        </div>
        <div className="project-options">
          <div className="button primary disabled share">Share</div>
          <div className="button warnning" onClick={()=>deleteProject(id)}>Delete</div>
        </div>
        <div className="client-contact">
          <p className="client-phone">{project.phone}</p>
          <p className="client-email">{project.email}</p>
        </div>
        <div className="project-options">
          <div className="button secondary add-collection"
          onClick={openModal}
          >Add Collection</div>
        </div>
      </div>
      {project.collections.length === 0 ? (
        <div className="no-items no-collections">Create a collection</div>
      ) : (
        <div className="project-collections">
          <RenderCollectionsPanel/>
          <RenderProjectCollection/>
        </div>
      )}
      <AddCollectionModal project={project} visible={modal.createCollection} onClose={closeModal} onSubmit={addCollection}  />
    </main>
  )
  }

  
  