import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchImageUrls } from '../../utils/storageOperations';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import { findCollectionById } from '../../utils/CollectionQuery';

export default function ShareProject({projects}) {
  let  { projectId, collectionId } = useParams();
  const [imageUrls, setImageUrls] = useState([]);
// if co collectionIs is passed, use the first collectionId
    collectionId  = collectionId || projects?.find(project => project.id === projectId)?.collections[0]?.id
    console.log(projectId, collectionId)
    
  //let collection = findCollectionById( project, project.collections.length > 0 ? collectionId || project.collections[0].id:null);
  // Fetch Images based on projectId and collectionId
  useEffect(() => {
    console.log(projectId, collectionId)
    fetchImageUrls(projectId, collectionId, setImageUrls);
  }, [projectId, collectionId]);

  if(!projects) return
  // Data
  const project = projects.find((p) => p.id === projectId); 
  
  // Collections panel
  const CollectionsPanel = () => {
    return (
      <div className="collections-panel">
        {
          project.collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`collection-tab ${collection.id === collectionId || (!collectionId && index === 0) ? 'active' : ''}`}
            >
              <Link to={`/share/${project.id}/${collection.id}`}>{collection.name}</Link>
            </div>
          ))
        }
      </div>
    );
  };
  return (
    <div className="share-project">
        <h1>Shared Project</h1>
        <div className="shared-collection">
        <h2>Selected Collection Images</h2>
        <CollectionsPanel/>
        <ImageGallery imageUrls={imageUrls} />
        </div>
    </div>
  );
}
